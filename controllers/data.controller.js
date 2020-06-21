const Data = require('../models/data.model');
const logger = require('../middlewares/logger.middleware');
const { promise_handler } = require('../services/common.service');
const { findById } = require('../models/parentNode.model');
const { response } = require('express');

// Save parent node data object. Includes child node data.
exports.save = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    findById(req.body.parentNodeId, (err, parentNode) => {
      if (err) {
        logger.error('createNewDataTable', err.message);
        res.status(500).json({
          state: false,
          message: err.message || 'Some error occurred while creating the data table.'
        });
      } else {

        let dataArray = new Array();
        const savedDateTime = new Date();

        for (let i = 0; i < parentNode.noOfNodes ; i++) {
          req.body.data[i].savedDateTime = savedDateTime;
          dataArray.push(req.body.data[i]);
        }

        let response = saveData(dataArray);
        console.log(response);

        res.status(200).json({
          state: true
        })

      }
    })
  }
}

// Parent node data array save in relevent data tables.
function saveData(dataArray){
  const promises = [];

  dataArray.map((data) => {
    promises.push(saveDataObject(data));
  });

  Promise.all(promises.map(promise_handler))
    .then(response => {
      let resolved = [];
      let rejected = [];

      response.forEach(value => {
        if (value.status === 'resolved') resolved.push(value.data);
        if (value.status === 'rejected') rejected.push(value.data);
      })

      console.log(`Values: ${JSON.stringify(response)}`);
      console.log(`Resolved: `, resolved);
      console.log(`Rejected: `, rejected);
    })
    .catch(error => {
      console.log(error);
    })
};

// Save one data packet in one data table.
const saveDataObject = (data) => {
  return new Promise((resolve, reject) => {
    Data.save(`data_${data.nodeId}`, data, (err, savedData) => {
      if (err) {
        reject(data.nodeId);
      } else {
        resolve(savedData.nodeId);
      }
    });
  });
};