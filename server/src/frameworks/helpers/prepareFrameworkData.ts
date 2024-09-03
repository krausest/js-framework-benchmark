import { loadFrameworkVersions } from "../frameworksServices.js";

/**
 * Generate the index HTML page.
 */
export async function prepareFrameworkData() {
  const frameworks = await loadFrameworkVersions();

  for (const framework of frameworks) {
    framework.uri = `frameworks/${framework.type}/${framework.directory}${framework.customURL || ""}`;
  }

  frameworks.sort((a, b) => a.frameworkVersionString!.localeCompare(b.frameworkVersionString!));
  return frameworks;
}
