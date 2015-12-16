# js-framework-benchmark

This is a simple benchmark for several javascript frameworks. The benchmarks creates a large table with randomized entries and measures the time for various operations.

This work is derived from a benchmark that Richard Ayotte published on https://gist.github.com/RichAyotte/a7b8780341d5e75beca7 and adds more framework and more operations.

It's also uses the work of ShMcK Framework-Performance-Tests-with-Meteor who put Protractor and BenchPress wonderfully to work.

Thanks to both for their great work.

## Prerequsites

Have node.js installed. If you want to do yourself a favour use nvm for that. The benchmark has been tested with node 5.1+.

## Building

`npm install`
`npm run build`
The latter calls npm build-prod in each subproject.

## Running in the browser

Execute `npm start` to start a http-server for the web pages.
Open [http://localhost:8080](http://localhost:8080/) and choose the directory for the framework you want to test

## Execute the benchmarks with protractor and benchpress

`npm start`

`cd tests`
`npm run webdriver-manager`
open a new shell in the tests directory
`npm run protractor`

Open [http://localhost:8080/tests/chart.html](http://localhost:8080/tests/chart.html) for the results

## About the benchmarks

* page load & create 1000 rows: Time for page load and creating  1000 rows.
* create 1000 rows: Measures the time for creating 1000 rows, but after the page was loaded.
* update 1000 rows: Time to replace all 1000 rows with new rows. It performs a few invocations as a warmup and measures the the time to replace the rows.
* 10 x add 10 rows: Time for adding a few items. It measures the time to add 10 times 10 rows.
* partial update: Time for a partial update. Appends a dot to the text of every 10th row and keeps the other rows unchanged.
* select 10 rows: Measures the time to click the first ten rows one after the other. Each row is highlighted when clicked.
* remove 10 rows: Measures the time to remove the first ten rows one after the other.