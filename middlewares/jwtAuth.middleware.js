const AuthToken = require('../models/authToken.model');
const logger = require('./logger.middleware');
const authenticationService = require('../services/authentication.service');

const { sign, verify } = require('jsonwebtoken');

// Create access token
exports.createAccessToken = (payload, result) => {
  sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '1d' }, (err, token) => {
    if (err) {
      logger.error('createAccessToken', err.message);
      result(err, null);
      return;

    } else{
      logger.info('accessToken created');
      result(null, token);
      return;
    }
  })
}

// Create refresh token
exports.createRefreshToken = (payload, result) => {
  sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' }, (err, token) => {
    if (err) {
      logger.error('createRefreshToken', err.message);
      result(err, null);
      return;

    } else{
      logger.info('refreshToken created');
      result(null, token);
      return;
    }
  })
}

// Create access and refresh tokens for new logins
exports.createAccessAndRefreshTokens = (payload, result) => {
  this.createAccessToken(payload, (err, accessToken) => {
    if (err) {
      result(err, null);
      return;
    } else if (accessToken) {
      this.createRefreshToken(payload, (err, refreshToken) => {
        if (err) {
          result(err, null);
          return;
        } else if (refreshToken) {
          logger.info('createAccessAndRefreshTokens success');
          result(null, { accessToken: accessToken, refreshToken: refreshToken });
          return;
        }
      })
    }
  })
}

// Verufy access token
exports.tokenAuthentication = (req, res, next) => {

  const authorization = req.headers['authorization'];
  let token = '';

  if (authorization) {
    token = authorization.split(' ')[1];
    if (!token) {
      logger.error('Authorization found without token');
      res.status(400).json({
        state: false,
        error_code: 1,
        message: 'Login required'
      });
    }
    verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, accessTokenPayload) => {
      if (err) {
        if (err.message == 'invalid token') {
          logger.error('invalid accessToken');
          res.status(400).json({
            state: false,
            error_code: 2,
            message: 'Login required'
          });
        } else if (err.message == 'jwt expired') {
          const refreshToken = req.cookies.refreshtoken;

          if (refreshToken) {
            verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, refreshTokenPayload) => {
              if (err) { 
                logger.error('refreshToken verify failed');
                if (debug) console.log(err.message);
                res.status(400).json({
                  state: false,
                  error_code: 3,
                  message: 'Login required'
                });
              } 

              if (refreshTokenPayload) {
                AuthToken.getTokenByUserId(refreshTokenPayload.user[0].userId, (err, token) => {
                  if (err) {
                    logger.error('AuthToken.getTokenByUserId', err.message);
                    if (err.kind == 'not_found') {
                      if (debug) console.log('No token found in DB');
                      res.status(400).json({
                        state: false,
                        error_code: 4,
                        message: 'Login required'
                      });
                    } else {
                      if (debug) console.log(err.message);
                      res.status(400).json({
                        state: false,
                        error_code: 5,
                        message: 'Login required'
                      });
                    }
                  }

                  if (token) {
                    if (token != refreshToken) {
                      logger.error('refreshTokens not same');
                      res.status(400).json({
                        state: false,
                        error_code: 6,
                        message: 'Login required'
                      });
                    } else {
                      let user = refreshTokenPayload.user[0];
                      this.createAccessToken({ user }, (err, accessToken) => {
                        if (err) {
                          logger.error('createAccessToken for refreshToken', err.message);
                          res.status(400).json({
                            state: false,
                            error_code: 7,
                            message: 'Login required'
                          }); 
                        }

                        if (accessToken) {
                          logger.info('New accessToken created');  
                          res.set('authorization', `Bearer ${accessToken}`);
                          req.loggedUser = refreshTokenPayload.user[0];
                          next();
                        }
                      });
                    }
                  }
                });
              }
            });
          } else{
            res.status(400).json({
              state: false,
              error_code: 8,
              message: 'Login required'
            });
          } 
        } else{
          logger.error('accessToken verify', err.message);
          res.status(400).json({
            state: false,
            error_code: 9,
            message: 'Login required'
          });
        }
      } else{
        logger.info('Valid AccessToken found');
        req.loggedUser = accessTokenPayload.user[0];
        console.log('1');
        next();
      }
    });
  } else {
    logger.debug('Authorization header not found');
    res.status(400).json({
      state: false,
      error_code: 10,
      message: 'Login required'
    });
  };
};

// Check if super admin
exports.checkIfSuperAdmin = (req, res, next) => {

  authenticationService.checkRole(req.loggedUser, 'super_admin', (err, result) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('authenticationService.checkRole findById notFound');
        res.status(404).json({
          state: false,
          error_code: 3,
          message: 'Not found role with id ' + req.params.roleId
        });
      } else {
        logger.error('authenticationService.checkRole findById', err.message);
        res.status(500).json({
          state: false,
          error_code: 2,
          message: err.message || 'Error retrieving role with id ' + req.params.roleId
        });
      }
    }

    if (result) {
      if (result.state === 'matched') {
        logger.info('Super Admin access granted');
        console.log('2');
        next();
      } else {
        logger.warn(`Super Admin access denied for user with userId ${req.loggedUser.userId}`);
        res.status(403).json({
          state: false,
          error_code: 4,
          message: `Super Admin access denied for user with userId ${req.loggedUser.userId}`
        });
      }
    }
  })
};

// Check if admin
exports.checkIfAdmin = (req, res, next) => {

  authenticationService.checkRole(req.loggedUser, 'admin', (err, result) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('authenticationService.checkRole findById notFound');
        res.status(404).json({
          state: false,
          error_code: 3,
          message: 'Not found role with id ' + req.params.roleId
        });
      } else {
        logger.error('authenticationService.checkRole findById', err.message);
        res.status(500).json({
          state: false,
          error_code: 2,
          message: 'Error retrieving role with id ' + req.params.roleId
        });
      }
    }

    if (result) {
      if (result.state === 'matched') {
        logger.info('Admin access granted');
        next();
      } else {
        logger.warn(`Admin access denied for user with userId ${req.loggedUser.userId}`);
        res.status(403).json({
          state: false,
          error_code: 4,
          message: `Admin access denied for user with userId ${req.loggedUser.userId}`
        });
      }
    }
  })
};