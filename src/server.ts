import sequelize from './database/config/sequelize';
import app from './app';
import http from 'http';
import moment from 'moment-timezone';
import WinstonLogger from './utils/WinstonLoggerUtil';

const NAMESPACE = '[SERVER CONNECTION]:';
const PORT = process.env.PORT ?? 3000;

const server = http.createServer(app);

/* setting the application timezone to IST */
moment.tz.setDefault('Asia/Calcutta');

/*
when writing tests we import the server from this file. We do not want
to start another server so server.listen() is not on top level code
*/

if (require.main === module)
    (async () => {
        try {
            await sequelize.authenticate();
            server.listen(PORT, () => {
                WinstonLogger.logger.log({
                    message: `${NAMESPACE} Server started on port ${PORT}`,
                    level: 'info'
                });
            });
        } catch (error: unknown) {
            console.log(error);
            WinstonLogger.logger.log({
                message: `${NAMESPACE} Unabel to start the server.`,
                level: 'error'
            });
        }
    })();

export default server;
