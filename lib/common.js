var cp = require('child_process');
var fs = require('fs');
var path = require('path');
var util = require('util');
var rc = require('rc');
var sf = require('slice-file');
var when = require('when');
var nodefn = require('when/node/function');

/**
 * Absolute filepaths for bundled executables.
 */
var Paths = {
  CORDOVA: path.resolve(__dirname, '..', 'node_modules', '.bin', 'cordova'),
  BOWER: path.resolve(__dirname, '..', 'node_modules', '.bin', 'bower'),
  // Use the globally-installed version.
  NPM: 'npm'
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

  deferred.promise.child = cp.spawn(path, argv, options)
    .on('error', function (err) {
      deferred.reject(err);
    })
    .on('exit', function (code) {
      deferred.resolve(code);
    });

  return deferred.promise;
}

/**
 * Forks node in `options.cwd` with `argv` as its arguments. If `options.cwd`
 * is not specified, `process.cwd()` is used instead.
 */
function pFork(path, argv, options) {
  var deferred = when.defer();

  options = options || {};
  options = {
    env: process.env,
    cwd: options.cwd || process.cwd()
  };

  deferred.promise.child = cp.fork(path, argv, options)
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
  var env = require('yeoman-generator')([], options);

  options = options || {};

  ['marionette', 'angular']
    .forEach(function (name) {
      env.registerStub(require('./generators/' + name), name);
    });

  env.cwd = options.cwd || process.cwd();
  env.run(argv);
}

/**
 * Runs bower in `options.cwd` with `argv` as its options. If `options.cwd`
 * is not specified, `process.cwd()` is used instead.
 */
function bower(argv, options) {
  return pSpawn(Paths.BOWER, argv, options);
}

/**
 * Runs npm in `options.cwd` with `argv` as its options. If `options.cwd`
 * is not specified, `process.cwd()` is used instead.
 */
function npm(argv, options) {
  return pSpawn(Paths.NPM, argv, options);
}

/**
 * Runs loopback in `options.cwd` with `argv` as its options. If `options.cwd`
 * is not specified, `process.cwd()` is used instead.
 */
function loopback(argv, options) {
  // TODO(schoon) - Currently, this is a shim for the "real" lb command/lib.
  options = options || {};

  if (argv.length < 3) {
    return error('lb-shim: Name and root missing.');
  }

  if (argv[0] !== 'project') {
    return error('lb-shim: Only `lb project` has been shimmed.');
  }

  var deferred = when.defer();

  // TODO(schoon) - Get loopback to support a different `name` property.
  require('loopback-workspace').models.Project.createFromTemplate(
    path.resolve(options.cwd || process.cwd(), argv[1]),
    options.template || 'mobile',
    function (err) {
      if (err) {
        return deferred.reject(err);
      }

      deferred.resolve();
    }
  );

  return deferred.promise;
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
 *  - `root`: The root project directory.
 *  - `clientRoot`: Root client directory.
 *  - `serverRoot`: Root server directory.
 *
 * Optional:
 *  - `name`: Project name.
 *  - `id`: Reverse-domain id.
 */
function projectConfig(name) {
  var root = projectRoot(name);
  var configPath = path.join(root, '.bacn', 'config');
  var config = {
    empty: true,
    root: root,
    clientRoot: 'client',
    serverRoot: 'server'
  };

  if (fs.existsSync(configPath)) {
    config.empty = false;

    var body = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    util._extend(config, body);
  }

  config.clientRoot = path.resolve(root, config.clientRoot);
  config.serverRoot = path.resolve(root, config.serverRoot);

  return config;
}

/**
 * Returns the global (application-level) configuration, represented as
 * an Object:
 *  - `platform`: Array subset of ['ios', 'android']
 */
function globalConfig() {
  return rc('bacn', {
    platform: ['ios']
  });
}

/**
 * Loads the combined configuration, taking into consideration both
 * global configuration and project-specific configuration.
 *
 * @see  common.projectConfig()
 * @see  common.globalConfig()
 */
function config(name) {
  var retval = {};

  util._extend(retval, globalConfig());
  util._extend(retval, projectConfig(name));

  return retval;
}

/**
 * Writes the project configuration for the named Project.
 */
function writeConfig(config) {
  data = {
    clientRoot: path.relative(config.root, config.clientRoot),
    serverRoot: path.relative(config.root, config.serverRoot),
    platform: config.platform
  };

  if (!fs.existsSync(path.join(config.root, '.bacn'))) {
    fs.mkdirSync(path.join(config.root, '.bacn'));
  }

  fs.writeFileSync(
    path.join(config.root, '.bacn/config'),
    JSON.stringify(data, null, 2)
  );
}

/*!
 * Export the module.
 */
module.exports = {
  Paths: Paths,
  error: error,
  pSpawn: pSpawn,
  pFork: pFork,
  cordova: cordova,
  yeoman: yeoman,
  bower: bower,
  npm: npm,
  loopback: loopback,
  tail: tail,
  projectRoot: projectRoot,
  projectConfig: projectConfig,
  globalConfig: globalConfig,
  config: config,
  writeConfig: writeConfig
};
