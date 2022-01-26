var express = require("express");
const mp3_cutter = require("mp3-cutter");
// var bodyParser = require('body-parser')
var fs = require("fs");
var multer = require("multer");
var cors = require("cors");
var router = express.Router();
app = express();
router.use(cors());

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    cb(null, "audio_track.mp3");
  },
});

var upload = multer({ storage: storage });

router.post("/upload", upload.single("audio"), function (req, res, next) {
  res.send("ok");
});
router.post("/cropped", function (req, res, next) {
  let body = req.body;
  let start = Math.floor(body.start)
  let stop = Math.floor(body.stop)
  console.log([ start, stop])
  mp3_cutter.cut({
    src: "uploads/audio_track.mp3",
    target: "uploads/cropped.mp3",
    start: start,
    end: stop,
  });
  res.send('ok')
});
router.get("/upload", function (req, res, next) {
  res.sendFile("audio_track.mp3", { root: "./uploads" });
});

router.get("/cropped", function (req, res, next) {
  res.sendFile("cropped.mp3", { root: "./uploads" });
});


module.exports = router;
