module.exports = app => {

  const common = require('../controllers/common.controller');

  // Get table info
  app.get('/common/:tableName', function (req, res, next) {
    logger.reqLog(req, 'common.getTableInfo');
    next()
  },
    common.getTableInfo
  );

  // Rename table
  app.put('/common/renameTable', function (req, res, next) {
    logger.reqLog(req, 'common.renameTable');
    next()
  },
    common.renameTable
  );
}