const {ticketRegexp} = require('./agile.js');

const pullRequestTitleRegExp = new RegExp(`^(?:${ticketRegexp.source}\\s)+(.*?)$`);

module.exports = {
  pullRequestTitleRegExp
}
