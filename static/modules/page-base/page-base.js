app.modules.PageBase = Backbone.View.extend({

  initialize: function() {
    this.initializePage();
  },

  render: function () {
    var el = $('<div/>');
    el.html(app.mustache['page-base']);
    $(document.body).append(el);
    this.elContainer = el.find('.page-base-content-wrapper');
    this.renderPage();
  },

  initializePage: function() {}, // virtual void
  renderPage: function() {}, // virtual void

});
