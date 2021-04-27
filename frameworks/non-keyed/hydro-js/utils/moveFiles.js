const fs = require("fs");
const glob = require("glob");

glob("build/**/*", {}, (err, files) => {
  if (err) console.error(err);

  for (const file of files) fs.copyFileSync(file, file.replace("build/", ""));

  fs.rmSync("build", { force: true, recursive: true });
});
