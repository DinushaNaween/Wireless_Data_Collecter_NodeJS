module.exports = app => {
  
  const dataTable = require('../controllers/dataTable.controller');
  const { reqLog } = require('../middlewares/logger.middleware');

  // Create new data table for a new node
  app.post('/dataTable', function (req, res, next) {
    reqLog(req, 'dataTable.createNewDataTable');
    next()
  },
    dataTable.createNewDataTable
  );

  // Add columns by table name
  app.put('/dataTable/add/:tableName', function (req, res, next) {
    reqLog(req, 'dataTable.addColumnToTableByTableName');
    next()
  },
    dataTable.addColumnToTableByTableName
  );

  // Modify columns by table name
  app.put('/dataTable/modify/:tableName', function (req, res, next) {
    reqLog(req, 'dataTable.modifyColumnByTableName');
    next()
  },
    dataTable.modifyColumnByTableName
  );

  // Drop columns by table name
  app.put('/dataTable/dropColumn/:tableName', function (req, res, next) {
    reqLog(req, 'dataTable.dropColumnByTableName');
    next()
  },
    dataTable.dropColumnByTableName
  );

  // Rename columns by table name
  app.put('/dataTable/renameColumn/:tableName', function (req, res, next) {
    reqLog(req, 'dataTable.renameColumnByTableName');
    next()
  },
    dataTable.renameColumnByTableName
  );

  // Get all data table names
  app.get('/dataTable', function (req, res, next) {
    reqLog(req, 'dataTable.getAllDataTableNames');
    next()
  },
    dataTable.getAllDataTableNames
  );
}