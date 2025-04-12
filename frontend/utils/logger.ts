// utils/logger.ts
let logger: any;

if (typeof window === 'undefined') {
    // 서버 환경 (winston 사용 가능)
    const winston = require('winston');

    logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        transports: [new winston.transports.Console()],
    });
} else {
    // 클라이언트 환경 (console 대체)
    logger = {
        info: (...args: any[]) => console.log('[INFO]', ...args),
        error: (...args: any[]) => console.error('[ERROR]', ...args),
        warn: (...args: any[]) => console.warn('[WARN]', ...args),
        debug: (...args: any[]) => console.debug('[DEBUG]', ...args),
    };
}

export default logger;