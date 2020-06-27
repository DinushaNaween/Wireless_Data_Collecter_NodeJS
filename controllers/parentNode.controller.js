const ParentNode = require('../models/parentNode.model');
const logger = require('../middlewares/logger.middleware');
const { stringToIntArray, stringToIntArrayBulk } = require('../services/common.service');
const { updateChildArray } = require('../services/common.service');

// create and save new parent node
exports.create = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    let parentNodeArray = [];
    
    for (let i = 0; i < req.body.data.length; i++) {
      let tempArray = [];
      const parentNode = req.body.data[i];
      tempArray.push(parentNode.parentNodeName);
      tempArray.push(parentNode.parentNodeLocation);
      tempArray.push(parentNode.nodes.join());
      tempArray.push(parentNode.unitId);
      tempArray.push(parentNode.collectionId);
      tempArray.push(parentNode.createdUserId);
      tempArray.push(parentNode.disabled);
      tempArray.push(parentNode.lastModifiedUser);
      tempArray.push(new Date());

      parentNodeArray.push(tempArray);
    }
  
    ParentNode.create(parentNodeArray, (err, data) => {
      if (err) {
        logger.error('create', err.message);
        res.status(500).json({
          state: false,
          message: err.message || 'Some error occurred while creating the parent node.'
        });
      } else {
        logger.info('parentNode created');
        
        let updateData = updateChildArray('unit', 'unitId', 'parentNodes', data[0].unitId, 'parentNodeId', data);

        updateData.then( function(newAddedIds) {
          res.status(200).json({
            state: true, 
            unitNodeUpdate: true,
            newAddedIds: newAddedIds,
            createdParentNodes: data
          });
        }, function(err) {
          logger.error('update unit table parentNodes column', err.message);
          res.status(200).json({
            state: true, 
            unitNodeUpdate: false,
            createdParentNodes: data
          });
        })
      }
    });
  }
};

// get all parent nodes from database
exports.getAll = (req, res) => {
  ParentNode.getAll((err, data) => {
    if (err) {
      logger.error('getAll', err.message);
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while retrieving the parent nodes.'
      });
    } else {
      logger.info('getAll success');

      let structuredData = stringToIntArrayBulk(data, 'nodes');
      
      res.status(200).json({
        state: true,
        parentNodes: structuredData
      });
    }
  });
};

// get parent node by id
exports.findById = (req, res) => {
  ParentNode.findById(req.params.parentNodeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('findById notFound');
        res.status(404).json({
          state: false,
          message: 'Not found parent node with id ' + req.params.parentNodeId
        });
      } else {
        logger.error('findById', err.message);
        res.status(500).json({
          state: false,
          message: 'Error retrieving parent node with id ' + req.params.parentNodeId
        });
      }
    } else {
      logger.info('findById success');

      data.nodes = stringToIntArray(data.nodes);

      res.status(200).json({
        state: true,
        parentNode: data
      });
    }
  });
};

// update a parent node
exports.update = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    req.body.lastModifiedDateTime = new Date();
    req.body.nodes.join();

    ParentNode.updateById(req.params.parentNodeId, new ParentNode(req.body), (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          logger.error('updateById notFound');
          res.status(404).json({
            state: false,
            message: 'Not found parent node with id ' + req.params.parentNodeId
          });
        } else {
          logger.error('updateById', err.message);
          res.status(500).json({
            state: false,
            message: 'Error updating parent node with id ' + req.params.parentNodeId
          });
        }
      } else {
        logger.info('update success');
        res.status(200).json({
          state: true,
          updated_parentNode: data
        });
      }
    })
  }
};

// delete a parent node by id
exports.remove = (req, res) => {
  ParentNode.remove(req.params.parentNodeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('remove notFound');
        res.status(404).json({
          state: false,
          message: 'Not found parent node with id ' + req.params.parentNodeId
        });
      } else {
        logger.error('remove', err.message);
        res.status(500).json({
          state: false,
          message: 'Could not delete parent node with id ' + req.params.parentNodeId
        });
      }
    } else {
      logger.info('remove success');
      res.status(200).json({
        state: true,
        message: 'Parent node deleted successfully'
      });
    }
  });
};

// delete all parent nodes
exports.removeAll = (req, res) => {
  ParentNode.removeAll((err, data) => {
    if (err) {
      logger.error('removeAll', err.message);
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while deleting all parent nodes.'
      });
    } else {
      logger.info('removeAll success');
      res.status(200).json({
        state: true,
        message: 'All parent nodes deleted successfully'
      });
    }
  })
};

// disable a parent node
exports.disable = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    req.body.lastModifiedDateTime = new Date();

    ParentNode.disable(req.params.parentNodeId, req.body, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          logger.error('disable notFound');
          res.status(404).json({
            state: false,
            message: 'Not found parent node with id ' + req.params.parentNodeId
          });
        } else {
          logger.error('disable', err.message);
          res.status(500).json({
            state: false,
            message: 'Error updating parent node with id ' + req.params.parentNodeId
          });
        }
      } else {
        logger.info('disable success');
        res.status(200).json({
          state: true,
          message: 'Disabled parent node with id: ' + data.id +'.'
        });
      }
    })
  }
};