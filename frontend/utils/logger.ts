// frontend/utils/logger.ts
import winston from 'winston';

const isServer = typeof window === 'undefined';

const logger = isServer
    ? winston.createLogger({
      level: 'info',
      format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
      ),
      transports: [new winston.transports.Console()],
    })
    : {
      info: (...args: any[]) => console.log('[INFO]', ...args),
      error: (...args: any[]) => console.error('[ERROR]', ...args),
      warn: (...args: any[]) => console.warn('[WARN]', ...args),
      debug: (...args: any[]) => console.debug('[DEBUG]', ...args),
    };

export default logger;