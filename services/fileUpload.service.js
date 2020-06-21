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

// Upload sensor images
exports.uploadSensorImage = (req, fileName, result) => {
  if (!req.file) {
    logger.warn('sensor image not found');
    result('not_found', null);
    return;
  } else {
    const imageDataUri = parser.format(path.extname(req.file.originalname).toString(), req.file.buffer);

    cloudinary.uploader.upload(imageDataUri.content, { folder: 'sensor_images', public_id: fileName, use_filename: true }, function (err, res) {
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

// Upload user images
exports.uploadUserImage = (req, fileName, result) => {
  console.log('image upload function')
  if (!req.file) {
    logger.warn('user image not found');
    result('not_found', null); 
    return;
  } else {
    const imageDataUri = parser.format(path.extname(req.file.originalname).toString(), req.file.buffer);

    cloudinary.uploader.upload(imageDataUri.content, { folder: 'user_images', public_id: fileName, use_filename: true }, function (err, res) {
      if (err) {
        logger.error('cloudinary.uploader.upload', err.message);
        result('error', null);
        return;
      } else {
        result('success', res.secure_url);
        return;
      }
    });
  }
}