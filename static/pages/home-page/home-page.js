app.modules.HomePage = app.modules.PageBase.extend({

  initializePage: function() {
    console.log('initializePage');
  },

  renderPage: function() {
    console.log('renderPage');
  }

});

(function() {
  var el = $('<div/>');
  $(document.body).append(el);
  var page = new app.modules.HomePage({
    el: el,
    model: new Backbone.Model()
  });
  page.render();
})();
