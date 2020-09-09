const { createConnection } = require('mysql');
const logger = require('../middlewares/logger.middleware');

const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const PORT = process.env.PORT;
const DB = process.env.DB;

const connection = createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  port: PORT,
  database: DB  
});

module.exports = {
  connection
};