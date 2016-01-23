"use strict";

var
  vinyl = require('vinyl-fs'),
  fs = require('fs'),
  map = require('map-stream'),
  readline = require('readline'),
    hexToRgba = require('hex-rgba');

/* Regex conditions for picking data */
var benchRegex = RegExp(/^\*{13} Testing time for (\|.*\|.*\|\d*) \*{13}$/gm),
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
          var iterations = parseFloat(m[3]);
          recorder[curMode] = recorder[curMode] || {};
          recorder[curMode][framework] = {iterations: iterations};
          console.log("*",curMode, framework,  recorder[curMode][framework].iterations);
        }
        // matching line before data
        else if (line.match(preDataRegex)) {
          recordData = true;
        }
        // recording data
        else if (recordData) {
            var res = trimResults(line);
            recorder[curMode][framework].data = res;
          prepareRecord = false;
          recordData = false;
        }
      });

      // print rows of data from recorder
      rl.on('close', function () {
          var colors = ["#00AAA0", "#8ED2C9", "#44B3C2", "#F1A94E", "#E45641", "#5D4C46", "#7B8D8E", "#F2EDD8", "#462066"];
          var data = {labels:[], datasets: []};
          var firstTest = Object.keys(recorder)[0];

          Object.keys(recorder).forEach(function(test, tidx) {

              data.labels.push(test);

              Object.keys(recorder[firstTest]).forEach(function (framework, fidx) {
                  // var dataRow = [];
                  var totalTime = parseFloat(recorder[test][framework].data[measure.script])/recorder[test][framework].iterations;
                  var scriptTime = parseFloat(recorder[test][framework].data[measure.pureScript])/recorder[test][framework].iterations;
                  var renderTime = parseFloat(recorder[test][framework].data[measure.render])/recorder[test][framework].iterations;
                  console.log(test, framework,  recorder[test][framework].iterations);

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
                  data.datasets[fidx].data[tidx] = scriptTime+renderTime;
              });
          });
          var resultData = "var data = "+JSON.stringify(data)+";";
          fs.writeFile("chartData.js", resultData, "utf-8");
      });
      cb(null, file);
    }))
}


function tables() {
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
                    var iterations = parseFloat(m[3]);
                    recorder[curMode] = recorder[curMode] || {};
                    recorder[curMode][framework] = {iterations: iterations};
                    console.log("*",curMode, framework,  recorder[curMode][framework].iterations);
                }
                // matching line before data
                else if (line.match(preDataRegex)) {
                    recordData = true;
                }
                // recording data
                else if (recordData) {
                    var res = trimResults(line);
                    recorder[curMode][framework].data = res;
                    prepareRecord = false;
                    recordData = false;
                }
            });

            // print rows of data from recorder
            rl.on('close', function () {
                var firstTest = Object.keys(recorder)[0];

                var resultData =  getSpaces("Framework")+"Framework"+";" + getSpaces("scriptTime")+"scriptTime"+";" + getSpaces("pureScriptTime")+"pureScriptTime"+";" + getSpaces("renderTime")+"renderTime"+";";

                Object.keys(recorder).forEach(function(test, tidx) {

                    resultData += "\n"+test+"\n";

                    Object.keys(recorder[firstTest]).forEach(function (framework, fidx) {
                        // var dataRow = [];
                        var totalTime = parseFloat(recorder[test][framework].data[measure.script])/recorder[test][framework].iterations;
                        var scriptTime = parseFloat(recorder[test][framework].data[measure.pureScript])/recorder[test][framework].iterations;
                        var renderTime = parseFloat(recorder[test][framework].data[measure.render])/recorder[test][framework].iterations;
                        console.log(test, framework,  recorder[test][framework].iterations);
                        resultData += framework+getSpaces(framework);
                        resultData += ";"+getSpaces(totalTime)+totalTime.toFixed(2);
                        resultData += ";"+getSpaces(scriptTime)+scriptTime.toFixed(2);
                        resultData += ";"+getSpaces(renderTime)+renderTime.toFixed(2)+"\n";
                    });
                });
                fs.writeFile("table_result.txt", resultData, "utf-8");
            });
            cb(null, file);
        }))
}

// adjust spaces in output
function getSpaces(obj) {
    if (typeof obj === "number") {
        return getSpaces(obj.toFixed(2));
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
tables();