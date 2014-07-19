app.modules.OrlyDBModel = Backbone.Model.extend({

  defaults: {
    host: location.host,
    port: 1234
  },

  initialize: function() {
    console.log('initialize orly db');
  }

});

app.modules.Page = app.modules.PageBase.extend({

  renderPage: function() {
    // render base html
    this.elContainer.html(app.mustache['console-page']);

    // render control panel
    this.controlPanel = new app.modules.ControlPanelView({
      el: this.elContainer.find('.control-panel-container'),
      model: new Backbone.Model()
    });

    this.controlPanel.render();
  }

});

(function() {
  var el = $('<div/>');
  $(document.body).append(el);
  var page = new app.modules.Page({
    el: el,
    model: new app.modules.OrlyDBModel()
  });
  page.render();
})();
