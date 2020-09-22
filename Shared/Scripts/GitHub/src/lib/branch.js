const {ticketRegexp} = require('./agile.js');

const protectedBranchTypes = ['main', 'develop', 'release', 'sync'];
const protectedBranchTypeRegExp = new RegExp(`(${protectedBranchTypes.join('|')})`);
const branchTypes = ['feature', 'release', 'hotfix', 'bugfix'];
const branchTypeRegExp = new RegExp(`(${branchTypes.join('|')})`);
const branchNameRegExp = new RegExp(`^${branchTypeRegExp.source}\/(?:${ticketRegexp.source}\/)+(.*?)$`);
const syncBranchRegExp = /^sync\/(.*?)→(.*?)\/(.*)$/;

const allowedMergeBranchTypes = (branchType) => {
  let allowedBranchTypes;
  switch (branchType) {
    case "main":
      allowedBranchTypes = ['hotfix', 'release'];
      break;
    case "develop":
      allowedBranchTypes = ['feature', 'bugfix'];
      break;
    case "release":
      allowedBranchTypes = ['bugfix'];
      break;
  }
  return allowedBranchTypes;
}

module.exports = {
  protectedBranchTypes,
  protectedBranchTypeRegExp,
  branchTypes,
  branchTypeRegExp,
  branchNameRegExp,
  syncBranchRegExp,
  allowedMergeBranchTypes
};
