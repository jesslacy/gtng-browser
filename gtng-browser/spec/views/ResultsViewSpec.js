describe("ResultsView", function() {
	beforeEach(function() {
		this.hub = {};
		_.extend(this.hub, Backbone.Events);
		this.model = new Backbone.Model();		
		this.view = new ResultsView({eventHub: this.hub, model: this.model});
	});
	
	it("Displays list of map features", function() {
		this.model.set({results: {features: icelandGlacier}});
		expect($(this.view.el).html()).toContain("G341164E64838N");
	});
});
