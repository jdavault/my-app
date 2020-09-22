const {Octokit} = require("@octokit/rest");

const {GITHUB_TOKEN: token} = process.env;
const octokit = new Octokit({auth: token});

(async () => {
  try {
    const core = console;

    const repo = {owner: 'OpenTechAlliance', repo: 'CoreApps'};

    const sourceBranchName = 'main';
    core.info(`Source Branch name: ${sourceBranchName}`);
    const {data: sourceBranch} = await octokit.repos.getBranch({...repo, branch: sourceBranchName});


    const targetBranchName = 'develop';
    core.info(`Target Branch name: ${targetBranchName}`);
    const {data: {commit: {sha}}} = await octokit.repos.getBranch({...repo, branch: targetBranchName});

    const branchName = `sync/${sourceBranchName}→${targetBranchName}/${sha}`;
    core.info(`Branch name: ${branchName}`);

    const existingBranch = await octokit.repos.getBranch({...repo, branch: branchName}).catch(err => null);

    if (existingBranch) {
      core.info(`Skipping create branch since ${existingBranch} already exists`);
      return;
    }

  } catch (err) {
    console.log(err);
  }
})();
