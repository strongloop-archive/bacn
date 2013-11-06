var lib = require('../');
var common = lib('common');
var config = lib('config');

function build(argv, options, loader) {
  common.cordova(['build'].concat(options._))
    .on('exit', function () {
      console.log('Finished.');
    });
}

module.exports = build;
