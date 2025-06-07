const { trace } = require('@opentelemetry/api');
const logger = require('../logger/winston');
const metricsCollector = require('../metrics/collector');

// Request logging middleware
function requestLoggingMiddleware(req, res, next) {
    const startTime = Date.now();

    // Log incoming request
    logger.info('Incoming request', {
        method: req.method,
        url: req.url,
        headers: req.headers,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
    });

    // Override res.end to capture response
    const originalEnd = res.end;
    res.end = function (chunk, encoding) {
        const duration = Date.now() - startTime;

        // Record metrics
        metricsCollector.recordHttpRequest(
            req.method,
            req.route?.path || req.path,
            res.statusCode,
            duration
        );

        // Log response
        logger.info('Request completed', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            responseSize: res.get('Content-Length') || 0,
        });

        originalEnd.call(this, chunk, encoding);
    };

    next();
}

// Error handling middleware
function errorHandlingMiddleware(err, req, res, next) {
    const span = trace.getActiveSpan();

    if (span) {
        span.recordException(err);
        span.setStatus({
            code: trace.SpanStatusCode.ERROR,
            message: err.message,
        });
    }

    logger.error('Request error', {
        error: err,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode || 500,
    });

    if (!res.headersSent) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
        });
    }
}

module.exports = {
    requestLoggingMiddleware,
    errorHandlingMiddleware,
};