const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const uploader = multer({
  storage,
  fileFilter: (req, file, cb) => {

    if (!file) {
      cb(null, true);
    }
    const supportedFile = /jpe?g|png/;
    const extension = path.extname(file.originalname);
    if (supportedFile.test(extension)) {
      cb(null, true);
    } else {
      cb(new Error("Only jpg or png image."));
    }
  },
  limits: {
    fileSize: 1000000,
  },
});

module.exports = uploader;
