/*!
 * BacnGenerator is a Yeoman generator for BACN Marionette projects.
 */
var path = require('path');
var mi = require('mi');
var sh = require('shelljs');
var yeoman = require('yeoman-generator');

/**
 * Creates a new instance of BacnGenerator with the provided `options`.
 */
function BacnGenerator(args, options, config) {
  options = options || {};
  options.force = true;

  yeoman.generators.Base.call(this, args, options, config);

  this.appname = args[2] || args[0] || this.appname;
  this.version = require('../../../package.json').version;

  this.destinationRoot(path.resolve(this.env.cwd));

  // Shim until https://github.com/yeoman/generator/pull/401.
  this.copy = function (source, dest) {
    dest = path.join(this.destinationRoot(), dest || source);
    yeoman.generators.Base.prototype.copy.call(this, source, dest);
  };
  // End shim.

  this.remove = function (dest) {
    dest = path.join(this.destinationRoot(), dest);
    sh.rm('-rf', dest);
  };
}
mi.inherit(BacnGenerator, yeoman.generators.Base);

/**
 * Extends `other` with the capabilities of BacnGenerator.
 */
BacnGenerator.extend = extend;
function extend(other) {
  var cls = this;

  mi.inherit(other, yeoman.generators.Base);
  mi.extend(other, cls);

  return cls;
}

/**
 * Remove the stubbed-in Cordova application.
 */
BacnGenerator.prototype.cleanExisting = cleanExisting;
function cleanExisting() {
  var self = this;

  this.remove('client/www/css');
  this.remove('client/www/img');
  this.remove('client/www/index.html');
  this.remove('client/www/js');
  this.remove('client/www/res');
  this.remove('client/www/spec');
  this.remove('client/www/spec.html');

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
  self.copy('logo.png', 'client/www/logo.png');
  self.copy('bower.json', 'client/www/bower.json');

  return self;
}

/**
 * Add CORS support to the scaffolded LoopBack server.
 */
BacnGenerator.prototype.addCorsSupport = addCorsSupport;
function addCorsSupport() {
  var self = this;
  var before = 'app.use(app.router);';
  var appJsPath = path.resolve(self.destinationRoot(), 'server/app.js');

  self.write(appJsPath, self.read(appJsPath).replace(before, before + '\napp.use(require(\'cors\')());'));

  process.chdir('server');
  self.npmInstall(
    ['cors@~2.1.1'],
    { save: true },
    self.async()
  );
  process.chdir('..');

  return self;
}

/*!
 * Export `BacnGenerator`.
 */
module.exports = BacnGenerator;
