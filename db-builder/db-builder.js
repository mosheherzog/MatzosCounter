'use strict';
var prompt = require('prompt');
var pgtools = require('pgtools');
var queries = require('./queries.json');

const config = {
  user: 'postgres',
  password: 'postgres',
  port: 5432,
  host: 'localhost'
}

consoleMe('Welcome to our Data-Base builder, cutomised by @shimon.brandsdorfer. \n All rights reserved!\n ...\n ...\n... \n...');

consoleMe('I will Just ask you to enter the Data-Base name, so I can build the data-base for you.\n If you don\'t plan to change the config.json file, please leave the name as default, matsah.');

 prompt.start();
 var schema = {
    properties: {
      name: {
        description: 'Enter the name of the data-base to build: (default: "matsah")',
        type: 'string',
        default: 'matsah',
        required: true
      },
      confirm: {
        description: 'Are you sure you want to proceed? (\'y\' for tes, \'n\' for no).',
        type: 'string',
        required: true
      },
      msg: {
        description: 'Also, make sure you have a database server, with the name "postgres", and user-name "postgres", on localhost, port 5432. (Type any key to continue)',
        type: 'string'
      }
    }
  }
 prompt.get(schema, function (err, result) {
   if (err) { return onErr(err); }
   if(result.confirm === 'y') createDB(result.name); else consoleMe("Aborting..........\n\n\n\n\n\n\n...........\n\n\n\n\n......\n\n\n\n")
 });

 function onErr(err) {
   console.log(err);
   return 1;
 }

 function consoleMe(msg){
   console.log('\x1b[33m%s\x1b[0m:', msg)
 }


 /*build the data-base*/

 function createDB(name){
   pgtools.createdb(config, name, function (err, res) {
     if (err) return onErr(err);
     consoleMe("DataBase: '" + name + "' created successfuly!");
     populate(name)
   });
 }

 /*poppulate the data-base*/

 function populate(name){
   config.database = name;
   var knex = require('knex')({
   	client: 'pg',
   	connection: config,
   	pool: { min: 0, max: 7 },
   	useNullAsDefault: true
   });

   var tasks = queries.map(function(query ,i){
    return function(){

       return knex.raw(queries[i].query)
       .then(function(){
          consoleMe(queries[i].success);
       });
     }
  });

  var p = tasks[0]();

  for(var i = 1; i < queries.length; i++) p = p.then(tasks[i]);
  p.then(function(data){
      "ABCDEFGHIJKLMNOPQR".split("").forEach(function(x){
          addMember(x)
          .then(function(k){
            if(k == 'R') process.exit();
          });
      });
  });


   function addMember(key){
     return knex.raw("INSERT INTO members (key) VALUES ('" + key + "')")
     .then(function(){
        consoleMe("added member: " + key + " to the table!");
        return key;
      })
     .catch(console.log);
   }


 }
