app.modules.Page = app.modules.PageBase.extend({

  renderPage: function() {
    this.elContainer.html(app.mustache['home-page']);
  }

});

(function() {
  var el = $('<div/>');
  $(document.body).append(el);
  var page = new app.modules.Page({
    el: el,
    model: new Backbone.Model()
  });
  page.render();
})();
