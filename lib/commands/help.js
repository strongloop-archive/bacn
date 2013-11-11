var util = require('util');
var optimist = require('ocl/node_modules/optimist');
var when = require('when');

function help(argv, options, loader) {
  if (options._.length) {
    return when.reject(util.format('"%s" is not a valid BACN command. See `bacn help` for more information.', options._[0]));
  }

  console.log(loader.loadManual('help'));
}

module.exports = help;
