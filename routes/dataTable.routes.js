module.exports = app => {
  
  const dataTable = require('../controllers/dataTable.controller');

  // Create new data table for a new node
  app.post('/dataTable', dataTable.createNewDataTable);

  // Add columns by table name
  app.put('/dataTable/add/:tableName', dataTable.addColumnToTableByTableName);

  // Modify columns by table name
  app.put('/dataTable/modify/:tableName', dataTable.modifyColumnByTableName);

  // Drop columns by table name
  app.put('/dataTable/dropColumn/:tableName', dataTable.dropColumnByTableName);
}