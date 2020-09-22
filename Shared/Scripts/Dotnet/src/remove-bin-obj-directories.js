'use strict';
const {join} = require('path');
const {promisify} = require('util');
const rmfr = require('rmfr');
const glob = promisify(require('glob'));


const workspaceRoot = join(__dirname, '../../../../');

(async () => {
  const binDirs = await glob(`${workspaceRoot}/**/bin`);
  if (!binDirs.length) {
    console.log('No bin directories found.');
  } else {
    console.log('Removing', binDirs);
    for (let binDir of binDirs) {
      await rmfr(binDir);
    }
  }

  const objDirs = await glob(`${workspaceRoot}/**/obj`);
  if (!objDirs.length) {
    console.log('No obj directories found.');
  } else {
    console.log('Removing', objDirs);
    for (let objDir of objDirs) {
      await rmfr(objDir);
    }
  }

  const awsSamDirs = await glob(`${workspaceRoot}/**/.aws-sam`);
  if (!awsSamDirs.length) {
    console.log('No AWS SAM directories found.');
  } else {
    console.log('Removing', awsSamDirs);
    for (let awsSamDir of awsSamDirs) {
      await rmfr(awsSamDir);
    }
  }


  const ideaDirs = await glob(`${workspaceRoot}/*/**/.idea`);
  if (!ideaDirs.length) {
    console.log('No AWS SAM directories found.');
  } else {
    console.log('Removing', ideaDirs);
    for (let ideaDir of ideaDirs) {
      await rmfr(ideaDir);
    }
  }

})();
