$(document).ready(function() {
	$(function() {
		gtngBrowser.createViews();
		gtngBrowser.addMapBaseLayers();	
		gtngBrowser.addMapOverlayLayers();	
		gtngBrowser.startApplication();	
	});
	
	var gtngBrowser = {
			mapView: null,
			eventHub: null,
	
			createViews: function () {
			this.eventHub = {};
			_.extend(this.eventHub, Backbone.Events);
			this.features = new Backbone.Model();
			this.mapView = new MapView({
				el: "#container",
				model: this.features,
				eventHub: this.eventHub,
				mapOptions: {lat: 47, lon: 8, zoom: 3}
			});
			this.mapView.render();
			
			this.resultsView = new ResultsView({
				el: "#results",
				model: this.features,
				eventHub: this.eventHub
			});
			
		},
		
		addMapBaseLayers: function() {
			var bluemarble = new OpenLayers.Layer.WMS(
                    "MODIS Blue Marble",
                    "http://glims.org/cgi-bin/tilecache-2.01/tilecache.cgi?",
                    {
                      layers: "MODIS_Blue_Marble"
                    }); 
			this.mapView.addLayer(bluemarble);
			
		},
		
		addMapOverlayLayers: function() {

			var countries  = new OpenLayers.Layer.WMS (
	            "Countries",
	            "http://glims.org/cgi-bin/tilecache-2.01/tilecache.cgi?",
	             {
	               layers: "Country_Outlines",
	               format:'image/png',
	               transparent:true,
	               isBaseLayer: false
	             }); 
			
			 glims_glaciers = new OpenLayers.Layer.WMS(
                "GLIMS Glaciers",
                "http://glims.colorado.edu/cgi-bin/glims_ogc?",
                {
                  layers:"glims_glaciers",
                  format:'image/png',
                  transparent:true,
                  isBaseLayer: false
                });

             var wgi_glims = new OpenLayers.Layer.WMS(
                 "World Glacier Inventory",
                 "http://localhost/glims/cgi-bin/glims_ogc?",
                 {
                   layers:"WGI_points",
                   transparent:true,
                   format:'image/png'
                 });
             
             var fog_points = new OpenLayers.Layer.WMS(
                 "Fluctuations of Glaciers Metadata",
                 "http://localhost/glims/cgi-bin/glims_ogc?",
                 {
                   layers:"FOG_points",
                   transparent:true,
                   format:'image/png'
                 });

             var query = new OpenLayers.Layer.WMS(
                     "Query",
                     "http://localhost/glims/cgi-bin/glims_ogc",
                     {
                       layers:"glims_glacier_query,FOG_query,WGI_points",
                       format:'image/png',
                       transparent: true,
                       isBaseLayer: false
                     }, 
                     {
                    	 visible: false
                     }
                 );

		            
			this.mapView.addLayers([                    
                 countries,
                 glims_glaciers,
                 fog_points,
                 wgi_glims,
                 query
             ]);
		},
		
		startApplication: function() {
			this.eventHub.trigger("startup");
		}
	};
});