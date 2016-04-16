# js-framework-benchmark

This is a simple benchmark for several javascript frameworks. The benchmarks creates a large table with randomized entries and measures the time for various operations.

This work is derived from a benchmark that Richard Ayotte published on https://gist.github.com/RichAyotte/a7b8780341d5e75beca7 and adds more framework and more operations.

Thanks for the great work.

## Changes

- more test cases
- add versioning for testing mulitple versions of the same platform
- tweaking on test runs (allows to re-runs all the cases/platforms)

## Prerequsites

Have *node.js* installed. If you want to do yourself a favour use nvm for that. The benchmark has been tested with node 5.1+.
You will also need *mvn* for *selenium*.

## Building

* To build the benchmarks for all frameworks:

`npm install`

`npm run build`

The latter calls npm build-prod in each subproject.

* To build a single benchmark for a framework, e.g. aurelia

`cd aurelia`

`npm install`

`npm run build-prod`

## Running in the browser

Execute `npm start` in the main directory to start a http-server for the web pages.
Open [http://localhost:8080](http://localhost:8080/) and choose the directory for the framework you want to test.
Most actions will try to measure the duration and print it to the console. Depending on the framework this might be more or less precise. To measure the exact numbers one needs to use e.g. the timeline from the chrome dev tools.

## About the benchmarks

* create 1000 rows: Time for creating a table with 1000 rows after the page loaded.
* update 1000 rows (hot): Time for updating all 1000 rows of the table. A few iterations to warmup the javascript engine are performed before measuring.
* partial update: Time to update the text of every 10th row. A few iterations to warmup the javascript engine are performed before measuring.
* select row: Duration to highlight a row in response to a click on the row. A few iterations to warmup the javascript engine are performed before measuring.
* remove row: Duration to remove a row. A few iterations to warmup the javascript engine are performed before measuring.
* hide all: Time for hiding all the rows
* show all: Timne for showing all the rows (after being hidden)
* create lots of rows: Time for creating a table lots a rows (currently 10.000).
* add 1000 rows after lots of rows: Time for adding 1000 rows on a table of add 1000 rows after lots of rows.
* clear rows: Time to clear the table filled with 10.000 rows
* clear rows a 2nd time: Time to clear the table filled with 10.000 rows. But warmed up with only one iteration.
* select row on big list: Time to select a row on a 10K table.
* swap rows: Time to swap 2 rows (1K table).
* recycle rows: Time to create 1000 rows after clearing a 1K table.

## Execute the benchmarks with selenium

You need to have a current java and maven installation to run the automated benchmark.

`npm start`
which starts a web browser
`npm run selenium`
which runs the seleniums tests

Open [http://localhost:8080/webdriver-java/chart.html](http://localhost:8080/webdriver-java/chart.html) for the results

A test showing the durations on my machine can be seen [here](https://rawgit.com/krausest/js-framework-benchmark/master/webdriver-java/chart.html)

## Results

[See the results](https://output.jsbin.com/lohibu/)