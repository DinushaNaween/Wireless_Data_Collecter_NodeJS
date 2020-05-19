const ParentNode = require('../models/parentNode.model');

// create and save new parent node
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
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
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the parent node.'
      });
    } else res.send(data);
  });
};

// get all parent nodes from database
exports.getAll = (req, res) => {
  ParentNode.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving the parent nodes.'
      });
    } else res.send(data);
  });
};

// get parent node by id
exports.findById = (req, res) => {
  ParentNode.findById(req.params.parentNodeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found parent node with id ' + req.params.parentNodeId
        });
      } else {
        res.status(500).send({
          message: 'Error retrieving parent node with id ' + req.params.parentNodeId
        });
      }
    } else res.send(data);
  });
};

// update a parent node
exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  ParentNode.updateById(req.params.parentNodeId, new ParentNode(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found parent node with id ' + req.params.parentNodeId
        });
      } else {
        res.status(500).send({
          message: 'Error updating parent node with id ' + req.params.parentNodeId
        });
      }
    } else res.send(data);
  })
};

// delete a parent node by id
exports.remove = (req, res) => {
  ParentNode.remove(req.params.parentNodeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found parent node with id ' + req.params.parentNodeId
        });
      } else {
        res.status(500).send({
          message: 'Could not delete parent node with id ' + req.params.parentNodeId
        });
      }
    } else res.send({ message: 'Parent node deleted successfully!' })
  });
};

// delete all parent nodes
exports.removeAll = (req, res) => {
  ParentNode.removeAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while deleting all parent nodes.'
      });
    } else res.send({ message: 'All parent nodes deleted successfully.' })
  })
};

// disable a parent node
exports.disable = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  ParentNode.disable(req.params.parentNodeId, req.body, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found parent node with id ' + req.params.parentNodeId
        });
      } else {
        res.status(500).send({
          message: 'Error updating parent node with id ' + req.params.parentNodeId
        });
      }
    } else res.send({ message: 'Disabled parent node with id: ' + data.id +'.' });
  })
};