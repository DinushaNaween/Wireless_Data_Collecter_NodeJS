module.exports = app => {

  const table = require('../controllers/table.controller');
  const { reqLog } = require('../middlewares/logger.middleware');

  // Get table info
  app.get('/table/:tableName', function (req, res, next) {
    reqLog(req, 'table.getTableInfo');
    next()
  },
    table.getTableInfo
  );

  // Rename table
  app.put('/table/renameTable', function (req, res, next) {
    reqLog(req, 'table.renameTable');
    next()
  },
    table.renameTable
  );
}