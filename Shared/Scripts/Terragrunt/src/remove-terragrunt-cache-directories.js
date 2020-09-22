'use strict';
const {join} = require('path');
const {promisify} = require('util');
const rmfr = require('rmfr');
const glob = promisify(require('glob'));


const infrastructurePath = join(__dirname, '../../../../Infrastructure');

(async () => {
  const dirs = await glob(`${infrastructurePath}/**/.terragrunt-cache`);
  if (!dirs.length) {
    console.log('No directories found.');
    return;
  }

  console.log('Removing', dirs);
  for (let dir of dirs) {
    await rmfr(dir);
  }
})();
