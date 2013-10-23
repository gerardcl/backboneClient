(function($){
	
	//Backbone.Model.prototype.idAttribute = '_id';

	var Device = Backbone.Model.extend({
		url: '/devices/routers.json',
		defaults: function(){
			return {	
				id: ' ',
				ip: ' ',
				name: ' ',
				description: ' '
			}				
		}
	});
	
	var DevicesList = Backbone.Collection.extend({
		model: Device,
	//	url: 'http://localhost:8080/device-manager-api/devices/routers'
		url: '/devices/routers.json',

				initialize: function () {
					this.bind("reset", function (model, options) {
						console.log("Inside event");
						console.log(model);

					});
				}
		


	});
	var numDevices = 0;
	var devices = new DevicesList();

	var DeviceView = Backbone.View.extend({
		model: new Device(),
		tagName: 'div',
		events: {
			'click .name': 'updateName',
			'click .ip': 'updateIp',
			'click .description': 'updateDesc',
			'click .delete': 'delete',
			'click .details': 'details',
			'blur .name': 'close',
			'blur .ip': 'close',
			'blur .description': 'close',
			'keypress .name': 'onEnterUpdate',
			'keypress .ip': 'onEnterUpdate',
			'keypress .description': 'onEnterUpdate'
		},
		initialize: function(){
			this.template = _.template($('#device-template').html()); //using underscore template
		},
		updateName: function(ev){
			ev.preventDefault();
			this.$('.name').attr('contenteditable',true).focus();
		},
		updateIp: function(ev){
			ev.preventDefault();
			this.$('.ip').attr('contenteditable',true).focus();
		},
		updateDesc: function(ev){
			ev.preventDefault();
			this.$('.description').attr('contenteditable',true).focus();
		},
		details: function(ev){
			
		},
		close: function(ev){
			var self = this;
			var name = this.$('.name').text();
			var ip = this.$('.ip').text();
			var description = this.$('.description').text();
			var id = this.$('.id').text();
			//this.model.set('name', name);
			//this.model.set('ip', ip);
			//this.model.set('description', description);
			this.model.save({ id: id ,name: name ,ip: ip, description: description }, {
				success: function(){ console.log('Successfully updated device '+ self.model.id); },
				error: function(){ console.log("Failed to update device with id = "+self.model.id); }
			});
			this.$('.name').removeAttr('contenteditable');
			this.$('.ip').removeAttr('contenteditable');
			this.$('.description').removeAttr('contenteditable');
		},
		onEnterUpdate: function(ev){
			var self = this;
			if(ev.keyCode==13){
				this.close();
				_.delay(function(){ self.$('.name').blur()},100);
				_.delay(function(){ self.$('.ip').blur()},100);
				_.delay(function(){ self.$('.description').blur()},100);
			}
		},
		delete: function(ev){
			ev.preventDefault();
			var self = this;
			this.model.destroy({
				success: function() { devices.remove(this.model); console.log("Delete succesfully done!"); },
				error: function() { console.log("Failed to remove device with id = "+self.model.idAttribute); }
			});
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});
	
	var DevicesView = Backbone.View.extend({
		model: devices,
		el: $('#devices-container'),
		initialize: function(){
			var self = this;
			this.model.on('add', this.render, this);
			this.model.on('remove', this.render,this);
			//get all devices (Backbone.sync powah!!!)
			this.model.fetch({
				success: function(response,xhr) {
					 console.log("Inside success");
					 //console.log(response+' '+xhr);
					console.log("Inside Parse");

								//keys
								var keys = response.COLUMNS;
								console.log("keys = "+keys);
								//values
								var values = response.DATA;

								//Parse the response and construct models			
								for (var i = 0, length = values.length; i < length; i++) {

									var currentValues = values[i];
									var deviceObject = {};
									for (var j = 0, valuesLength = currentValues.length; j < valuesLength; j++) {
										deviceObject[keys[j]] = currentValues[j];
									}

									//push the model object
									this.push(deviceObject);	
								}

								console.log(this.toJSON());

								//return models
								return this.models;
					
				},
				error: function (errorResponse) {
				       console.log(errorResponse)
				}
			});
			
		},					
		render: function(){
			var self = this;
			self.$el.html('');
			_.each(this.model.toArray(),function(device,i){
				self.$el.append((new DeviceView({model: device})).render().$el);
			});
			return this;
		}
		
	});
	
	var Router = Backbone.Router.extend({
		routes: {
			'': 'index',
			'devices/:id': 'show'
		},
		index: function(){
			//enable Add Device
			console.log("INDEX");
			//disable show device
		},
		show: function(id){
			//disable add device
			console.log("SHOW");
			//enable show device
		}
	});
	
	$(document).ready(function(){
		$('#add-device').submit(function(ev){
			var the_id= "RT-"+ ++numDevices;
			var device = new Device({id:the_id,name:$('#device-name').val(),ip:$('#device-ip').val(),description:$('#device-description').val()});
			devices.add(device);
			//var device2 = new Device({id:'RT-2',name:'Router 2',ip:'192.168.1.12',description:'second router'});
			//var device3 = new Device({id:'RT-3',name:'Router 3',ip:'192.168.1.13',description:'third router'});
			//console.log(device.get('description'));
			console.log(devices.toJSON());
//			device.save({id:device.get('id'),name:$('#device-name').val(),ip:$('#device-ip').val(),description:$('#device-description').val()},{
//				succes: function(){ consol.log("successfully saved device!");},
//				error: function(){ console.log("error saving device!");}
//			})
			return false;	
		});
		
		var appView = new DevicesView();
	});
	
	
})(jQuery);