const {assert} = require('chai');
const {describe, it} = require('mocha');

const {ticketRegexp} = require('../src/lib/agile.js');
const {commitMessageRegExp} = require('../src/lib/commit.js');

const getCommitMessage = ({item = 'AB#1', description = 'description'}) => `${Array.isArray(item) ? item.join(' ') : item} ${description}`;

describe('Commit', function () {

  describe('title', function () {
    it('should match azure boards items', function () {
      const azureBoardsItems = ['AB#1', 'AB#18', 'AB#5484553'];
      azureBoardsItems.forEach(item => {
        const pullRequestTitle = getCommitMessage({item});
        assert.isTrue(ticketRegexp.test(item), `'${item}' did not match ${ticketRegexp}`);
        assert.isTrue(commitMessageRegExp.test(pullRequestTitle), `'${pullRequestTitle}' did not match ${commitMessageRegExp}`);
      });
      const azureBoardsMultipleItemPullRequestTitle = getCommitMessage({item: azureBoardsItems});
      assert.isTrue(commitMessageRegExp.test(azureBoardsMultipleItemPullRequestTitle), `'${azureBoardsMultipleItemPullRequestTitle}' did not match ${commitMessageRegExp}`);
    });

    it('should match jira issues', function () {
      const jiraItems = ['PI-1', 'PI-15', 'PI-8485468', 'DEVOPS-1', 'DEVOPS-588', 'DEVOPS-2343432', 'A-1'];
      jiraItems.forEach(item => {
        const pullRequestTitle = getCommitMessage({item});
        assert.isTrue(ticketRegexp.test(item), `'${item}' did not match ${ticketRegexp}`);
        assert.isTrue(commitMessageRegExp.test(pullRequestTitle), `'${pullRequestTitle}' did not match ${commitMessageRegExp}`);
      });
      const jiraMultipleItemPullRequestTitle = getCommitMessage({item: jiraItems});
      assert.isTrue(commitMessageRegExp.test(jiraMultipleItemPullRequestTitle), `'${jiraMultipleItemPullRequestTitle}' did not match ${commitMessageRegExp}`);
    });

    it('should match jira & board items', function () {
      const jiraItems = ['PI-1', 'AB#1', 'AB#18', 'PI-15', 'PI-8485468', 'AB#5484553', 'DEVOPS-1', 'DEVOPS-588', 'DEVOPS-2343432', 'A-1'];
      const jiraMultiItempullRequestTitle = getCommitMessage({item: jiraItems});
      assert.isTrue(commitMessageRegExp.test(jiraMultiItempullRequestTitle), `'${jiraMultiItempullRequestTitle}' did not match ${commitMessageRegExp}`);
    });

    it('should contain description', async function () {
      const descriptions = ['adding-vpc', 'adding_vpc', 'adding a vpc', 'adding-vpc/aws'];
      descriptions.forEach(description => {
        const pullRequestTitle = getCommitMessage({description});
        assert.isTrue(commitMessageRegExp.test(pullRequestTitle), `'${pullRequestTitle}' did not match ${commitMessageRegExp}`);
        const [, , matchedDescription] = pullRequestTitle.match(commitMessageRegExp);
        assert.equal(matchedDescription, description);
      });
    });
  });

});
