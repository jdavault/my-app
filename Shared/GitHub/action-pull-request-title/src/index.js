const core = require('@actions/core');
const github = require('@actions/github');
const {pullRequestTitleRegExp: regex} = require('../../../Scripts/GitHub/src/lib/pull-request.js');

const validEvents = ['pull_request'];

(async function () {
  try {
    const {context: {eventName, payload: {pull_request: {title}}}} = github;

    core.info(`Event name: ${eventName}`);
    if (!validEvents.includes(eventName)) {
      core.setFailed(`Invalid event: ${eventName}`);
      return;
    }

    core.info(`Pull Request title: "${title}"`);
    core.info(`Regex: ${regex}`);
    if (!regex.test(title)) {
      core.setFailed(`Invalid Pull Request title.\nExpected "{ticket+} {description}"\nGot: "${title}"`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
