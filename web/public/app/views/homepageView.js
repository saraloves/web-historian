var HomepageView = Backbone.View.extend({
  el: '#archived ul',

  template: _.template('<li><a href="/<%=website%>"><%= website %></a></li>'),

  initialize: function(){
    this.render();
  },

  render: function (){
    this.collection.each(function(websiteListingModel){
      this.$el.append(this.template({ website: websiteListingModel.get('url')}));
    }, this);
  }
});