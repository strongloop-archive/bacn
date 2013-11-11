/*!
 * BacnGenerator is a Yeoman generator for BACN Marionette projects.
 */
var path = require('path');
var util = require('util');
var sh = require('shelljs');
var yeoman = require('yeoman-generator');

/**
 * Creates a new instance of BacnGenerator with the provided `options`.
 */
function BacnGenerator(args, options, config) {
  if (!(this instanceof BacnGenerator)) {
    return new BacnGenerator(args, options, config);
  }

  yeoman.generators.Base.call(this, args, options, config);

  this.destinationRoot(path.resolve(this.env.cwd));

  // Shim until https://github.com/yeoman/generator/pull/401.
  this.copy = function (source, dest) {
    dest = path.join(this.destinationRoot(), dest || source);
    yeoman.generators.Base.prototype.copy.call(this, source, dest);
  };

  this.remove = function (dest) {
    dest = path.join(this.destinationRoot(), dest);
    sh.rm('-rf', dest);
  };
}
util.inherits(BacnGenerator, yeoman.generators.Base);

/**
 * Remove the stubbed-in Cordova application.
 */
BacnGenerator.prototype.cleanExisting = cleanExisting;
function cleanExisting() {
  var self = this;

  this.remove('www/css');
  this.remove('www/img');
  this.remove('www/index.html');
  this.remove('www/js');
  this.remove('www/res');
  this.remove('www/spec');
  this.remove('www/spec.html');

  return self;
}

/**
 * Add directory structure.
 */
BacnGenerator.prototype.scaffolding = scaffolding;
function scaffolding() {
  var self = this;

  self.sourceRoot(__dirname + '/template');
  self.copy('gitignore', '.gitignore');
  self.copy('logo.png', 'www/logo.png');

  return self;
}

/*!
 * Export `BacnGenerator`.
 */
module.exports = BacnGenerator;
