const sql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

const poolPromise = new sql.ConnectionPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}).connect();

module.exports = { poolPromise };
