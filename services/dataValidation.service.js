const sql = require('../config/db.config');
const DataValidation = require('../models/dataValidation.model');
const { response } = require('express');
const { promiseHandler } = require('../services/common.service');

const validateData = function(data, validationPropsArray) {

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

      validations.push(tempArray);
    }

    const validationsAdder = function(dataObject) {
      return validator(dataObject, validations)
    }

    dataArray.map((data) => {
      promises.push(validationsAdder(data));
    })

    Promise.all(promises.map(promiseHandler))
      .then(response => {
        console.log('response = ', response);
      })
      .catch(error => {
        console.log('error = ', error);
      })
  }) 
}

const validator = (data, validations) => {

  return new Promise((resolve, reject) => {
    try {
      let validatedDataObjects = [];
      let isValidated = new Boolean(true);

      for (let i = 1; i < Object.keys(data).length - 3; i++) {
        let validationStates = [];
        let dataPropertyName = Object.keys(data)[i]
        let dataPropertyValue = data[dataPropertyName];
        
        for (let j = 0; j < validations.length; j++) {
          const validationParameter = validations[j];
          
          if (dataPropertyName == validationParameter[0]) {
            let tempElement = {};
            switch (true) {
              case (dataPropertyValue < validationParameter[1]):
                tempElement.propertyName = dataPropertyName;
                tempElement.state = 'Low';
                validationStates.push(tempElement);
                isValidated = false;
                break;

              case (dataPropertyValue > validationParameter[2]):
                tempElement.propertyName = dataPropertyName;
                tempElement.state = 'High';
                validationStates.push(tempElement);
                isValidated = false;
                break;

              case (validationParameter[1] <= dataPropertyValue && dataPropertyValue <= validationParameter[2]):
                tempElement.propertyName = dataPropertyName;
                tempElement.state = 'OK';
                validationStates.push(tempElement);
                break;
            
              default:
                break;
            }
          }
        }

        validatedDataObjects.push(validationStates[0]);
      }

      if (isValidated) {
        data.isValidated = '1';
      }

      let response = [];
      response.push({ data: data, validationState: validatedDataObjects });
      resolve(response);
    } catch (error) {
      reject('error')
    }
  }) 
}

module.exports = {
  validateData
}