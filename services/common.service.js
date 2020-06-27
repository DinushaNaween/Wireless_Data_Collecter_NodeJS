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
    Array.from(dataSet).forEach(element => {
      newIds.push(element[dataSetKeyColumnName]);
    })

    sql.query(`SELECT * FROM ${tableName} WHERE ${keyAttributeOfTable} = ${keyAttributeValue}`, (err, stringArray) => {
      if (err) {
        reject(err.message);
      } 

      if (stringArray) {
        let currentArray = stringToIntArray(stringArray[0][columnToUpdate]);
        let updatedArray = currentArray.concat(newIds);

        sql.query(`UPDATE ${tableName} SET ${columnToUpdate} = ?, lastModifiedDateTime = ? WHERE ${keyAttributeOfTable} = ${keyAttributeValue}`,[updatedArray.join(), new Date()], (err, res) => {
          if (err) {
            reject(err.message);
          }

          if (res) {
            sql.query(`SELECT * FROM ${tableName} WHERE ${keyAttributeOfTable} = ${keyAttributeValue}`, (err, updatedElement) => {
              if (err) {
                reject(err.message);
              }

              if (updatedElement) {
                resolve(updatedElement);
              }
            })
          }
        })
      }
    })
  })

  
}

module.exports = {
  promiseHandler,
  stringToIntArray,
  stringToIntArrayBulk,
  updateChildArray
}