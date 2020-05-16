module.exports = app => {

  const common = require('../controllers/common.controller');

  // get table info
  app.get('/common/:tableName', common.getTableInfo);
}