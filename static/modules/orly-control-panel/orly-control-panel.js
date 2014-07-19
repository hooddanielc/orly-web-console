app.modules.ControlPanelView = Backbone.View.extend({

  render: function() {
    this.$el.html(app.mustache['orly-control-panel']);

    // render the orly editor
    this.editor = new app.modules.OrlyEditor({
      el: this.$el.find('.orly-editor-wrapper'),
      model: new app.modules.OrlyEditorModel()
    });

    this.editor.render();
  }

});
