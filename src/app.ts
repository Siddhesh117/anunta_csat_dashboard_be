import express, { ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import routerV1 from './routes/v1';
// import GlobalErrorHandlerConstant from './constants/GlobalErrorHandlerConstant';
import General from './utils/General';
import WinstonLogger from './utils/WinstonLoggerUtil';
import RateLimiter from './utils/RateLimiter';
import helmet from 'helmet';

const app = express();

const NAMESPACE = '[APPLICATION]:';

/* Technologies used by the application are confidential and should not be easily guessed. */
app.disable('x-powered-by');

app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
        credentials: true
    })
);

/* for security purposes response header "Server" is removed. */
app.use((req, res, next) => {
    res.removeHeader('Server');
    next();
});

app.use(RateLimiter.limiter);

/* limit the size of message body received by server.  */
app.use(
    express.json({
        limit: process.env.INCOMING_REQUEST_BODY_LIMIT
            ? process.env.INCOMING_REQUEST_BODY_LIMIT
            : '1024mb'
    })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(helmet({ crossOriginResourcePolicy: false }));

/* log every request */
app.use((req, res, next) => {
    /* ip address of the host machine */
    const ip = General.parseIp(req);
    /* req object modifies the req.url on finish so we store it in a variable, so for on finish logging we get the same inital url */
    const reqUrl = req.url;

    WinstonLogger.logger.log({
        message: `${NAMESPACE} METHOD: [${req.method}] - URL: [${reqUrl}] - IP: [${ip}]`,
        level: 'info'
    });
    res.on('finish', () => {
        WinstonLogger.logger.log({
            message: `${NAMESPACE} METHOD: [${req.method}] - URL: [${reqUrl}] - IP: [${ip}] - STATUS: [${res.statusCode}]`,
            level: 'info'
        });
    });
    next();
});

app.use('/api/v1', routerV1);

/* global error handler */
// const errorHandler: ErrorRequestHandler = (err, req, res) => {
//     if (err?.message == GlobalErrorHandlerConstant.INCOMING_REQ_BODY_TOO_LARGE) {
//         WinstonLogger.logger.log({
//             message: `${NAMESPACE} Incoming request body too large, URL=${
//                 req.originalUrl
//             } SIZE=${req.get('content-length')} Bytes.`,
//             level: 'error'
//         });
//     } else {
//         WinstonLogger.logger.log({ message: `${NAMESPACE} Global Error Handler`, level: 'error' });
//     }
//     res.status(500).json({ message: err.message });
// };
// app.use(errorHandler);

export default app;
