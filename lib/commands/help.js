// Copyright IBM Corp. 2013. All Rights Reserved.
// Node module: bacn
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

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
