const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../logger/logger');
  
// create and save new user
exports.create = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    User.findByEmail(req.body.email, (err, data) => {
      if (err) {
        logger.error('findByEmail', err.message);
        res.status(500).json({
          state: false,
          message: err.message || 'Some error occurred while creating the user.'
        });
      }
  
      if (data.length == 0) {
        bcrypt.hash(req.body.loginPassword, SALTROUNDS, function (err, hash) {
          if (err) {
            logger.error('bcrypt.hash', err.message);
            res.status(500).json({
              state: false,
              message: err.message || 'Some error occurred while creating the user.'
            });
          } else {
            let user = new User({
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
                logger.error('user.create', err.message);
                res.status(500).json({
                  state: false,
                  message: err.message || 'Some error occurred while creating the user.'
                });
              } else {
                logger.info('user created', data);
                res.status(200).json({
                  state: true,
                  created_user: data
                })
              }
            });
          }
        });
      } else if (data) {
        logger.error('email exist', {email: req.body.email});
        res.status(302).json({
          state: false,
          exist: true,
          message: 'Email exist.'
        });
      }
    })
  }
};

// Login user
exports.login = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    User.findByEmail(req.body.email, (err, user) => {
      if (err) {
        logger.error('findByEmail', err.message);
        res.status(500).json({
          state: false,
          message: err.message || 'Some error occurred while finding the user.'
        });
      }
  
      if (user.length != 0) {
        bcrypt.compare(req.body.loginPassword, user[0].loginPassword, (err, result) => {
          if (err) {
            logger.error('bcrypt.compare');
            res.status(500).json({
              state: false,
              message: err.message || 'Some error occurred while finding the user.'
            });
          }
  
          if (result) {
            jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: '10h' }, (err, token) => {
              if (err) {
                logger.error('jwt.sign');
                res.status(500).json({
                  state: false,
                  message: err.message || 'Some error occurred while creating token.'
                });
              } else {
                logger.info('token send')
                res.status(200).json({
                  state: true,
                  token: token
                });
              }
            });
          } else {
            logger.error('incorrect password');
            res.status(400).json({
              state: false,
              message: 'Email or password is incorrect'
            });
          }
        });
      } else {
        logger.error('email not found');
        res.status(400).json({
          state: false,
          message: 'Email or password is incorrect'
        });
      }
    });
  }
};

// get all users from database
exports.getAll = (req, res) => {
  User.getAll((err, data) => {
    if (err) {
      logger.error('getAll', err.message);
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while retrieving the users.'
      });
    } else {
      logger.info('getAll success')
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
        logger.error('findById notFound');
        res.status(404).json({
          state: false,
          message: 'Not found user with id ' + req.params.userId
        });
      } else {
        logger.error('findById', err.message);
        res.status(500).json({
          state: false,
          message: 'Error retrieving user with id ' + req.params.userId
        });
      }
    } else {
      logger.info('findById success');
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
    logger.error('empty req.body');
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    bcrypt.hash(req.body.loginPassword, SALTROUNDS, function(err, hash) {
      if (err) {
        logger.error('bcrypt.hash');
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
              logger.error('updateById notFound');
              res.status(404).json({
                state: false,
                message: 'Not found user with id ' + req.params.userId
              });
            } else {
              logger.error('updateById', err.message);
              res.status(500).json({
                state: false,
                message: 'Error updating user with id ' + req.params.userId
              });
            }
          } else {
            logger.info('update success');
            res.status(200).json({
              state: true,
              updated_user: data
            });
          }
        })
      }
    })
  }
};

// delete a user by id
exports.remove = (req, res) => {
  User.remove(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('remove notFound');
        res.status(404).json({
          state: false,
          message: 'Not found user with id ' + req.params.userId
        });
      } else {
        logger.error('remove', err.message);
        res.status(500).json({
          state: false,
          message: 'Could not delete user with id ' + req.params.userId
        });
      }
    } else {
      logger.info('remove success');
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
      logger.error('removeAll', err.message);
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while deleting all users.'
      });
    } else {
      logger.info('removeAll success');
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
    logger.error('empty req.body');
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    req.body.lastModifiedDateTime = new Date();

    User.disable(req.params.userId, req.body, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          logger.error('disable notFound');
          res.status(404).json({
            state: false,
            message: 'Not found user with id ' + req.params.userId
          });
        } else {
          logger.error('disable', err.message);
          res.status(500).json({
            state: false,
            message: 'Error updating user with id ' + req.params.userId
          });
        }
      } else {
        logger.info('disable success');
        res.status(200).json({ 
          state: true,
          message: 'Disabled user with id: ' + data.id + '.' 
        });
      }
    });
  }
};