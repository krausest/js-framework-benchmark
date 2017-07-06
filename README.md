[![Build Status](https://travis-ci.org/krausest/js-framework-benchmark.svg?branch=master)](https://travis-ci.org/krausest/js-framework-benchmark)

# js-framework-benchmark

This is a simple benchmark for several javascript frameworks. The benchmarks creates a large table with randomized entries and measures the time for various operations.

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
* startup time: Duration for loading and parsing the javascript code and rendering the page.

For all benchmarks the duration is measured including rendering time. You can read some details on this [article](http://www.stefankrause.net/wp/?p=218).
The results of this benchmark is outlined on my blog ([round 1](http://www.stefankrause.net/wp/?p=191), [round 2](http://www.stefankrause.net/wp/?p=283), [round 3](http://www.stefankrause.net/wp/?p=301), [round 4](http://www.stefankrause.net/wp/?p=316) [round 5](http://www.stefankrause.net/wp/?p=392) and [round 6](http://www.stefankrause.net/wp/?p=431)).

## Temporary results

Official results are posted on the blog mentioned above. A snapshot that may not have the same quality (i.e. 
results might be for mixed browser versions, number of runs per benchmark may vary) can be seen [here](https://rawgit.com/krausest/js-framework-benchmark/master/webdriver-ts-results/table.html) or as a static page here [here](https://rawgit.com/krausest/js-framework-benchmark/master/webdriver-ts/table.html)
The benchmark was run on a MacBook Pro 15 (2,5 GHz i7, 16 GB RAM, OSX >= 10.12.5, Chrome >= 58.0.3029.110 (64-bit))

## Important News

Chrome 54 on OSX has a bug that causes webdriver to hang or crash on non english systems. Please run the following command prior to executing the webdriver-ts testdriver:```
export LANG="en_US.UTF-8"```

## Prerequisites

Have *node.js (>=6.0)* installed. If you want to do yourself a favour use nvm for that and install yarn. The benchmark has been tested with node 7.0.
You will also need *java* (>=8, e.g. openjdk-8-jre on ubuntu) for the google closure compiler, currently used in kivi.
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
> javac -version
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

## Execute the benchmarks with webdriver

The former java test runner has been replaced with a typescript based test runner. The new test runner contains no timer based waits and is thus much faster.

`npm start`

which starts a web server

`npm run selenium`

which runs the seleniums tests

Open [http://localhost:8080/webdriver-ts-results/table.html](http://localhost:8080/webdriver-ts-results/table.html) or the static version [http://localhost:8080/webdriver-ts/table.html](http://localhost:8080/webdriver-ts/table.html) for the results

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

How to start submitting a new implementation:
* Clone the repository. `npm install` would be next and will invoke install.js that in turn calls `npm install` in every folder. If you're not interested in mirroring npm just remove the folders for frameworks you're not interested in and run `npm install` then.
* If something fails the easiest way is to move the folder that causes the problem somewhere else and run `npm install` (or `npm run build-prod` if you really want to build all benchmarks again). The install and build process prints the name of the folder it is currently working on so it should be simple to find which folder causes the problems.
* Create a folder according to the naming scheme "framework-version"
* cd into that folder
* Create a package.json such that `npm install` installs *all* necessary dependencies including grunt, webpack, gulp and so on (the only thing you don't need is http-server).
* Create a src directory and put your implementation there.
* Take a look at some other framework you know like react or vue and start adapting the source code.
* Copy the index.html from that implementation, copy the Store implementation. It might already contain all that is necessary and you might only have to bind the data and events in your index.html
* Don't change the ids in the index.html, since the automated benchmarking relies on those ids.
* The package.json must support a build-prod task that assembles your application. Often you'd use webpack to do that.
* Make sure your application compiles and runs in the browser. The easiest way to start a local server is by invoking npm start in the root dir and opening your application on http://localhost:8080/framework-version/index.html
* Optional: Run it with the automated benchmarking tool. Add a new array entry to the frameworks array in webdriver-ts/src/common.ts. Compile the test driver in webdriver-ts with `npm run build-prod` and run it just with `npm run selenium -- --framework framework-version` if you want to run your version only or just `npm run selenium` if you have time, built everything and want to run the benchmarks for all frameworks. The results will be written in the directory webdriver-ts/results in JSON format. `npm run results` will create the results table that can be opened on http://localhost:8080/webdriver-ts/table.html. If you don't I'll update webdriver-ts for you ;-)
* *If you have a conflict in index.html or common.ts you don't need to fix them. I'm fine with solving conflicts in those files.*.

This work is derived from a benchmark that Richard Ayotte published on https://gist.github.com/RichAyotte/a7b8780341d5e75beca7 and adds more framework and more operations. Thanks for the great work.

Thanks to Baptiste Augrain for making the benchmarks more sophisticated and adding frameworks.
