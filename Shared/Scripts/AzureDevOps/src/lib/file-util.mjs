import {promisify} from "util";
import {promises} from "fs";
import hcltojson from "hcl-to-json";
import yaml from "js-yaml";
import {ignoreNodeModules} from "./workspace.mjs";
import glob0 from "glob";


const glob = promisify(glob0);
const {readFile, writeFile, mkdir} = promises;
const {safeLoadAll, safeDump} = yaml;

export const jsonFromYamlPath = async (path) => {
  const data = await readFile(path);
  return safeLoadAll(data);
};

export const jsonFromHclPath = async (path) => {
  const data = await readFile(path);
  return hcltojson(data.toString())
};

export const overwriteFile = (path, yaml) => writeFile(path, safeDump(yaml, {
  noRefs: true,
  lineWidth: 1000
}).replace(/(.)\n+$/m, '$1\n'));

export const globExcludeNodeModules = (path) => glob(path, ignoreNodeModules);

export const mkdirp = (path) => mkdir(path, {recursive: true});
