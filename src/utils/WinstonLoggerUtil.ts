import 'winston-daily-rotate-file';
import winston from 'winston';
import path from 'path';

winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'green'
});

const timezoned = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata'
    });
};

/* logger class with different methods to capture logs. */
class WinstonLogger {
    /* logging used by entire application API's */
    public static logger = winston.createLogger({
        format: winston.format.combine(winston.format.timestamp({ format: timezoned })),
        /* info also tracks error and warn levels so a separate error level transport is not required */
        transports: [
            new winston.transports.Console({
                level: 'info',
                format: winston.format.combine(winston.format.colorize(), winston.format.simple())
            })
        ]
    });

    /* logging used by xovis ETL*/
    public static xovisLogger = winston.createLogger({
        format: winston.format.combine(
            winston.format.timestamp({ format: timezoned }),
            winston.format.json()
        ),
        transports: [
            new winston.transports.DailyRotateFile({
                filename: `${path.join(
                    __dirname,
                    '..',
                    '..',
                    '..',
                    'logs',
                    'xovis-info-%DATE%.log'
                )}`,
                datePattern: 'YYYY-MM-DD',
                level: 'info',
                format: winston.format.combine(winston.format.json())
            }),
            new winston.transports.DailyRotateFile({
                filename: `${path.join(
                    __dirname,
                    '..',
                    '..',
                    '..',
                    'logs',
                    'xovis-error-%DATE%.log'
                )}`,
                datePattern: 'YYYY-MM-DD',
                level: 'error',
                format: winston.format.combine(winston.format.json())
            })
        ]
    });
}

export default WinstonLogger;
