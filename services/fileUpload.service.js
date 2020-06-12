const cloudinary = require('cloudinary').v2;
const path = require('path');
const DataUriParser = require('datauri/parser');
const logger = require('../middlewares/logger.middleware');

const parser = new DataUriParser();

cloudinary.config({
  cloud_name: process.env.COLUDINARY_CLOUD_NAME,
  api_key: process.env.COLUDINARY_API_KEY,
  api_secret: process.env.COLUDINARY_API_SECRET
});

exports.uploadSensorImage = (req, sensor, result) => {
  if (!req.file) {
    logger.warn('sensor image not found');
    result('not_found', null);
    return;

  } else {
    const imageDataUri = parser.format(path.extname(req.file.originalname).toString(), req.file.buffer);

    cloudinary.uploader.upload(imageDataUri.content, { folder: 'sensor_images', public_id: `${sensor.id}_${sensor.sensorName}`, use_filename: true }, function (err, res) {
      if (err) {
        logger.error('cloudinary.uploader.upload', err.message);
        result('error', null);
        return;
      } else {
        result('success', res.secure_url);
        return;
      }
    });
  };
};  