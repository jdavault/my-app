import {webApi} from './lib/azure-devops-util.mjs';
import workspace from '../../../../workspace.json';
import {getEnvironments, getItems, getRegions, getStages} from "./lib/release-definition.mjs";
import {releaseDefinitionHcl, terraformWithOverride} from "./lib/terraform.mjs";
import {join} from "path";
import _ from "lodash";
import {infrastructurePaths} from "./lib/workspace.mjs";
import {silenceTerragrunt} from "./lib/shell-util.mjs";
import {yamlFilePathToTerraform} from "./lib/build-definition.mjs";
import {mkdirp} from "./lib/file-util.mjs";
import {promises} from "fs";

const {writeFile} = promises;
const {
  gitHub: {repository: {name: gitHubRepositoryName}},
  azureDevOps: {project: {name: projectName}},
  terraform: {overrides},
} = workspace;
const description = 'Managed by Terraform';
const mapTerraformWithOverride = terraformWithOverride(overrides);

(async () => {
  const coreApi = await webApi.getCoreApi();
  const buildApi = await webApi.getBuildApi();
  const taskAgentApi = await webApi.getTaskAgentApi();
  const releaseApi = await webApi.getReleaseApi();

  const projects = await coreApi.getProjects();
  const project = projects.find(p => p.name === projectName);

  const queues = await taskAgentApi.getAgentQueues(project.id);
  const queue = queues.find(q => q.name === 'Azure Pipelines');

  const buildDefinitions = await buildApi.getDefinitions(project.id);
  const releaseDefinitions = await releaseApi.getReleaseDefinitions(project.id);

  const apiRequests = buildDefinitions.map(async ({id}) => {
    const buildDefinition = await buildApi.getDefinition(project.id, id);
    const developBranch = 'refs/heads/develop';
    const builds = await buildApi.getBuilds(project.id, [buildDefinition.id]);
    const successfulBuilds = builds.filter(b => b.result === 2);
    if (!successfulBuilds.length) {
      console.log(`[SKIP] ${buildDefinition.name} has no builds.`);
      return null;
    }
    const developBranchBuilds = successfulBuilds.filter(b => b.sourceBranch === developBranch);
    if (!developBranchBuilds.length) {
      console.log(`[WARN] ${buildDefinition.name} has no builds on the ${developBranch}.`);
    }
    const [build] = successfulBuilds;
    const buildArtifacts = await buildApi.getArtifacts(project.id, build.id);

    const environments = getEnvironments(buildArtifacts);
    const stages = getStages(buildArtifacts, true);
    const regions = getRegions(buildArtifacts);
    const items = getItems(buildArtifacts);

    if (!stages.length && !environments.length) {
      console.log(`[SKIP] ${buildDefinition.name} no stages or environments found`);
      return null;
    }

    const path = buildDefinition.path.replace(/\\/g, '\\\\');
    const {terraformName: buildTerraformName, type, name} = yamlFilePathToTerraform(buildDefinition.process.yamlFilename, gitHubRepositoryName)
    const terraform = mapTerraformWithOverride({
      name, type, path, environments, stages, items, description, regions, agentPoolId: queue.id, buildTerraformName
    });
    const release = releaseDefinitionHcl(terraform);

    const folderName = `release-definition_${_.kebabCase(name)}`;
    const releaseDefinitionPath = join(infrastructurePaths.azureDevOps, projectName.toLowerCase(), folderName);

    console.log(`[CREATE] ${buildDefinition.name}`);

    await mkdirp(releaseDefinitionPath);
    await writeFile(`${releaseDefinitionPath}/terragrunt.hcl`, release + '\n');

    const releaseDefinition = releaseDefinitions.find(r => r.name === buildDefinition.name);
    if (releaseDefinition && releaseDefinition.description !== description) {
      await writeFile(
        `${releaseDefinitionPath}/import.md`,
        `terragrunt import "azuredevops_release_definition.this" "${project.id}/${releaseDefinition.id}" ${silenceTerragrunt}\n`
      );
    }
  });

  console.log(`Processing ${apiRequests.length} requests`);
  const results = await Promise.allSettled(apiRequests);
  for (const {status, reason} of results) {
    if (status === 'rejected') {
      console.error(reason);
    }
  }
  console.log(`ALL done!`);
})();
