const sql = require('../config/db.config');
const ValidationAck = require('../models/validationAck.model');
const logger = require('../middlewares/logger.middleware');
const { promiseHandler } = require('../services/common.service');
const { loggers } = require('winston');

const validateData = function(data, validationPropsArray, parentNodeId) {

  return new Promise((resolve, reject) => {
    let dataArray = Array.from(data);
    let promises = [];
    let validations = [];

    for (let i = 0; i < validationPropsArray.length; i++) {
      const validationObject = validationPropsArray[i];
      let tempArray = [];

      tempArray.push(`${validationObject.sensorId}_${validationObject.sensorName}`);
      tempArray.push(validationObject.lowerValidLimit);
      tempArray.push(validationObject.upperValidLimit);
      tempArray.push(validationObject.dataValidationId);

      validations.push(tempArray);
    }

    const validationsAdder = function(dataObject) {
      return validator(dataObject, validations, parentNodeId)
    }

    dataArray.map((data) => {
      promises.push(validationsAdder(data));
    })

    Promise.all(promises.map(promiseHandler))
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        logger.error('validateData Promise.all', error.message);
        reject(error);
      })
  }) 
}

const validator = (data, validations, parentNodeId) => {

  return new Promise((resolve, reject) => {
    try {
      let validatedDataObjects = [];
      let validatedDataObject = {};
      let isValidated = new Boolean(true);
      
      validatedDataObject['nodeId'] = data.nodeId;

      for (let i = 1; i < Object.keys(data).length - 3; i++) {
        let dataPropertyName = Object.keys(data)[i]
        let dataPropertyValue = data[dataPropertyName];
      
        for (let j = 0; j < validations.length; j++) {
          const validationParameter = validations[j];
          
          if (dataPropertyName == validationParameter[0]) {
            switch (true) {
              case (dataPropertyValue < validationParameter[1]):
                validatedDataObject[dataPropertyName] = 'Low';
                isValidated = false;
                saveValidationAck(parentNodeId, data.nodeId, dataPropertyName, dataPropertyValue, validationParameter, 'Low');
                break;

              case (dataPropertyValue > validationParameter[2]):
                validatedDataObject[dataPropertyName] = 'High';
                isValidated = false;
                saveValidationAck(parentNodeId, data.nodeId, dataPropertyName, dataPropertyValue, validationParameter, 'High');
                break;

              case (validationParameter[1] <= dataPropertyValue && dataPropertyValue <= validationParameter[2]):
                validatedDataObject[dataPropertyName] = 'OK';
                break;
            
              default:
                break;
            }
          }
        }
      }
      validatedDataObjects.push(validatedDataObject);

      if (isValidated) {
        data.isValidated = '1';
      }

      let response = [];
      response.push({ data: data, validationState: validatedDataObjects });
      resolve(response);
    } catch (error) {
      logger.error('validator try catch', error.message);
      reject('error')
    }
  }) 
}

function saveValidationAck(parentNodeId, nodeId, dataPropertyName, dataPropertyValue, validationParameter, status) {
  let newValidationAck = new ValidationAck({
    parentNodeId: parentNodeId,
    nodeId: nodeId,
    dataValidationId: validationParameter[3],
    sensorName: dataPropertyName,
    receivedValue: dataPropertyValue,
    lowerValidLimit: validationParameter[1],
    upperValidLimit: validationParameter[2],
    status: status,
    savedDateTime: new Date()
  });

  ValidationAck.save(newValidationAck, (err, savedValidationAck) => {
    if (err) {
      logger.error('ValidationAck.save', err.message);
    } else {
      logger.warn(`Validation error on node with id: ${newValidationAck.nodeId} and savedValidationAck under id: ${savedValidationAck.insertId}`);
    }
  })
}

module.exports = {
  validateData
}