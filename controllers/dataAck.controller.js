const DataAck = require('../models/dataAck.model');
const logger = require('../middlewares/logger.middleware');

exports.getDataAcknowledgementById = (req, res) => {
  DataAck.getDataAcknowledgementById(req.params.dataAckId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('getDataAcknowledgementById notFound');
        res.status(404).json({
          state: false,
          message: 'Not found DataAcknowledgement with id ' + req.params.dataAckId
        });
      } else {
        logger.error('getDataAcknowledgementById', err.message);
        res.status(500).json({
          state: false,
          message: 'Error retrieving DataAcknowledgement with id ' + req.params.dataAckId
        });
      }
    } else {
      logger.info('getDataAcknowledgementById success');

      data.successNodes = (Array.from(data.successNodes.split(','))).map((i) => Number(i));
      data.errorNodes = (Array.from(data.errorNodes.split(','))).map((i) => Number(i));
      data.missedNodes = (Array.from(data.missedNodes.split(','))).map((i) => Number(i));

      res.status(200).json({
        state: true,
        DataAcknowledgement: data
      });
    }
  });
};