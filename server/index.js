const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs');
const fsp = require('fs/promises');

const app = express()
const port = 8080

let addCSP = false;

app.use(express.json());

let frameworkDirectory  = path.join(__dirname, "..", "frameworks");
let webDriverResultDirectory  = path.join(__dirname, "..", "webdriver-ts-results");

if (process.argv.length===3) {
  console.log("Changing working directory to "+process.argv[2]);
  frameworkDirectory = process.argv[2];
}

async function loadFrameworkInfo(keyedDir, directoryName) {
    let result = {
        type: keyedDir,
        directory: directoryName,        
    };

    let copyProps = (result, packageJSON) => {
        result.issues = packageJSON["js-framework-benchmark"]["issues"];
        result.customURL = packageJSON["js-framework-benchmark"]["customURL"];
        result.frameworkHomeURL = packageJSON["js-framework-benchmark"]["frameworkHomeURL"];
        let useShadowRoot = packageJSON["js-framework-benchmark"]["useShadowRoot"];
        result.useShadowRoot = useShadowRoot;
        result.useRowShadowRoot = packageJSON["js-framework-benchmark"]["useRowShadowRoot"];
        result.shadowRootName = useShadowRoot ? (packageJSON["js-framework-benchmark"]["shadowRootName"] ?? "main-element" ) : undefined;
        result.buttonsInShadowRoot = useShadowRoot ? (packageJSON["js-framework-benchmark"]["buttonsInShadowRoot"] ?? true) : undefined;
    }

    const frameworkPath = path.resolve(frameworkDirectory, keyedDir, directoryName);
    const packageJSONPath = path.resolve(frameworkPath, "package.json");  
    const packageLockJSONPath = path.resolve(frameworkPath, "package-lock.json");  
    if (fs.existsSync(packageJSONPath)) {
      let packageJSON = JSON.parse(await fsp.readFile(packageJSONPath, "utf8"));
      if (packageJSON["js-framework-benchmark"]) {
        if (packageJSON["js-framework-benchmark"]["frameworkVersionFromPackage"]) {          
            let packageNames = packageJSON["js-framework-benchmark"]["frameworkVersionFromPackage"].split(":");
            let packageLockJSON = JSON.parse(await fsp.readFile(packageLockJSONPath, "utf8"));
            result.versions = {};
            for (let packageName of packageNames) {
              if (packageLockJSON.dependencies[packageName]) {
                result.versions[packageName] = packageLockJSON.dependencies[packageName].version;
              } else {
                result.versions[packageName] = "ERROR: Not found in package-lock";
              }
            }        
            result.frameworkVersionString = directoryName + "-v" + packageNames.map(p => result.versions[p]).join(" + ") + "-"+keyedDir;
            copyProps(result, packageJSON);
        } else if (typeof packageJSON["js-framework-benchmark"]["frameworkVersion"] === "string") {
            result.version = packageJSON["js-framework-benchmark"]["frameworkVersion"];
            result.frameworkVersionString = directoryName + (result.version ? "-v" + result.version : "")+ "-"+keyedDir;
            copyProps(result, packageJSON);
        } else {
            result.error = "package.json must contain a 'frameworkVersionFromPackage' or 'frameworkVersion' in the 'js-framework-benchmark'.property";
        }
      } else {
        result.error = "package.json must contain a 'js-framework-benchmark' property";
      }
    } else {
        result.error = "No package.json found";
    }
    return result;
  }

function isFrameworkDir(keyedDir, directoryName) {
  const frameworkPath = path.resolve(frameworkDirectory, keyedDir, directoryName);
  const packageJSONPath = path.resolve(frameworkPath, "package.json");  
  const packageLockJSONPath = path.resolve(frameworkPath, "package-lock.json");  
  const exists = fs.existsSync(packageJSONPath) && fs.existsSync(packageLockJSONPath);
  return exists;
}

async function loadFrameworkVersionInformation(filterForFramework) {
    // let matchesDirectoryArg = (directoryName) =>
    // frameworkArgument.length == 0 || frameworkArgument.some((arg: string) => arg == directoryName);

    let resultsProm = [];
    let frameworksPath = path.resolve(frameworkDirectory);
    for (keyedType of ["keyed", "non-keyed"]) {
      let directories = fs.readdirSync(path.resolve(frameworksPath, keyedType));
      for (let directory of directories) {
        let pathInFrameworksDir = keyedType + "/" + directory;
        if (!filterForFramework || filterForFramework===pathInFrameworksDir) {
          if (isFrameworkDir(keyedType, directory)) {
            let fi = loadFrameworkInfo(keyedType, directory);
            resultsProm.push(fi);
          }
        }
      }
    }
    return Promise.all(resultsProm);
  }

function addSiteIsolationForIndex(request, response, next) {
  if (request.path.endsWith("/index.html")) {
    response.setHeader("Cross-Origin-Embedder-Policy","require-corp");
    response.setHeader("Cross-Origin-Opener-Policy","same-origin");
  }
  next();
}
app.use(addSiteIsolationForIndex);

app.use('/frameworks', express.static(frameworkDirectory, 
  {
    setHeaders: function(res, path) {
      if (addCSP) {
        res.setHeader('Content-Security-Policy', "default-src 'self'; report-uri /csp");
      }
    }
  }
))
app.use('/webdriver-ts-results', express.static(webDriverResultDirectory))
app.use('/css', express.static(path.join(frameworkDirectory, '..', 'css')))
app.get('/index.html', async (req, res, next) => {
  res.sendFile(path.join(__dirname,'..', 'index.html'));
})
app.get('/ls', async (req, res) => {
    let t0 = Date.now();
    let frameworks = await loadFrameworkVersionInformation();
    res.send(frameworks);
    let t1 = Date.now();
    console.log("/ls duration ", (t1-t0));
})
app.use('/csp', bodyParser.json({ type: 'application/csp-report' }))

let violations = []

app.post('/csp', async (req, res) => {
  console.log("/CSP ", req.body);
  let uri = req.body['csp-report']["document-uri"]
  let frameworkRegEx = /((non-)?keyed\/.*?\/)/
  let framework = uri.match(frameworkRegEx)[0];
  if (violations.indexOf(framework)==-1) {
    violations.push(framework)
  }
  res.sendStatus(201);
})

app.get('/startCSP', async (req, res) => {
  console.log("/startCSP");
  violations = [];
  addCSP = true;
  res.send("OK")
})

app.get('/endCSP', async (req, res) => {
  console.log("/endCSP");
  violations = [];
  addCSP = false;
  res.send("OK")
})

app.get('/csp', async (req, res) => {
  console.log("CSP violations recorded for", violations);
  res.send(violations)
})


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})