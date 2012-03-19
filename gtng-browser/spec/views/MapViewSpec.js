describe("OpenLayersMapView", function() {
	beforeEach(function() {
		this.mapOptions = {lat: 40, lon: -123, zoom: 3};
		
		this.hub = {};
		_.extend(this.hub, Backbone.Events);
		
		this.view = new MapView({eventHub: this.hub, mapOptions: this.mapOptions});
		
	});

	describe("Instantiating the map", function() {

		it("Contains an open layers map", function() {
			expect(this.view.el.nodeName).toEqual("DIV");
		});

		it("creates map when startup event triggered", function() {
			var startupSpy = sinon.spy(this.view, "onStartup");
			
			// Re-run handler binding so that spy is bound to spy version of the onStartup
			this.view.bindHandlersToEvents();		
			
			expect($(this.view.el)).not.toContain("olMapViewport");
			
			this.hub.trigger("startup");
			
			expect(startupSpy).toHaveBeenCalledOnce();			
			expect($(this.view.el).html()).toContain("olMapViewport");
			
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

	describe("Enable styling of the map", function() {
		it("should have a class defined", function() {			
			expect($(this.view.el)).toHaveClass('openLayersMapWrapper');
		});
	});
	
	describe("A base layer in the map", function() {
		
		it("can set as default", function() {			
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
	
});