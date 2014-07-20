app.modules.OrlyDBModel = Backbone.Model.extend({

  mySentEvents: {},

  defaults: {
    host: location.host,
    port: 1234,
    connected: false,
    session: null,
    messageQueue: [],
    connect: false,
    connected: false
  },

  on: function(msg, fn) {
    
    if (this.connection) {
      this.connection.addEventListener(msg, fn);
    }

    Backbone.Model.prototype.on.call(this);
  },

  initialize: function() {

    /* make sure connected is false */
    this.set('connected', false);

    window.orlydbcon = this;

    var self = this;

    this.connection = new WebSocket('ws://' + this.get('host') + ':8082/');

    var pass = 'OrlyDBModel';
    this.connection.addEventListener('open', function(e) {
      self.trigger('open', e);

      if (!self.get('connect')) {
        return;
      }

      self.connect();
    });

    this.connection.addEventListener('close', function(e) {
      self.set('connected', false);
      self.trigger('connection-closed', e);
    });

    this.connection.addEventListener('error', function(e) {
      self.trigger('connection-error', e);
    });

    var messageQueue = [];

    this.connection.addEventListener('message', function(e) {

      var obj = $.parseJSON(e.data);

      if (messageQueue.length === 0) {
        self.trigger('unexpected_message', obj);
        return;
      }

      var thisMessage = messageQueue.shift();

      if (messageQueue.length > 0) {
        self.connection.send(messageQueue[0]);
      }

      if (obj.status === 'ok') {

        if (thisMessage.fn) {
          thisMessage.fn(obj);  
        }

        return;
      }

      if (thisMessage.fnError) {
        thisMessage.fnError(obj);
      }

    });

    this.send = function(msg, fn, fnError) {

      messageQueue.push({
        msg: msg,
        fn: fn,
        fnError: fnError
      });

      if (messageQueue.length === 1) {
        self.connection.send(msg);
      }
    };

  },

  connect: function() {

    if (this.get('connected') === true) {
      return;
    }

    var self = this;

    this.send('new session;', function(e) {
      self.set('session', e.result);
      self.trigger('connected', e);
    });

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
    var self = this;

    this.model.on('connected', function(e) {
      console.log('CONNECTED: ');
      console.log(this.get('session'));
      console.log(e);
    });

    this.model.on('open', function(e) {
      console.log('CONNECTION-OPEN');
    });

    this.model.on('connection-error', function(e) {
      console.log('CONNECTION ERROR', e);
    });

    this.model.on('connection-closed', function(e) {
      console.log('CONNECTION CLOSED', e);
    });
  }

});

(function() {
  var el = $('<div/>');
  $(document.body).append(el);
  var page = new app.modules.Page({
    el: el,
    model: new app.modules.OrlyDBModel({
      connect: true
    })
  });
  page.render();
})();
