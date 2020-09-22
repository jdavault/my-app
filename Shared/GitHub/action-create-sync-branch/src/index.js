const core = require('@actions/core');
const github = require('@actions/github');

const validEvents = ['push'];

const token = core.getInput('token');
const octokit = github.getOctokit(token);

(async function () {
  try {
    const {context: {eventName, repo, payload: {ref}}} = github;
    core.info(JSON.stringify(repo, null, 2));

    core.info(`Event name: ${eventName}`);
    if (!validEvents.includes(eventName)) {
      core.setFailed(`Invalid event: ${eventName}`);
      return;
    }

    const sourceBranchName = ref.replace('refs/heads/', '');
    core.info(`Source Branch name: ${sourceBranchName}`);
    // const {data: sourceBranch} = await octokit.repos.getBranch({...repo, branch: sourceBranchName});

    const targetBranchName = core.getInput('branch');
    core.info(`Target Branch name: ${targetBranchName}`);
    const {data: {commit: {sha}}} = await octokit.repos.getBranch({...repo, branch: targetBranchName});

    const branchName = `sync/${sourceBranchName}⟶${targetBranchName}/${sha}`;
    core.info(`Branch name: ${branchName}`);

    const existingBranch = await octokit.repos.getBranch({...repo, branch: branchName}).catch(() => null);

    if (existingBranch) {
      core.info(`Skipping create branch since ${existingBranch} already exists`);
      return;
    }

    await octokit.git.createRef({...repo, ref: `refs/heads/${branchName}`, sha});
  } catch (error) {
    core.setFailed(error.message);
  }
})();
