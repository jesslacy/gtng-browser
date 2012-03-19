$(document).ready(function() {
	$(function() {
		var eventHub = {};
		_.extend(eventHub, Backbone.Events);
		
		var mapView = new MapView({
			el: "#container",
			eventHub: eventHub,
			mapOptions: {lat: 40, lon: -123, zoom: 7}
		});
		
		mapView.render();
		
		
		eventHub.trigger("startup");
	});
});