if (require.main === module) {
  require('./bin/bacn');
} else {
  module.exports = require('./lib');
}
