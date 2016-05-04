// Copyright IBM Corp. 2013,2014. All Rights Reserved.
// Node module: bacn
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/*!
 * IonicGenerator is a Yeoman generator for BACN projects that leverage the
 * Ionic framework.
 */
var path = require('path');
var Base = require('../base');

/**
 * Creates a new instance of IonicGenerator with the provided `options`.
 */
function IonicGenerator(args, options, config) {
  Base.call(this, args, options, config);
}
Base.extend(IonicGenerator);

/**
 * Add bower dependencies.
 */
IonicGenerator.prototype.dependencies = dependencies;
function dependencies() {
  var self = this;

  process.chdir('client/www');
  self.bowerInstall([
    'angular#~1.2.5',
    'angular-animate#~1.2.5',
    'angular-resource#~1.2.5',
    'angular-route#~1.2.5',
    'angular-sanitize#~1.2.5',
    'angular-touch#~1.2.5',
    'angular-ui-router#0.2.7',
    'ionic#~0.9.17',
    'ionicons#~1.4.0'
  ], { offline: this.options.offline, save: true }, self.async());
  process.chdir('../..');

  return self;
}

/**
 * Copy initial source files.
 */
IonicGenerator.prototype.sourceFiles = sourceFiles;
function sourceFiles() {
  var self = this;

  self.sourceRoot(__dirname + '/template');
  self.copy('index.html', 'client/www/index.html');
  self.copy('css/main.css', 'client/www/css/main.css');
  self.copy('js/main.js', 'client/www/js/main.js');

  return self;
}

/*!
 * Export `IonicGenerator`.
 */
module.exports = IonicGenerator;
