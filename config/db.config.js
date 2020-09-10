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

console.log(process.env.HOST);
console.log(process.env.USER);
console.log(process.env.PASSWORD);
console.log(process.env.PORT);
console.log(process.env.DB);

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