const { NodeSDK } = require('@opentelemetry/sdk-node');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics')
const { logs } = require('@opentelemetry/api-logs');
const { LoggerProvider, BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');
const config = require('../config/telemetry');

let sdk = null;
let loggerProvider = null;
let isInitialized = false;

async function initializeTelemetry() {
    if (isInitialized) {
        console.warn('Telemetry already initialized');
        return;
    }

    try {
        // Create resource
        const resource = new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
            [SemanticResourceAttributes.SERVICE_VERSION]: config.serviceVersion,
            [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: config.environment,
            [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: process.env.HOSTNAME || 'unknown'
        });

        // Initialize trace exporter
        const traceExporter = new OTLPTraceExporter({
            url: `${config.otlp.endpoint}/v1/traces`,
            headers: config.otlp.headers,
            timeoutMillis: 5000,
        });

        // Initialize metric exporter
        const metricExporter = new OTLPMetricExporter({
            url: `${config.otlp.endpoint}/v1/metrics`,
            headers: config.otlp.headers,
            timeoutMillis: 5000,
        });

        // Initialize log exporter
        const logExporter = new OTLPLogExporter({
            url: `${config.otlp.endpoint}/v1/logs`,
            headers: config.otlp.headers,
            timeoutMillis: 5000,
        });

        // Setup SDK
        sdk = new NodeSDK({
            resource,
            traceExporter,
            metricReader: new PeriodicExportingMetricReader({
                exporter: metricExporter,
                exportIntervalMillis: 10000, // Export every 10 seconds
            }),
            instrumentations: [
                getNodeAutoInstrumentations({
                    '@opentelemetry/instrumentation-fs': {
                        enabled: false, // Disable file system instrumentation for performance
                    },
                    '@opentelemetry/instrumentation-http': {
                        enabled: true,
                        requestHook: (span, request) => {
                            span.setAttributes({
                                'http.request.size': request.headers['content-length'] || 0,
                                'user.agent': request.headers['user-agent'] || 'unknown'
                            });
                        },
                    },
                    '@opentelemetry/instrumentation-express': {
                        enabled: true,
                    },
                }),
            ],
        });

        // Initialize logger provider for logs
        loggerProvider = new LoggerProvider({
            resource,
            logRecordProcessors: [
                new BatchLogRecordProcessor(logExporter, {
                    maxExportBatchSize: 100,
                    scheduledDelayMillis: 5000,
                    exportTimeoutMillis: 5000,
                    maxQueueSize: 1000,
                }),
            ],
        });

        // Register logger provider
        logs.setGlobalLoggerProvider(loggerProvider);

        // Start SDK
        sdk.start();

        isInitialized = true;
        console.log('OpenTelemetry initialized successfully');
    } catch (error) {
        console.error('Failed to initialize OpenTelemetry:', error);
        throw error;
    }
}

async function shutdownTelemetry() {
    if (!isInitialized) return;

    try {
        await sdk?.shutdown();
        await loggerProvider?.shutdown();
        console.log('OpenTelemetry shutdown successfully');
    } catch (error) {
        console.error('Error during OpenTelemetry shutdown:', error);
    }
}

module.exports = {
    initializeTelemetry,
    shutdownTelemetry
};