'use strict';
var db = require('./db');

module.exports = {
	//determine the current shift ID.
	getCurrentShift: function(){
		return db.query("SELECT * FROM tbl_shifts WHERE id = (SELECT CAST(Val AS INTEGER) FROM tbl_settings WHERE Key = 'crntShift');");
	},

	getCurrentBatch: function(){
		return db.keyVal("crntBatch");
	},

	newBatch: function(callback){
		db.query("UPDATE tbl_members SET lastMatza = null;");
		this.getCurrentBatch()
		.then(function(data){
			return db.keyVal("crntBatch", (data[0].val * 1) + 1);
		})
		.then(function(data){
			callback(data);
		})
		.catch(console.log);
	},

	checkShift: function(time){
		var that = this;
		this.getCurrentShift()
		.then(function(data){
			var shift = data.rows[0];
			var date = new Date(time);
			var hoursTime =  date.getHours() + "" + date.getMinutes()
			if (hoursTime < shift.ends && hoursTime > shift.starts) {
				//do nothing
				return;
			} else {
				//we got to take in consideration if no shift matches the time;
				that.updateShift(hoursTime);
			}
		})
		.catch(console.log);
	},

	updateShift: function(time){
		//time has to be worked out, by now
		return db.query("UPDATE tbl_settings SET val = (SELECT id FROM tbl_shifts WHERE start < " + time + " AND ends > " + time + ") WHERE key = 'crntShift';")
		.then(function(){
			db.update('tbl_members', {batches: 0});
		})
		//and set totalBatches to 0;
	},

	calculateSeconds: function(key, time, callback){
		var that = this;
		var seconds = 0;
		db.query("SELECT lastMatza FROM tbl_members WHERE key = '" + key + "';")
		.then(function(result){
			//if last-matza is null, then first matza and seconds is 0
			if (!result.rows[0]) console.log("Debugging: fncs.js - calculateSeconds. something is wrong!!!")
			var lastMatza = result.rows[0].lastMatza;
			if(lastMatza != null){
				seconds = Math.round((time - lastMatza) / 1000);
			} else {
				//new Batch
				seconds = 0;
				this.getCurrentBatch()
				.then(function(data){
					return db.update("tbl_members", {batches: (data[0].val * 1) + 1});
				})
			}
			/*CHECK FOR MINIMUM SECONDS*/
			return db.keyVal('minScnds');
		})
		.then(function(data){
			var minSecnds = data[0].val;
			if(seconds < minSecnds) seconds = 0;
			return db.query("UPDATE tbl_members SET lastMatza = " + time + " WHERE Key = '" + key + "';");
		})
		.then(function(data){
			callback(null, seconds);
		})
		.catch(console.log);
	}
};
