const fs = require("fs");
const glob = require("glob").glob;
const path = require("path")

glob("build/**/*").then(files => {
  for (const file of files) {
    fs.copyFileSync(file, file.replace(`build${path.sep}`, ""));
  }

  try {
    fs.rm("build", { force: true, recursive: true }, () => {});
  } catch (e) {}
});
