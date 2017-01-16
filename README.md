# js-framework-benchmark

This is a simple benchmark for several javascript frameworks. The benchmarks creates a large table with randomized entries and measures the time for various operations.

This work is derived from a benchmark that Richard Ayotte published on https://gist.github.com/RichAyotte/a7b8780341d5e75beca7 and adds more framework and more operations. Thanks for the great work.

Thanks to Baptiste Augrain for making the benchmarks more sophisticated and adding frameworks.

## Important News

Chrome 54 on OSX has a bug that causes webdriver to hang or crash on non english systems. Please run the following command prior to executing the webdriver-ts testdriver:```
export LANG="en_US.UTF-8"```

## Prerequsites

Have *node.js (>=6.0)* installed. If you want to do yourself a favour use nvm for that and install yarn. The benchmark has been tested with node 6.0.
You will also need *java* (>=6, e.g. openjdk-8-jre on ubuntu) for the google closure compiler, currently used in kivi.
Further maven is needed and the bin directory of maven must be added to the path.
Please make sure that the following command work before trying to build:
```
> npm
npm -version
4.0.5
> node --version
v7.4.0
> echo %JAVA_HOME% / echo $JAVA_HOME
> java -version
java version "1.8.0_111" ...
> javac
javac 1.8.0_111
> mvn -version
Apache Maven 3.3.9 (...
> git --version
git version 2.11.0.windows.3
```

## Building

* To build the benchmarks for all frameworks:

`npm install`
or 
`yarn`

`npm run build`

The latter calls npm build-prod in each subproject.

* To build a single benchmark for a framework, e.g. aurelia

`cd aurelia`

`npm install`
or 
`yarn`

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
The results of this benchmark is outlined on by blog ([round 1](http://www.stefankrause.net/wp/?p=191), [round 2](http://www.stefankrause.net/wp/?p=283), [round 3](http://www.stefankrause.net/wp/?p=301) and [round 4](http://www.stefankrause.net/wp/?p=316)).

## Execute the benchmarks with webdriver

The former java test runner has been replaced with a typescript based test runner. The new test runner contains no timer based waits and is thus much faster.

`npm start`

which starts a web server

`npm run selenium`

which runs the seleniums tests

Open [http://localhost:8080/webdriver-ts/table.html](http://localhost:8080/webdriver-ts/table.html) for the results

A test showing the durations on my machine (MacBook Pro 15, 2,5 GHz i7, 16 GB RAM) can be seen [here](https://rawgit.com/krausest/js-framework-benchmark/master/webdriver-ts/table.html)

Single tests can be repeated easily. Just `cd webdriver-ts` and run the benchmarks and frameworks you want, e.g:
`npm run selenium -- --framework angular bob --benchmark 01_ 02_`
runs the test for all frameworks that contain either angular or bob, which means all angular versions and bobril and all benchmarks whose id contain 01_ or 02_
which means the create rows and replace all rows benchmarks.
After that you'll want to update the result table with
`npm run results`

## How to contribute

Contributions are very welcome. Please use the following rules:
* Each contribution must be buildable by a "npm run build-prod" command in the directory. What build-prod does is up to you.
* All npm dependencies should be installed locally (i.e. listed in your package.json). Http-server should not be a local dependency. npm start in the root directory start a web server that can be used for all contributions.
* Please use fixed version number, no ranges, as it turned out to break often. Updating works IMO best with npm-check-updates, which keeps the version format.
* Webdriver-ts must be able to run the perf tests for the contribution. This means that all buttons (like "Create 1,000 rows") must have the correct id e.g. like in vanillajs. Using shadow DOM is a real pain for webdriver. The closer you can get to polymer the higher the chances I can make that contribution work.
