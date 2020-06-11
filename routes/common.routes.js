module.exports = app => {

  const common = require('../controllers/common.controller');
  const { reqLog } = require('../middlewares/logger.middleware');

  // Get table info
  app.get('/common/:tableName', function (req, res, next) {
    reqLog(req, 'common.getTableInfo');
    next()
  },
    common.getTableInfo
  );

  // Rename table
  app.put('/common/renameTable', function (req, res, next) {
    reqLog(req, 'common.renameTable');
    next()
  },
    common.renameTable
  );
}