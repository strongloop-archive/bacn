// Copyright IBM Corp. 2013. All Rights Reserved.
// Node module: bacn
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

if (require.main === module) {
  require('./bin/bacn');
} else {
  module.exports = require('./lib');
}
