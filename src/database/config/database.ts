import dotenv from 'dotenv';
import { ApplicationModeConstants } from '../../constants/ApplicationModeConstants';

/* based on the node environment set using cross-env, we will pick the environment variable. */
const env = process.env.NODE_ENV ? process.env.NODE_ENV : ApplicationModeConstants.DEVELOPMENT;
dotenv.config({ path: `.env.${env}` });
export = {
    development: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT,
        dialectOptions: {
            connectTimeout: 40000
        }
    },
    test: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT
    },
    uat: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT,
        dialectOptions: {
            connectTimeout: 40000
        }
    }
};
