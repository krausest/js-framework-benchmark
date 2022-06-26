const express = require('express')
const path = require('path')
const fs = require('fs');
const fsp = require('fs/promises');

const app = express()
const port = 8080

async function loadFrameworkInfo(keyedDir, directoryName) {
    let result = {
        type: keyedDir,
        directory: directoryName,        
    };

    let copyProps = (result, packageJSON) => {
        result.issues = packageJSON["js-framework-benchmark"]["issues"];
        result.customURL = packageJSON["js-framework-benchmark"]["customURL"];
        let useShadowRoot = packageJSON["js-framework-benchmark"]["useShadowRoot"];
        result.useShadowRoot = useShadowRoot;
        result.useRowShadowRoot = packageJSON["js-framework-benchmark"]["useRowShadowRoot"];
        result.shadowRootName = useShadowRoot ? (packageJSON["js-framework-benchmark"]["shadowRootName"] ?? "main-element" ) : undefined;
        result.buttonsInShadowRoot = useShadowRoot ? (packageJSON["js-framework-benchmark"]["buttonsInShadowRoot"] ?? true) : undefined;
    }

    const frameworkPath = path.resolve("..", "frameworks", keyedDir, directoryName);
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

async function loadFrameworkVersionInformation(filterForFramework) {
    // let matchesDirectoryArg = (directoryName) =>
    // frameworkArgument.length == 0 || frameworkArgument.some((arg: string) => arg == directoryName);

    let resultsProm = [];
    let frameworksPath = path.resolve("..", "frameworks");
    for (keyedType of ["keyed", "non-keyed"]) {
      let directories = fs.readdirSync(path.resolve(frameworksPath, keyedType));
      for (let directory of directories) {
        let pathInFrameworksDir = keyedType + "/" + directory;
        if (!filterForFramework || filterForFramework===pathInFrameworksDir) {
          let fi = loadFrameworkInfo(keyedType, directory);
          resultsProm.push(fi);
        }
      }
    }
    return Promise.all(resultsProm);
  }

app.use('/frameworks', express.static(path.join(__dirname, '..', 'frameworks')))
app.use('/css', express.static(path.join(__dirname, '..', 'css')))

app.get('/ls', async (req, res) => {
    let t0 = Date.now();
    let frameworks = await loadFrameworkVersionInformation();
    res.send(frameworks);
    let t1 = Date.now();
    console.log("/ls duration ", (t1-t0));
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})