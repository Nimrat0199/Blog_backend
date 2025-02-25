const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep original filename
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
