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

  // 1. Create Cordova scaffolding.
  return common.cordova(['create'].concat(options._))
    // 2. Add configured mobile platforms.
    .then(function () {
      console.log('Created a new project at ' + projectBase + '.');

      if (!config.platforms.ios) {
        return false;
      }

      return common.cordova(['platform', 'add', 'ios'], { cwd: projectBase })
        .then(function () {
          console.log('Added iOS as a client platform.');
          return true;
        });
    })
    // 3. Inject MVC awesomeness.
    .then(function () {
      return common.yeoman(['marionette'], {
        cwd: projectBase
      });
    })
    // 4. Install dependencies.
    .then(function () {
      return common.bower(['install'], {
        cwd: projectBase
      });
    });
}

module.exports = create;
