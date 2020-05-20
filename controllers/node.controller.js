const Node = require('../models/node.model');

// create and save new node
exports.create = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  const node = new Node({
    parentNodeId: req.body.parentNodeId,
    createdUserId: req.body.createdUserId,
    disabled: req.body.disabled,
    lastModifiedUser: req.body.lastModifiedUser,
    lastModifiedDateTime: new Date()
  });

  Node.create(node, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the node.'
      });
    } else res.send(data);
  });
};

// get all nodes from database
exports.getAll = (req, res) => {
  Node.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving the nodes.'
      });
    } else res.send(data);
  });
};

// get node by id
exports.findById = (req, res) => {
  Node.findById(req.params.nodeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found node with id ' + req.params.nodeId
        });
      } else {
        res.status(500).send({
          message: 'Error retrieving node with id ' + req.params.nodeId
        });
      }
    } else res.send(data);
  });
};

// update a node
exports.update = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  Node.updateById(req.params.nodeId, new Node(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found node with id ' + req.params.nodeId
        });
      } else {
        res.status(500).send({
          message: 'Error updating node with id ' + req.params.nodeId
        });
      }
    } else res.send(data);
  })
};

// delete a node by id
exports.remove = (req, res) => {
  Node.remove(req.params.nodeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found node with id ' + req.params.nodeId
        });
      } else {
        res.status(500).send({
          message: 'Could not delete node with id ' + req.params.nodeId
        });
      }
    } else res.send({ message: 'Node deleted successfully!' })
  });
};

// delete all nodes
exports.removeAll = (req, res) => {
  Node.removeAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while deleting all nodes.'
      });
    } else res.send({ message: 'All nodes deleted successfully.' })
  })
};

// disable a node
exports.disable = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  Node.disable(req.params.nodeId, req.body, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found node with id ' + req.params.nodeId
        });
      } else {
        res.status(500).send({
          message: 'Error updating node with id ' + req.params.nodeId
        });
      }
    } else res.send({ message: 'Disabled node with id: ' + data.id +'.' });
  })
};