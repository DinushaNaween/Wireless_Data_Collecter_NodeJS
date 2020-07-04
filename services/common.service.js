const sql = require('../config/db.config');

// This promice-reflect use to map rejects in Promice.all
const promiseHandler =  function(promise) {
  return promise
      .then(data => {
        return {data: data, status: "resolved"}
      })
      .catch(error => {
        return {data: error, status: "rejected"}
      });
}

// Convert comma seperated string to int array
const stringToIntArray = function(string) {
  return intArray = (Array.from(string.split(','))).map((i) => Number(i));
}

// Convert comma seperated string to int array from multiple objects
const stringToIntArrayBulk = function(dataArray, stringName) {

  for (let i = 0; i < dataArray.length; i++) {
    const element = dataArray[i];
    let tempArray = (Array.from(element[stringName].split(','))).map((i) => Number(i));
    element[stringName] = tempArray;
  }

  return dataArray;
}

// Update child array of a table (eg: nodes array in parentNode table)
const updateChildArray = function(tableName, keyAttributeOfTable, columnToUpdate, keyAttributeValue, dataSetKeyColumnName, dataSet) {

  return promise = new Promise( function(resolve, reject) {
    let newIds = [];

    if (dataSet.length > 1) {
      Array.from(dataSet).forEach(element => {
        newIds.push(element[dataSetKeyColumnName]);
      })
    } else{
      newIds.push(dataSet[0][dataSetKeyColumnName]);
    }

    sql.query(`SELECT * FROM ${tableName} WHERE ${keyAttributeOfTable} = ${keyAttributeValue}`, (err, parentObject) => {
      if (err) {
        reject(err.message);
      } 

      if (parentObject) {
        let currentString = parentObject[0][columnToUpdate];
        let updatedArray = [];

        if (currentString == null) {
          updatedArray = newIds;
        } else {
          let currentIntArray = stringToIntArray(currentString);
          updatedArray = currentIntArray.concat(newIds);
        }

        sql.query(`UPDATE ${tableName} SET ${columnToUpdate} = ?, lastModifiedDateTime = ? WHERE ${keyAttributeOfTable} = ${keyAttributeValue}`,[updatedArray.join(), new Date()], (err, res) => {
          if (err) {
            reject(err.message);
          }

          if (res) {
            resolve(newIds);
          } 
        });
      }
    });
  });
};

module.exports = {
  promiseHandler,
  stringToIntArray,
  stringToIntArrayBulk,
  updateChildArray
}