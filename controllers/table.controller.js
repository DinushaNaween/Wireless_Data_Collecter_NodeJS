const table = require('../services/table.service');
const logger = require('../middlewares/logger.middleware');

exports.getTableInfo = (req, res) => {
  table.getTableInfo(req.params.tableName, (err, data) => {
    if (err) {
      logger.error('getTableInfo', err.message);
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while retrieving the table info.'
      });
    } else {
      logger.info('getTableInfo success');
      res.status(200).json({
      state: true,
      tableData: data
    });
    }
  });
};

exports.renameTable = (req, res) => {
  table.renameTable(req.body.tableName, req.body.newTableName, (err, data) => {
    if (err) {
      logger.error('renameTable', err.message);
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while retrieving the table info.'
      });
    } else {
      logger.info('renameTable success');
      res.status(200).json({
      state: true,
      tableData: data
    });
    }
  });
};