module.exports = app => {

  const common = require('../controllers/common.controller');

  // Get table info
  app.get('/common/:tableName', common.getTableInfo);

  // Rename table
  app.put('/common/renameTable', common.renameTable);
}