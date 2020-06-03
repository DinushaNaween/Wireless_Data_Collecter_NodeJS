const AuthToken = require('../models/authToken.model');
const logger = require('../middlewares/logger');

// Save new token
exports.saveNewRefreshToken = (userId, refreshToken, result) => {
  let authToken = new AuthToken({
    userId: userId,
    refreshToken: refreshToken,
    revoked: 0,
    createdDateTime: new Date()
  });

  AuthToken.saveNewRefreshToken(authToken, (err, data) => {
    if (err) {
      logger.error('AuthToken.saveNewRefreshToken', err.message);
      result(err, null);
      return;
    }

    if (data) {
      logger.info('Auth.saveNewRefreshToken success');
      result(null, data);
      return;
    }
  })
}