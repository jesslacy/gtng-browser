var MapView = Backbone.View.extend({

	initialize : function() {
		this.compileTemplates();
		this.bindHandlersToEvents();
		this.setupResizableContainer();
		this.createOLMap();
	},

	compileTemplates : function() {
		var config = this.model.get("application");
		this.popupTemplate_glimsquery = Handlebars.compile(config.templates.popupTemplate_glimsquery);
		this.popupTemplate_WGI_points = Handlebars.compile(config.templates.popupTemplate_WGI_points);
		this.popupTemplate_FOG_points = Handlebars.compile(config.templates.popupTemplate_FOG_points);
		this.mapTemplate = Handlebars.compile(config.templates.mapTemplate);
		this.controlsTemplate = Handlebars.compile(config.templates.mapControlsTemplate);
	},

	bindHandlersToEvents : function() {
		this.options.eventHub.bind("startup", this.onStartup, this);
		this.options.eventHub.bind("showFeature", this.showFeature, this);
		this.options.eventHub.bind("hideFeature", this.hideFeature, this);
		this.options.eventHub.bind("resetMap", this.resetMap, this);
	},

	setupResizableContainer : function() {
		$(this.el).css({height: this.getInitialHeight(), width: this.getInitialWidth()});

		$(this.el).resizable({
			// animate: don't use until the UI code calls the stop event
			// after the animation has completed. Otherwise, map
			// updateSize is
			// called too early
			helper : "ui-resizable-helper",
			containment : "document"
		});
		var context = this;
		$(this.el).bind('resizestop', function() {
			context.onResize(this);
		});

	},

	getInitialHeight : function() {
		return Math.floor($(window).height() * .6);
	},

	getInitialWidth : function() {
		return Math.floor($(window).width() * .8);
	},

	getZoomedHeight : function() {
		return "200px";
	},

	getZoomedWidth : function() {
		return "300px";
	},

	onStartup : function() {
		var el$ = $(this.el);
		var olMapWrapper = $(this.mapTemplate());
		el$.append(olMapWrapper);
		
		var olControlsWrapper = $(this.controlsTemplate());
		el$.append(olControlsWrapper);
		
		var options = this.options.mapOptions;

		var queryLayer = this.map.getLayersBy('name', 'Query')[0];
		var featureControl = new OpenLayers.Control.WMSGetFeatureInfo({
			url : queryLayer.url,
			title : 'Identify	 features by clicking',
			layers : [ queryLayer ],
			infoFormat : "application/vnd.ogc.gml",
			maxFeatures: 25,
			queryVisible : false
		});
		featureControl.events.register("getfeatureinfo", this,this.onGetFeatureInfo);
		this.map.addControl(featureControl);
		
		this.map.addControl(new OpenLayers.Control.Navigation());
		this.map.addControl(new OpenLayers.Control.PanZoomBar({div: el$.find(".panZoom").get(0)}));
		this.map.addControl(new OpenLayers.Control.ScaleLine({div: el$.find(".scaleLine").get(0)}));
		this.map.addControl(new OpenLayers.Control.MousePosition({div: el$.find(".mousePosition").get(0)}));

		this.map.render(olMapWrapper.get(0));
		this.map.setCenter(new OpenLayers.LonLat(options.lon,
				options.lat), options.zoom);

		this.map.events.register("moveend", this, this.refreshExtent);
		featureControl.activate();
	},

	createOLMap : function() {
		OpenLayers.Popup.FramedCloud.panMapIfOutOfView = false;
		this.map = new OpenLayers.Map({
			controls : [],
			numZoomLevels : 9,
			maxResolution: 0.3515625,
            units: "degrees"
		});
		window.map = this.map;
		
	},

	onResize : function(domElement) {
		this.map.size = new OpenLayers.Size($(domElement).width(),
				$(domElement).height());
		this.map.updateSize();
	},

	refreshExtent : function(event) {
		var bounds = event.object.getExtent();
		this.model.set({
			"left" : bounds.left
		});
		this.model.set({
			"right" : bounds.right
		});
		this.model.set({
			"bottom" : bounds.bottom
		});
		this.model.set({
			"top" : bounds.top
		});
	},

	onGetFeatureInfo : function(event) {
		this.clearMapPopups();
		
		if ( this.zoomed !== true && event.features.length > 0) {
			this.zoomed = true;
			var bounds = _.reduce(event.features, function(b, feature) {
				b.extend(feature.bounds);
				return b;
			}, new OpenLayers.Bounds() );
			
			var map = this.map;
			$(this.el).animate( {width: this.getZoomedWidth(), height: this.getZoomedHeight(), marginLeft: "62%"}, 1000, function() {
				map.updateSize();
				map.zoomToExtent(bounds, true);
			} );
		}
		
		var lonlat = this.map.getLonLatFromViewPortPx(event.xy);
		this.model.set({
			results : {
				features : event.features,
				lat : lonlat.lat,
				lon : lonlat.lon
			}
		});
		
	},

	addLayer : function(layer) {
		this.map.addLayer(layer);
	},

	addLayers : function(layers) {
		this.map.addLayers(layers);
	},

	showFeature : function(feature) {
		var bbox = feature.bounds;
		var location = new OpenLayers.Bounds(bbox.left, bbox.bottom,bbox.right, bbox.top);
		var popup = new OpenLayers.Popup.FramedCloud("popup", location.getCenterLonLat(), 
				null, this["popupTemplate_"+feature.type](feature.data), null, false);
		this.map.addPopup(popup);
	},
	
	hideFeature : function(feature) {
		this.clearMapPopups();
	},
	
	resetMap : function() {
		this.zoomed = false;
		this.clearMapPopups();
		
		var map = this.map, options = this.options.mapOptions;
		
		$(this.el).animate( {width: this.getInitialWidth(), height: this.getInitialHeight(), marginLeft: "0"}, 1000, function() {
			map.updateSize();
			map.setCenter(new OpenLayers.LonLat(options.lon,options.lat), options.zoom);
		} );
	},

	clearMapPopups : function() {
		while (this.map.popups.length > 0) {
			this.map.removePopup(this.map.popups[0]);
		}
	}

});
