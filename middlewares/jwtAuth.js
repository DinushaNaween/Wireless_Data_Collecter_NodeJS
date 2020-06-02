const jwt = require('jsonwebtoken');
const authToken = require('../models/authToken.model');

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
    console.log(token);
    
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        if (debug) console.log(err.message);

        const refreshToken = req.cookies.refreshtoken;

        if (refreshToken) {
          jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, payload) => {
            console.log(payload.user[0]);
            if (err) {
              if (debug) console.log(err.message);
              res.status(400).json({
                state: false,
                message: 'Login required 1'
              })
            } 

            if (payload.user[0]) {
              this.createAccessToken(payload.user[0], (err, accessToken) => {
                if (err) {
                  if (debug) console.log(err.message);
                  res.status(400).json({
                    state: false,
                    message: 'Login required 2'
                  }); 
                }

                if (accessToken) {
                  if (debug) console.log('New accessToken added to headers');  
                  req.headers.authorization.replace('Bearer ' + accessToken);
                  console.log(req.headers['authorization'].split(' ')[1])
                  next()
                }
              });
            }
          });
        } else{
          res.status(400).json({
            state: false,
            message: 'Login required 3'
          })
        } 

      } else{
        if (debug) console.log(payload);
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