var express = require("express");
var router = express.Router();
var cors = require("cors"); 
router.use(cors());
// var fs = require('fs')
knob_map = {
  pan : '-1-1-0.05.json',
  decibels : '-60-0-1.json',
  ratio : '0-50-1.json',
  reverse : '0-1-1.json',
  type : 'type.json',
  frequency : 'freq.json',
  phaser_frequency : 'p_freq.json',
  octaves : "1-5-1.json"
}

router.get('/sets/:name/', function(req, res){
  let params = req.params
  res.sendFile(params.name + '.json', {root:  "./jsons/knob/sets"});
})
router.get('/data/:name', function(req, res){
  let params = req.params
  let root  = {root:  "./jsons/knob/data"}
  if (knob_map.hasOwnProperty(params.name))
  {
    res.sendFile(knob_map[params.name], {root:  "./jsons/knob/data"})
    return;
  }
  res.sendFile('0-1-0.05.json', {root:  "./jsons/knob/data"});
})
module.exports = router;
