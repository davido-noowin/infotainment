import { createProxyMiddleware } from "http-proxy-middleware"

module.exports = function (app) {
    app.use('/auth/**', 
        createProxyMiddleware({ 
            target: 'http://127.0.0.1:5000'
        })
    );
};