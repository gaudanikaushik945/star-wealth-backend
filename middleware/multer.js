const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads'); // Specify the directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Append timestamp to the original file name
  }
});

const upload = multer({ storage: storage });

// Export the configured multer instance
module.exports = upload;