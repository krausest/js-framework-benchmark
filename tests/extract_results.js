"use strict";

var
  vinyl = require('vinyl-fs'),
  fs = require('fs'),
  map = require('map-stream'),
  readline = require('readline'),
    hexToRgba = require('hex-rgba');

/* Regex conditions for picking data */
var benchRegex = RegExp(/^\*{13} Testing time for (\|.*\|.*\|) \*{13}$/gm),
  preDataRegex = RegExp(/^[={18} \|]+$/gm),
  dataRegex = RegExp(/(\s+(\d+\.\d+(\+\-\d+\%)?)(?: \|)?)+/gm),
  dataFailureStop = RegExp(/^\*{57}/gm);

// file input / ouput
var input = './results.txt';

// define which column
var measure = {
  script: 7,
  pureScript: 5,
  render: 6
};

function chart() {
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
          curMode = m[1];
          framework = m[2];
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
          var data = {labels:[], datasets: []};
          var firstTest = Object.keys(recorder)[0];

          Object.keys(recorder).forEach(function(test, tidx) {

              data.labels.push(test);

              Object.keys(recorder[firstTest]).forEach(function (framework, fidx) {
                  // var dataRow = [];
                  var totalTime = parseFloat(recorder[test][framework][measure.script]);

                  if (!data.datasets[fidx]) {
                      data.datasets[fidx] = {
                          label: framework,
                          fillColor: hexToRgba(colors[fidx % colors.length], 50),
                          strokeColor: hexToRgba(colors[fidx % colors.length], 80),
                          highlightFill: hexToRgba(colors[fidx % colors.length], 70),
                          highlightStroke: hexToRgba(colors[fidx % colors.length], 90),
                          data: []
                      };
                  }
                  data.datasets[fidx].data[tidx] = totalTime;
              });
          });
          var resultData = "var data = "+JSON.stringify(data)+";";
          fs.writeFile("chartData.js", resultData, "utf-8");
      });
      cb(null, file);
    }))
}

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

chart();