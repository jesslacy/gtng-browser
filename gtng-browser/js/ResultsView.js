var ResultsView = Backbone.View.extend({
	
	initialize : function() {		
		this.bindHandlersToEvents();
	},
	
	bindHandlersToEvents: function() {
		this.options.eventHub.bind("doSearch", this.doSearch, this);
	},
	
	doSearch: function() {
		
	}
	
});