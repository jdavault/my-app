#!/usr/bin/env node
const {spawn} = require('child_process');
const {promises} = require("fs");
const {promisify} = require('util');
const exec = promisify(require('child_process').exec);

const terraformPrefix = 'TF_VAR_';
const {writeFile} = promises;
const {SYSTEM: system, TERRAGRUNT_DEPENDENCIES: terragruntDependencies} = process.env;
const arguments = process.argv.splice(2);
const [command] = arguments;

const isPlanOnBuildServer = command === 'plan' && system === 'build';
const pathToTerraform = terragruntDependencies ? `${terragruntDependencies}/` : '';
const proxyTerraform = spawn(`${pathToTerraform}terraform`, arguments, {stdio: [process.stdin, process.stdout, process.stderr]});

proxyTerraform.on('close', async (code) => {
  if (isPlanOnBuildServer) {
    const terraformEnvVars = Object.keys(process.env)
      .filter(key => key.startsWith(terraformPrefix))
      .reduce((str, key) => str + `export ${key}='${process.env[key].replace(/'/g, "'\\''")}'\n`, '');
    await writeFile('terragrunt.auto.tfvars.env', terraformEnvVars);

    const dirs = process.cwd().split('/');
    const distCacheDir = dirs.pop();
    const terragruntCachePath = dirs.join('/');
    await exec(`mv -- ${distCacheDir} dist`, {cwd: terragruntCachePath});
  }
  process.exit(code);
});
