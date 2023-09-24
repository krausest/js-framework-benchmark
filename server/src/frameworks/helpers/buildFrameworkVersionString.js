/**
 * @param {string} directoryName
 * @param {string} version
 * @param {string} keyedDir
 * @returns
 */
export function buildFrameworkVersionString(directoryName, version, keyedDir) {
  return `${directoryName}${version ? `-v${version}` : ""}-${keyedDir}`;
}
