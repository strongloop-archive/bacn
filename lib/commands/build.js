// Copyright IBM Corp. 2013. All Rights Reserved.
// Node module: bacn
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var common = require('../common');

function build(argv, options, loader) {
  return common.cordova(['build'].concat(options._), {
    cwd: common.config().clientRoot
  });
}

module.exports = build;
