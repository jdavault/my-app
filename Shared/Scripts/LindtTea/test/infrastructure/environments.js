const {assert} = require('chai');
const {describe, it} = require('mocha');
const {promisify} = require('util');
const {join, dirname, basename} = require('path');
const {stat, readFile} = require('fs').promises;
const glob = promisify(require('glob'));
const {safeLoadAll} = require('js-yaml');
const hclToJson = require('hcl-to-json');
const envToStage = {
  dev: 'dev',
  qa: 'qa',
  staging: 'staging',
  alpha: 'prod',
  beta: 'prod',
  prod: 'prod',
}

const workspaceDirPath = join(__dirname, '../../../../..');
const workspace = require(`${workspaceDirPath}/workspace.json`);

const awsEnvironmentGlob = `${workspaceDirPath}/Infrastructure/AWS/*/environments/*`;
const awsEnvironmentTagYamlGlob = `${workspaceDirPath}/Infrastructure/AWS/*/environments/*/tags.yml`;
const awsEnvironmentTagHclGlob = `${workspaceDirPath}/Infrastructure/AWS/*/environments/*/tags.tfvars`;

const jsonFromYamlPath = async (path) => {
  const data = await readFile(path);
  return safeLoadAll(data);
};

const jsonFromHclPath = async (path) => {
  const data = await readFile(path);
  return hclToJson(data.toString());
};

describe('Infrastructure/AWS', function () {
  describe('every environment directory', function () {
    it('should contain a tags.tfvars', async function () {
      const environmentPaths = await glob(awsEnvironmentGlob);

      for (const environmentPath of environmentPaths) {
        const tagsStat = await stat(join(environmentPath, 'tags.tfvars'));
        assert.isTrue(tagsStat.isFile(), `${environmentPath} directory does not contain a tags.tfvars`);
      }
    });

    it('should contain a tags.variables.tf', async function () {
      const environmentPaths = await glob(awsEnvironmentGlob);

      for (const environmentPath of environmentPaths) {
        const tagsStat = await stat(join(environmentPath, 'tags.variables.tf'));
        assert.isTrue(tagsStat.isFile(), `${environmentPath} directory does not contain a tags.variables.tf`);
      }
    });

    it('should contain a tags.yml', async function () {
      const environmentPaths = await glob(awsEnvironmentGlob);

      for (const environmentPath of environmentPaths) {
        const tagsStat = await stat(join(environmentPath, 'tags.variables.tf'));
        assert.isTrue(tagsStat.isFile(), `${environmentPath} directory does not contain a tags.yml`);
      }
    });
  });

  describe('every tags.yml', function () {
    it('should contain the same name as the environment & product name and product code to match workspace', async function () {
      const environmentTagsPaths = await glob(awsEnvironmentTagYamlGlob);
      const {openTech: {product: {name, code}}} = workspace;
      const tagGroups = await Promise.all(environmentTagsPaths.map(async path => {
        const [tags] = await jsonFromYamlPath(path);
        const environment = basename(dirname(path));
        const stage = envToStage[environment.replace(/-\d+/, '')];
        return {environment, stage, path, tags};
      }));

      for (const {environment, stage, path, tags} of tagGroups) {
        assert.equal(tags.stage, stage, `Stage name does not match in ${path}`);
        assert.equal(tags.environment, environment, `Environment name does not match in ${path}`);
        assert.equal(tags.product, name, `Product name does not match in ${path}`);
        assert.equal(tags.productCode, code, `Product code does not match in ${path}`);
      }
    });
  });

  describe('tags.tfvars', function () {
    it('should contain the same name as the environment & product name to match workspace', async function () {
      const environmentTagsPaths = await glob(awsEnvironmentTagHclGlob);
      const {openTech: {product: {name, code}}} = workspace;
      const tagGroups = await Promise.all(environmentTagsPaths.map(async path => {
        const {tags} = await jsonFromHclPath(path);
        const environment = basename(dirname(path));
        const stage = envToStage[environment.replace(/-\d+/, '')];
        return {environment, stage, path, tags};
      }));

      for (const {environment, stage, path, tags} of tagGroups) {
        assert.equal(tags.Stage, stage, `Stage name does not match in ${path}`);
        assert.equal(tags.Environment, environment, `Environment name does not match in ${path}`);
        assert.equal(tags.Product, name, `Product name does not match in ${path}`);
      }
    });
  });
});
