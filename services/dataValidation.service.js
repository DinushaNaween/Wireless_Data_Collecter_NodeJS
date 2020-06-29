const sql = require('../config/db.config');
const DataValidation = require('../models/dataValidation.model');

const validateData = function(parentNodeId, data, validationPropsArray) {
  let dataArray = Array.from(data);
  let promises = [];
  
  dataArray.map((data) => {
    promises.push((data) => {
      
    })
  })
}

module.exports = {
  validateData
}