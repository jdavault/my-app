const {assert} = require('chai');
const {describe, it} = require('mocha');

const {ticketRegexp} = require('../src/lib/agile.js');
const {branchTypes, branchTypeRegExp, branchNameRegExp} = require('../src/lib/branch.js');

const getBranchName = ({type = 'feature', item = 'AB#1', description = 'description'}) => `${type}/${Array.isArray(item) ? item.join('/') : item}/${description}`;

describe('Branch', function () {

  describe('name', function () {
    it('should match azure boards items', function () {
      const azureBoardsItems = ['AB#1', 'AB#18', 'AB#5484553'];
      azureBoardsItems.forEach(item => {
        const branchName = getBranchName({item});
        assert.isTrue(ticketRegexp.test(item), `'${item}' did not match ${ticketRegexp}`);
        assert.isTrue(branchNameRegExp.test(branchName), `'${branchName}' did not match ${branchNameRegExp}`);
      });
      const azureBoardsMultipleItemBranchName = getBranchName({item: azureBoardsItems});
      assert.isTrue(branchNameRegExp.test(azureBoardsMultipleItemBranchName), `'${azureBoardsMultipleItemBranchName}' did not match ${branchNameRegExp}`);
    });

    it('should match jira items', function () {
      const jiraItems = ['PI-1', 'PI-15', 'PI-8485468', 'DEVOPS-1', 'DEVOPS-588', 'DEVOPS-2343432', 'A-1'];
      jiraItems.forEach(item => {
        const branchName = getBranchName({item});
        assert.isTrue(ticketRegexp.test(item), `'${item}' did not match ${ticketRegexp}`);
        assert.isTrue(branchNameRegExp.test(branchName), `'${branchName}' did not match ${branchNameRegExp}`);
      });
      const jiraMultipleItemBranchName = getBranchName({item: jiraItems});
      assert.isTrue(branchNameRegExp.test(jiraMultipleItemBranchName), `'${jiraMultipleItemBranchName}' did not match ${branchNameRegExp}`);
    });

    it('should match jira & board items', function () {
      const jiraItems = ['PI-1', 'AB#1', 'AB#18', 'PI-15', 'PI-8485468', 'AB#5484553', 'DEVOPS-1', 'DEVOPS-588', 'DEVOPS-2343432', 'A-1'];
      const mixMultipleItemBranchName = getBranchName({item: jiraItems});
      assert.isTrue(branchNameRegExp.test(mixMultipleItemBranchName), `'${mixMultipleItemBranchName}' did not match ${branchNameRegExp}`);
    });

    it('should start with prefix of branch type', async function () {
      branchTypes.forEach(type => {
        const branchName = getBranchName({type});
        assert.isTrue(branchTypeRegExp.test(type), `'${type}' did not match ${ticketRegexp}`);
        assert.isTrue(branchNameRegExp.test(branchName), `'${branchName}' did not match ${branchNameRegExp}`);
      });
    });

    it('should contain description', async function () {
      const descriptions = ['adding-vpc', 'adding_vpc', 'adding a vpc', 'adding-vpc/aws'];
      descriptions.forEach(description => {
        const branchName = getBranchName({description});
        assert.isTrue(branchNameRegExp.test(branchName), `'${branchName}' did not match ${branchNameRegExp}`);
        const [, , , matchedDescription] = branchName.match(branchNameRegExp);
        assert.equal(matchedDescription, description);
      });
    });
  });

});
