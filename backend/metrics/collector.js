const { metrics } = require('@opentelemetry/api');

let meter = null;
let httpRequestCounter = null;
let httpRequestDuration = null;
let businessMetricCounter = null;
let activeConnectionsGauge = null;
let memoryUsageGauge = null;
let cpuUsageGauge = null;

function initializeMetrics() {
    meter = metrics.getMeter('nodejs-app-metrics', '1.0.0');
    setupMetricInstruments();
    registerSystemMetrics();
}

function setupMetricInstruments() {
    // HTTP request metrics
    httpRequestCounter = meter.createCounter('http_requests_total', {
        description: 'Total number of HTTP requests',
    });

    httpRequestDuration = meter.createHistogram('http_request_duration_seconds', {
        description: 'HTTP request duration in seconds',
        boundaries: [0.1, 0.5, 1, 2, 5, 10],
    });

    // Business metrics
    businessMetricCounter = meter.createCounter('business_operations_total', {
        description: 'Total number of business operations',
    });

    activeConnectionsGauge = meter.createUpDownCounter('active_connections', {
        description: 'Number of active connections',
    });

    // System metrics
    memoryUsageGauge = meter.createObservableGauge('memory_usage_bytes', {
        description: 'Memory usage in bytes',
    });

    cpuUsageGauge = meter.createObservableGauge('cpu_usage_percent', {
        description: 'CPU usage percentage',
    });
}

function registerSystemMetrics() {
    // Memory usage
    meter.addBatchObservableCallback(
        (observableResult) => {
            const memUsage = process.memoryUsage();
            observableResult.observe(memoryUsageGauge, memUsage.heapUsed, {
                type: 'heap_used',
            });
            observableResult.observe(memoryUsageGauge, memUsage.heapTotal, {
                type: 'heap_total',
            });
            observableResult.observe(memoryUsageGauge, memUsage.rss, {
                type: 'rss',
            });
        },
        [memoryUsageGauge]
    );

    // CPU usage (simplified)
    meter.addBatchObservableCallback(
        (observableResult) => {
            const cpuUsage = process.cpuUsage();
            const cpuPercent = (cpuUsage.user + cpuUsage.system) / 1000000; // Convert to seconds
            observableResult.observe(cpuUsageGauge, cpuPercent);
        },
        [cpuUsageGauge]
    );
}

// Convenience functions for recording metrics
function recordHttpRequest(method, route, statusCode, duration) {
    const labels = {
        method,
        route: route || 'unknown',
        status_code: statusCode.toString(),
    };

    httpRequestCounter.add(1, labels);
    httpRequestDuration.record(duration / 1000, labels); // Convert to seconds
}

function recordBusinessOperation(operation, success = true) {
    businessMetricCounter.add(1, {
        operation,
        success: success.toString(),
    });
}

function updateActiveConnections(delta) {
    activeConnectionsGauge.add(delta);
}

module.exports = {
    initializeMetrics,
    recordHttpRequest,
    recordBusinessOperation,
    updateActiveConnections
};