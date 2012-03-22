var SearchView = Backbone.View.extend({
	
	initialize : function() {	
		$(this.el).append("<button>Show search results</button>");
		this.$('button').button();
		
		var hub = this.options.eventHub;
		this.$('button').click(function() {
			hub.trigger("doSearch");
		});
		
	},
	
});