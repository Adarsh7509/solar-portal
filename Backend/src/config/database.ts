import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
const dbName = process.env.DB_NAME || 'solar_db';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'postgres';
const dbSslEnabled = process.env.DB_SSL === 'true';
const dbSslRejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true';

const sslOptions = dbSslEnabled
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: dbSslRejectUnauthorized,
      },
    }
  : undefined;

export const sequelize = dbUrl
  ? new Sequelize(dbUrl, {
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development'
        ? (sql) => logger.debug(`Sequelize SQL: ${sql}`)
        : false,
      benchmark: true,
      dialectOptions: {
        ssl: dbSslEnabled ? {
          require: true,
          rejectUnauthorized: dbSslRejectUnauthorized
        } : undefined
      },
      define: {
        underscored: true,
        freezeTableName: true,
        timestamps: true,
      },
    })
  : new Sequelize({
      dialect: 'postgres',
      host: dbHost,
      port: dbPort,
      database: dbName,
      username: dbUser,
      password: dbPassword,
      logging: process.env.NODE_ENV === 'development'
        ? (sql) => logger.debug(`Sequelize SQL: ${sql}`)
        : false,
      benchmark: true,
      dialectOptions: sslOptions,
      define: {
        underscored: true,
        freezeTableName: true,
        timestamps: true,
      },
    });
