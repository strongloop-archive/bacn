/*!
 * TodosGenerator is a Yeoman generator for the example BACN project:
 * a simple Todos app.
 */
var path = require('path');
var Angular = require('../angular');
var common = require('../../common');

/**
 * Creates a new instance of TodosGenerator with the provided `options`.
 */
function TodosGenerator(args, options, config) {
  Angular.call(this, args, options, config);
}
Angular.extend(TodosGenerator);

/**
 * Add bower dependencies.
 */
TodosGenerator.prototype.dependencies = dependencies;
function dependencies() {
  var self = this;

  // TODO(schoon) - Figure out how to make this more override-friendly.
  process.chdir('client/www');
  self.bowerInstall([
    'angular#~1.2.3',
    'angular-resource#~1.2.4',
    'topcoat#~0.8.0',
    'font-awesome#~4.0.3'
  ], { offline: this.options.offline, save: true }, self.async());
  process.chdir('../..');

  return self;
}

/**
 * Copy initial source files.
 */
TodosGenerator.prototype.sourceFiles = sourceFiles;
function sourceFiles() {
  var self = this;

  self.sourceRoot(__dirname + '/template');
  self.copy('index.html', 'client/www/index.html');
  self.copy('css/main.css', 'client/www/css/main.css');
  self.copy('js/main.js', 'client/www/js/main.js');

  return self;
}

/**
 * Create LoopBack models.
 */
TodosGenerator.prototype.models = models;
function models() {
  var self = this;
  var callback = self.async();

  common.loopback(['model', 'todo'], {
    cwd: path.resolve(self.destinationRoot(), 'server'),
    properties: {
      name: 'String'
    }
  })
    .then(function () {
      callback();
    }, callback);

  return self;
}

/*!
 * Export `TodosGenerator`.
 */
module.exports = TodosGenerator;
