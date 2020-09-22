'use strict';
const {join} = require('path');
const {promisify} = require('util');
const glob = promisify(require('glob'));


const workspaceRoot = join(__dirname, '../../../../');

(async () => {
  const csprojFiles = await glob(`${workspaceRoot}/**/*.csproj`);
  console.log(csprojFiles.length, csprojFiles);

  const slnFiles = await glob(`${workspaceRoot}/**/*.sln`);
  console.log(slnFiles.length, slnFiles);
})();
