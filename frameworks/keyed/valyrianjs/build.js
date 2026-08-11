const fs = require("fs");
const { inline } = require("valyrian.js/node");

const argv = process.argv.slice(2);
const isDev = argv.includes("--dev");

async function build() {
  const { raw, map } = await inline("./src/main.tsx", {
    compact: !isDev,
  });

  const js = isDev ? `${raw}\n${map}` : raw;

  fs.mkdirSync("./dist", { recursive: true });
  fs.writeFileSync("./dist/main.js", js);

  console.log(`App length: ${raw.length}`);
  console.log(`Minified size: ${(raw.length / 1024).toFixed(2)}kb`);
}

build();
