app.modules.HomePage = app.modules.PageBase.extend({

  renderPage: function() {
    this.elContainer.html(app.mustache['console-page']);
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
