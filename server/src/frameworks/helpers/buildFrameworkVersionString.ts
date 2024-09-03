export function buildFrameworkVersionString(directoryName: string, version: string, keyedDir: string) {
  return `${directoryName}${version ? `-v${version}` : ""}-${keyedDir}`;
}
