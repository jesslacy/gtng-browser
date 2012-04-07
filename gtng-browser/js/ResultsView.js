var ResultsView = Backbone.View.extend({

	initialize : function() {
		this.createRenderTemplate();		
		this.model.bind('change', this.render, this);
	},
      
	render : function() {
		var results = this.model.get("results");
		if (results) {
			var resultsHtml = this.resultTemplate(results);
			$(this.el).html(resultsHtml);
		}
		return this;
	},
	
	events: {
	      "click .featureHandle"   : "showFeature",
	},
	
	createRenderTemplate: function() {
		var glimsSource = ""
			+ "<h3 class='glacierID'>{{data.glac_id}} - {{data.glac_name}}</h3>"
			+ "<p class='glacierSummary'>Acquired {{data.image_date}} by {{data.anlst_givn}} {{data.anlst_surn}}, {{data.anlst_affl}}</p>"
			+ "<p class='glacierLinks'><a target='glims' href='http://glims.colorado.edu/php_utils/glacier_info.php?anlys_id={{data.anlys_id}}'>GLIMS Database</a></p>";
		this.glimsTemplate = Handlebars.compile(glimsSource);
		
		var wgiSource = ""
			+ "<h3 class='glacierID'>{{data.wgi_glacier_id}} - {{data.glacier_name}}</h3>"
			+ "<p class='glacierSummary'>Located at ({{data.lat}},{{data.lon}}). Elevation range is {{data.min_elev}}m to {{data.max_elev}}m.  Total area is {{data.total_area}}sq/km.</p>";
		this.wgiTemplate = Handlebars.compile(wgiSource);
		
		var fogSource = "";
		this.fogTemplate = Handlebars.compile(fogSource);
		
		var that = this;
		Handlebars.registerHelper('feature', function(feature) {
			switch (feature.type) {
			case "glimsquery":
				return that.glimsTemplate(feature);
				break;
			case "WGI_points":
				return that.wgiTemplate(feature);
				break;
			case "FOG_points":
				return that.fogTemplate(feature);
				break;
			}
		} );
		
		var resultSource = "<div class='featureResults'>"
				+ "<p>{{features.length}} features: </p>"
				+ "<ul class='featureList'>{{#features}}"
				+   "<li class='featureResult type_{{type}}'><div class='featureHandle'><div class='featureLegend'></div><a href='#'>Show</a></div><div class='featureContainer'>{{{feature this}}}</div></li>"
				+ "{{/features}}</ul></div>";
		this.resultTemplate = Handlebars.compile(resultSource);
	},
	
	showFeature: function(event)
	{
		event.stopPropagation();
		console.log("fired", $(event.target).find("a").attr("href"));
		this.options.eventHub.trigger("showFeature");
	}
});