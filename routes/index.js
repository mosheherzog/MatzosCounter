/*jshint esversion: 6 */

var path = require('path');
var express = require('express');
var router = express.Router();
var db = require('../functions/db');
var functions = require('../functions/fncs.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

router.get('/get-info', function(req, res){
	var locals = {};
  locals.shift = 1;
  locals.batch = 0;
  locals.membersInfo = [];
  locals.batches = [];

  db.keyVal('crntBatch')
  .then(function(data){
    locals.batch = data[0].val;
    return db.keyVal('crntShift');
  })
  .then(data => {
    locals.shift = data[0].val;

    return functions.getInfo();
  })
  .then(function(data){
    locals.membersInfo = data;
    return db.read('v_batches');
  })
  .then(function(data){

    batches = data;
    var reslt = {
      shift: locals.shift,
      batch: locals.batch,
      members: [],
      winners: [],
      batches: locals.batches,
    };

    //get the order of current, to declare winners;
    reslt.winners = locals.membersInfo
			.map(function(x){ return x.current || 0})
			.sort(function(a, b){return b-a})
			.filter(function(x, y, z){ return z.indexOf(x) == y;})
			.splice(0, 3);
    reslt.members = locals.membersInfo;
    res.json(reslt);
  });
});

module.exports = router;
