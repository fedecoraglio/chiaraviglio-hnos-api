let mysql = require('promise-mysql');
import { default as config } from '../env/index';

const connectionPool = mysql.createPool({
    host:     config.envConfig.database.DB_URI,
    user:     config.envConfig.database.DB_USER,
    password: config.envConfig.database.DB_PASS,
    database: config.envConfig.database.DB_MAIN,
    connectionLimit: 10
});

export const db  = connectionPool;