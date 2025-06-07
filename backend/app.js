const { initializeTelemetry, shutdownTelemetry } = require('./telemetry/init');
const { requestLoggingMiddleware, errorHandlingMiddleware } = require('./middleware/telemetry');
const logger = require('./logger/winston');
const metricsCollector = require('./metrics/collector');
const { trace } = require('@opentelemetry/api');

let app = null;
let server = null;

async function initializeApplication() {
    try {
        // Initialize telemetry first
        await initializeTelemetry();

        // Initialize metrics
        metricsCollector.initializeMetrics();

        // Create Express app
        app = express();

        // Setup middleware
        setupMiddleware();

        // Setup routes
        setupRoutes();

        // Setup error handling
        setupErrorHandling();

        logger.info('Application initialized successfully');
    } catch (error) {
        logger.error('Failed to initialize application', { error });
        process.exit(1);
    }
}

function setupMiddleware() {
    app.use(express.json());
    app.use(requestLoggingMiddleware);
}

function setupRoutes() {
    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: process.env.SERVICE_NAME || 'nodejs-app',
            version: process.env.SERVICE_VERSION || '1.0.0',
        });
    });

    // Sample business endpoint
    app.post('/api/process', async (req, res) => {
        const tracer = trace.getTracer('business-operations');

        await tracer.startActiveSpan('process-data', async (span) => {
            try {
                span.setAttributes({
                    'operation.type': 'data-processing',
                    'data.size': JSON.stringify(req.body).length,
                });

                // Simulate business logic
                await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

                // Record business metric
                metricsCollector.recordBusinessOperation('data-processing', true);

                logger.info('Data processed successfully', {
                    dataSize: JSON.stringify(req.body).length,
                    processingTime: Date.now(),
                });

                res.json({
                    success: true,
                    processedAt: new Date().toISOString(),
                    dataSize: JSON.stringify(req.body).length,
                });

            } catch (error) {
                span.recordException(error);
                metricsCollector.recordBusinessOperation('data-processing', false);
                throw error;
            } finally {
                span.end();
            }
        });
    });

    // Endpoint to simulate error
    app.get('/api/error', (req, res) => {
        throw new Error('Simulated error for testing');
    });
}

function setupErrorHandling() {
    app.use(errorHandlingMiddleware);
}

async function startServer() {
    const port = process.env.PORT || 3000;

    server = app.listen(port, () => {
        logger.info(`Server started on port ${port}`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', shutdownApplication);
    process.on('SIGINT', shutdownApplication);
}

async function shutdownApplication() {
    logger.info('Shutting down server...');

    if (server) {
        server.close(() => {
            logger.info('HTTP server closed');
        });
    }

    await shutdownTelemetry();
    process.exit(0);
}

// Start application
async function main() {
    await initializeApplication();
    await startServer();
}

main().catch(error => {
    console.error('Failed to start application:', error);
    process.exit(1);
});

module.exports = { app, initializeApplication, startServer, shutdownApplication };