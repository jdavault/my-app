const {assert} = require('chai');
const {describe, it} = require('mocha');

const {ticketRegexp} = require('../src/lib/agile.js');
const {pullRequestTitleRegExp} = require('../src/lib/pull-request.js');

const getPullRequestTitle = ({item = 'AB#1', description = 'description'}) => `${Array.isArray(item) ? item.join(' ') : item} ${description}`;

describe('Pull Request', function () {

  describe('title', function () {
    it('should match azure boards items', function () {
      const azureBoardsItems = ['AB#1', 'AB#18', 'AB#5484553'];
      azureBoardsItems.forEach(item => {
        const pullRequestTitle = getPullRequestTitle({item});
        assert.isTrue(ticketRegexp.test(item), `'${item}' did not match ${ticketRegexp}`);
        assert.isTrue(pullRequestTitleRegExp.test(pullRequestTitle), `'${pullRequestTitle}' did not match ${pullRequestTitleRegExp}`);
      });
      const azureBoardsMultipleItemPullRequestTitle = getPullRequestTitle({item: azureBoardsItems});
      assert.isTrue(pullRequestTitleRegExp.test(azureBoardsMultipleItemPullRequestTitle), `'${azureBoardsMultipleItemPullRequestTitle}' did not match ${pullRequestTitleRegExp}`);
    });

    it('should match jira issues', function () {
      const jiraItems = ['ST-1', 'ST-','PI-1', 'PI-15', 'PI-8485468', 'DEVOPS-1', 'DEVOPS-588', 'DEVOPS-2343432', 'A-1'];
      jiraItems.forEach(item => {
        const pullRequestTitle = getPullRequestTitle({item});
        assert.isTrue(ticketRegexp.test(item), `'${item}' did not match ${ticketRegexp}`);
        assert.isTrue(pullRequestTitleRegExp.test(pullRequestTitle), `'${pullRequestTitle}' did not match ${pullRequestTitleRegExp}`);
      });
      const jiraMultipleItemPullRequestTitle = getPullRequestTitle({item: jiraItems});
      assert.isTrue(pullRequestTitleRegExp.test(jiraMultipleItemPullRequestTitle), `'${jiraMultipleItemPullRequestTitle}' did not match ${pullRequestTitleRegExp}`);
    });

    it('should match jira & board items', function () {
      const jiraItems = ['ST-1', 'ST-','PI-1', 'AB#1', 'AB#18', 'PI-15', 'PI-8485468', 'AB#5484553', 'DEVOPS-1', 'DEVOPS-588', 'DEVOPS-2343432', 'A-1'];
      const jiraMultiItempullRequestTitle = getPullRequestTitle({item: jiraItems});
      assert.isTrue(pullRequestTitleRegExp.test(jiraMultiItempullRequestTitle), `'${jiraMultiItempullRequestTitle}' did not match ${pullRequestTitleRegExp}`);
    });

    it('should contain description', async function () {
      const descriptions = ['adding-vpc', 'adding_vpc', 'adding a vpc', 'adding-vpc/aws'];
      descriptions.forEach(description => {
        const pullRequestTitle = getPullRequestTitle({description});
        assert.isTrue(pullRequestTitleRegExp.test(pullRequestTitle), `'${pullRequestTitle}' did not match ${pullRequestTitleRegExp}`);
        const [, , matchedDescription] = pullRequestTitle.match(pullRequestTitleRegExp);
        assert.equal(matchedDescription, description);
      });
    });
  });

});
