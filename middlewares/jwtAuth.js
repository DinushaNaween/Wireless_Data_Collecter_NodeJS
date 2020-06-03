const jwt = require('jsonwebtoken');
const AuthToken = require('../models/authToken.model');

// Create access token
exports.createAccessToken = (payload, result) => {
  jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '1m' }, (err, token) => {
    if (err) {
      result(err, null);
      return;

    } else{
      result(null, token);
      return;
    }
  })
}

// Create refresh token
exports.createRefreshToken = (payload, result) => {
  jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' }, (err, token) => {
    if (err) {
      result(err, null);
      return;

    } else{
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
          result(null, { accessToken: accessToken, refreshToken: refreshToken });
          return;
        }
      })
    }
  })
}

// Verufy access token
exports.verifyAccessToken = (req, res, next) => {

  const authorization = req.headers['authorization'];
  let token = '';

  if (authorization) {
    token = authorization.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, accessTokenPayload) => {
      if (err) {
        if (debug) console.log(err.message);
        if (err.message == 'invalid token') {
          res.status(400).json({
            state: false,
            message: 'Login required 1'
          })
        } else if (err.message == 'jwt expired') {
          const refreshToken = req.cookies.refreshtoken;

          if (refreshToken) {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, refreshTokenPayload) => {
              if (err) { 
                if (debug) console.log(err.message);
                res.status(400).json({
                  state: false,
                  message: 'Login required 1'
                })
              } 

              if (refreshTokenPayload) {
                AuthToken.getTokenByUserId(refreshTokenPayload.user[0].userId, (err, token) => {
                  if (err) {
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
                      if (debug) console.log(err.message);
                      res.status(400).json({
                        state: false,
                        message: 'Login required 6'
                      });
                    } else {
                      this.createAccessToken(refreshTokenPayload.user[0], (err, accessToken) => {
                        if (err) {
                          if (debug) console.log(err.message);
                          res.status(400).json({
                            state: false,
                            message: 'Login required 2'
                          }); 
                        }

                        if (accessToken) {
                          if (debug) console.log('New accessToken created');  
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
          if (debug) console.log(err.message);
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
    res.status(400).json({
      state: false,
      message: 'Login required 4'
    });
  };
};