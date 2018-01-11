/*jshint esversion: 6 */
var db = require('./db');

module.exports = {
  //determine the current shift ID.
  getCurrentShift: function(){
      return db.query("SELECT * FROM tbl_shifts WHERE id = (SELECT CAST(val AS INTEGER) FROM tbl_settings WHERE key = 'crntShift');");
  },

  getCurrentBatch: function(){
    return db.keyVal("crntBatch");
  },

  checkShift: function(time){
    var that = this;
    return this.getCurrentShift()
    .then(function(data){

      var shift = data.rows[0];
      var date = new Date(Number(time));
      var hoursTime = ('0' + date.getHours()).substr(-2) + ('0' + date.getMinutes()).substr(-2);
      if(hoursTime <= shift.ends && hoursTime > shift.starts){
        //do nothing
        return shift.id;
      } else {

        return that.updateShift(hoursTime);
      }
    })
    .catch(console.log);
  },

  updateShift: function(time){
    var crntShift;

    return db.query("SELECT id FROM tbl_shifts WHERE start < " + time + " AND ends >= " + time + ";")
    .then(function(data){
      crntShift = data.rows[0].id;
      return db.query("UPDATE tbl_settings SET val = " + crntShift + " WHERE key = 'crntShift';");
    })
    .then(function() {
      return db.query("UPDATE tbl_settings SET val = '0' WHERE key = 'crntBatch';");
    })
    .catch(console.log);
    //and set totalBatches to 0;
  },

  getInfo : function(){
    return db.read('v_info');
  }

};
