const { createConnection } = require('mysql');
const logger = require('../middlewares/logger.middleware');

// const HOST = process.env.HOST;
// const USER = process.env.USER;
// const PASSWORD = process.env.PASSWORD;
// const PORT = process.env.PORT;
// const DB = process.env.DB;

const HOST = 'freedb.tech';
const USER = 'freedb_teamgreen'
const PASSWORD = '123456789'
const PORT = '3306'
const DB = 'freedb_wdc'

console.log(HOST);
console.log(USER);
console.log(PASSWORD);
console.log(PORT);
console.log(DB);

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