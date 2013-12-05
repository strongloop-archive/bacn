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

  var id = options._[1] || config.id || 'io.bacn.cooknbacn';
  var name = options._[2] || config.name || 'CooknBACN';

  return when.all([
    // BAC: Generate the client.
    // 1. Create Cordova scaffolding.
    common.cordova(['create'].concat([
      config.clientRoot,
      id,
      name
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
      // 3. Add Cordova plugins.
      .then(function () {
        return when.all([
          'console', // console.*
          'statusbar', // Show/hide statusbar
          'splashscreen', // Show/hide splash screen
          'globalization', // Locale and time zone
          'geolocation', // GPS and gross location
          'file', // W3C File API
          'device' // UUID, etc.
        ].reduce(installPlugins, when()));

        function installPlugins(prev, name) {
          return prev.then(function () {
            return common.cordova(
              ['plugin', 'add', 'https://git-wip-us.apache.org/repos/asf/cordova-plugin-' + name + '.git'],
              {
                cwd: config.clientRoot
              }
            );
          });
        }
      })
      // 4. Inject MVC awesomeness.
      .then(function () {
        return common.yeoman([options.template || 'default'].concat(options._), {
          offline: options.offline,
          cwd: config.root
        });
      }),
    // N: Generate the server.
    // 1. Create Loopback scaffolding.
    common.loopback(['project', config.serverRoot, name])
      .then(function () {
        var args = ['install'];

        if (options.offline) {
          args = args.concat([
            '--fetch-retries', '0',
            '--fetch-retry-mintimeout', '1',
            '--fetch-retry-maxtimeout', '2'
          ]);
        }
        // 2. Install dependencies.
        return common.npm(args, {
          cwd: config.serverRoot
        });
      })
  ])
    .then(function () {
      common.writeConfig(config);
    });
}

module.exports = create;
