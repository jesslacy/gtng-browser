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
			
			this.mapView = new MapView({
				el: "#container",
				model: new Backbone.Model(),
				eventHub: this.eventHub,
				mapOptions: {lat: 47, lon: 8, zoom: 3}
			});
			this.mapView.render();
			
			/*
			this.searchView = new SearchView({
				el: "#container",
				eventHub: this.eventHub
			});
			this.searchView.render();
			*/
		},
		
		addMapBaseLayers: function() {
			/*var openaerial = new OpenLayers.Layer.WMS(
                    "Open Aerial Map",
                    "http://glims.org/cgi-bin/tilecache-2.01/tilecache.cgi?",
                    {
                      layers: "open_aerial_map"
                    }); 
			this.mapView.addLayer(openaerial);
			*/
			/* Currently supporting a single base layer */
			var bluemarble = new OpenLayers.Layer.WMS(
                    "MODIS Blue Marble",
                    "http://glims.org/cgi-bin/tilecache-2.01/tilecache.cgi?",
                    {
                      layers: "MODIS_Blue_Marble"
                    }); 
			this.mapView.addLayer(bluemarble);
			/*
			var vmap0 = new OpenLayers.Layer.WMS(
                    "Metacarta's VMAP0 basemap",
                    "http://glims.org/cgi-bin/tilecache-2.01/tilecache.cgi?",
                    {
                      layers: "vmap0"
                    }); 
            */
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
                 "http://glims.colorado.edu/cgi-bin/glims_ogc?",
                 {
                   layers:"WGI_points",
                   transparent:true,
                   format:'image/png'
                 });
             
             var fog_points = new OpenLayers.Layer.WMS(
                 "Fluctuations of Glaciers Metadata",
                 "http://glims.colorado.edu/cgi-bin/glims_ogc?",
                 {
                   layers:"FOG_points",
                   transparent:true,
                   format:'image/png'
                 });

             var query = new OpenLayers.Layer.WMS(
                     "Query",
                     "http://localhost/glims/cgi-bin/glims_ogc",
                     {
                       layers:"glims_glacier_query,FOG_query,WGI_query",
                       format:'image/png',
                       transparent: true,
                       isBaseLayer: false
                     }, {
                    	 visible: false
                     }
                 );
		            
			this.mapView.addLayers([                    
                 countries,
                 wgi_glims,
                 fog_points,
                 glims_glaciers,
                 query
             ]);
		},
		
		startApplication: function() {
			this.eventHub.trigger("startup");
		}
	};
});