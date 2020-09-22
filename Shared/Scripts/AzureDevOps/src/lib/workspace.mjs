import {join, dirname} from "path";
import {fileURLToPath} from 'url';
import {toUnixPath} from "./shell-util.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const workspaceRootPath = join(__dirname, '../../../../../');
export const normalizeWorkspaceRootPath = toUnixPath(workspaceRootPath);
export const ignoreNodeModules = {ignore: [`${workspaceRootPath}/**/node_modules/**`]};

export const infrastructurePaths = {
  aws: join(workspaceRootPath, 'Infrastructure/AWS'),
  azureDevOps: join(workspaceRootPath, 'Infrastructure/AzureDevOps'),
  gitHub: join(workspaceRootPath, 'Infrastructure/GitHub'),
};

export const templatePaths = {
  azurePipelines: join(workspaceRootPath, 'Shared/AzurePipelines/Templates'),
};
