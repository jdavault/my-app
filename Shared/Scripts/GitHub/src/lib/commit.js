const {ticketRegexp} = require('./agile.js');

const commitMessageRegExp = new RegExp(`^(?:${ticketRegexp.source}\\s)+(.*?)$`);

module.exports = {
  commitMessageRegExp
}
