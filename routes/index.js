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
	var shift = 1;
	var batch = 0;
	var membersInfo = [];
	db.keyVal('crntBatch')
	.then(function(data){
		batch = data[0].val;
		return db.keyVal('crntShift');
	})
	.then(function(data){
		shift = data[0].val;
		return db.read('v_info');
	})
	.then(function(data){
		membersInfo = data;
		return db.read('tbl_members');
	})
	.then(function(data){
		var reslt = {
			shift: shift,
			batch: batch,
			members: [],
			winners: []
		}

		//get the order of current, to declare winners;
		reslt.winners = membersInfo.map(function(x){ return x.current || 0}).sort(function(a, b){return b-a}).filter(function(x, y, z){ return z.indexOf(x) == y;}).splice(0, 3);
		reslt.members = membersInfo;
		/*.sort(function(a, b) {
		if (a.key1 < b.key1) return -1;
		if (a.key1 > b.key1)  return 1;
		return 0;
		});*/

		// sort the info in order;
		res.json(reslt);
	})
});

module.exports = router;
