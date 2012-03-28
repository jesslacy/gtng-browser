describe("ResultsView", function() {
	beforeEach(function() {
		this.hub = {};
		_.extend(this.hub, Backbone.Events);
		this.model = new Backbone.Model();		
		this.view = new ResultsView({eventHub: this.hub, model: this.model});
	});
	
	it("Begins search when search button is clicked", function() {
		var searchSpy = sinon.spy(this.view, "doSearch");
		
		// Re-run handler binding so that spy is bound to spy version of the onStartup
		this.view.bindHandlersToEvents();		
		
		this.hub.trigger("doSearch");
		
		expect(searchSpy).toHaveBeenCalledOnce();	
		searchSpy.restore();
	});
	
	describe("Searching", function() {
		it("Gets results from attached layers", function() {
			
		});
	});
	
});
