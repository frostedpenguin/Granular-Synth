var express = require("express");
var router = express.Router();
var cors = require("cors");
router.use(cors());
var fs = require("fs");

var curr = "";

router.get("/curr", function (req, res) {
  res.send(curr);
});
router.get("/init", function (req, res) {
  res.send(curr);
});

router.post("/:parameter/:value", function (req, res) {
  let params = req.params;
  let p = params.parameter;
  let value = params.value;
  curr[p] = Number(value);
  res.send(curr);
});

router.get("/:parameter/", function (req, res) {
  let params = req.params;
  let value = curr[params.parameter];
  let string_value = value.toString();
  res.send(string_value);
});
router.get("/sets/:name", function (req, res) {
  if (!curr){
    let raw = fs.readFileSync("./jsons/presets/init.json");
    curr = JSON.parse(raw);
  }
  let params = req.params;
  let raw = fs.readFileSync("./jsons/knob/sets/" + params.name + '.json');
  var knobs = JSON.parse(raw);
  temp = {};
  for (var i in knobs) {
    temp[knobs[i]] = curr[knobs[i]]
  }
  console.log(temp)
  res.send(temp)
});

module.exports = router;
