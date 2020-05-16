const common = require('../services/common.service');

exports.getTableInfo = (req, res) => {
  console.log(req.params.tableInfo)
  common.getTableInfo(req.params.tableName, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving the table info.'
      });
    }
    
    res.status(200).send(data);
  })
}