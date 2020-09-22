const {assert} = require('chai');
const {describe, it} = require('mocha');
const {promisify} = require('util');
const {join, dirname, basename} = require('path');
const {stat, readFile} = require('fs').promises;
const glob = promisify(require('glob'));
const {safeLoadAll} = require('js-yaml');
const hclToJson = require('hcl-to-json');

const workspaceDirPath = join(__dirname, '../../../../..');
const workspace = require(`${workspaceDirPath}/workspace.json`);

const awsStageGlob = `${workspaceDirPath}/Infrastructure/AWS/*/stages/*`;
const awsStageTagYamlGlob = `${workspaceDirPath}/Infrastructure/AWS/*/stages/*/tags.yml`;
const awsStageTagHclGlob = `${workspaceDirPath}/Infrastructure/AWS/*/stages/*/tags.tfvars`;

const jsonFromYamlPath = async (path) => {
  const data = await readFile(path);
  return safeLoadAll(data);
};

const jsonFromHclPath = async (path) => {
  const data = await readFile(path);
  return hclToJson(data.toString());
};

describe('Infrastructure/AWS', function () {
  describe('every stage directory', function () {
    it('should contain a tags.tfvars', async function () {
      const stagePaths = await glob(awsStageGlob);

      for (const stagePath of stagePaths) {
        const tagsStat = await stat(join(stagePath, 'tags.tfvars'));
        assert.isTrue(tagsStat.isFile(), `${stagePath} directory does not contain a tags.tfvars`);
      }
    });

    it('should contain a tags.variables.tf', async function () {
      const stagePaths = await glob(awsStageGlob);

      for (const stagePath of stagePaths) {
        const tagsStat = await stat(join(stagePath, 'tags.variables.tf'));
        assert.isTrue(tagsStat.isFile(), `${stagePath} directory does not contain a tags.variables.tf`);
      }
    });

    it('should contain a tags.yml', async function () {
      const stagePaths = await glob(awsStageGlob);

      for (const stagePath of stagePaths) {
        const tagsStat = await stat(join(stagePath, 'tags.variables.tf'));
        assert.isTrue(tagsStat.isFile(), `${stagePath} directory does not contain a tags.yml`);
      }
    });
  });

  describe('every tags.yml', function () {
    it('should contain the same name as the stage & product name and product code to match workspace', async function () {
      const stageTagsPaths = await glob(awsStageTagYamlGlob);
      const {openTech: {product: {name, code}}} = workspace;
      const tagGroups = await Promise.all(stageTagsPaths.map(async path => {
        const [tags] = await jsonFromYamlPath(path);
        return {stage: basename(dirname(path)), path, tags};
      }));

      for (const {stage, path, tags} of tagGroups) {
        assert.isUndefined(tags.environment, `Environment name does not belong in Stage tags in ${path}`);
        assert.equal(tags.stage, stage, `Stage name does not match in ${path}`);
        assert.equal(tags.product, name, `Product name does not match in ${path}`);
        assert.equal(tags.productCode, code, `Product code does not match in ${path}`);
      }
    });
  });

  describe('tags.tfvars', function () {
    it('should contain the same name as the stage & product name to match workspace', async function () {
      const stageTagsPaths = await glob(awsStageTagHclGlob);
      const {openTech: {product: {name, code}}} = workspace;
      const tagGroups = await Promise.all(stageTagsPaths.map(async path => {
        const {tags} = await jsonFromHclPath(path);
        return {stage: basename(dirname(path)), path, tags};
      }));

      for (const {stage, path, tags} of tagGroups) {
        assert.isUndefined(tags.Environment, `Environment name does not belong in Stage tags in ${path}`);
        assert.equal(tags.Stage, stage, `Stage name does not match in ${path}`);
        assert.equal(tags.Product, name, `Product name does not match in ${path}`);
      }
    });
  });
});
