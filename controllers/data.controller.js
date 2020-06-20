const Data = require('../models/data.model');
const logger = require('../middlewares/logger.middleware');
const { findById } = require('../models/parentNode.model');

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

        saveData(dataArray);



      }
    })
  }
}

// Parent node data array save in relevent data tables.
function saveData(dataArray){
  const promises = [];

  dataArray.map((data) => {
    promises.push(saveDataObject(data))
  })

  Promise.all(promises)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    })
}

// Save one data packet in one data table.
const saveDataObject = (data) => {
  return new Promise((resolve, reject) => {
    Data.save(`data_${data.nodeId}`, data, (err, savedData) => {
      if (err) {
        reject('Reject with err');
      } else {
        resolve(savedData.nodeId);
      }
    })
  })
}