const tableService = require('../services/table.service');

const { createConnection } = require('mysql');

const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const PORT = process.env.PORT;
const DB = process.env.DB;

const sqlConnection = createConnection({
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

// Create new data table for a new node
exports.createNewDataTable = (nodeId, columns, result) => {
  let columnsArray = [];
  let tableName = 'data_' + nodeId;

  for (let i = 0; i < columns.length; i++) {
    columnsArray.push(`${columns[i].sensorId}_${columns[i].column}` + ' ' + columns[i].type + '(' + columns[i].size + ')');
  }

  sqlConnection.query('CREATE TABLE ' + tableName +' (dataId INT NOT NULL AUTO_INCREMENT, nodeId INT NOT NULL, ' + columnsArray.join() + ', ' + 'isValidated INT(2) ZEROFILL NULL, disabled INT(2) ZEROFILL NULL, savedDateTime DATETIME NULL DEFAULT NULL, PRIMARY KEY(dataId), FOREIGN KEY(nodeId) REFERENCES `wdc`.`node` (`nodeId`) ON DELETE NO ACTION ON UPDATE CASCADE) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8', (err, res) => {
    if (err) {
      if (debug) console.log('Error on creating table: ', err);
      result(err, null);
      return;
    }

    tableService.getTableInfo(tableName, (err, data) => {
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

// Add columns by table name
exports.addColumnToTableByTableName = (tableName, columns, result) => {
  let columnsArray = [];

  for (let i = 0; i < columns.length; i++) {
    columnsArray.push(' ADD ' + `${columns[i].sensorId}_${columns[i].column}` + ' ' + columns[i].type + '(' + columns[i].size + ') AFTER nodeId');
  }

  sqlConnection.query('ALTER TABLE ' + tableName + columnsArray.join(', '), (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    tableService.getTableInfo(tableName, (err, data) => {
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

// Modify columns by table name
exports.modifyColumnByTableName = (tableName, columns, result) => {

  let columnsArray = [];

  for (let i = 0; i < columns.length; i++) {
    columnsArray.push(' MODIFY ' + `${columns[i].sensorId}_${columns[i].column}` + ' ' + columns[i].type + '(' + columns[i].size + ')')
  }

  sqlConnection.query('ALTER TABLE ' + tableName + columnsArray.join(), (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    tableService.getTableInfo(tableName, (err, data) => {
      if (err) {
        result(err, null);
        return;
      }
  
      result(null, data);
      return;
    });
  });
};

// Drop a columns by table name
exports.dropColumnByTableName = (tableName, columns, result) => {
  console.log('drop column');

  let columnsArray = [];

  for (let i = 0; i < columns.length; i++) {
    console.log(`${columns[i].sensorId}_${columns[i].column}`);
    columnsArray.push(' DROP COLUMN ' + `${columns[i].sensorId}_${columns[i].column}`);
  }

  sqlConnection.query('ALTER TABLE ' + tableName + columnsArray.join(), (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    tableService.getTableInfo(tableName, (err, data) => {
      if (err) {
        result(err, null);
        return;
      }
  
      result(null, data);
      return;
    });
  });
};

// Rename columns by table name
exports.renameColumnByTableName = (tableName, columns, result) => {
  let columnsArray = [];

  for (let i = 0; i < columns.length; i++) {
    columnsArray.push(' CHANGE COLUMN ' + `${columns[i].sensorId}_${columns[i].column}` + ' ' + columns[i].newName + ' ' + columns[i].type + '(' + columns[i].size + ')');
  }

  sqlConnection.query('ALTER TABLE ' + tableName + columnsArray.join(), (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    tableService.getTableInfo(tableName, (err, data) => {
      if (err) {
        result(err, null);
        return;
      }
  
      result(null, data);
      return;
    });
  });
};

// Get all data table names
exports.getAllDataTables = (result) => {

  let tableNames = [];

  sqlConnection.query('SELECT table_name FROM information_schema.tables WHERE table_name LIKE \"data_%\"', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    for (let i = 0; i < res.length; i++) {
      tableNames.push(res[i].table_name);
    }

    result(null, tableNames);
    return
  });
};

// Get data table info by table name
exports.getDataTableByTableName = (dataTableName, result) => {

  let columns = [];

  sqlConnection.query('SELECT * FROM information_schema.columns WHERE TABLE_SCHEMA = \'WDC\' AND TABLE_NAME = ?', [dataTableName], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    for (let i = 0; i < res.length; i++) {
      columns.push(res[i].COLUMN_NAME);
    }

    if (debug) console.log(columns);
    result(null, columns);
    return;
  });
}