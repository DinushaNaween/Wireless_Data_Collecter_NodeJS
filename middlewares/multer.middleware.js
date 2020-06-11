const multer = require('multer');

const storage = multer.memoryStorage();

const imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

exports.multerUpload = multer({ storage: storage, imageFilter: imageFilter }).single('image');