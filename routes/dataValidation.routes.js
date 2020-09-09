module.exports = app => {
  
  const dataValidation = require('../controllers/dataValidation.controller');
  const { reqLog } = require('../middlewares/logger.middleware');

  // Create new dataValidation for parentNode
  app.post('/dataValidation', function (req, res, next) {
    reqLog(req, 'dataValidation.create');
    next()
  }, 
    dataValidation.create
  );

  // Data validation find by parent node id
  app.get('/dataValidation/:parentNodeId', function (req, res, next) {
    reqLog(req, 'dataValidation.getByParentNodeId');
    next()
  }, 
    dataValidation.getByParentNodeId
  );
}