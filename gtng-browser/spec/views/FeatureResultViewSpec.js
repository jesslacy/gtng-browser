describe("FeatureResultView", function() {
	beforeEach(function() {
		this.hub = sharedConfig.hub;
		this.model = new Backbone.Model({feature: icelandGlacier[0]});	
		
		this.view = new FeatureResultView({
			tagName: "li",
			eventHub : this.hub,
			model : this.model,
			template: "<h3 class='glacierID'>{{glac_id}} - {{glac_name}}</h3>" 
		});
		this.view.render();
	});
	
	it("Displays a single feature", function() {
		expect($(this.view.el).html()).toContain('<h3 class="glacierID">G341164E64838N - Hofsjokull</h3>');
	});
	
	it("Sends a message when user moves mouse over item", function() {
		var spy = sinon.spy();
		this.hub.bind("showFeature", spy);	
		$(this.view.el).mouseover();
		expect(spy).toHaveBeenCalled();
	});
	
});
