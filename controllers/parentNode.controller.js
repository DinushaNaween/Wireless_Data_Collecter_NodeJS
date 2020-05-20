const ParentNode = require('../models/parentNode.model');

// create and save new parent node
exports.create = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  const parentNode = new ParentNode({
    parentNodeName: req.body.parentNodeName,
    parentNodeLocation: req.body.parentNodeLocation,
    noOfNodes: req.body.noOfNodes,
    unitId: req.body.unitId,
    collectionId: req.body.collectionId,
    createdUserId: req.body.createdUserId,
    disabled: req.body.disabled,
    lastModifiedUser: req.body.lastModifiedUser,
    lastModifiedDateTime: new Date()
  });

  ParentNode.create(parentNode, (err, data) => {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while creating the parent node.'
      });
    } else {
      res.status(200).json({
        state: true,
        created_parentNode: data
      });
    }
  });
};

// get all parent nodes from database
exports.getAll = (req, res) => {
  ParentNode.getAll((err, data) => {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while retrieving the parent nodes.'
      });
    } else {
      res.status(200).json({
        state: true,
        parentNodes: data
      });
    }
  });
};

// get parent node by id
exports.findById = (req, res) => {
  ParentNode.findById(req.params.parentNodeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          state: false,
          message: 'Not found parent node with id ' + req.params.parentNodeId
        });
      } else {
        res.status(500).json({
          state: false,
          message: 'Error retrieving parent node with id ' + req.params.parentNodeId
        });
      }
    } else {
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
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  ParentNode.updateById(req.params.parentNodeId, new ParentNode(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          state: false,
          message: 'Not found parent node with id ' + req.params.parentNodeId
        });
      } else {
        res.status(500).json({
          state: false,
          message: 'Error updating parent node with id ' + req.params.parentNodeId
        });
      }
    } else {
      res.status(200).json({
        state: true,
        updated_parentNode: data
      });
    }
  })
};

// delete a parent node by id
exports.remove = (req, res) => {
  ParentNode.remove(req.params.parentNodeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          state: false,
          message: 'Not found parent node with id ' + req.params.parentNodeId
        });
      } else {
        res.status(500).json({
          state: false,
          message: 'Could not delete parent node with id ' + req.params.parentNodeId
        });
      }
    } else {
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
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while deleting all parent nodes.'
      });
    } else {
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
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  ParentNode.disable(req.params.parentNodeId, req.body, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          state: false,
          message: 'Not found parent node with id ' + req.params.parentNodeId
        });
      } else {
        res.status(500).json({
          state: false,
          message: 'Error updating parent node with id ' + req.params.parentNodeId
        });
      }
    } else {
      res.status(200).json({
        state: true,
        message: 'Disabled parent node with id: ' + data.id +'.'
      });
    }
  })
};