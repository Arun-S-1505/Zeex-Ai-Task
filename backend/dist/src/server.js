import { createServer } from 'http';
import app from './app.js';
import { env } from './config/env.js';
import logger from './config/logger.js';
import prisma from './config/database.js';
import { initSocketIO } from './sockets/index.js';
import { getRedisClient } from './config/redis.js';
async function bootstrap() {
    try {
        const httpServer = createServer(app);
        // Initialize Real-time WebSockets
        initSocketIO(httpServer);
        logger.info('WebSocket (Socket.IO) server initialized');
        // Verify Database Connection (gracefully warned if offline)
        try {
            await prisma.$connect();
            logger.info('Database connected successfully');
        }
        catch (err) {
            logger.warn({ error: err.message }, 'PostgreSQL database offline. Start PostgreSQL or run: docker-compose up -d postgres');
        }
        // Non-fatal Redis connection check
        getRedisClient().catch((err) => {
            logger.warn({ error: err.message }, 'Redis is offline. Background queue disabled.');
        });
        httpServer.listen(env.PORT, () => {
            logger.info(`=======================================================`);
            logger.info(`🚀 SentinelAI Visual Safety Surveillance Platform API`);
            logger.info(`📡 Server running on http://localhost:${env.PORT}`);
            logger.info(`📖 Swagger API Docs: http://localhost:${env.PORT}/api/docs`);
            logger.info(`⚡ Socket.IO Ready: ws://localhost:${env.PORT}`);
            logger.info(`=======================================================`);
        });
        // Graceful Shutdown
        const shutdown = async (signal) => {
            logger.info(`Received ${signal}. Shutting down gracefully...`);
            httpServer.close(async () => {
                await prisma.$disconnect();
                logger.info('HTTP server closed, database connection disconnected');
                process.exit(0);
            });
            // Force shutdown after 10s timeout
            setTimeout(() => {
                logger.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }
    catch (error) {
        logger.error({ error }, 'Fatal error during server bootstrap');
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=server.js.map