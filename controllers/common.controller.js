const common = require('../services/common.service');

exports.getTableInfo = (req, res) => {
  common.getTableInfo(req.params.tableName, (err, data) => {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while retrieving the table info.'
      });
    }
    
    res.status(200).json({
      state: true,
      tableData: data
    });
  });
};

exports.renameTable = (req, res) => {
  common.renameTable(req.body.tableName, req.body.newTableName, (err, data) => {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while retrieving the table info.'
      });
    }
    
    res.status(200).json({
      state: true,
      tableData: data
    });
  });
};