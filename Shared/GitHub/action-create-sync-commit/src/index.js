const core = require('@actions/core');
const github = require('@actions/github');
const {syncBranchRegExp} = require("../../../Scripts/GitHub/src/lib/branch.js");

const validEvents = ['create'];

const token = core.getInput('token');
const octokit = github.getOctokit(token);

(async function () {
  try {
    const {context: {eventName, repo, payload: {ref, master_branch: masterBranch}}} = github;

    core.info(`Event name: ${eventName}`);
    if (!validEvents.includes(eventName)) {
      core.setFailed(`Invalid event: ${eventName}`);
      return;
    }

    core.info(`Sync branch: ${ref}`);
    if (!syncBranchRegExp.test(ref)) {
      core.info(`Skipping branch merge because current branch is not a sync branch.`);
      return;
    }

    const [, sourceBranch, targetBranch, targetHash] = ref.match(syncBranchRegExp);
    core.info(`Source branch: ${sourceBranch}`);
    core.info(`Target branch: ${targetBranch}`);
    core.info(`Target hash: ${targetHash}`);

    // sanity check
    if (masterBranch !== targetBranch) {
      core.setFailed(`Master branch and Target branch do not match. Master: "${masterBranch}" Target: "${targetBranch}"`);
      return;
    }

    await octokit.pulls.create({...repo, title: `SYNC ${sourceBranch} to ${targetBranch}`, head: ref, base: targetBranch});

    // TODO : Add error handling for failed merge :)
    await octokit.repos.merge({...repo, base: ref, head: sourceBranch, commit_message: `Merged ${sourceBranch}`});
  } catch (error) {
    core.error(JSON.stringify(error, null, 2));
    core.setFailed(error.message);
  }
})();
