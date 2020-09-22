const core = require('@actions/core');
const github = require('@actions/github');
const {protectedBranchTypeRegExp, branchTypeRegExp, allowedMergeBranchTypes} = require('../../../Scripts/GitHub/src/lib/branch.js');

const validEvents = ['pull_request'];

(async function () {
  try {
    const {context: {eventName, payload: {pull_request: {head: {ref: sourceBranch}, base: {ref: targetBranch}}}}} = github;

    core.info(`Event name: ${eventName}`);
    if (!validEvents.includes(eventName)) {
      core.setFailed(`Invalid event: ${eventName}`);
      return;
    }

    core.info(`Source Branch: "${sourceBranch}"`);
    core.info(`Target Branch: "${targetBranch}"`);

    if (!protectedBranchTypeRegExp.test(targetBranch)) {
      core.info(`Skipping branch merge check the destination branch is not protected.`);
      return;
    }

    const [, sourceBranchType] = sourceBranch.match(branchTypeRegExp);
    const [, targetBranchType] = targetBranch.match(protectedBranchTypeRegExp);
    core.info(`Source Branch Type: "${sourceBranchType}"`);
    core.info(`Target Branch Type: "${targetBranchType}"`);


    const allowedBranchTypes = allowedMergeBranchTypes(targetBranchType);
    if (!allowedBranchTypes.includes(sourceBranchType)) {
      core.setFailed(`Invalid Pull Request.\nExpected branches "${allowedBranchTypes}"\nGot: "${sourceBranch}"`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
