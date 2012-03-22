describe("OpenLayersMapView", function() {
	beforeEach(function() {
		
		this.hub = {};
		_.extend(this.hub, Backbone.Events);
		
		this.model = new Backbone.Model();		
		this.mapOptions = {lat: 40, lon: -123, zoom: 3};
		
		this.view = new MapView({eventHub: this.hub, mapOptions: this.mapOptions, model: this.model});
		
		var layer = new OpenLayers.Layer.WMS( "OpenLayers WMS",
                "http://vmap0.tiles.osgeo.org/wms/vmap0", {layers: 'basic'} );
     	this.view.addLayer(layer);
		
	});

	describe("Instantiating the map", function() {

		it("creates map when startup event triggered", function() {
			var startupSpy = sinon.spy(this.view, "onStartup");
			
			// Re-run handler binding so that spy is bound to spy version of the onStartup
			this.view.bindHandlersToEvents();		
			
			expect($(this.view.el)).not.toContain("div.olMap");
			expect($(this.view.el)).not.toContain("div.olMapViewport");
			
			this.hub.trigger("startup");
			
			expect(startupSpy).toHaveBeenCalledOnce();	
			expect($(this.view.el)).toContain("div.olMap");
			expect($(this.view.el)).toContain("div.olMapViewport");
			
			startupSpy.restore();
		});
		
		it("sets the zoom level and center of the map", function() {
			this.hub.trigger("startup");
			expect(this.mapOptions.lat).toEqual(this.view.map.getCenter().lat);
			expect(this.mapOptions.lon).toEqual(this.view.map.getCenter().lon);
			expect(this.mapOptions.zoom).toEqual(this.view.map.getZoom());
		});
		
		it("creates a map size appropriately for the users screen", function() {
			this.hub.trigger("startup");
			expect($(this.view.el).height()).toEqual(this.view.getInitialHeight());
			expect($(this.view.el).width()).toEqual(this.view.getInitialWidth());
		});

	});
	
	describe("Map Layer", function() {
		
		it("can be added to the map prior to startup", function() {
			
			var openaerial = new OpenLayers.Layer.WMS(
                "Open Aerial Map",
                "http://glims.org/cgi-bin/tilecache-2.01/tilecache.cgi?",
                {
                  layers: "open_aerial_map"
                }); 
			this.view.addLayer(openaerial);
			
			this.hub.trigger("startup");
			expect(this.view.map.getLayersBy("name","Open Aerial Map")[0]).toEqual(openaerial);
		});
		
		it("can set as the default base layer", function() {			
			
			this.hub.trigger("startup");			
			expect(this.view.map.baseLayer).not.toBeNull();
		});
		
	});
	
	describe("Resizing the map", function() {
		 
		it("A resize event handler is called during resize", function() {			
			var resizeSpy = sinon.spy(this.view, "onResize");
			
			this.hub.trigger("startup");
			
			$(this.view.el).css('height', '500px');
			$(this.view.el).css('width', '500px');
			
			expect(this.view.map.size.h).not.toEqual(500);
			
			// manually trigger the resize since user isn't interacting with control
			$(this.view.el).trigger('resizestop');
			
			expect(resizeSpy).toHaveBeenCalled();
			expect($(this.view.el).height()).toEqual(500);
			expect($(this.view.el).width()).toEqual(500);
			expect(this.view.map.size.h).toEqual(500);
			
			resizeSpy.restore();			
			
		});
	});
	
	describe("Selecting a region of interest", function() {
		 
		it("Map extent is captured for use in search", function() {			
			
			this.hub.trigger("startup");
			
			var bounds = new OpenLayers.Bounds(-107.203125, 46.796875, -105.796875, 48.203125);
			this.view.map.zoomToExtent(bounds);
			
			expect(this.model.get("left")).toEqual(bounds.left);
			expect(this.model.get("right")).toEqual(bounds.right);
			expect(this.model.get("bottom")).toEqual(bounds.bottom);
			expect(this.model.get("top")).toEqual(bounds.top);
		});
	});
	
	
});