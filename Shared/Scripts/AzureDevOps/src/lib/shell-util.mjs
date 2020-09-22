export const and = ' && \\\n';
export const silenceTerragrunt = ' 2> >(grep -v "\\[terragrunt]" | grep -v "\\[Copy Files]" >&2)';
export const toUnixPath = (path) => path.replace(/\\/g, '/')
