import * as fs from "fs";
import { JSONResult, config, initializeFrameworks } from "./common";
import * as dot from "dot";

async function main() {
  let frameworks = await initializeFrameworks();

  frameworks.sort((a, b) =>
    a.fullNameWithKeyedAndVersion.localeCompare(b.fullNameWithKeyedAndVersion)
  );

  const dots = dot.process({
    path: "./",
  });

  fs.writeFileSync(
    "../index.html",
    dots.index({
      frameworks,
    }),
    {
      encoding: "utf8",
    }
  );
}

main().catch(err => {console.log("Error in createIndex", err)});
