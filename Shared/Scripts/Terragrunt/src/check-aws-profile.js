const yargs = require('yargs');
const {overrideProfile} = yargs.argv;
const {aws:{profile: workspaceProfile}} = require('../../../../workspace.json');
const awsProfile = overrideProfile || workspaceProfile;
const {AWS_PROFILE, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY} = process.env;
if (AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY) {
  console.log("Using IAM Access ID and Key for AWS provider authentication");
  return;
}
if (awsProfile !== AWS_PROFILE) {
  const errorMessage = `AWS profile does not match. Expected: ${awsProfile} Got: ${AWS_PROFILE}`;
  throw new Error(errorMessage);
}
