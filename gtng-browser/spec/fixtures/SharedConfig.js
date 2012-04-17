sharedConfig = (function() {

	hub = {};
	_.extend(hub, Backbone.Events);

	model = new Backbone.Model();
	var appConfig = {
			templates: {
				mapTemplate: "<div class='olMapWrapper'></div>",
				mapControlsTemplate:
					  "<div class='panZoom'></div>"
					+ "<div class='scaleLine'></div>"
					+ "<div class='mousePosition'></div>",
				popupTemplate_glimsquery : "<div class='olMapFeaturePopup'>{{glac_id}} - {{glac_name}}</div>",
				popupTemplate_WGI_points : "<div class='olMapFeaturePopup'>{{wgi_glacier_id}} - {{glacier_name}}</div>",
				emptyFeatureResults: "<div class='featureResults'>"
					+ "<p>No results are available at location ({{lat}}, {{lon}}).</p></div>",
				featureResults: "<div class='featureResults'>"
					+ "<p>{{features.length}} features at location ({{lat}}, {{lon}}).</p><div class='resetSearch'>Start a new search.</div></div>",
				featureResultList: "<ul class='featureList'></ul>",
				featureResultItem: "<li class='featureItem'></li>",
				glimsquery : "<h3 class='glacierID'>{{glac_id}} - {{glac_name}}</h3>",
				WGI_points : "<h3 class='glacierID'>{{wgi_glacier_id}} - {{glacier_name}}</h3>"
			}
	};
	model.set({
		"application" : appConfig
	});

	return {
		hub : hub,
		model : model
	};
})();