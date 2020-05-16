const DataTable = require('../models/dataTable.model');

exports.createNewDataTable = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
  }

  DataTable.createNewDataTable(req.body.nodeId, req.body.columns, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the data table.'
      });
    } else res.status(200).send(data);
  });
};

exports.addColumnToTableByTableName = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
  }

  DataTable.addColumnToTableByTableName(req.params.tableName, req.body.columns, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while updating the data table.'
      });
    } else res.status(200).send(data);
  });
};

exports.modifyColumnByTableName = (req, res) => {
  console.log('modify route');
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
  }

  DataTable.modifyColumnByTableName(req.params.tableName, req.body.columns, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while updating the data table.'
      });
    } else res.status(200).send(data);
  });
};