/*jshint esversion: 6 */

const path = require('path');
const express = require('express');
const router = express.Router();
const db = require('../functions/db.js');

/*
 for the Ajax Calls of the service.
*/

router.get('/', function(req, res, next) {
  var key = req.query.key;
  var time = req.query.time;
  var seconds = 0;
  var crntShift;
  var firstmatsa = false;
  // check if correct key code.
  var correctKeys = 'ABCDEFGHIJKLMNOPQR';

  if(correctKeys.includes(key)) {
    var locals = {};
    //get seconds
    //check if new Batch
    db.read('tbl_members', {key: key}, undefined, 'newbatch')
    .then(function(data){
      locals.firstmatsa = data[0].newbatch;
      return db.query("SELECT (" + time + " - (SELECT max(time) FROM tbl_records WHERE key = '" + key + "')) / 1000 AS answer");
    })
    .then(function(reslt){

       seconds = locals.firstmatsa ? 0 : Number(reslt.rows[0].answer);
      //always make sure the next matsa is not the first
      return db.update('tbl_members', {key: 'key', val: key}, {newbatch: false});
    })
    .then(function(){
      //get the current shift
      return db.keyVal('crntShift');
    })
    .then(function(shift){
      crntShift = shift[0].val;
        //get the current batch
      return db.query("select val from tbl_settings WHERE key = 'crntBatch'");
    })
    .then(function(batch){
      var crntBatch = batch.rows[0].val;
      var recs = {
        shift: crntShift,
        batch: crntBatch,
        time: time,
        date: req.query.date,
        firstMatsa: firstmatsa,
        key: key,
        seconds: seconds,
      };
      return db.create('tbl_records', recs);
    })
    .then(function(data){
        res.sendStatus(200);
    })
    .catch(function(err){
      console.log(err);
      res.sendStatus(201);
    });
    // if key = 2

  /*

    new Batche
  */
} else if(key == 1) {
    var locals = {};
    //get the current shift
    db.query("SELECT val FROM tbl_settings WHERE key = 'crntShift'")
    .then(function(data){
      locals.crntShift = data.rows[0] && data.rows[0].val;

      //now check if it has to be updated
      var hours = formatTime(time);
      var sqlStatement = `SELECT id FROM tbl_shifts WHERE ${hours} <= ends AND ${hours} > start`;
      return db.query(sqlStatement);
    })
    .then(function(data){
      locals.correctShift = data.rows[0] && data.rows[0].id;
      if(locals.crntShift == locals.correctShift){
        newBatch(res);
      }
      else{
        updateShift(res, locals.correctShift);
      }
    });
  } else {
    res.send("wrong key!");
  }
});


// a function that evals the time to 0000 format
function formatTime(time){
  var date = new Date(Number(time));
  return ('0' + date.getHours()).substr(-2) + ('0' + date.getMinutes()).substr(-2);
}

// a function for a new batch
function newBatch(res){
  db.update('tbl_members', false, {newbatch: true})
  .then(function(){
    //add 1 to crntBatch
    let sqlStatement = `UPDATE tbl_settings SET val = val::integer + 1 WHERE key = 'crntBatch'`;
    return db.query(sqlStatement);
  })
  .then(function(data){
    res.send(data);
  })
  .catch(console.log);
}
// a function to update the shift
function updateShift(res, correctShift){
  //correct the shift
  let sqlStatement = `UPDATE tbl_settings SET val = ${correctShift} WHERE key = 'crntShift'`;
  db.query(sqlStatement)
  .then(function(){
    // crntBatch = 0
    return db.query("UPDATE tbl_settings SET val = '0' WHERE key = 'crntBatch'");
  })
  .then(function(){
    //newBatch
    newBatch(res);
  })
  .catch(console.log);
}


module.exports = router;
