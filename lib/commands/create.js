var fs = require('fs');
var path = require('path');
var when = require('when');
var lib = require('../');
var common = lib('common');
var config = lib('config');

/**
 * The workhorse of BACN: Scaffolding out a full stack of BACN.
 */
function create(argv, options, loader) {
  var name = options._[0] || null;
  var root = common.projectRoot(name);
  var projectConfig = common.projectConfig(name);

  if (!name) {
    return common.error('No name provided to `bacn create`.');
  }

  return when.all([
    // BAC: Generate the client.
    // 1. Create Cordova scaffolding.
    common.cordova(['create'].concat([
      projectConfig.client,
      options._[1] || 'io.bacn.cooknbacn',
      options._[2] || 'CooknBACN'
    ]))
      // 2. Add configured mobile platforms.
      .then(function () {
        console.log('Created a new BACN project at ' + root + '.');
        console.log('Created a new Cordova project at ' + projectConfig.client + '.');

        if (!config.platforms.ios) {
          return false;
        }

        // TODO(schoon) - Platform options.
        return common.cordova(['platform', 'add', 'ios'], { cwd: projectConfig.client })
          .then(function () {
            console.log('Added iOS as a client platform.');
            return true;
          });
      })
      // 3. Inject MVC awesomeness.
      .then(function () {
        return common.yeoman(['marionette'].concat(options._), {
          cwd: projectConfig.client
        });
      })
      // 4. Install dependencies.
      .then(function () {
        return common.bower(['install'], {
          cwd: path.join(projectConfig.client, 'www')
        });
      }),
    // N: Generate the server.
  ]);
}

module.exports = create;
