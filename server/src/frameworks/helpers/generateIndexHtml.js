import * as fs from "node:fs";
import path from "node:path";
import { cwd } from "node:process";
import ejs from "ejs";

import { loadFrameworkVersions } from "../frameworksServices.js";

const projectRootPath = path.join(cwd(), "..");

/**
 * Options for generating the index HTML page.
 * @typedef GenerateIndexHtmlOptions
 * @property {boolean} minify
 */

/**
 * Generate the index HTML page.
 * @param {GenerateIndexHtmlOptions} options
 */
export async function generateIndexHtml(options = { minify: true }) {
  const { minify } = options;
  const frameworks = await loadFrameworkVersions();

  for (const framework of frameworks) {
    framework.uri = `frameworks/${framework.type}/${framework.directory}${
      framework.customURL || ""
    }`;
  }

  frameworks.sort((a, b) =>
    a.frameworkVersionString.localeCompare(b.frameworkVersionString),
  );

  const templateFilePath = path.join("templates", "index.ejs");
  const templateContent = fs.readFileSync(templateFilePath, "utf8");

  const renderedContent = ejs.render(templateContent, {
    frameworks,
  });

  let outputContent = minify
    ? renderedContent
        .replace(/\n/g, "")
        .replace(/\s+/g, " ")
        .replace(/(<[^>]*>)\s+/g, "$1")
        .replace(/\s*>\s*/g, ">") // Removes line wraps and spaces;
    : renderedContent;

  fs.writeFileSync(path.resolve(projectRootPath, "index.html"), outputContent, {
    encoding: "utf8",
  });
}
