# js-framework-benchmark

This is a simple benchmark for several javascript frameworks. The benchmarks creates a large table with randomized entries and measures the time for various operations.

This work is derived from a benchmark that Richard Ayotte published on https://gist.github.com/RichAyotte/a7b8780341d5e75beca7 and adds more framework and more operations.

It's also uses the work of ShMcK [Framework-Performance-Tests-with-Meteor](https://github.com/ShMcK/Framework-Performance-Tests-with-Meteor) who put Protractor and BenchPress wonderfully to work.

Thanks to both for their great work.

## Prerequsites

Have node.js installed. If you want to do yourself a favour use nvm for that. The benchmark has been tested with node 5.1+.

## Building

`npm install`

`npm run build`

The latter calls npm build-prod in each subproject.

## Running in the browser

Execute `npm start` to start a http-server for the web pages.
Open [http://localhost:8080](http://localhost:8080/) and choose the directory for the framework you want to test. Most actions will try to measure the duration. Depending on the framework this might be more or less precise. To measure the exact numbers one needs to use e.g. the timeline from the chrome dev tools. This kind of mea can be automated and repeated

## Execute the benchmarks with protractor and benchpress

`npm start`

`cd tests`
`npm run webdriver-manager`
open a new shell in the tests directory
`npm run protractor`

Open [http://localhost:8080/tests/chart.html](http://localhost:8080/tests/chart.html) for the results

## About the benchmarks

* page load & create 1000 rows: Time for page load and clicking on "Create 1000 rows".
* create 1000 rows: Measures the time for creating 1000 rows, but without page load duration.
* update 1000 rows: Time to replace all 1000 rows with new rows. It performs a few invocations as a warmup and measures the the time to replace the rows. Equivalent to clicking "Create 1000 rows" a few times and measuring the duration for the last click.
* 10 x add 10 rows: Time for adding a few items. It measures the time clickt 10 times on the "Add 10 rows" button.
* partial update: Clicks on the "Update every 10th row". Appends a dot to the text of every 10th row and keeps the other rows unchanged.
* select 10 rows: Measures the time to click the first ten rows one after the other. Each row is highlighted when clicked.
* remove 10 rows: Measures the time to remove the first ten rows one after the other.

A test showing the durations on my machine can be seen [here](https://rawgit.com/krausest/js-framework-benchmark/master/tests/chart.html)
