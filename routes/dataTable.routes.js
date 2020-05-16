module.exports = app => {
  
  const dataTable = require('../controllers/dataTable.controller');

  // create new data table
  app.post('/dataTable', dataTable.createNewDataTable);

  // add columns to a data table by table name
  app.put('/dataTable/add/:tableName', dataTable.addColumnToTableByTableName);

  // modify columns by table name
  app.put('/dataTable/modify/:tableName', dataTable.modifyColumnByTableName);
}