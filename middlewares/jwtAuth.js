const jwt = require('jsonwebtoken');

// Create access token
exports.createAccessToken = (payload, result) => {
  jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '10m' }, (err, token) => {
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

// Verufy access token
exports.verifyAccessToken = (token, result) => {
  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, result) => {
    if (err) {
      console.log(err);
    } else{
      console.log(result)
    }
  })
}