const DataTable = require('../models/dataTable.model');

// Create new data table for a new node
exports.createNewDataTable = (req, res) => {
  if (!req.body.columns) {
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  DataTable.createNewDataTable(req.body.nodeId, req.body.columns, (err, data) => {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while creating the data table.'
      });
    } else 
      res.status(200).json({
        state: true,
        table_data: data
      });
  });
};

// Add columns by table name
exports.addColumnToTableByTableName = (req, res) => {
  if (!req.body.columns) {
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  DataTable.addColumnToTableByTableName(req.params.tableName, req.body.columns, (err, data) => {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while updating the data table.'
      });
    } else 
      res.status(200).json({
        state: true,
        table_data: data
      });
  });
};

// Modify columns by table name
exports.modifyColumnByTableName = (req, res) => {
  if (!req.body.columns) {
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  DataTable.modifyColumnByTableName(req.params.tableName, req.body.columns, (err, data) => {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while updating the data table.'
      });
    } else 
      res.status(200).json({
        state: true,
        table_data: data
      });
  });
};

// Drop columns by table name
exports.dropColumnByTableName = (req, res) => {
  if (!req.body.columns) {
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  DataTable.dropColumnByTableName(req.params.tableName, req.body.columns, (err, data) => {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while updating the data table.'
      });
    } else 
      res.status(200).json({
        state: true,
        table_data: data
      });
  })
};