const multer = require("multer");
const path = require("path");
const os = require("os");

// Use Vercel's temp directory
const uploadDir = os.tmpdir();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save in /tmp
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;

