const Data = require('../models/data.model');
const logger = require('../middlewares/logger.middleware');
const DataAck = require('../models/dataAck.model');
const Node = require('../models/node.model');
const { promiseHandler } = require('../services/common.service');
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

        Node.findByParentNodeId(parentNode.parentNodeId, (err, data) => {
          if (err) {
            if (err.kind === 'not_found') {
              logger.error('Node.findByParentNodeId notFound')
              ers.status(500).json({
                state: false,
                message: 'Not found any nodes with parentNodeId: ' + parentNode.parentNodeId
              });
            } else {
              logger.error('Node.findByParentNodeId', err.message);
              res.status(500).json({
                state: false,
                message: 'Error occured on getting nodes for parentNodeId'
              });
            }
          } else if (data) {
            let nodesFromDB = [];
            let nodesFromParentNode = [];

            for (let i = 0; i < data.length; i++) { nodesFromDB.push(data[i].nodeId); }
            for (let j = 0; j < req.body.data.length; j++) { nodesFromParentNode.push(parseInt(req.body.data[j].nodeId)); }

            const missedNodes = [...new Set(nodesFromDB.filter(node => !nodesFromParentNode.includes(node)))];

            saveData(dataArray, missedNodes, parentNode.parentNodeId);
          }
        });

        res.status(200).json({
          state: true
        });

      }
    });
  }
};

// Parent node data array save in relevent data tables.
function saveData(dataArray, missedNodes, parentNodeId){
  const promises = [];

  dataArray.map((data) => {
    promises.push(saveDataObject(data));
  });

  Promise.all(promises.map(promiseHandler))
    .then(response => {
      let resolved = [];
      let rejected = [];
      let missed = Array.from(missedNodes);

      response.forEach(value => {
        if (value.status === 'resolved') resolved.push(value.data);
        if (value.status === 'rejected') rejected.push(value.data);
      })

      let resolvedNodesString = resolved.join();
      let rejectedNodesString = rejected.join();
      let missedNodesString = missed.join();

      const newDataAck = new DataAck({
        parentNodeId: parentNodeId,
        successNodes: resolvedNodesString,
        errorNodes: rejectedNodesString,
        missedNodes: missedNodesString,
        savedDateTime: new Date()
      })

      DataAck.saveAcknowledgement(newDataAck, (err, ackData) => {
        if (err) {
          console.log(err);
        } else{
          console.log(ackData);
        }
      })
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

// End of Save parent node data object.