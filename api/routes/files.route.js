const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.use(express.static("../../public"));

// Get all files

router.get("/", (req, res) => {
  const directoryPath = "../public/uploads";
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: "http://localhost:3000/api/files/" + file,
      });
    });

    res.status(200).send(fileInfos);
  });
});

// Get a single file

router.get("/:filename", (req, res) => {
  const filename = req.params.filename;
  const directoryPath = "../public/uploads";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    files.forEach((file) => {
      if (file == filename) {
        res.status(200).send({
          name: file,
          url: "http://localhost:3000/api/files/" + file,
        });
      }
    });
  });
});

// Upload a single file
router.post("/upload-single", (req, res) => {
  upload.single("file")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.status(500).end(err.message);
    } else if (err) {
      // An unknown error occurred when uploading.
      res.status(500).end(err.message);
    } else {
      // Everything went fine.
      res.status(200).send(req.file);
    }
  });
});

// Upload multiple files
router.post("/upload-multiple", (req, res) => {
  upload.array("files", 3)(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.status(500).end(err.message);
    } else if (err) {
      // An unknown error occurred when uploading.
      res.status(500).end(err.message);
    } else {
      // Everything went fine.
      res.status(200).send(req.files);
    }
  });
});

// Download a file
router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  res.download("../public/uploads/" + filename);
});

// Delete a file

router.delete("/:filename", (req, res) => {
  const filename = req.params.filename;
  fs.unlink("../public/uploads/" + filename, function (err) {
    if (err) {
      res.status(500).send({
        message: "Unable to delete file!",
      });
    }
    res.status(200).send({
      message: "File deleted successfully!",
    });
  });
});

module.exports = router;
