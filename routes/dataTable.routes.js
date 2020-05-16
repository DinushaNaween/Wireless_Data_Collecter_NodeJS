module.exports = app => {
  
  const dataTable = require('../controllers/dataTable.controller');

  // create new data table
  app.post('/dataTable', dataTable.createNewDataTable);
}