var FeatureResultView = Backbone.View.extend({
	
	events: {
	      "mouseover" : "showFeature",
	      "mouseout" : "hideFeature",
	},
	
	initialize : function(o) {	
		this.template = Handlebars.compile(o.template);
	},
	
	render : function() {
		var feature = this.model.get("feature");
		var resultsHtml = this.template(feature.data);
		$(this.el).append(resultsHtml);
		
		return this;
	},
	
	showFeature: function(event)
	{
		this.options.eventHub.trigger("showFeature", this.model.get("feature"));
		event.stopPropagation();
	},
	
	hideFeature: function(event)
	{
		this.options.eventHub.trigger("hideFeature", this.model.get("feature"));
		event.stopPropagation();
	}
	
});