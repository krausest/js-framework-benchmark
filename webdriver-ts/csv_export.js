var _ = require('lodash');
var exec = require('child_process').execSync;
var fs = require('fs');
var path = require('path');
var yargs = require('yargs');

let directories = process.argv.length<=2 ? [] : process.argv.slice(2,process.argv.length);

console.log("directories", directories);

if (directories.length<=1) {
  console.log("ERROR: Please specify the directories");
  process.exit(1);
}

let benchmarks = fs.readdirSync(directories[0]);

// for (let dir of directories.slice(1)) {
//   console.log("checking dir", dir);
//   let dir_benchmarks = fs.readdirSync(dir);
//   if (!_.(dir_benchmarks, benchmarks)) {
//     console.log("the contents of the directories differ for ", dir, dir_benchmarks, benchmarks);
//     process.exit(1);
//   }
// }

let map = new Map();
for (let dir of directories) {
  map.set(dir, new Map());
}

for (let dir of directories) {
  for (let bench of benchmarks) {
    map.get(dir).set(bench, JSON.parse(fs.readFileSync(path.join(dir, bench), 'utf8')));
  }
}

let output = ';';
output += directories.join(";")+"\n";
for (let bench of benchmarks) {
  output += bench + ";";
  for (let dir of directories) {
    output += map.get(dir).get(bench).median +";"
  }
  output += "\n";
} 

console.log(output);
