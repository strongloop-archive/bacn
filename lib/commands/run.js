// Copyright IBM Corp. 2013. All Rights Reserved.
// Node module: bacn
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var common = require('../common');
var when = require('when');

function run(argv, options, loader) {
  argv = [
    options.device ? 'run' : 'emulate'
  ];

  if (options._.length) {
    argv.push(options._[0]);
  }

  // TODO(schoon) - What arguments should we pass to the server?
  var npm = common.pFork(common.config().serverRoot, {
    cwd: common.config().serverRoot
  });

  return common.cordova(argv, {
    cwd: common.config().clientRoot
  }).then(function () {
    console.log('');
    console.log('Both client and server are now running. Press Ctrl-C to exit.');

    return npm;
  });
}

module.exports = run;
