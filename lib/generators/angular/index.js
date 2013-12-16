/*!
 * AngularGenerator is a Yeoman generator for BACN Angular projects.
 */
var path = require('path');
var Base = require('../base');

/**
 * Creates a new instance of AngularGenerator with the provided `options`.
 */
function AngularGenerator(args, options, config) {
  Base.call(this, args, options, config);

  this.appname = args[2] || args[0] || this.appname;
  this.version = require('../../../package.json').version;
}
Base.extend(AngularGenerator);

/**
 * Add bower dependencies.
 */
AngularGenerator.prototype.dependencies = dependencies;
function dependencies() {
  var self = this;

  process.chdir('client/www');
  self.bowerInstall([
    'angular#~1.2.3',
    'angular-resource#~1.2.4',
    'bootstrap#~3.0.2'
  ], { offline: this.options.offline, save: true }, self.async());
  process.chdir('../..');

  return self;
}

/**
 * Copy initial source files.
 */
AngularGenerator.prototype.sourceFiles = sourceFiles;
function sourceFiles() {
  var self = this;

  self.sourceRoot(__dirname + '/template');
  self.copy('index.html', 'client/www/index.html');
  self.copy('css/main.css', 'client/www/css/main.css');
  self.copy('js/main.js', 'client/www/js/main.js');

  return self;
}

/*!
 * Export `AngularGenerator`.
 */
module.exports = AngularGenerator;
