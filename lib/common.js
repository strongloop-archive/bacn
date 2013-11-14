var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');
var util = require('util');
var sf = require('slice-file');
var when = require('when');
var nodefn = require('when/node/function');

/**
 * Absolute filepaths for bundled executables.
 */
var Paths = {
  CORDOVA: path.resolve(__dirname, '..', 'node_modules', '.bin', 'cordova'),
  BOWER: path.resolve(__dirname, '..', 'node_modules', '.bin', 'bower')
};

/**
 * Returns a promise sufficient for notifying the end-user of an error.
 */
function error() {
  return when.reject(util.format.apply(util, arguments));
}

/**
 * Runs the specified executable in `options.cwd` with `argv` as its options.
 * If `options.cwd` is not specified, `process.cwd()` is used instead.
 */
function pSpawn(path, argv, options) {
  var deferred = when.defer();

  options = options || {};
  options = {
    env: process.env,
    cwd: options.cwd || process.cwd(),
    stdio: 'inherit'
  };

  spawn(path, argv, options)
    .on('error', function (err) {
      deferred.reject(err);
    })
    .on('exit', function (code) {
      deferred.resolve(code);
    });

  return deferred.promise;
}

/**
 * Runs cordova in `options.cwd` with `argv` as its options. If `options.cwd`
 * is not specified, `process.cwd()` is used instead.
 */
function cordova(argv, options) {
  return pSpawn(Paths.CORDOVA, argv, options);
}

/**
 * Runs yeoman in `options.cwd` with `argv` as its options. If `options.cwd`
 * is not specified, `process.cwd()` is used instead.
 */
function yeoman(argv, options) {
  var env = require('yeoman-generator')();

  options = options || {};

  env.cwd = options.cwd || process.cwd();
  env.registerStub(require('./generators/marionette'), 'marionette');
  env.run(argv);
}

function bower(argv, options) {
  return pSpawn(Paths.BOWER, argv, options);
}

/**
 * "Tails" the file at `filename`, listening for continued updates if
 * `options.follow` is specified.
 */
function tail(filename, options) {
  var deferred = when.defer();
  var stream = sf(path.resolve(process.cwd(), filename));

  options = options || {};

  var index = -1 * (options.length || 10);

  if (options.follow) {
    stream = stream.follow(index);
  } else {
    stream = stream.slice(index);
  }

  stream.pipe(process.stdout);
  stream.on('end', function () {
    deferred.resolve();
  });

  return deferred.promise;
}

/**
 * Returns an absolute path to the named project. If `name` is not specified,
 * we assume the `cwd` is the intended project. If `name` is specified, it's
 * assumed to be relative to `cwd` instead.
 */
function projectRoot(name) {
  return path.resolve(process.cwd(), name || '.');
}

/**
 * Returns project-specific settings for the `name` project, represented as
 * an Object:
 *  - `empty`: `true` if the Project would need to be created, `false` otherwise.
 *  - `client`: Root client directory
 *  - `server`: Root server directory
 */
function projectConfig(name) {
  var root = projectRoot(name);
  var configPath = path.join(root, '.bacn', 'config');
  var config = {
    empty: true,
    client: 'client',
    server: 'server'
  };

  if (fs.existsSync(configPath)) {
    config.empty = false;

    var body = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    util._extend(config, body);
  }

  config.client = path.resolve(root, config.client);
  config.server = path.resolve(root, config.server);

  return config;
}

/*!
 * Export the module.
 */
module.exports = {
  Paths: Paths,
  error: error,
  pSpawn: pSpawn,
  cordova: cordova,
  yeoman: yeoman,
  bower: bower,
  tail: tail,
  projectRoot: projectRoot,
  projectConfig: projectConfig
};
