var ResultsView = Backbone.View.extend({

	events: {
	      "click .resetSearch" : "resetSearch"
	},
	
	initialize : function() {
		var config = this.model.get("application");
		this.templates = config.templates;

		this.resultTemplate = Handlebars.compile(config.templates.featureResults);
		this.emptyResultsTemplate = Handlebars.compile(config.templates.emptyFeatureResults);
		this.listTemplate = Handlebars.compile(config.templates.featureResultList);
		this.itemTemplate = Handlebars.compile(config.templates.featureResultItem);
		this.templates["header_glimsquery"] =  Handlebars.compile(config.templates.header_glimsquery);
		this.templates["header_WGI_points"] =  Handlebars.compile(config.templates.header_WGI_points);
		this.model.bind('change', this.render, this);
	},

	render : function() {
		$(this.el).removeClass("resultsFound");
		var results = this.model.get("results");
		if (!results || !results.features ) {
			$(this.el).html("");
		} else if (results.features.length > 0) {
			$(this.el).addClass("resultsFound");
			var resultEl = $(this.resultTemplate(results));
			$(this.el).html(resultEl);
			this.$(".resetSearch").button();
			
			var featureListEl = $(this.listTemplate(results));
			resultEl.append(featureListEl);
			
			var featuresByType = _.groupBy(results.features, function(f){ return f.type; });
			var that = this;
			_.each(featuresByType, function(features, type) {
				var categorizedItemsEl = $(that.templates["header_"+type]());
				$(".featureResults", featureListEl).append(categorizedItemsEl);
				_.reduce(features, that.appendFeature, $(".featureList", categorizedItemsEl), that);
			});
			
		} else {
			$(this.el).html(this.emptyResultsTemplate(results));
		}

		return this;
	},

	appendFeature : function(listEl, feature) {
		var listItemEl = $(this.itemTemplate());
		listItemEl.addClass("type_"+feature.type);
		
		var featureView = new FeatureResultView({
			el : listItemEl.get(0),
			eventHub : this.options.eventHub,
			template : this.templates["row_"+feature.type],
			model : new Backbone.Model({
				feature : feature
			})
		});

		featureView.render();
		listEl.append(listItemEl);

		return listEl;
	},
	
	resetSearch: function() {
		this.model.set({results: {}});
		this.options.eventHub.trigger("resetMap");
	}
});