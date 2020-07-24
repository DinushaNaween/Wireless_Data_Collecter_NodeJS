const DataTable = require('../models/dataTable.model');
const logger = require('../middlewares/logger.middleware');
const { findById } = require('../models/node.model');

// Create new data table for a new node
exports.createNewDataTable = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {

    findById(req.body.nodeId, (err, node) => {
      if (err) {
        logger.error('node findById', err.message);
        res.status(500).json({
          state: false,
          message: err.message || 'Not found node for nodeId: ' + req.body.nodeId
        })
      } 

      if (node) {
        DataTable.createNewDataTable(req.body.nodeId, req.body.columns, (err, data) => {
          if (err) {
            logger.error('createNewDataTable', err.message);
            res.status(500).json({
              state: false,
              message: err.message || 'Some error occurred while creating the data table.'
            });
          } else {
            logger.info('createNewDataTable success');
            res.status(200).json({
              state: true,
              table_data: data
            });
          }
        });
      }
    })
  }
};

// Add columns by table name
exports.addColumnToTableByTableName = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    DataTable.addColumnToTableByTableName(req.params.tableName, req.body.columns, (err, data) => {
      if (err) {
        logger.error('addColumnToTableByTableName', err.message);
        res.status(500).json({
          state: false,
          message: err.message || 'Some error occurred while updating the data table.'
        });
      } else {
        logger.info('addColumnToTableByTableName success');
        res.status(200).json({
          state: true,
          table_data: data
        });
      }
    });
  }
};

// Modify columns by table name
exports.modifyColumnByTableName = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    DataTable.modifyColumnByTableName(req.params.tableName, req.body.columns, (err, data) => {
      if (err) {
        logger.error('modifyColumnByTableName', err.message);
        res.status(500).json({
          state: false,
          message: err.message || 'Some error occurred while updating the data table.'
        });
      } else {
        logger.info('modifyColumnByTableName success');
        res.status(200).json({
          state: true,
          table_data: data
        });
      }
    });
  }
};

// Drop columns by table name
exports.dropColumnByTableName = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    DataTable.dropColumnByTableName(req.params.tableName, req.body.columns, (err, data) => {
      if (err) {
        logger.error('dropColumnByTableName', err.message);
        res.status(500).json({
          state: false,
          message: err.message || 'Some error occurred while updating the data table.'
        });
      } else {
        logger.info('dropColumnByTableName success');
        res.status(200).json({
          state: true,
          table_data: data
        });
      }
    });
  }
};

// Rename columns by table name
exports.renameColumnByTableName = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    DataTable.renameColumnByTableName(req.params.tableName, req.body.columns, (err, data) => {
      if (err) {
        logger.error('renameColumnByTableName', err.message);
        res.status(500).json({
          state: false,
          message: err.message || 'Some error occurred while updating the data table.'
        });
      } else {
        logger.info('renameColumnByTableName success');
        res.status(200).json({
          state: true,
          table_data: data
        });
      }
    });
  }
};

// Get all data table names
exports.getAllDataTableNames = (req, res) => {
  DataTable.getAllDataTables((err, data) => {
    if (err) {
      logger.error('getAllDataTableNames', err.message);
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while getting data table names.'
      });
    } else {
      logger.info('getAllDataTableNames success');
      res.status(200).json({
        state: true,
        table_names: data
      });
    }
  });
};

// Get data table info by table name
exports.getDataTableByTableName = (req, res) => {
  DataTable.getDataTableByTableName(req.body.tableName, (err, data) => {
    res.status(200).json({
      err: err,
      data: data
    })
  })
}