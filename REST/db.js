var Mongolian = require('mongolian');

var server = new Mongolian();

var dbs = server.db('devices_db');

module.exports.collections = {
	devices: dbs.collection('devices')
};
