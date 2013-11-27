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

  self.sourceRoot(__dirname + '/template');
  self.copy('bower.json', 'client/www/bower.json');
  self.copy('index.html', 'client/www/index.html');
  self.copy('css/main.css', 'client/www/css/main.css');
  self.copy('js/main.js', 'client/www/js/main.js');

  return self;
}

/*!
 * Export `MarionetteGenerator`.
 */
module.exports = MarionetteGenerator;
