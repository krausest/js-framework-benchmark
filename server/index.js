import express from "express";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import { cwd } from "process";

const app = express();
const PORT = 8080;

let isCSPEnabled = false;

app.use(express.json());

const __dirname = cwd();

let frameworkDirectory = path.join(__dirname, "..", "frameworks");
const webDriverResultDirectory = path.join(
  __dirname,
  "..",
  "webdriver-ts-results"
);

if (process.argv.length === 3) {
  console.log(`Changing working directory to ${process.argv[2]}`);
  frameworkDirectory = process.argv[2];
}

function copyProps(result, benchmarkData) {
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

async function loadFrameworkInfo(keyedDir, directoryName) {
  const result = {
    type: keyedDir,
    directory: directoryName,
  };

  const frameworkPath = path.resolve(
    frameworkDirectory,
    keyedDir,
    directoryName
  );
  const packageJSONPath = path.resolve(frameworkPath, "package.json");
  const packageLockJSONPath = path.resolve(frameworkPath, "package-lock.json");

  if (!fs.existsSync(packageJSONPath)) {
    result.error = "No package.json found";
    return result;
  }

  const packageJSON = JSON.parse(await fsp.readFile(packageJSONPath, "utf8"));
  const benchmarkData = packageJSON["js-framework-benchmark"];

  if (!benchmarkData) {
    result.error =
      "package.json must contain a 'js-framework-benchmark' property";
    return result;
  }

  if (benchmarkData.frameworkVersionFromPackage) {
    const packageNames = benchmarkData.frameworkVersionFromPackage.split(":");
    const packageLockJSON = JSON.parse(
      await fsp.readFile(packageLockJSONPath, "utf8")
    );

    result.versions = {};

    for (const packageName of packageNames) {
      if (packageLockJSON.dependencies?.[packageName]) {
        result.versions[packageName] =
          packageLockJSON.dependencies[packageName].version;
      } else if (packageLockJSON.packages?.[`node_modules/${packageName}`]) {
        result.versions[packageName] =
          packageLockJSON.packages[`node_modules/${packageName}`].version;
      } else {
        result.versions[packageName] = "ERROR: Not found in package-lock";
      }
    }

    result.frameworkVersionString = `${directoryName}-v${packageNames
      .map((p) => result.versions[p])
      .join(" + ")}-${keyedDir}`;

    copyProps(result, benchmarkData);
  } else if (typeof benchmarkData.frameworkVersion === "string") {
    result.version = benchmarkData.frameworkVersion;
    result.frameworkVersionString = `${directoryName}${
      result.version ? `-v${result.version}` : ""
    }-${keyedDir}`;

    copyProps(result, benchmarkData);
  } else {
    result.error =
      "package.json must contain a 'frameworkVersionFromPackage' or 'frameworkVersion' in the 'js-framework-benchmark'.property";
  }

  return result;
}

function isFrameworkDir(keyedDir, directoryName) {
  const frameworkPath = path.resolve(
    frameworkDirectory,
    keyedDir,
    directoryName
  );
  const packageJSONPath = path.resolve(frameworkPath, "package.json");
  const packageLockJSONPath = path.resolve(frameworkPath, "package-lock.json");
  const exists =
    fs.existsSync(packageJSONPath) && fs.existsSync(packageLockJSONPath);

  return exists;
}

async function loadFrameworkVersionInformation(filterForFramework) {
  const resultsProm = [];
  const frameworksPath = path.resolve(frameworkDirectory);
  const keyedTypes = ["keyed", "non-keyed"];

  for (const keyedType of keyedTypes) {
    const directories = fs.readdirSync(path.resolve(frameworksPath, keyedType));

    for (const directory of directories) {
      const pathInFrameworksDir = `${keyedType}/${directory}`;

      if (filterForFramework && filterForFramework !== pathInFrameworksDir) {
        continue;
      }

      if (!isFrameworkDir(keyedType, directory)) {
        continue;
      }

      const frameworkInfo = loadFrameworkInfo(keyedType, directory);
      resultsProm.push(frameworkInfo);
    }
  }
  return Promise.all(resultsProm);
}

function addSiteIsolationForIndex(request, response, next) {
  if (request.path.endsWith("/index.html")) {
    response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  }
  next();
}
app.use(addSiteIsolationForIndex);

app.use(
  "/frameworks",
  express.static(frameworkDirectory, {
    setHeaders: (res, path) => {
      if (isCSPEnabled && path.endsWith("index.html")) {
        console.log("adding CSP to ", path);
        res.setHeader(
          "Content-Security-Policy",
          "default-src 'self'; report-uri /csp"
        );
      }
    },
  })
);
app.use("/webdriver-ts-results", express.static(webDriverResultDirectory));
app.use("/css", express.static(path.join(frameworkDirectory, "..", "css")));
app.get("/index.html", (req, res) => {
  const indexHTMLPath = path.join(__dirname, "..", "index.html");
  res.sendFile(indexHTMLPath);
});
app.get("/ls", async (req, res) => {
  performance.mark("Start");
  const frameworks = await loadFrameworkVersionInformation();
  res.send(frameworks);
  performance.mark("End");
  const executionTime = performance.measure(
    "/ls duration measurement",
    "Start",
    "End"
  ).duration;

  console.log(`/ls duration: ${executionTime}ms`);
});
app.use("/csp", bodyParser.json({ type: "application/csp-report" }));

let violations = [];

app.post("/csp", (req, res) => {
  console.log("/CSP ", req.body);
  const uri = req.body["csp-report"]["document-uri"];
  const frameworkRegEx = /((non-)?keyed\/.*?\/)/;
  const framework = uri.match(frameworkRegEx)[0];
  if (!violations.includes(framework)) {
    violations.push(framework);
  }
  res.sendStatus(201);
});

app.get("/startCSP", (req, res) => {
  console.log("/startCSP");
  violations = [];
  isCSPEnabled = true;
  res.send("OK");
});

app.get("/endCSP", (req, res) => {
  console.log("/endCSP");
  violations = [];
  isCSPEnabled = false;
  res.send("OK");
});

app.get("/csp", (req, res) => {
  console.log("CSP violations recorded for", violations);
  res.send(violations);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
