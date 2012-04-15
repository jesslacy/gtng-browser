describe("ResultsView", function() {
	beforeEach(function() {
		this.hub = sharedConfig.hub;
		this.model = sharedConfig.model;
		this.view = new ResultsView({eventHub: this.hub, model: this.model});
	});
	
	it("Displays list of map features", function() {
		this.model.set({results: {features: icelandGlacier}});
		expect($(this.view.el).html()).toContain("G341164E64838N");
		expect($(this.view.el).html()).toContain("IS4V00000003");
	});
	
	it("A message is displayed when there are no results.", function() {
		this.model.set({results: {features: []}});
		expect($(this.view.el).html()).toContain("No results are available at location");
	});
	
});
