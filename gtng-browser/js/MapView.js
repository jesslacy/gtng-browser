var MapView = Backbone.View.extend({
	className : "openLayersMapWrapper",

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
		var options = this.options.mapOptions;
		this.map.render(this.el);		
		this.map.setCenter(new OpenLayers.LonLat(options.lon, options.lat), options.zoom);
	},
	
	createOLMap: function() {
		this.map = new OpenLayers.Map();		
		var layer = new OpenLayers.Layer.WMS( "OpenLayers WMS",
                  "http://vmap0.tiles.osgeo.org/wms/vmap0", {layers: 'basic'} );
        this.map.addLayer(layer);
	},
	
	onResize: function(domElement) {
		this.map.size = new OpenLayers.Size($(domElement).width(), $(domElement).height());
		this.map.updateSize();
	},
	
	
});
