(function($) {
	var Device = Backbone.Model.extend({
		defaults: function() {
			return {
				name: '',
				ip: '',
				description: ''
			}
		}
	});
	var DevicesList = Backbone.Collection.extend({
		model: Device
	});
	var devices = new DevicesList();

	var DeviceView = Backbone.View.extend({
		model: new Device(),
		tagName: 'div',
		events: {
			'click .edit': 'edit',
			'click .delete': 'delete',
			'blur .ip': 'close',
			'keypress .ip': 'onEnterUpdate'
		},
		initialize: function() {
			this.template = _.template($('#device-template').html());
		},
		edit: function(ev) {
			ev.preventDefault();
			this.$('.ip').attr('contenteditable', true).focus();
		},
		close: function(ev) {
			var ip = this.$('.ip').text();
			this.model.set('ip', ip);
			this.$('.ip').removeAttr('contenteditable');
		},
		onEnterUpdate: function(ev) {
			var self = this;
			if (ev.keyCode === 13) {
				this.close();
				_.delay(function() { self.$('.ip').blur() }, 100);
			}
		},
		delete: function(ev) {
			ev.preventDefault();
			devices.remove(this.model);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});

	var DevicesView = Backbone.View.extend({
		model: devices,
		el: $('#devices-container'),
		initialize: function() {
			this.model.on('add', this.render, this);
			this.model.on('remove', this.render, this);
		},
		render: function() {
			var self = this;
			self.$el.html('');
			_.each(this.model.toArray(), function(tweet, i) {
				self.$el.append((new DeviceView({model: tweet})).render().$el);
			});
			return this;
		}
	});

	$(document).ready(function() {
		$('#new-device').submit(function(ev) {
			var tweet = new Device({ name: $('#device-name').val(), ip: $('#ip-update').val(), description: $('#description-update').val()});
			devices.add(tweet);
			console.log(devices.toJSON());
			
			return false;		
		});
		
		var appView = new DevicesView();
	});
	
})(jQuery);