const {ticketRegexp} = require('./agile.js');

const branchTypes = ['feature', 'release', 'hotfix', 'bugfix']
const branchTypeRegExp = new RegExp(`(${branchTypes.join('|')})`);
const branchNameRegExp = new RegExp(`^${branchTypeRegExp.source}\/(?:${ticketRegexp.source}\/)+(.*?)$`);

module.exports = {
  branchTypes,
  branchTypeRegExp,
  branchNameRegExp
};
