const User = require('../models/user.model');
const AuthToken = require('../controllers/authToken.controller');
const logger = require('../middlewares/logger.middleware');

const { checkRole } = require('../services/authentication.service');
const { hash, compare } = require('bcrypt');
const { createAccessAndRefreshTokens } = require('../middlewares/jwtAuth.middleware');
const { sendVerificationCode } = require('../services/mail.service');
const { uploadUserImage } = require('../services/fileUpload.service');

// Create and save new user
exports.create = (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    User.findByEmail(req.body.email, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          hash(req.body.loginPassword, SALTROUNDS, function (err, hash) {
            if (err) {
              logger.error('bcrypt.hash', err.message);
              res.status(500).json({
                state: false,
                message: err.message || 'Some error occurred while creating the user.'
              });
            } else {
              console.log(req.body.email);
              let user = new User({
                email: req.body.email,
                userName: req.body.userName,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                loginPassword: hash,
                roleId: req.body.roleId,
                userImageURL: req.body.userImageURL,
                disabled: 0,
                lastModifiedUser: null,
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
                  let fileName = `${data.id}_${data.firstName}_${data.lastName}`;

                  uploadUserImage(req, fileName, (imageUploadState, userImageURL) => {
                    console.log(imageUploadState);
                    console.log(userImageURL);
                    switch (imageUploadState) {
                      case 'not_found':
                        logger.info('user created without image');
                        res.status(200).json({
                          state: true,
                          imageState: false,
                          created_user: data
                        });
                        break;
          
                      case 'error':
                        logger.info('error while uploading image');
                        res.status(200).json({
                          state: true,
                          imageState: false,
                          created_user: data
                        });
                        break;
                    
                      case 'success':
                        User.updateUserImageURL(userImageURL, data.id, (err, updatedData) => {
                          if (err) {
                            logger.error('updateUserImageURL', err.message);
                            res.status(200).json({
                              state: true,
                              imageState: false,
                              created_user: data
                            });
                          } 
          
                          if (updatedData) {
                            logger.info('user created with image');
                            data.userImageURL = userImageURL;
                            res.status(200).json({
                              state: true,
                              imageState: true,
                              created_user: data
                            });
                          }
                        });
                        break;
          
                      default:
                        break;
                    }
                  })
                }
              });
            }
          });
        } else {
          logger.error('findByEmail', err.message);
          res.status(500).json({
            state: false,
            message: err.message || 'Some error occurred while finding the user.'
          });
        }
      } else {
        logger.error('email exist', { email: req.body.email });
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
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    User.findByEmail(req.body.email, (err, user) => {
      if (err) {
        if (err.kind === 'not_found') {
          logger.error('email notFound');
          res.status(400).json({
            state: false,
            message: 'Email not found'
          })
        } else {
          logger.error('findByEmail', err.message);
          res.status(500).json({
            state: false,
            message: err.message || 'Some error occurred while finding the user.'
          });
        }
      }

      if (user.length == 1) {
        compare(req.body.loginPassword, user[0].loginPassword, (err, result) => {
          if (err) {
            logger.error('bcrypt.compare');
            res.status(500).json({
              state: false,
              message: err.message || 'Some error occurred while finding the user.'
            });
          }

          if (result) {
            createAccessAndRefreshTokens({ user }, (err, tokens) => {
              if (err) {
                logger.error('jwt.sign');
                res.status(500).json({
                  state: false,
                  message: err.message || 'Some error occurred while creating token.'
                });
              } else {
                AuthToken.saveNewRefreshToken(user[0].userId, tokens.refreshToken, (err, data) => {
                  if (err) {
                    logger.error('AuthToken.saveNewRefreshToken', err.message);
                    res.status(500).json({
                      state: false,
                      message: err.message || 'Some error occurred while saving user refreshToken.'
                    });
                  }

                  if (data) {
                    logger.info('token saved');
                    logger.info('token send');
                    res.cookie('refreshtoken', tokens.refreshToken, {
                      httpOnly: true,
                      path: '/refresh_token'
                    });
                    res.status(200).json({
                      state: true,
                      token: tokens.accessToken
                    });
                  }
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
        logger.error('email found multiple times');
        res.status(400).json({
          state: false,
          message: 'Email or password is incorrect'
        });
      }
    });
  }
};

// Get all users from database
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

// Get user by id
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

// Update a user
exports.update = (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    req.body.disabled = 0;
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
        let fileName = `${req.params.userId}_${req.body.firstName}_${req.body.lastName}`;

        uploadUserImage(req, fileName, (imageUploadState, userImageURL) => {
          switch (imageUploadState) {
            case 'not_found':
              logger.info('user update without user image');
              res.status(200).json({
                state: true,
                imageState: false,
                updated_user: data
              });
              break;
            
            case 'error':
              logger.error('error while uploading image');
              res.status(500).json({
                state: false,
                imageState: false,
                updated_user: data
              });
              break;

            case 'success':
              User.updateUserImageURL(userImageURL, req.params.userId, (err, updatedData) => {
                if (err) {
                  logger.error('updateUserImageURL', err.message);
                  res.status(200).json({
                    state: true,
                    imageState: false,
                    updated_user: data
                  });
                }

                if (updatedData) {
                  logger.info('user updated with image');
                  data.userImageURL = userImageURL;
                  res.status(200).json({
                    state: true,
                    imageState: true,
                    updated_user: data
                  });
                }
              });
              break;
          
            default:
              break;
          }
        })
      }
    });
  }
};

// Change email address
exports.changeEmail = (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  }
  User.findByEmail(req.body.currentEmail, (err, user) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('email notFound');
        res.status(400).json({
          state: false,
          message: 'Email not found'
        })
      } else {
        logger.error('findByEmail', err.message);
        res.status(500).json({
          state: false,
          message: err.message || 'Some error occurred while finding the user.'
        });
      }
    }

    if (user.length == 1) {
      if (req.params.userId != user[0].userId) {
        logger.error('userId does not match with email address');
        res.status(500).json({
          state: false,
          message: 'UserId does not match with email address given.'
        });
      } else {
        compare(req.body.loginPassword, user[0].loginPassword, (err, result) => {
          if (err) {
            logger.error('bcrypt.compare');
            res.status(500).json({
              state: false,
              message: err.message || 'Some error occurred while finding the user.'
            });
          }

          if (result) {
            req.body.lastModifiedDateTime = new Date();

            User.changeEmailAddress(req.params.userId, req.body, (err, data) => {
              if (err) {
                if (err.kind === 'not_found') {
                  logger.error('email not found in database');
                  res.status(400).json({
                    state: false,
                    message: 'Email not found'
                  });
                } else {
                  logger.error('changeEmailAddress', err.message);
                  res.status(500).json({
                    state: false,
                    message: err.message || 'Some error occured while updating email address'
                  });
                }
              }

              if (data) {
                logger.info('email changed success');
                res.status(200).json({
                  state: true,
                  message: 'Email changed'
                });
              }
            });
          }
        });
      }
    } else {
      logger.error('email found multiple times');
      res.status(200).json({
        state: true,
        message: 'Check email and try again'
      });
    }
  });
};

// Reset login password
exports.resetLoginPassword = (req, res) => {
  if (req.body.step == 1) {
    User.findByEmail(req.body.email, (err, user) => {
      if (err) {
        if (err.kind === 'not_found') {
          logger.error('email notFound');
          res.status(400).json({
            state: false,
            message: 'Email not found'
          });
        } else {
          logger.error('findByEmail', err.message);
          res.status(500).json({
            state: false,
            message: err.message || 'Some error occurred while finding the user.'
          });
        }
      }

      if (user.length == 1) {
        sendVerificationCode(user[0].email, (err, verificationCode) => {
          if (err) {
            logger.error('mailer.sendVerificationCode', err.message);
            res.status(500).json({
              state: false,
              message: err.message || 'Some error occured while sending verification code'
            });
          }

          if (verificationCode) {
            logger.info('verificationCode send to ' + user[0].email);
            res.status(200).json({
              state: true,
              verificationCode: verificationCode
            });
          }
        })
      } else {
        logger.error('email found multiple times');
        res.status(200).json({
          state: true,
          message: 'Check email and try again'
        });
      }
    })
  } else if (req.body.step == 2) {
    if (req.body.verified == true) {
      User.findByEmail(req.body.email, (err, user) => {
        if (err) {
          if (err.kind === 'not_found') {
            logger.error('email notFound');
            res.status(400).json({
              state: false,
              message: 'Email not found'
            });
          } else {
            logger.error('findByEmail', err.message);
            res.status(500).json({
              state: false,
              message: err.message || 'Some error occurred while finding the user.'
            });
          }
        }

        if (user.length == 1) {
          hash(req.body.loginPassword, SALTROUNDS, function (err, hash) {
            if (err) {
              logger.error('bcrypy.hash new password', err.message);
              res.status(500).json({
                state: false,
                message: err.message || 'Some error occured'
              });
            }

            if (hash) {
              User.resetLoginPassword(hash, user[0], (err, data) => {
                if (err) {
                  logger.error('user.resetLoginPassword', err.message);
                  res.status(500).json({
                    state: false,
                    message: 'Some error occured while reseting passord'
                  });
                }

                if (data) {
                  logger.info('login password reset success');
                  res.status(200).json({
                    state: true,
                    message: 'Password reset successfilly'
                  });
                }
              });
            }
          });
        } else {
          logger.error('email found multiple times');
          res.status(200).json({
            state: true,
            message: 'Check email and try again'
          });
        }
      });
    } else {
      logger.error('not verified');
      res.status(200).json({
        state: false,
        message: 'Not verified'
      });
    }
  };
};

// Password verify
exports.verifyPassword = (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    User.findByEmail(req.body.email, (err, data) => {
      
    })
  }
}

// Delete a user by id
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

// Delete all users
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

// Disable a user
exports.disable = (req, res) => {
  checkRole(req.loggedUser, 'Admin', (err, state) => {
    if (err) {
      logger.error('User.disable.checkRole', err.message);
      res.status(500).json({
        state: false,
        message: 'Error on checking role'
      })
    }

    if (state === 'matched') {
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
    } else {
      logger.warn('User.disable.checkRole not autherized person');
      res.status(400).json({
        state: false,
        message: 'Not autherized person to diable user'
      });
    }
  });
};