var home = require('./controllers/home_controller')
	, devices = require('./controllers/devices_controller');
//get homepage and crud ops.
module.exports = function(app){
	app.get('/', home.index);
	
	app.get('/devices', devices.index);
	//CRUD
	app.post('/devices', devices.create);
	app.get('/devices/:id', devices.show);
	app.put('/devices/:id', devices.update);
	app.delete('/devices/:id', devices.destroy);
};