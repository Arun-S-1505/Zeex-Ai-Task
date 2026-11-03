import { env } from './env.js';
let redisConnection = null;
export function getRedisConfig() {
    try {
        const url = new URL(env.REDIS_URL);
        return {
            host: url.hostname || 'localhost',
            port: parseInt(url.port || '6379'),
        };
    }
    catch {
        return { host: 'localhost', port: 6379 };
    }
}
export async function getRedisClient() {
    if (!redisConnection) {
        try {
            const { default: IORedis } = await import('ioredis');
            redisConnection = new IORedis(env.REDIS_URL, {
                maxRetriesPerRequest: null,
                enableReadyCheck: false,
                retryStrategy: (times) => {
                    if (times > 3)
                        return null;
                    return Math.min(times * 200, 2000);
                },
            });
            redisConnection.on('error', (err) => {
                console.warn('Redis connection error (non-fatal):', err.message);
            });
        }
        catch {
            console.warn('Redis not available - background jobs disabled');
            return null;
        }
    }
    return redisConnection;
}
//# sourceMappingURL=redis.js.map