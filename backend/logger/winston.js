const winston = require('winston');
const { logs } = require('@opentelemetry/api-logs');
const { trace } = require('@opentelemetry/api');

function createOTLPWinstonTransport(options = {}) {
    const logger = logs.getLogger('winston-logger', '1.0.0');

    const transport = new winston.Transport(options);

    transport.log = function (info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        try {
            // Get current span context
            const activeSpan = trace.getActiveSpan();
            const spanContext = activeSpan?.spanContext();

            // Create log record
            const logRecord = {
                timestamp: Date.now() * 1000000, // Convert to nanoseconds
                severityNumber: getSeverityNumber(info.level),
                severityText: info.level.toUpperCase(),
                body: info.message,
                attributes: {
                    'log.level': info.level,
                    'service.name': process.env.SERVICE_NAME || 'nodejs-app',
                    ...info.metadata,
                    ...(info.error && {
                        'error.name': info.error.name,
                        'error.message': info.error.message,
                        'error.stack': info.error.stack,
                    }),
                },
                ...(spanContext && {
                    traceId: spanContext.traceId,
                    spanId: spanContext.spanId,
                    traceFlags: spanContext.traceFlags,
                }),
            };

            logger.emit(logRecord);
        } catch (error) {
            console.error('Error in OTLP Winston transport:', error);
        }

        callback();
    };

    return transport;
}

function getSeverityNumber(level) {
    const levels = {
        error: 17,
        warn: 13,
        info: 9,
        http: 9,
        verbose: 5,
        debug: 5,
        silly: 1,
    };
    return levels[level] || 9;
}

// Create Winston logger with OTLP transport
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: {
        service: process.env.SERVICE_NAME || 'nodejs-app',
        version: process.env.SERVICE_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
    },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        createOTLPWinstonTransport(),
    ],
});

module.exports = logger;