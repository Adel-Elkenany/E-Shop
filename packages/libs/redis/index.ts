import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL as string, {
    tls: {},
    maxRetriesPerRequest: 5,
    retryStrategy: (times: number) => Math.min(200 + times * 100, 2000),
    enableReadyCheck: true,
});

// Events
redisClient.on('connect', () => {
    console.info('[redis] connected');
});

redisClient.on('ready', () => {
    console.info('[redis] ready');
});

// FIX: Strongly type error
redisClient.on('error', (err: Error) => {
    console.error('[ioredis] error event:', err.message);
});

// FIX: Explicit typing for delay parameter
redisClient.on('close', () => {
    console.warn('[redis] connection closed');
});

redisClient.on('reconnecting', (delay: number) => {
    console.info('[redis] reconnecting, delay ms:', delay);
});

// Memory fallback
const memoryStore = new Map<string, { value: string; expiresAt?: number }>();

const isRedisReady = () => redisClient.status === 'ready';

const wrapAsync = async (fn: () => any) => {
    try {
        return await fn();
    } catch (err: any) {
        console.error('[redis] command error, falling back to memory store:', err?.message || err);
        return null;
    }
};

const redis = {
    async get(key: string) {
        if (isRedisReady()) return wrapAsync(() => redisClient.get(key));

        const entry = memoryStore.get(key);
        if (!entry) return null;

        if (entry.expiresAt && Date.now() > entry.expiresAt) {
            memoryStore.delete(key);
            return null;
        }

        return entry.value;
    },

    async set(key: string, value: string, mode?: string, modeArg?: number) {
        if (isRedisReady()) {
            return wrapAsync(() => {
                if (mode?.toUpperCase() === 'EX' && modeArg) {
                    return redisClient.set(key, value, 'EX', modeArg);
                }
                return redisClient.set(key, value);
            });
        }

        const entry: any = { value };
        if (mode?.toUpperCase() === 'EX' && modeArg) {
            entry.expiresAt = Date.now() + modeArg * 1000;
        }

        memoryStore.set(key, entry);
        return 'OK';
    },

    async del(key: string) {
        if (isRedisReady()) return wrapAsync(() => redisClient.del(key));
        return memoryStore.delete(key) ? 1 : 0;
    },

    client: redisClient,
};

export default redis;
