/*!
 * MarionetteGenerator is a Yeoman generator for BACN Marionette projects.
 */
var path = require('path');
var Base = require('../base');

/**
 * Creates a new instance of MarionetteGenerator with the provided `options`.
 */
function MarionetteGenerator(args, options, config) {
  Base.call(this, args, options, config);

  this.appname = args[2] || args[0] || this.appname;
  this.version = require('../../../package.json').version;
}
Base.extend(MarionetteGenerator);

/**
 * Add bower dependencies.
 */
MarionetteGenerator.prototype.dependencies = dependencies;
function dependencies() {
  var self = this;

  process.chdir('client/www');
  self.bowerInstall([
    'marionette#~1.2.2',
    'jquery#~2.0.3',
    'bootstrap#~3.0.2'
  ], { offline: this.options.offline, save: true }, self.async());
  process.chdir('../..');

  return self;
}

/**
 * Copy initial source files.
 */
MarionetteGenerator.prototype.sourceFiles = sourceFiles;
function sourceFiles() {
  var self = this;

  self.sourceRoot(__dirname + '/template');
  self.copy('index.html', 'client/www/index.html');
  self.copy('css/main.css', 'client/www/css/main.css');
  self.copy('js/main.js', 'client/www/js/main.js');

  return self;
}

/*!
 * Export `MarionetteGenerator`.
 */
module.exports = MarionetteGenerator;
