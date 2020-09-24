const core = require('@actions/core');
const github = require('@actions/github');
const {branchNameRegExp: regex} = require('../../../Scripts/GitHub/src/lib/branch.js');

const validEvents = ['push', 'pull_request'];
const ignoreBranches = ['main', 'develop'];

(async function () {
  try {
    const {context: {eventName, payload: {ref, pull_request}}} = github;

    core.info(`Event name: ${eventName}`);
    if (!validEvents.includes(eventName)) {
      core.setFailed(`Invalid event: ${eventName}`);
      return;
    }

    const branch = eventName === 'push' ? ref.replace('refs/heads/', '') : pull_request.head.ref;
    core.info(`Branch name: ${branch}`);

    if (ignoreBranches.includes(branch)) {
      core.info(`Skipping checks since ${branch} is in the ignored list - ${ignoreBranches}`);
      return;
    }

    core.info(`Regex: ${regex}`);
    if (!regex.test(branch)) {
      core.setFailed(`Invalid Branch name.\nExpected "{branchType}/{ticket+/}{description}\nGot ${branch}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
