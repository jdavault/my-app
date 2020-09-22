'use strict';
const {join} = require('path');
const {promisify} = require('util');
const rmfr = require('rmfr');
const glob = promisify(require('glob'));


const workspaceRoot = join(__dirname, '../../../../');

(async () => {
  const dirs = await glob(`${workspaceRoot}/**/.serverless`);
  if (!dirs.length) {
    console.log('No directories found.');
    return;
  }

  console.log('Removing', dirs);
  for (let dir of dirs) {
    await rmfr(dir);
  }
})();
