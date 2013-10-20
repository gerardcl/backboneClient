var devices = require('../db').collections.devices;

exports.index = function(req, res){
	devices.find().toArray(function(err,docs){
		if(err) return res.status(500).send({status : 'Failed to load devices!'});
		res.send(docs);
	});
};
exports.show = function(req, res){
};
exports.create = function(req, res){
	var params = req.body;
	devices.insert(params, function(err){
		if(err) return res.status(500).send({status : 'Failed to create device to the server!'});
		res.send(params);
	});	
};
exports.destroy = function(req, res){
};
exports.update = function(req, res){
};
