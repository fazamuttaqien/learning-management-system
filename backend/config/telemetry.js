const config = {
    serviceName: process.env.SERVICE_NAME || "learning-management-sytem",
    serviceVersion: process.env.SERVICE_VERSION || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    otlp: {
        endpoint: process.env.OTLP_ENDPOINT || "http://localhost:4317",
        headers: {
            'Authorization': `Bearer ${process.env.OTLP_TOKEN || ''}`,
            'Content-Type': 'application/json'
        }
    },
    sampling: {
        ratio: parseFloat(process.env.TRACE_SAMPLE_RATIO) || 1.0
    }
};

module.exports = config;