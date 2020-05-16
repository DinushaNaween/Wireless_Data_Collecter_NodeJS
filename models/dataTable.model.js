const mysql = require('mysql');
const commonService = require('../services/common.service');

const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const PORT = process.env.PORT;
const DB = process.env.DB;

const sqlConnection = mysql.createConnection({
  host: '127.0.0.1',
  user: USER,
  password: PASSWORD,
  port: PORT,
  database: DB
});

sqlConnection.connect(error => {
  if(error) throw error;

  console.log('Successfully connected to the database \'wdc\'');
});

// create new data table for a new node
exports.createNewDataTable = (nodeId, columns, result) => {
  let columnsArray = [];
  let tableName = 'Data_' + nodeId;

  for (let i = 0; i < columns.length; i++) {
    columnsArray.push(columns[i].column + ' ' + columns[i].type + '(' + columns[i].size + ')');
  }

  sqlConnection.query('CREATE TABLE ' + tableName +' (dataId INT NOT NULL AUTO_INCREMENT, nodeId INT NOT NULL, ' + columnsArray.join() + ', ' + 'isValidated INT(2) ZEROFILL NULL, disabled INT(2) ZEROFILL NULL, savedDateTime DATETIME NULL DEFAULT NULL, PRIMARY KEY(dataId), FOREIGN KEY(nodeId) REFERENCES `wdc`.`node` (`nodeId`) ON DELETE NO ACTION ON UPDATE CASCADE) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8', (err, res) => {
    if (err) {
      if (debug) console.log('Error on creating table: ', err);
      result(err, null);
      return;
    }

    commonService.getTableInfo(tableName, (err, data) => {
      if (err) {
        result(err, null);
        return;
      }

      result(null, data);
      return;
    });

    if (debug) console.log('Data table created successfully');
  });
};

// add columns by table name
exports.addColumnToTableByTableName = (tableName, columns, result) => {
  let columnsArray = [];

  for (let i = 0; i < columns.length; i++) {
    columnsArray.push(' ADD ' + columns[i].column + ' ' + columns[i].type + '(' + columns[i].size + ') AFTER nodeId');
  }

  sqlConnection.query('ALTER TABLE ' + tableName + columnsArray.join(', '), (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    commonService.getTableInfo(tableName, (err, data) => {
      if (err) {
        result(err, null);
        return;
      }

      result(null, data);
      return;
    });
  
    if (debug) console.log('Table modified successfully')
  });
};

// modify column by table name
exports.modifyColumnByTableName = (tableName, columns, result) => {

  let columnsArray = [];

  for (let i = 0; i < columns.length; i++) {
    columnsArray.push(' MODIFY ' + columns[i].column + ' ' + columns[i].type + '(' + columns[i].size + ')')
  }

  sqlConnection.query('ALTER TABLE ' + tableName + columnsArray.join(), (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      erros.push(err.message);
    }

    commonService.getTableInfo(tableName, (err, data) => {
      if (err) {
        result(err, null);
        return;
      }
  
      result(null, data);
      return;
    });
  });
};