module.exports = app => {

  const data = require('../controllers/data.controller');
  const { reqLog } = require('../middlewares/logger.middleware');

  // Save data packet
  app.post('/data', function (req, res, next) {
    reqLog(req, 'data.save');
    next()
  }, 
    data.save
  );

  // Get all data from a data table
  app.get('/data/:tableName', function (req, res, next) {
    reqLog(req, 'data.getAll');
    next()
  },
    data.getAll
  );
}