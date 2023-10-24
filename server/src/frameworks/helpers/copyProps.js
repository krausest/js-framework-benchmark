/**
 * @typedef {Object} BenchmarkData
 * @prop {string} issues
 * @prop {string} customURL
 * @prop {string} frameworkHomeURL
 * @prop {string} useShadowRoot
 * @prop {string} useRowShadowRoot
 * @prop {string} shadowRootName
 * @prop {string} buttonsInShadowRoot
 */

/**
 * @param {unknown} result
 * @param {BenchmarkData} benchmarkData
 */
export function copyProps(result, benchmarkData) {
  const {
    issues,
    customURL,
    frameworkHomeURL,
    useShadowRoot,
    useRowShadowRoot,
    shadowRootName,
    buttonsInShadowRoot,
  } = benchmarkData;

  result.issues = issues;
  result.customURL = customURL;
  result.frameworkHomeURL = frameworkHomeURL;
  result.useShadowRoot = useShadowRoot;
  result.useRowShadowRoot = useRowShadowRoot;
  result.shadowRootName = useShadowRoot
    ? shadowRootName ?? "main-element"
    : undefined;
  result.buttonsInShadowRoot = useShadowRoot
    ? buttonsInShadowRoot ?? true
    : undefined;
}
