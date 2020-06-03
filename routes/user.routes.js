module.exports = app => {

  const user = require('../controllers/user.controller');
  const logger = require('../middlewares/logger');
  const jwtAuth = require('../middlewares/jwtAuth');

  // Create new user
  app.post('/user', function (req, res, next) {
    logger.reqLog(req, 'user.create');
    next()
  },
    user.create
  );

  // User login
  app.post('/user/login', function (req, res, next) {
    logger.reqLog(req, 'user.login');
    next()
  },
    user.login
  );

  // Get all users
  app.get('/user', function (req, res, next) {
    logger.reqLog(req, 'user.getAll');
    next()
  },
    user.getAll
  );

  // Find user by id
  app.get('/user/:userId', function (req, res, next) {
    logger.reqLog(req, 'user.findById');
    jwtAuth.tokenAuthentication(req, res, next);
  },
    user.findById
  );

  // Update user by id
  app.put('/user/:userId', function (req, res, next) {
    logger.reqLog(req, 'user.update');
    next()
  },
    user.update
  );

  // Change email address
  app.put('/user/changeEmail/:userId', function (req, res, next) {
    logger.reqLog(req, 'user.changeEmailAddress');
    next()
  },
    user.changeEmail
  );

  // Reset login password
  app.post('/user/resetPassword', function (req, res, next) {
    logger.reqLog(req, 'user.resetLoginPassword');
    next()
  },
    user.resetLoginPassword
  );

  // Delete user by id
  app.delete('/user/:userId', function (req, res, next) {
    logger.reqLog(req, 'user.remove');
    next()
  },
    user.remove
  );

  // Delete all users
  app.delete('/user', function (req, res, next) {
    logger.reqLog(req, 'user.removeAll');
    next()
  },
    user.removeAll
  );

  // Disable a user
  app.put('/user/disable/:userId', function (req, res, next) {
    logger.reqLog(req, 'user.disable');
    next()
  },
    user.disable
  );
}