const fs = require("fs-extra");
const yargs = require("yargs");
const path = require("path");

const args = yargs(process.argv)
  .usage("$0 [--bootstrap --minimal]")
  .help()
  .boolean("bootstrap")
  .default("bootstrap", false)
  .boolean("minimal")
  .default("minimal", false).argv;

// Function to copy CSS and generate shared-styles.html
async function copyAndGenerateSharedStyles(sourceCss, mainCss) {
  await fs.copy(sourceCss, path.join("css", "currentStyle.css"));

  // Read the main CSS file
  const mainCssContent = await fs.readFile(mainCss, "utf8");

  // Generate shared-styles.html content
  const sharedStylesContent = `<dom-module id="shared-styles"><template><style>${mainCssContent}</style></template></dom-module>`;

  // Write shared-styles.html
  await fs.writeFile(
    path.join("polymer-v2.0.0-non-keyed", "src", "shared-styles.html"),
    sharedStylesContent
  );
}

// Main function
async function configureStyles() {
  try {
    if (args.bootstrap ^ args.minimal) {
      console.log("ERROR: You must either choose bootstrap or minimal");
      return;
    }

    // Read and copy the appropriate CSS file
    if (args.bootstrap) {
      await copyAndGenerateSharedStyles(
        path.join("css", "useOriginalBootstrap.css"),
        path.join("css", "bootstrap", "dist", "css", "bootstrap.min.css")
      );
    } else {
      await copyAndGenerateSharedStyles(
        path.join("css", "useMinimalCss.css"),
        path.join("css", "useMinimalCss.css")
      );
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

configureStyles();
