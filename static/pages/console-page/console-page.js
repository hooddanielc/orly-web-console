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

  initialize: function () {
    /* make sure connected is false */
    this.set('connected', false);

    window.orlydbcon = this;

    var self = this;

    this.connection = new WebSocket('ws://' + this.get('host') + ':8082/');

    var pass = 'OrlyDBModel';
    this.connection.addEventListener('open', function (e) {
      self.trigger('open', e);

      if (!self.get('connect')) {
        return;
      }

      self.connect();
    });

    this.connection.addEventListener('close', function (e) {
      self.set('connected', false);
      self.trigger('connection-closed', e);
    });

    this.connection.addEventListener('error', function (e) {
      self.trigger('connection-error', e);
    });

    var messageQueue = [];

    this.connection.addEventListener('message', function (e) {
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
        self.trigger('error', e);
        thisMessage.fnError(obj);
      }

    });

    this.send = function (msg, fn, fnError) {
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

  compile: function (src, fn) {
    var self = this;
    fn = fn || function () {};
    this.trigger('log', '=== attempting to compile === \n\n' + src);
    this.send('compile' + JSON.stringify(src) + ';', function (e) {
      var msg = '=== compiler output ===\n\n';
      if (e.result.status == 'error') {
        msg += '\nCompilation failed\n\n';
        msg += 'kind: ' + e.result.kind;
        msg += 'diagnostics: ' + e.result.diagnostics + '\n';
        self.trigger('log', msg);
        fn(e);
        return;
      }

      msg += 'name: ' + e.result.name + '\n';
      msg += 'version: ' + e.result.version + '\n';
      msg += 'status: ' + e.status + '\n';
      self.trigger('log', msg);
      fn(e);
    });
  },

  installPackage: function (pkg, fn) {
    fn = fn || function () {};
    this.trigger('log', 'attempting to install "' + pkg + '"');
    var self = this;
    this.send('install ' + pkg + ';', function (e) {
      self.trigger('log', 'successfully installed: ' + pkg + '\n\n');
      fn(e);
    }, function (e) {
      self.trigger('log', 'failed package install: ' + pkg + '\n');
      self.trigger('log', 'result: ' + e.result + '\n\n');
      fn(e);
    });
  },

  getPackages: function (fn) {
    fn = fn || function () {};
    this.trigger('log', 'Listing packages..');
    var self = this;
    this.send('list_packages;', function (e) {
      var msg = '\n === Packgages currently installed === \n';

      for (var i in e.result.packages) {
        msg += e.result.packages[i].name + 
        '.' + e.result.packages[i].version + '\n';
      }

      self.trigger('log', msg);
      fn(e);
    });
  },

  execute: function (packageName, functionName, args, fn) {
    fn = fn || function () {};
    var cmd = 'try {' + this.get('pov') + '} ' + packageName + ' ' +
      functionName + ' <{' + args.join(', ') + '}>;';

    this.send(cmd, function (e) {
      fn(e);
    }, function (e) {
      fn(e);
    });
  },

  connect: function () {
    if (this.get('connected') === true) {
      return;
    }

    var self = this;

    this.send('new session;', function(e) {
      self.set('session', e.result);
      self.trigger('new-session', e);
      self.trigger('log', 'received new session: ' + e.result + '  \n\n');
      self.send('new fast private pov;', function(e) {
        self.set('pov', e.result);
        self.trigger('new-pov');
        self.trigger('connected');
        self.trigger('log', 'Received new fast pov: ' + e.result + '\n\n');
        self.trigger('log', 'Congratualations, you are connected \n\n');
      }, function (e) {
        self.trigger('log', 'error trying to get fast private pov');
      });
    }, function (e) {
      self.trigger('log', 'error trying to get new session');
    });
  },

  disconnect: function (msg) {

    if (this.get('connected') !== true) {
      return;
    }

    this.set('session', null);
    this.set('pov', null);

    msg = msg || "manually called disconnected";

    this.trigger('disconnected', msg);
  }

});

app.modules.Page = app.modules.PageBase.extend({

  initializePage: function() {
    this.model.on('log', function (e) {
      console.log(e);
    });
  },

  renderPage: function () {
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
    model: new app.modules.OrlyDBModel({
      connect: true
    })
  });
  page.render();
})();
