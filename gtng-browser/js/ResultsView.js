var ResultsView = Backbone.View.extend({

    initialize: function() {
        this.model.bind('change', this.render, this);
      },
      
	render : function() {
		$(this.el).html(JSON.stringify(this.model.get("features")));
		return this;
	}

});