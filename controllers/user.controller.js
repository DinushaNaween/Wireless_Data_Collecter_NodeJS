const User = require('../models/user.model');

// create and save new user
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
  }

  const user = new User({
    userName: req.body.userName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    loginPassword: req.body.loginPassword,
    roleId: req.body.roleId,
    disabled: req.body.disabled,
    lastModifiedUser: req.body.lastModifiedUser,
    lastModifiedDateTime: new Date()
  });

  User.create(user, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the user.'
      });
    } else res.send(data);
  });
};

// get all users from database
exports.getAll = (req, res) => {
  User.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving the users.'
      });
    } else res.send(data);
  });
};

// get user by id
exports.findById = (req, res) => {
  User.findById(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found user with id ' + req.params.userId
        });
      } else {
        res.status(500).send({
          message: 'Error retrieving user with id ' + req.params.userId
        });
      }
    } else res.send(data);
  });
};

// update a user
exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  User.updateById(req.params.userId, new Role(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found user with id ' + req.params.userId
        });
      } else {
        res.status(500).send({
          message: 'Error updating user with id ' + req.params.userId
        });
      }
    } else res.send(data);
  })
};

// delete a user by id
exports.remove = (req, res) => {
  User.remove(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found user with id ' + req.params.userId
        });
      } else {
        res.status(500).send({
          message: 'Could not delete user with id ' + req.params.userId
        });
      }
    } else res.send({ message: 'User deleted successfully!' })
  });
};

// delete all users
exports.removeAll = (req, res) => {
  User.removeAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while deleting all users.'
      });
    } else res.send({ message: 'All users deleted successfully.' })
  })
};

// disable a user
exports.disable = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  User.disable(req.params.userId, req.body, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found user with id ' + req.params.userId
        });
      } else {
        res.status(500).send({
          message: 'Error updating user with id ' + req.params.userId
        });
      }
    } else res.send({ message: 'Disabled user with id: ' + data.id +'.' });
  })
};