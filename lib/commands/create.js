var fs = require('fs');
var path = require('path');
var when = require('when');
var common = require('../common');

/**
 * The workhorse of BACN: Scaffolding out a full stack of BACN.
 */
function create(argv, options, loader) {
  var config = common.config(options._[0]);

  if (!options._[0]) {
    return common.error('No project path provided to `bacn create`.');
  }

  return when.all([
    // BAC: Generate the client.
    // 1. Create Cordova scaffolding.
    common.cordova(['create'].concat([
      config.clientRoot,
      options._[1] || config.id || 'io.bacn.cooknbacn',
      options._[2] || config.name || 'CooknBACN'
    ]))
      // 2. Add configured mobile platforms.
      .then(function () {
        console.log('Created a new BACN project at ' + config.root + '.');
        console.log('Created a new Cordova project at ' + config.clientRoot + '.');

        return when.all(config.platform.map(function (platform) {
          // TODO(schoon) - Platform options.
          return common.cordova(['platform', 'add', platform], {
            cwd: config.clientRoot
          })
            .then(function () {
              console.log('Added "%s" as a client platform.', platform);
            });
        }));
      })
      // 3. Inject MVC awesomeness.
      .then(function () {
        return common.yeoman(['marionette'].concat(options._), {
          cwd: config.clientRoot
        });
      })
      // 4. Install dependencies.
      .then(function () {
        return common.bower(['install'], {
          cwd: path.join(config.clientRoot, 'www')
        });
      }),
    // N: Generate the server.
  ])
    .then(function () {
      common.writeConfig(config);
    });
}

module.exports = create;
