var path = require('path');
var express = require('express');
var router = express.Router();
var db = require('../functions/db.js');
var functions = require('../functions/fncs.js');

/*for the Ajax Calls of the service.*/

router.get('/', function(req, res, next) {
	var key = req.query.key;
	var time = req.query.time;
	// check if correct key code.
	var correctKeys = 'ABCDEFGHIJKLMNOPQR';

	if (correctKeys.includes(key)) {
		//calculate seconds
		functions.calculateSeconds(key, time, function(tooSmall, seconds){
			//if too small break
			if (tooSmall) {
				res.send(tooSmall);
				return;
			}

			var crntShift;
			//get the current batch
			db.keyVal('crntShift')
			.then(function(shift){
				crntShift = shift[0].val;
				//get the current shift
				return functions.getCurrentBatch()
			})
			.then(function(batch){
				var crntBatch = batch[0].val;
				var recs = {
					shift: crntShift,
					batch: crntBatch,
					time: time,
					date: req.query.date,
					firstMatza: false,
					key: key,
					seconds: seconds
				};
				return db.create('tbl_records', recs)
			})
			.then(function(data){
				res.sendStatus(200);
			})
			.catch(function(err){
				console.log(err);
				res.sendStatus(201);
			});
		});
		// if key = 2
		/*new Batche*/
	} else if(key == 1) {
		functions.checkShift(next);
		//first check if new shift
		functions.newBatch(function(data){
			res.send(data);
		});
	} else {
		res.send("wrong key!")
	}
});

module.exports = router;
