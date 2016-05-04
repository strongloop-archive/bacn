// Copyright IBM Corp. 2013. All Rights Reserved.
// Node module: bacn
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var util = require('util');
var pkg = require('../../package.json');

function dependencyVersion(name) {
  return pkg.dependencies[name].replace(/~/g, '');
}

function version(argv, options, loader) {
  if (options.short) {
    return process.stdout.write(pkg.version);
  }

  process.stdout.write(util.format(
    'Bacn version %s:\n' +
    '- Cordova %s\n' +
    '- LoopBack Workspace %s\n',
    pkg.version,
    dependencyVersion('cordova'),
    dependencyVersion('loopback-workspace')
  ));
}

module.exports = version;
