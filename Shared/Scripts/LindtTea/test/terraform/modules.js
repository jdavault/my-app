const {assert} = require('chai');
const {describe, it} = require('mocha');
const {promisify} = require('util');
const {join} = require('path');
const glob = promisify(require('glob'));

const workspaceDirPath = join(__dirname, '../../../../..');

const sharedTerraformGlob = `${workspaceDirPath}/Shared/Terraform/**/local.*`;
const localTerraformGlob = `${workspaceDirPath}/Terraform/**/local.*.tf`;

describe('Shared/Terraform', function () {
  describe('every terraform file', function () {
    it('should not start with local', async function () {
      const filePaths = await glob(sharedTerraformGlob);
      assert.isEmpty(filePaths, `Shared/Terraform directory contains files that start with local: ${filePaths.join(',')}`);
    });
  });
});

describe('Terraform', function () {
  describe('every terraform file', function () {
    it('should not start with local', async function () {
      const filePaths = await glob(localTerraformGlob);
      assert.isEmpty(filePaths, `Terraform directory contains files that start with local: ${filePaths.join(',')}`);
    });
  });
});
