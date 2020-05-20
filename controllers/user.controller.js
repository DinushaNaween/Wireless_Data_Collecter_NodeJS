const User = require('../models/user.model');
const bcrypt = require('bcrypt');

// create and save new user
exports.create = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  User.findByEmail(req.body.email, (err, data) => {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while creating the user.'
      });
    }

    if (data.length == 0) {
      bcrypt.hash(req.body.loginPassword, SALTROUNDS, function (err, hash) {
        if (err) {
          res.status(500).json({
            state: false,
            message: err.message || 'Some error occurred while creating the user.'
          });
        } else {
          const user = new User({
            email: req.body.email,
            userName: req.body.userName,
            firstName: req.body.firstName,
            lastName: req.body.lastName, 
            loginPassword: hash,
            roleId: req.body.roleId,
            disabled: req.body.disabled,
            lastModifiedUser: req.body.lastModifiedUser,
            lastModifiedDateTime: new Date()
          });
    
          User.create(user, (err, data) => {
            if (err) {
              res.status(500).json({
                state: false,
                message: err.message || 'Some error occurred while creating the user.'
              });
            } else {
              res.status(200).json({
                state: true,
                created_user: data
              })
            }
          });
        }
      });
    } else if (data) {
      res.status(302).json({
        state: false,
        exist: true,
        message: 'Email found.'
      });
    }
  })
};

// Login user
exports.login = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  }


}

// get all users from database
exports.getAll = (req, res) => {
  User.getAll((err, data) => {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while retrieving the users.'
      });
    } else {
      res.status(200).json({
        state: true,
        users: data
      });
    }
  });
};

// get user by id
exports.findById = (req, res) => {
  User.findById(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          state: false,
          message: 'Not found user with id ' + req.params.userId
        });
      } else {
        res.status(500).json({
          state: false,
          message: 'Error retrieving user with id ' + req.params.userId
        });
      }
    } else {
      res.status(200).json({
        state: true,
        user: data
      });
    }
  });
};

// update a user
exports.update = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  bcrypt.hash(req.body.loginPassword, SALTROUNDS, function(err, hash) {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while updating the user.'
      });
    } else {
      req.body.loginPassword = hash;
      req.body.lastModifiedDateTime = new Date();

      User.updateById(req.params.userId, new User(req.body), (err, data) => {
        if (err) {
          if (err.kind === 'not_found') {
            res.status(404).json({
              state: false,
              message: 'Not found user with id ' + req.params.userId
            });
          } else {
            res.status(500).json({
              state: false,
              message: 'Error updating user with id ' + req.params.userId
            });
          }
        } else {
          res.status(200).json({
            state: true,
            updated_user: data
          });
        }
      })
    }
  })
};

// delete a user by id
exports.remove = (req, res) => {
  User.remove(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          state: false,
          message: 'Not found user with id ' + req.params.userId
        });
      } else {
        res.status(500).json({
          state: false,
          message: 'Could not delete user with id ' + req.params.userId
        });
      }
    } else {
      res.status(200).json({
        state: true,
        message: 'User deleted successfully'
      });
    }
  });
};

// delete all users
exports.removeAll = (req, res) => {
  User.removeAll((err, data) => {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while deleting all users.'
      });
    } else {
      res.status(200).json({
        state: true,
        message: 'All users deleted successfully'
      });
    }
  })
};

// disable a user
exports.disable = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  User.disable(req.params.userId, req.body, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          state: false,
          message: 'Not found user with id ' + req.params.userId
        });
      } else {
        res.status(500).json({
          state: false,
          message: 'Error updating user with id ' + req.params.userId
        });
      }
    } else {
      res.status(200).json({ 
        state: true,
        message: 'Disabled user with id: ' + data.id + '.' 
      });
    }
  })
};