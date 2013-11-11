/*!
 * MarionetteGenerator is a Yeoman generator for BACN Marionette projects.
 */
var path = require('path');
var util = require('util');
var Base = require('../base');

/**
 * Creates a new instance of MarionetteGenerator with the provided `options`.
 */
function MarionetteGenerator(args, options, config) {
  if (!(this instanceof MarionetteGenerator)) {
    return new MarionetteGenerator(args, options, config);
  }

  Base.call(this, args, options, config);

  this.appname = args[2] || args[0] || this.appname;
}
util.inherits(MarionetteGenerator, Base);
util._extend(MarionetteGenerator.prototype, Base.prototype);

/**
 * Add bower dependencies.
 */
MarionetteGenerator.prototype.dependencies = dependencies;
function dependencies() {
  var self = this;

  self.sourceRoot(__dirname + '/template');
  self.copy('bower.json', 'www/bower.json');
  self.copy('index.html', 'www/index.html');
  self.mkdir('css');
  self.copy('css/main.css', 'www/css/main.css');

  return self;
}

/*!
 * Export `MarionetteGenerator`.
 */
module.exports = MarionetteGenerator;
