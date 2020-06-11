const AuthToken = require('../models/authToken.model');
const logger = require('./logger.middleware');

const { sign, verify } = require('jsonwebtoken');

// Create access token
exports.createAccessToken = (payload, result) => {
  sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15m' }, (err, token) => {
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
        message: 'Login required 1'
      });
    }
    verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, accessTokenPayload) => {
      if (err) {
        if (err.message == 'invalid token') {
          logger.error('invalid accessToken');
          res.status(400).json({
            state: false,
            message: 'Login required 1'
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
                  message: 'Login required 1'
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
                        message: 'Login required 7'
                      });
                    } else {
                      if (debug) console.log(err.message);
                      res.status(400).json({
                        state: false,
                        message: 'Login required 5'
                      });
                    }
                  }

                  if (token) {
                    if (token != refreshToken) {
                      logger.error('refreshTokens not same');
                      res.status(400).json({
                        state: false,
                        message: 'Login required 6'
                      });
                    } else {
                      this.createAccessToken(refreshTokenPayload.user[0], (err, accessToken) => {
                        if (err) {
                          logger.error('createAccessToken for refreshToken', err.message);
                          if (debug) console.log(err.message);
                          res.status(400).json({
                            state: false,
                            message: 'Login required 2'
                          }); 
                        }

                        if (accessToken) {
                          logger.info('New accessToken created');  
                          res.set('authorization', `Bearer ${accessToken}`);
                          console.log(req.headers['authorization'].split(' ')[1])
                          next()
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
              message: 'Login required 3'
            });
          } 
        } else{
          logger.error('accessToken verify', err.message);
          res.status(400).json({
            state: false,
            message: 'Login required 1'
          });
        }
      } else{
        if (debug) console.log(accessTokenPayload);
        next()
      }
    });
  } else {
    logger.debug('Authorization header not found');
    res.status(400).json({
      state: false,
      message: 'Login required 4'
    });
  };
};