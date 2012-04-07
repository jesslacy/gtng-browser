var MapView = Backbone.View.extend({
	
	initialize : function() {		
		this.bindHandlersToEvents();
		this.setupResizableContainer();
		this.createOLMap();				
	},
	
	bindHandlersToEvents: function() {
		this.options.eventHub.bind("startup", this.onStartup, this);
	},
	
	setupResizableContainer: function() {		
		$(this.el).css('height', this.getInitialHeight());
		$(this.el).css('width', this.getInitialWidth());
		
		$(this.el).resizable({
			// animate: don't use until the UI code calls the stop event
			//  after the animation has completed.  Otherwise, map updateSize is called too early
			helper: "ui-resizable-helper",
			containment: "document"
		});
		var context = this;
		$(this.el).bind('resizestop', function() {
			context.onResize(this);
		});
		
	},
		
	getInitialHeight: function() {
		return Math.floor($(window).height() * .6);
	},
	
	getInitialWidth: function() {
		return Math.floor($(window).width() * .8);
	},
	
	onStartup: function() {
		$(this.el).append("<div class='olMapWrapper'></div>");		
		var options = this.options.mapOptions;

		var queryLayer = this.map.getLayersBy('name', 'Query')[0];
		var featureControl =  new OpenLayers.Control.WMSGetFeatureInfo({
				url : 'http://localhost/glims/cgi-bin/glims_ogc',
				title : 'Identify features by clicking',
				layers : [ queryLayer ],
				infoFormat: "application/vnd.ogc.gml",
				queryVisible: false
			});
		featureControl.events.register("getfeatureinfo", this, this.onGetFeatureInfo);
		this.map.addControl(featureControl);	
			
		this.map.render(this.$(".olMapWrapper")[0]);		
		this.map.setCenter(new OpenLayers.LonLat(options.lon, options.lat), options.zoom);
		
	    this.map.events.register("moveend", this, this.refreshExtent);
	    featureControl.activate();
	},
	
	createOLMap: function() {
		this.map = new OpenLayers.Map();		
	},
	
	onResize: function(domElement) {
		this.map.size = new OpenLayers.Size($(domElement).width(), $(domElement).height());
		this.map.updateSize();
	},
	
	refreshExtent:  function(event) {
    	var bounds = event.object.getExtent();
		this.model.set({"left": bounds.left});
		this.model.set({"right": bounds.right});
		this.model.set({"bottom": bounds.bottom});
		this.model.set({"top": bounds.top});
    },
    
    onGetFeatureInfo: function(event) {
    	this.model.set({results: {features: event.features}});
    },
	
	addLayer: function(layer) {
		this.map.addLayer(layer);
	},
	
	addLayers: function(layers) {
		this.map.addLayers(layers);
	}
	
	
});
