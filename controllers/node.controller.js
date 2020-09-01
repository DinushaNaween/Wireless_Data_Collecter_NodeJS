const Node = require('../models/node.model');
const logger = require('../middlewares/logger.middleware');
const { updateChildArray } = require('../services/common.service');

// create and save new node
exports.create = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    let nodeArray = [];

    for (let i = 0; i < req.body.noOfNodes; i++) {
      let tempArray = [];
      tempArray.push(req.body.parentNodeId);      
      tempArray.push(req.body.createdUserId)
      tempArray.push(req.body.disabled)
      tempArray.push(req.body.lastModifiedUser)
      tempArray.push(new Date())

      nodeArray.push(tempArray);
    }

    Node.create(nodeArray, (err, data) => {
      if (err) {
        logger.error('create', err.message);
        res.status(500).json({
          state: false,
          message: err.message || 'Some error occurred while creating the node.'
        }); 
      } else {
        logger.info('node created');

        let updateData = updateChildArray('parentNode', 'parentNodeId', 'nodes', data[0].parentNodeId, 'nodeId', data);

        updateData.then( function(newlyAddedIds) {
          res.status(200).json({
            state: true,
            parentNodeUpdate: true,
            newlyAddedIds: newlyAddedIds,
            createdNodes: data
          });
        }, function(err) {
          logger.error('update parent table nodes column', err.message);
          res.status(200).json({
            state: true,
            parentNodeUpdate: false,
            createdNodes: data
          });
        });
      }
    });
  }
};

// get all nodes from database
exports.getAll = (req, res) => {
  Node.getAll((err, data) => {
    if (err) {
      logger.error('getAll', err.message);
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while retrieving the nodes.'
      });
    } else {
      logger.info('getAll success');
      res.status(200).json({
        state: true,
        nodes: data
      });
    }
  });
};

// get node by id
exports.findById = (req, res) => {
  Node.findById(req.params.nodeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('findById notFound');
        res.status(404).json({
          state: false,
          message: 'Not found node with id ' + req.params.nodeId
        });
      } else {
        logger.error('findById', err.message);
        res.status(500).json({
          state: false,
          message: 'Error retrieving node with id ' + req.params.nodeId
        });
      }
    } else {
      logger.info('findById success');
      res.status(200).json({
        state: true,
        node: data
      });
    }
  });
};

// Get nodes by parentNodeId
exports.findByParentNodeId = (req, res) => {
  Node.findByParentNodeId(req.params.parentNodeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('findByParentNodeId notFound');
        res.status(404).json({
          state: false,
          message: 'Not found any node for parent node Id: ' + req.params.parentNodeId
        });
      } else {
        logger.info('findByParentNodeId', err.message);
        res.status(500).json({
          state: false,
          message: 'Error getting nodeIds'
        });
      }
    } else {
      logger.info('findByParentNodeId success');
      res.status(200).json({
        state: true,
        nodes: data
      });
    }
  });
};

// update a node
exports.update = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    req.body.lastModifiedDateTime = new Date();

    Node.updateById(req.params.nodeId, new Node(req.body), (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          logger.error('updateById notFound');
          res.status(404).json({
            state: false,
            message: 'Not found node with id ' + req.params.nodeId
          });
        } else {
          logger.error('updateById', err.message);
          res.status(500).json({
            state: false,
            message: 'Error updating node with id ' + req.params.nodeId
          });
        }
      } else {
        logger.info('update success');
        res.status(200).json({
          state: true,
          updated_node: data
        });
      }
    });
  }
};

// delete a node by id
exports.remove = (req, res) => {
  Node.remove(req.params.nodeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('remove notFound');
        res.status(404).json({
          state: false,
          message: 'Not found node with id ' + req.params.nodeId
        });
      } else {
        logger.error('remove', err.message);
        res.status(500).json({
          state: false,
          message: 'Could not delete node with id ' + req.params.nodeId
        });
      }
    } else {
      logger.info('remove success');
      res.status(200).json({
        state: true,
        message: 'Node deleted successfully'
      });
    }
  });
};

// delete all nodes
exports.removeAll = (req, res) => {
  Node.removeAll((err, data) => {
    if (err) {
      logger.error('removeAll', err.message);
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while deleting all nodes.'
      });
    } else {
      logger.info('removeAll success');
      res.status(200).json({
        state: true,
        message: 'All nodes deleted successfully'
      });
    }
  })
};

// disable a node
exports.disable = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    req.body.lastModifiedDateTime = new Date();

    Node.disable(req.params.nodeId, req.body, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          logger.error('disable notFound');
          res.status(404).json({
            state: false,
            message: 'Not found node with id ' + req.params.nodeId
          });
        } else {
          logger.error('disable', err.message);
          res.status(500).json({
            state: false,
            message: 'Error updating node with id ' + req.params.nodeId
          });
        }
      } else {
        logger.info('disable success');
        res.status(200).json({
          state: true,
          message: 'Disabled node with id: ' + data.id +'.'
        });
      }
    })
  }
};