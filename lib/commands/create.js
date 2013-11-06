var fs = require('fs');
var path = require('path');
var lib = require('../');
var common = lib('common');
var config = lib('config');

function create(argv, options, loader) {
  var projectBase = options._[0] || null;

  if (projectBase) {
    projectBase = path.resolve(process.cwd(), projectBase);
  }

  common.cordova(['create'].concat(options._))
    .on('exit', function () {
      console.log('Created a new project at ' + projectBase + '.');
      addClients();
    });

  function addClients() {
    if (!config.clients.ios) {
      done();
      return;
    }

    common.cordova(['platform', 'add', 'ios'], { cwd: projectBase })
      .on('exit', function () {
        console.log('Added iOS as a client platform.');
        done();
      });
  }

  function done() {
    console.log('Finished.');
  }
}

module.exports = create;
