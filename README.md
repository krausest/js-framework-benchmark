# js-framework-benchmark

This is a simple benchmark for several javascript frameworks. The benchmarks creates a large table with randomized entries and measures the time for various operations.

This work is derived from a benchmark that Richard Ayotte published on https://gist.github.com/RichAyotte/a7b8780341d5e75beca7 and adds more framework and more operations. Thanks for the great work.

Thanks to Baptiste Augrain for making the benchmarks more sophisticated and adding frameworks.

## Prerequsites

Have *node.js (>=6.0)* installed . If you want to do yourself a favour use nvm for that. The benchmark has been tested with node 6.0.
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

* create rows: Duration for creating 1000 rows after the page loaded.
* replace all rows: Duration for updating all 1000 rows of the table (with 5 warmup iterations).
* partial update: Time to update the text of every 10th row (with 5 warmup iterations).
* select row: Duration to highlight a row in response to a click on the row. (with 5 warmup iterations).
* swap rows: Time to swap 2 rows on a 1K table. (with 5 warmup iterations).
* remove row: Duration to remove a row. (with 5 warmup iterations).
* create many rows: Duration to create 10,000 rows
* append rows to large table: Duration for adding 1000 rows on a table of 10,000 rows.
* clear rows: Duration to clear the table filled with 10.000 rows.
* clear rows a 2nd time: Time to clear the table filled with 10.000 rows. But warmed up with only one iteration.
* ready memory: Memory usage after page load.
* run memory: Memory usage after adding 1000 rows.

For all benchmarks the duration is measured including rendering time. You can read some details on this [article](http://www.stefankrause.net/wp/?p=218).
The results of this benchmark is outlined on by blog ([round 1](http://www.stefankrause.net/wp/?p=191), [round 2](http://www.stefankrause.net/wp/?p=283) and [round 3](http://www.stefankrause.net/wp/?p=301))

## Execute the benchmarks with selenium

You need to have a current java and maven installation to run the automated benchmark.

`npm start`
which starts a web browser
`npm run selenium`
which runs the seleniums tests

For each framework the results are stored in JSON format in the webdriver-java directory. The script makeTable.js creates the final results.

Open [http://localhost:8080/webdriver-java/table.html](http://localhost:8080/webdriver-java/table.html) for the results

A test showing the durations on my machine can be seen [here](https://cdn.rawgit.com/krausest/js-framework-benchmark/a358bc967e1d9ff0c268b43f5ab8b832abe0476e/webdriver-java/table.html)
