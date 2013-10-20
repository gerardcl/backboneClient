(function($){
	_.templateSettings = {
	  interpolate: /\{\{(.+?)\}\}/g
	};  //this is for not using jade and be based on ejs simple html code
	
	var Device = Backbone.Model.extend({
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
		url: '/devices'
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
		close: function(ev){
			var name = this.$('.name').text();
			var ip = this.$('.ip').text();
			var description = this.$('.description').text();
			this.model.set('name', name);
			this.model.set('ip', ip);
			this.model.set('description', description);
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
			devices.remove(this.model);
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
			this.model.on('add', this.render, this);
			this.model.on('remove', this.render,this);
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
	
	$(document).ready(function(){
		$('#add-device').submit(function(ev){
			var device = new Device({id:++numDevices,name:$('#device-name').val(),ip:$('#device-ip').val(),description:$('#device-description').val()});
			devices.add(device);
			//var device2 = new Device({id:'RT-2',name:'Router 2',ip:'192.168.1.12',description:'second router'});
			//var device3 = new Device({id:'RT-3',name:'Router 3',ip:'192.168.1.13',description:'third router'});
			//console.log(device.get('description'));
			console.log(devices.toJSON());
			device.save({},{
				succes: function(){ consol.log("successfully saved device!");},
				error: function(){ console.log("error saving device!");}
			});
			return false;	
		});
		
		var appView = new DevicesView();
	});
	
	
})(jQuery);