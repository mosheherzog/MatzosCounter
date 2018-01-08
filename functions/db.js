'use strict';

var cfg = require('../config.json').db;

var config = {
	user: cfg.user,
	database: cfg.database, //env var: PGDATABASE
	password: cfg.password, //env var: PGPASSWORD
	host: cfg.host, // Server hosting the postgres database
	port: cfg.port, //env var: PGPORT
	max: 10, // max number of clients in the pool
	idleTimeoutMillis: 100 };

var knex = require('knex')({
	client: 'pg',
	connection: config,
	pool: { min: 0, max: 7 },
	useNullAsDefault: true
});
var db = {
	config: config,
	query: function query(queryString, valsArray) {
		return knex.raw(queryString, valsArray);
	},
	create: function create(table, keyVals) {
		return knex(table).returning('ID').insert(keyVals);
	},
	read: function read(table, filter, order, clms) {
		var query =  knex.select(clms).from(table);
		if(filter) query.where(filter);
		if(order) query.orderBy(order.clm, order.order);
		return query;
	},
	update: function update(table, pk, keyVals) {
		return knex(table).where('ID', pk).update(keyVals).returning('ID');
	},
	// a special function to update the keyVals table
	keyVal: function updateKeyVal(key, val) {
		if(val){
			return knex('tbl_settings').where('key', key).update({ val: val }).returning('val');
		}
		return knex('tbl_settings').select('val').where('key', key).returning('val');
	},
	delete: function _delete(table, pk) {

		return knex(table).where('ID', pk).del().returning('ID');
	}
};

module.exports = db;
