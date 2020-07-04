const Data = require('../models/data.model');
const logger = require('../middlewares/logger.middleware');
const DataAck = require('../models/dataAck.model');
const Node = require('../models/node.model');
const DataValidation = require('../models/dataValidation.model');
const { promiseHandler } = require('../services/common.service');
const { findById } = require('../models/parentNode.model');
const { validateData } =  require('../services/dataValidation.service');
const ParentNode = require('../models/parentNode.model');

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

        let updatedNodes = new Array();
        const savedDateTime = new Date();

        for (let i = 0; i < req.body.data.length ; i++) {
          req.body.data[i].savedDateTime = savedDateTime;
          updatedNodes.push(req.body.data[i]);
        }

        Node.findByParentNodeId(parentNode.parentNodeId, (err, data) => {
          if (err) {
            if (err.kind === 'not_found') {
              logger.error('Node.findByParentNodeId notFound')
              res.status(500).json({
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

            let commonNodes = [];

            for (let k = 0; k < nodesFromDB.length; k++) {
              const nodefromDB = nodesFromDB[k];
              for (let m = 0; m < updatedNodes.length; m++) {
                const nodeData = updatedNodes[m];
                if (nodeData.nodeId == nodefromDB) {
                  commonNodes.push(nodeData);
                }
              }
            }
            
            DataValidation.getByParentNodeId(parentNode.parentNodeId, (err, validationData) => {
              if (err) {
                if (err.kind === 'not_found') {
                  logger.error('DataValidation.getByParentNodeId notFound')
                  res.status(500).json({
                    state: false,
                    message: 'Not found any validations for parentNodeId: ' + parentNode.parentNodeId
                  });
                } else {
                  logger.error('DataValidation.getByParentNodeId', err.message);
                  res.status(500).json({
                    state: false,
                    message: 'Error occured on getting validations for parentNodeId'
                  });
                }
              }

              validateData(commonNodes, Array.from(validationData), parentNode.parentNodeId)
                .then((result) => {
                  let validatedNodes = result.map(object => object['data'][0]['data'])
                  
                  const mergeByNodeId = (validatedNodes, nodesFromReq, prop) => {
                    nodesFromReq.forEach(sourceElement => {
                      let targetElement = validatedNodes.find(targetElement => {
                        return sourceElement[prop] === targetElement[prop];
                      })
                      targetElement ? Object.assign(targetElement, sourceElement) : validatedNodes.push(sourceElement);
                    })
                  }
                  
                  mergeByNodeId(validatedNodes, req.body.data, 'nodeId');

                  saveData(validatedNodes, missedNodes, parentNode.parentNodeId)
                    .then((result) => {
                      let successNodes = result.successNodes.split(',');

                      for (let i = 0; i < validatedNodes.length; i++) {
                        const dataObject = validatedNodes[i];
                        if ( !successNodes.includes(dataObject.nodeId) ) {
                          validatedNodes.splice(i, 1);
                        }
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  console.log(err)
                });
            });

            res.status(200).json({
              state: true
            })
          }
        });
      }
    });
  }
};

// Parent node data array save in relevent data tables.
function saveData(dataArray, missedNodes, parentNodeId){

  return new Promise((resolve, reject) => {
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
            logger.error('DataAck.saveAcknowledgement', err.message);
            reject(err.message);
          } else{
            logger.info('DataAck.saveAcknowledgement success');
            resolve(ackData);
          }
        })
      })
      .catch(error => {
        logger.error('saveData Promise.all', error);
        reject(error);
      })
  })
};

// Save one data packet in one data table.
const saveDataObject = (data) => {
  return new Promise((resolve, reject) => {
    Data.save(`data_${data.nodeId}`, data, (err, savedData) => {
      if (err) {
        logger.error(`Data.save failed to save nodeData with id: ${data.nodeId}`);
        logger.error('Data.save', err.message);
        reject(data.nodeId);
      } else {
        logger.info(`Data.save node with id: ${data.nodeId} success`);
        resolve(savedData.nodeId);
      }
    });
  });
};

// End of Save parent node data object.