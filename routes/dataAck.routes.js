module.exports = app => {

  const dataAck = require('../controllers/dataAck.controller');
  const { reqLog } = require('../middlewares/logger.middleware');

  app.get('/dataAck/:dataAckId', function (req, res, next) {
    reqLog(req, 'dataAck.getDataAcknowledgementById');
    next()
  }, 
    dataAck.getDataAcknowledgementById
  );
}