app.modules.OrlyEditorModel = Backbone.Model.extend({
  
  defaults: {
    source: 'hello = "hello world";'
  },

});

app.modules.OrlyEditor = Backbone.View.extend({

  render: function() {
    this.$el.html(app.mustache['orly-editor']);

    this.cm = CodeMirror(this.$el.find('.orly-editor')[0], {
      lineNumbers: true,
      matchBrackets: true,
      mode: 'text/x-c++src',
      styleActiveLine: true,
      theme: 'solarized',
      value: this.model.get('source'),
      extraKeys: {
        F11: function(cm) {
          cm.setOption('fullScreen', !cm.getOption('fullScreen'));
        },
        Esc: function(cm) {
          if (cm.getOption('fullScreen')) {
            cm.setOption('fullScreen', false);
          }  // if
        },
        Tab: function(cm) {
          var spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
          cm.replaceSelection(spaces);
        },
      }
    });

  }

});
