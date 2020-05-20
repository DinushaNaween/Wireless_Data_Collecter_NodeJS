const Privilege = require('../models/privilege.model');

//create and save new privilege
exports.create = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  const privilege = new Privilege({
    privilegeDescription: req.body.privilegeDescription,
    disabled: req.body.disabled,
    lastModifiedUser: req.body.lastModifiedUser,
    lastModifiedDateTime: new Date()
  });

  Privilege.create(privilege, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the privilege.'
      });
    } else res.send(data);
  });
};

// get all privileges from database
exports.getAll = (req, res) => {
  Privilege.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving the privileges.'
      });
    } else res.send(data);
  });
};

// get privilege by id
exports.findById = (req, res) => {
  Privilege.findById(req.params.privilegeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found privilege with id ' + req.params.privilegeId
        });
      } else {
        res.status(500).send({
          message: 'Error retrieving privilege with id ' + req.params.privilegeId
        });
      }
    } else res.send(data);
  });
};

// update a privilege
exports.update = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  Privilege.updateById(req.params.privilegeId, new Privilege(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found privilege with id ' + req.params.privilegeId
        });
      } else {
        res.status(500).send({
          message: 'Error updating privilege with id ' + req.params.privilegeId
        });
      }
    } else res.send(data);
  })
};

// delete a privilege by id
exports.remove = (req, res) => {
  Privilege.remove(req.params.privilegeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found privilege with id ' + req.params.privilegeId
        });
      } else {
        res.status(500).send({
          message: 'Could not delete privilege with id ' + req.params.privilegeId
        });
      }
    } else res.send({ message: 'Privilege deleted successfully!' })
  });
};

// delete all privileges
exports.removeAll = (req, res) => {
  Privilege.removeAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while deleting all privileges.'
      });
    } else res.send({ message: 'All privileges deleted successfully.' })
  })
};

// disable a privilege
exports.disable = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  Privilege.disable(req.params.privilegeId, req.body, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found privilege with id ' + req.params.privilegeId
        });
      } else {
        res.status(500).send({
          message: 'Error updating privilege with id ' + req.params.privilegeId
        });
      }
    } else res.send(data);
  })
};