describe("SearchView", function() {
	beforeEach(function() {
		this.hub = {};
		_.extend(this.hub, Backbone.Events);
		
		this.view = new SearchView({eventHub: this.hub});
	});

	describe("Creating the search overview", function() {
		it("Contains a button for showing results", function() {
			expect(this.view.$(".ui-button")).toExist();
		});
	});
	
	it("Triggers an event when the search is clicked", function() {
		var searchSpy = sinon.spy();
		this.hub.bind("doSearch", searchSpy);	
		
		this.view.$(".ui-button").click();
		expect(searchSpy).toHaveBeenCalledOnce();	
	});
});