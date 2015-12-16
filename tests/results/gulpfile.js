"use strict";

var gulp = require('gulp'),
  vinyl = require('vinyl-fs'),
  fs = require('fs'),
  map = require('map-stream'),
  readline = require('readline'),
  hexToRgba = require('hex-rgba');;

/* Regex conditions for picking data */
var benchRegex = RegExp(/^\*{13} Testing time for (\w+\|\w+) \*{13}$/gm),
  preDataRegex = RegExp(/^[={18} \|]+$/gm),
  dataRegex = RegExp(/(\s+(\d+\.\d+(\+\-\d+\%)?)(?: \|)?)+/gm),
  dataFailureStop = RegExp(/^\*{57}/gm);

// file input / ouput
var input = './completed/*.txt';
var output = './results.md';

// define which column
var measure = {
  script: 7,
  pureScript: 5,
  render: 6
};

/**
 * Collect data from text files
 * Generate tables for each file
 * Generate overall chart data
 */
gulp.task('tables', function () {
  vinyl.src(input)
    .pipe(map(function (file, cb) {
      var recorder = {
      };
      var rl = readline.createInterface({
        input: fs.createReadStream(file.path, 'utf8')
      });

      var prepareRecord = false,
        recordData = false,
        curMode = undefined,
          framework = undefined;

      function nextMode() {
        if (prepareRecord) {
          recorder[curMode].push('error');
        }
        prepareRecord = true;
        recordData = false;
      }

      rl.on('line', function (line) {
        if (line.match(benchRegex)) {
          var match = benchRegex.exec(line);
          nextMode();
          let m = match[1].split('|');
          curMode = m[0];
          framework = m[1];
          recorder[curMode] = recorder[curMode] || {};
          recorder[curMode][framework] = {};
        }
        // matching line before data
        else if (line.match(preDataRegex)) {
          recordData = true;
        }
        // recording data
        else if (recordData) {
            var res = trimResults(line);
            recorder[curMode][framework] = res;
          prepareRecord = false;
          recordData = false;
        }
      });

      // print rows of data from recorder
      rl.on('close', function () {
        console.log('\n');
        console.log(`File: ${file.basename}`);
        console.log('\n');

        console.log('            Test |        Framework |         Duration');

        // collect data from column
        // log into table rows
          Object.keys(recorder).forEach(function (test, index) {
              Object.keys(recorder[test]).forEach(function (framework, index) {
                  var totalTime = parseInt(recorder[test][framework][measure.script]);
                  console.log(`${getSpaces(test)}${test} | ${getSpaces(framework)}${framework} | ${getSpaces(totalTime)}${totalTime}`);
              });
        });
      });
      cb(null, file);
    }))
});

gulp.task('chart', function () {
  vinyl.src(input)
    .pipe(map(function (file, cb) {
      var recorder = {
      };
      var rl = readline.createInterface({
        input: fs.createReadStream(file.path, 'utf8')
      });

      var prepareRecord = false,
        recordData = false,
        curMode = undefined,
          framework = undefined;

      function nextMode() {
        if (prepareRecord) {
          recorder[curMode].push('error');
        }
        prepareRecord = true;
        recordData = false;
      }

      rl.on('line', function (line) {
        if (line.match(benchRegex)) {
          var match = benchRegex.exec(line);
          nextMode();
          let m = match[1].split('|');
          curMode = m[0];
          framework = m[1];
          recorder[curMode] = recorder[curMode] || {};
          recorder[curMode][framework] = {};
        }
        // matching line before data
        else if (line.match(preDataRegex)) {
          recordData = true;
        }
        // recording data
        else if (recordData) {
            var res = trimResults(line);
            recorder[curMode][framework] = res;
          prepareRecord = false;
          recordData = false;
        }
      });

      // print rows of data from recorder
      rl.on('close', function () {
          var colors = ["#006495", "#004C70", "#0093D1", "#F2635F", "#F4D00C", "#E0A025"];
          var data = {};
          data.labels = Object.keys(recorder).map(function (test) { return test; });
          data.datasets = [];
          var firstTest = Object.keys(recorder)[0];
          Object.keys(recorder[firstTest]).forEach(function(framework, idx) {
              var dataRow = [];
              Object.keys(recorder).forEach(function (test, index) {
                  var totalTime = parseInt(recorder[test][framework][measure.script]);
                  dataRow.push(totalTime);
              });
              var ds = {
                  label: framework,
                  fillColor: hexToRgba(colors[idx % colors.length], 50),
                  strokeColor: hexToRgba(colors[idx % colors.length], 80),
                  highlightFill: hexToRgba(colors[idx % colors.length], 70),
                  highlightStroke: hexToRgba(colors[idx % colors.length], 90),
                  data: dataRow
              };
              data.datasets.push(ds);
          });
            console.log("var data = "+JSON.stringify(data)+";");
/*          console.log("var data = {");
          console.log("labels: ["+labels+"],");
              datasets: [
                  {
                      label: "My First dataset",
                      fillColor: "rgba(220,220,220,0.5)",
                      strokeColor: "rgba(220,220,220,0.8)",
                      highlightFill: "rgba(220,220,220,0.75)",
                      highlightStroke: "rgba(220,220,220,1)",
                      data: [65]
                  },
                  {
                      label: "My Second dataset",
                      fillColor: "rgba(151,187,205,0.5)",
                      strokeColor: "rgba(151,187,205,0.8)",
                      highlightFill: "rgba(151,187,205,0.75)",
                      highlightStroke: "rgba(151,187,205,1)",
                      data: [28]
                  },
                  {
                      label: "My Third dataset",
                      fillColor: "rgba(220,220,220,0.5)",
                      strokeColor: "rgba(220,220,220,0.8)",
                      highlightFill: "rgba(220,220,220,0.75)",
                      highlightStroke: "rgba(220,220,220,1)",
                      data: [65]
                  },
                  {
                      label: "My Fourth dataset",
                      fillColor: "rgba(151,187,205,0.5)",
                      strokeColor: "rgba(151,187,205,0.8)",
                      highlightFill: "rgba(151,187,205,0.75)",
                      highlightStroke: "rgba(151,187,205,1)",
                      data: [28]
                  }
              ]
          };
        // collect data from column
        // log into table rows
          Object.keys(recorder).forEach(function (test, index) {
              Object.keys(recorder[test]).forEach(function (framework, index) {
                  var totalTime = parseInt(recorder[test][framework][measure.script]);
                  console.log(`${getSpaces(test)}${test} | ${getSpaces(framework)}${framework} | ${getSpaces(totalTime)}${totalTime}`);
              });
        });*/
      });
      cb(null, file);
    }))
});

gulp.task('default', ['tables']);

// adjust spaces in output
function getSpaces(obj) {
    if (typeof obj === "number") {
        return ' '.repeat(16 - obj.toString().length);
    } else {
        return ' '.repeat(16 - obj.length);
    }
}

// not efficient, but couldn't get regex captures to work
function trimToNumbersOnly(string) {
  return string.replace(/\D/g, '');
}

function trimMarginOfError(string) {
  if (string.indexOf('+') > -1) {
    return string.slice(0, string.indexOf('+'));
  } else {
    return string;
  }
}

// remove white space around data
function trimResults(string) {
  var array = string.split('|');
  return array.map(function (string) {
    return string.trim();
  });
}

function mapScriptData(item) {
  return trimMarginOfError(item[measure.script]);
}
