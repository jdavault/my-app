import {
  envRegEx,
  envSort,
  itemRegEx,
  regionRegEx,
  stageRegEx,
  stageSort
} from "./azure-devops-util.mjs";
import _ from "lodash";

export const artifactNameIsStageOrEnv = a => /([A-Z]+_)+/g.test(a.name);
export const artifactNameContainsRegion = a => regionRegEx.test(a.name);
export const artifactNameContainsItem = a => itemRegEx.test(a.name);

export const flatMapEnvironmentName = (artifact) => {
  const name = artifact.name.toUpperCase();
  const matches = name.match(envRegEx);
  if (!matches) {
    return [];
  }
  const [environment] = matches;
  return [environment];
}

export const flatMapStageName = (strict) => (artifact) => {
  const name = artifact.name.toUpperCase();
  const isEnv = envRegEx.test(name);
  if (strict && isEnv) {
    return [];
  }
  const matches = name.match(stageRegEx);
  if (!matches) {
    return [];
  }
  const [stage] = matches;
  return [stage];
}


export const getEnvironments = (buildArtifacts) => {
  const filtered = buildArtifacts
    .filter(artifactNameIsStageOrEnv)
    .flatMap(flatMapEnvironmentName)
    .map(_.kebabCase)
    .sort()
    .sort(envSort)
  return _.uniq(filtered);
}

export const getStages = (buildArtifacts, strict) => {
  const filtered = buildArtifacts
    .filter(artifactNameIsStageOrEnv)
    .flatMap(flatMapStageName(strict))
    .map(_.kebabCase)
    .sort(stageSort)
  return _.uniq(filtered);
}

export const getRegions = (buildArtifacts) => {
  const filtered = buildArtifacts
    .filter(artifactNameContainsRegion)
    .map(b => b.name.match(regionRegEx)[1])
    .map(_.kebabCase)
    .sort()
  return _.uniq(filtered);
}

export const getItems = (buildArtifacts) => {
  const filtered = buildArtifacts
    .filter(artifactNameContainsItem)
    .map(b => b.name.match(itemRegEx)[1])
    .map(name => _.startCase(name.toLowerCase()))
    .sort()
  return _.uniq(filtered);
}
