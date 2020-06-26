const ParentNode = require('../models/parentNode.model');
const logger = require('../middlewares/logger.middleware');
const { stringToIntArray, stringToIntArrayBulk } = require('../services/common.service');

// create and save new parent node
exports.create = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    let parentNode = new ParentNode({
      parentNodeName: req.body.parentNodeName,
      parentNodeLocation: req.body.parentNodeLocation,
      childNodes: req.body.childNodes.join(),
      unitId: req.body.unitId,
      collectionId: req.body.collectionId,
      createdUserId: req.body.createdUserId,
      disabled: req.body.disabled,
      lastModifiedUser: req.body.lastModifiedUser,
      lastModifiedDateTime: new Date()
    });
  
    ParentNode.create(parentNode, (err, data) => {
      if (err) {
        logger.error('create', err.message);
        res.status(500).json({
          state: false,
          message: err.message || 'Some error occurred while creating the parent node.'
        });
      } else {
        logger.info('parentNode created');
        res.status(200).json({
          state: true, 
          created_parentNode: data
        });
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

      let structuredData = stringToIntArrayBulk(data, 'childNodes');
      
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

      data.childNodes = stringToIntArray(data.childNodes);

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
    req.body.childNodes = req.body.childNodes.join();

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