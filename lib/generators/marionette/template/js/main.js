(function () {
  var root = this;
  var geo = {};

  var App = root['<%= appname %>'] = new Marionette.Application();

  App.addRegions({
    'mainRegion': '#main'
  });

  App.module('<%= appname %>', function (Module, App, Backbone, Marionette, $, _) {
    var ExampleView = Marionette.ItemView.extend({
      template: '#example-template'
    });

    var MainController = Marionette.Controller.extend({
      initialize: function(options) {
        this.mainRegion = options.mainRegion;
      },
      show: function() {
        var exampleModel = new Backbone.Model({
          version: '<%= version %>',
          geo: geo
        });
        var exampleView = new ExampleView({
          model: exampleModel
        });

        this.mainRegion.show(exampleView);
      }
    });

    Module.addInitializer(function () {
      Module.controller = new MainController({
        mainRegion: App.mainRegion
      });

      Module.controller.show();
    });
  });

  document.addEventListener('deviceready', function () {
    console.log('BACN v<%= version %> Loaded.');
    console.log('Loading location...');

    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Position found: ' + pos.coords.latitude + ',' + pos.coords.longitude);

      geo = {
        lat: pos.coords.latitude,
        long: pos.coords.longitude
      };

      App.start();
    }, function (err) {
      console.error('Error:', err.message);
    });
  }, false);
}());
