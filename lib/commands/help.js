var optimist = require('ocl/node_modules/optimist');

function help(argv, options, loader) {
  if (options._.length) {
    console.error('"%s" is not a valid BACN command.', options._[0]);
    console.log('');
  }

  console.log(loader.loadManual('help'));
}

module.exports = help;
