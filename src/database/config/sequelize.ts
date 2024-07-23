import { Sequelize } from 'sequelize';
import database from './database';
import { ApplicationModeConstants } from '../../constants/ApplicationModeConstants';

/* check if environment is set, if not default to development and database port 3306 */
const env = process.env.NODE_ENV ? process.env.NODE_ENV : ApplicationModeConstants.DEVELOPMENT;
const dbPort = process?.env?.DATABASE_PORT ? +process.env.DATABASE_PORT : 3306;

const pool = new Sequelize({
    ...database[env as keyof typeof database],
    port: dbPort,
    dialect: 'mysql',
    logging: true,
    dialectOptions: {
        connectTimeout: 40000
    },
    pool: {
        max: 15,
        min: 5,
        evict: 30_000
    }
});

export default pool;
