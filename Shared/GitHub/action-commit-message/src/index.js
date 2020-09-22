const core = require('@actions/core');
const github = require('@actions/github');
const {commitMessageRegExp: regex} = require('../../../Scripts/GitHub/src/lib/commit.js');

const validEvents = ['push'];

(async function () {
  try {
    const {context: {eventName, payload: {commits: [{message}]}}} = github;

    core.info(`Event name: ${eventName}`);
    if (!validEvents.includes(eventName)) {
      core.setFailed(`Invalid event: ${eventName}`);
      return;
    }

    core.info(`Commit message: "${message}"`);
    core.info(`Regex: ${regex}`);
    if (!regex.test(message)) {
      core.warning(`Invalid commit message.\nExpected "{ticket+} {description}"\nGot: "${message}"`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
