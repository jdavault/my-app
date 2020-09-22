const core = require('@actions/core');
const github = require('@actions/github');
const {branchNameRegExp, protectedBranchTypes, syncBranchRegExp} = require('../../../Scripts/GitHub/src/lib/branch.js');

const validEvents = ['push', 'pull_request'];

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

    if (protectedBranchTypes.includes(branch)) {
      core.info(`Skipping checks since ${branch} is in the protected branch list - ${protectedBranchTypes}`);
      return;
    }

    core.info(`Gitflow branch Regex: ${branchNameRegExp}`);
    core.info(`Sync branch Regex: ${syncBranchRegExp}`);
    if (!branchNameRegExp.test(branch) && !syncBranchRegExp.test(branch)) {
      const expected = branch.startsWith('') ? "syc/{source}→${target}/{sourceHash}" : "{branchType}/{ticket/+}{description}";
      core.setFailed(`Invalid Branch name.\nExpected ${expected}\nGot ${branch}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
