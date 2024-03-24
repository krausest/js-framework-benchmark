// @ts-check
import * as fs from "node:fs";
import path from "node:path";

// Function to copy CSS and generate shared-styles.html
async function copyAndGenerateSharedStyles(sourceCss, mainCss) {
  await fs.promises.cp(sourceCss, path.join("css", "currentStyle.css"));

  // Read the main CSS file
  const mainCssContent = await fs.promises.readFile(mainCss, "utf8");

  // Generate shared-styles.html content
  const sharedStylesContent = `<dom-module id="shared-styles"><template><style>${mainCssContent}</style></template></dom-module>`;

  // Write shared-styles.html
  await fs.promises.writeFile(path.join("polymer-v2.0.0-non-keyed", "src", "shared-styles.html"), sharedStylesContent);
}

/**
 * @param {Object} options
 * @param {boolean} options.bootstrap
 * @param {boolean} options.minimal
 */
export async function configureStyles({ bootstrap, minimal }) {
  console.log("Configure styles", "bootstrap", bootstrap, "minimal", minimal);

  try {
    // @ts-ignore
    if (bootstrap ^ minimal) {
      console.log("ERROR: You must either choose bootstrap or minimal");
      return;
    }

    // Read and copy the appropriate CSS file
    if (bootstrap) {
      await copyAndGenerateSharedStyles(
        path.join("css", "useOriginalBootstrap.css"),
        path.join("css", "bootstrap", "dist", "css", "bootstrap.min.css")
      );
    } else {
      await copyAndGenerateSharedStyles(path.join("css", "useMinimalCss.css"), path.join("css", "useMinimalCss.css"));
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}
