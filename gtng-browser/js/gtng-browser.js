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
			var appConfig = {
					templates: {
						mapTemplate: "<div class='olMapWrapper'></div>",
						mapControlsTemplate:
							  "<div class='panZoom'></div>"
							+ "<div class='scaleLine'></div><div class='helpText'>Click on the map to search:</div>"
							+ "<div class='mousePosition'></div>",
						popupTemplate_glimsquery : "<div class='olMapFeaturePopup'>{{glac_id}} - {{glac_name}}</div>",
						popupTemplate_WGI_points : "<div class='olMapFeaturePopup'>{{wgi_glacier_id}} - {{glacier_name}}</div>",
						popupTemplate_FOG_points : "<div class='olMapFeaturePopup'>{{WGMS_ID}} - {{NAME}}</div>",
						emptyFeatureResults: "<div class='featureResults'>"
							+ "<p>No results are available at location ({{lat}}, {{lon}}). Please try clicking again.</p></div>",
						featureResults: "<div class='featureResults'>"
							+ "<p>Number of features at location ({{lat}}, {{lon}}):  {{features.length}}</p><div class='resetSearch'>Start a new search.</div></div>",
						featureResultList: "<div class='featureResultContainer'><table class='featureResults'></table></div>",
						featureResultItem: "<tr class='featureItem'></tr>",
						header_glimsquery: "<tr><td><table class='featureList'><tr>"
                            + "<th colspan='9' class='res_sect_head'><a href='http://glims.colorado.edu:8080/glacierdata/' target='_blank'>GLIMS Glacier Database</a></th></tr><tr>"
							+ '<th></th>'
							+ '<th><a target="_blank" ,="" href="http://www.glims.org/MapsAndDocs/DB/GLIMS_DD_20050602.html#Glacier_Static">Glacier Name</a></th>'
							+ '<th><a target="_blank" ,="" href="http://www.glims.org/MapsAndDocs/DB/GLIMS_DD_20050602.html#Glacier_Static">Glacier ID</a></th>'
							+ '<th><a target="_blank" ,="" href="http://www.glims.org/MapsAndDocs/DB/GLIMS_DD_20050602.html#Image">Acquisition Date</a></th>'
							+ '<th><a target="_blank" ,="" href="http://www.glims.org/MapsAndDocs/DB/GLIMS_DD_20050602.html#Glacier_Dynamic">Analysis ID</a></th>'
							+ '<th><a target="_blank" ,="" href="http://www.glims.org/MapsAndDocs/DB/GLIMS_DD_20050602.html#Glacier_Dynamic">Analyst Name</a></th>'
							+ '<th><a target="_blank" ,="" href="http://www.glims.org/MapsAndDocs/DB/GLIMS_DD_20050602.html#Institution">RC Institution</a></th>'
							+ '<th><a target="_blank" ,="" href="http://www.glims.org/MapsAndDocs/DB/GLIMS_DD_20050602.html#Package_Info">Date Available</a></th>'
							+ '<th>More Info</th>'
							+ "</tr></table></td></tr>",
						row_glimsquery : "<td><div class='featureLegend'>&nbsp;</div></td><td>{{glac_id}}</td><td>{{glac_name}}</td><td>{{image_date}}</td><td>{{anlys_id}}</td><td>{{anlst_givn}} {{anlst_surn}}</td><td>{{anlst_affl}}</td><td>{{release_date}}</td>"
							+ '<td><center><a target="_blank" href="http://glims.colorado.edu/php_utils/glacier_info.php?anlys_id={{anlys_id}}">More...</a></center></td>',
						header_FOG_points: "<tr><td><table class='featureList'><thead><tr>"
                            + "<th colspan='16' class='res_sect_head'><a href='http://www.wgms.ch/dataexp.html' target='_blank'>Fluctuations of Glaciers database</a></th></tr><tr>"
							+ '<th></th>'
							+ '<th><a title="Political Unit" alt="Political Unit" target="_blank" href="http://glims.colorado.edu/glacierdata/info/wgms_layer.html">Political Unit</a></th>'
							+ '<th><a title="Local PSFG code" alt="Local PSFG code" target="_blank" href="http://glims.colorado.edu/glacierdata/info/wgms_layer.html">Local PSFG code</a></th>'
							+ '<th><a title="World Glacier Monitorinig Service ID" alt="World Glacier Monitorinig Service ID" target="_blank" href="http://glims.colorado.edu/glacierdata/info/wgms_layer.html">WGMS ID</a></th>'
							+ '<th><a title="Glacier Name" alt="Glacier Name" target="_blank" href="http://glims.colorado.edu/glacierdata/info/wgms_layer.html">Glacier Name</a></th>'
							+ '<th><a title="Approximate geographic location" alt="Approximate geographic location" target="_blank" href="http://glims.colorado.edu/glacierdata/info/wgms_layer.html">General location</a></th>'
							+ '<th><a title="More specific geographic location" alt="More specific geographic location" target="_blank" href="http://glims.colorado.edu/glacierdata/info/wgms_layer.html">Specific location</a></th>'
							+ '<th><a title="Latitude" alt="Latitude" target="_blank" href="http://glims.colorado.edu/glacierdata/info/wgms_layer.html">Latitude</a></th>'
							+ '<th><a title="Longitude" alt="Longitude" target="_blank" href="http://glims.colorado.edu/glacierdata/info/wgms_layer.html">Longitude</a></th>'
							+ '<th><a title="Front variation, first reference year" alt="Front variation, first reference year" target="_blank" href="http://glims.colorado.edu/glacierdata/info/wgms_layer.html">FV_1stRY</a></th>'
							+ '<th><a title="Front variation, first survey year" alt="Front variation, first survey year" target="_blank" href="http://glims.colorado.edu/glacierdata/info/wgms_layer.html">FV_1stSY</a></th>'
							+ '<th><a title="Front variation, last survey year" alt="Front variation, last survey year" target="_blank" href="http://glims.colorado.edu/glacierdata/info/wgms_layer.html">FV_LastSY</a></th>'
							+ '<th><a title="Front variation, number of observations" alt="Front variation, number of observations" target="_blank" href="http://glims.colorado.edu/glacierdata/info/wgms_layer.html">FV_NoObs</a></th>'
							+ '<th><a title="Mass balance, first survey year" alt="Mass balance, first survey year" target="_blank" href="http://glims.colorado.edu/glacierdata/info/wgms_layer.html">MB_1stSY</a></th>'
							+ '<th><a title="Mass balance, last survey year" alt="Mass balance, last survey year" target="_blank" href="http://glims.colorado.edu/glacierdata/info/wgms_layer.html">MB_LastSY</a></th>'
							+ '<th><a title="Mass balance, number of observations" alt="Mass balance, number of observations" target="_blank" href="http://glims.colorado.edu/glacierdata/info/wgms_layer.html">MB_NoObs</a></th>'
							+"</tr></thead></table></td></tr>",
						row_FOG_points: "<td><div class='featureLegend'>&nbsp;</div></td><td>{{PU}}</td><td>{{LOCAL_PSFG}}</td><td>{{WGMS_ID}}</td><td>{{NAME}}</td>"
							+ "<td>{{GEN_LOC}}</td><td>{{SPEC_LOC}}</td><td>{{LATITUDE}}</td><td>{{LONGITUDE}}</td>"
							+ "<td>{{FV_1STRY}}</td><td>{{FV_1STSY}}</td><td>{{FV_LASTSY}}</td><td>{{FV_NOOBS}}</td>"
							+ "<td>{{MB_1STSY}}</td><td>{{MB_LASTSY}}</td><td>{{MB_NOOBS}}</td>",
						row_WGI_points : "<td><div class='featureLegend'>&nbsp;</div></td><td>{{political_unit}}</td><td>{{glacier_name}}</td><td>{{glacier_name}}</td><td>{{glacier_name}}</td>"
							+ "<td>{{glacier_name}}</td><td>{{glacier_name}}</td><td>{{glacier_name}}</td><td>{{glacier_name}}</td>" 
							+ "<td>{{glacier_name}}</td><td>{{glacier_name}}</td><td>{{glacier_name}}</td>",
						header_WGI_points: "<tr><td><table class='featureList'><thead><tr>"
                            + "<th colspan='16' class='res_sect_head'><a href='http://nsidc.org/data/g01130.html' target='_blank'>World Glacier Inventory</a></th></tr><tr>"
							+ '<th></th>'
							+ '<th>Glacier Name</th>'
							+ '<th>WGI Glacier ID</th>'
							+ '<th>Political Unit</th>'
							+ '<th>Latitude</th>'
							+ '<th>Longitude</th>'
							+ '<th>Max. Elevation, m</th>'
							+ '<th>Mean Elevation, m</th>'
							+ '<th>Min. Elevation, m</th>'
							+ '<th>Class</th>'
							+ '<th>Form</th>'
							+ '<th>Front</th>'
							+ '<th>Longitudinal Profile</th>'
							+ '<th>Tongue Activity</th>'
							+ '<th>Source</th>'
							+ '<th>Total Area, km<sup>2</sup></th>'
							+"</tr></thead></table></td></tr>",
						row_WGI_points : "<td><div class='featureLegend'>&nbsp;</div></td><td>{{glacier_name}}</td><td>{{wgi_glacier_id}}</td><td>{{political_unit}}</td>"
							+ "<td>{{lat}}</td><td>{{lon}}</td><td>{{max_elev}}</td><td>{{mean_elev}}</td>" 
							+ "<td>{{min_elev}}</td><td>{{primary_class}}</td><td>{{form}}</td>"
							+ "<td>{{frontal_char}}</td><td>{{longi_profile}}</td><td>{{tongue_activity}}</td>"
							+ "<td>{{source_nourish}}</td><td>{{total_area}}</td>"
				
					}
			};
			this.features.set({"application": appConfig});
			
			this.mapView = new MapView({
				el: "#container",
				model: this.features,
				eventHub: this.eventHub,
				mapOptions: {lat: 0, lon: 0, zoom: 0}
			});
			this.mapView.render();
			
			this.resultsView = new ResultsView({
				el: "#results",
				model: this.features,
				eventHub: this.eventHub,
				template:  "<div class='featureResults'>"
					+ "<p>{{features.length}} features: </p>"
					+ "<ul class='featureList'></ul></div>"
			});
			
		},
		
		addMapBaseLayers: function() {
			var bluemarble = new OpenLayers.Layer.WMS(
                    "MODIS Blue Marble",
                    "http://nsidc.org/api/ogc/nsidc_ogc_global",
                    {
                      layers: "blue_marble_07"
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
                "http://glims.colorado.edu:8080/cgi-bin/glims_ogc?",
                {
                  layers:"glims_glaciers",
                  format:'image/png',
                  transparent:true,
                  isBaseLayer: false
                });

             var wgi_glims = new OpenLayers.Layer.WMS(
                 "World Glacier Inventory",
                 "http://glims.colorado.edu:8080/cgi-bin/glims_ogc?",
                 {
                   layers:"WGI_points",
                   transparent:true,
                   format:'image/png'
                 });
             
             var fog_points = new OpenLayers.Layer.WMS(
                 "Fluctuations of Glaciers Metadata",
                 "http://glims.colorado.edu:8080/cgi-bin/glims_ogc?",
                 {
                   layers:"FOG_points",
                   transparent:true,
                   format:'image/png'
                 });

             var query = new OpenLayers.Layer.WMS(
                     "Query",
                     "http://glims.colorado.edu:8080/cgi-bin/glims_ogc",
                     {
                       layers:"glims_glacier_query,FOG_points,WGI_points",
                       format:'image/png',
                       transparent: true,
                       isBaseLayer: false
                     }, 
                     {
                    	 visible: false,
                    	 displayInLayerSwitcher: false
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
