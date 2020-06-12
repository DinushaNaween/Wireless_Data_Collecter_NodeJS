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

exports.uploadSensorImage = (req, res, next) => {
  if (!req.file) {
    logger.warn('sensor image not found');
    next()
  } else{
    const imageDataUri = parser.format(path.extname(req.file.originalname).toString(), req.file.buffer);

    cloudinary.uploader.upload(imageDataUri.content, { folder: 'sensor_images', public_id: req.file.originalname, use_filename: true }, function(err, result){
      if (err) {
        logger.error('cloudinary.uploader.upload', err.message);
        next()
      } else{
        req.body.sensorImageURL = result.secure_url;
        next()
      }
    });
  };
};  