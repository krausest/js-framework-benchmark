[![Build Status](https://travis-ci.org/krausest/js-framework-benchmark.svg?branch=master)](https://travis-ci.org/krausest/js-framework-benchmark)

# js-framework-benchmark

This is a simple benchmark for several javascript frameworks. The benchmarks creates a large table with randomized entries and measures the time for various operations including rendering duration.

![Screenshot](images/screenshot.png?raw=true "Screenshot")

## About the benchmarks

The following operations are benchmarked for each framework:

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

## Snapshot of the results

Official results are posted on the blog mentioned above. The current snapshot that may not have the same quality (i.e. 
results might be for mixed browser versions, number of runs per benchmark may vary) can be seen [here](https://rawgit.com/krausest/js-framework-benchmark/master/webdriver-ts-results/table.html) 
[![Results](images/results.png?raw=true "Results")](https://rawgit.com/krausest/js-framework-benchmark/master/webdriver-ts-results/table.html)

## How to get started - building and running

There are currently ~60 framework entries in this repository. Installing (and maintaining) those can be challenging, but here are simplified instructions how to get started.

### 1. Prerequisites

Have *node.js (>=7.0)* installed. If you want to do yourself a favour use nvm for that and install yarn. The benchmark has been tested with node 7.0.
For some frameworks you'll also need *java* (>=8, e.g. openjdk-8-jre on ubuntu).
Please make sure that the following command work before trying to build:
```
> npm
npm -version
5.0.0
> node --version
v8.0.0
> echo %JAVA_HOME% / echo $JAVA_HOME
> java -version
java version "1.8.0_131" ...
> javac -version
javac 1.8.0_131
```

### 2. Start installing

As stated above building and running the benchmarks for all frameworks can be challenging, thus we start step by step...

Install global dependencies
This installs just a few top level dependencies for the building the frameworks and a http-server.
```
npm install
```
We start the http-server in the root directory
```
npm start
```
Verify that the http-server works:
Try to open [http://localhost:8080/index.html](http://localhost:8080/index.html). If you see something like that you're on the right track:
![Index.html](images/index.png?raw=true "Index.html")

Now open a new terminal window and keep http-server in background running

### 3. Building and running a single framework

We now try to build the first framework. Go to the vanillajs reference implementation
```
cd vanillajs-keyed
```
and install the dependencies
```
npm install
```
and build the framework
```
npm run build-prod
```
There should be no build errors and we can open the framework in the browser:
[http://localhost:8080/vanillajs-keyed/](http://localhost:8080/vanillajs-keyed/)

Some frameworks like aurelia, binding.scala or ember can't be opened that way, because they need a 'dist' or 'target/web/stage' or something in the URL. You can find out the correct URL in the [index.html](http://localhost:8080/index.html) you've opened before or take a look whether there's a third parameter in [common.ts](https://github.com/krausest/js-framework-benchmark/blob/master/webdriver-ts/src/common.ts#L38-L42) that represents the url.

Open the browser console and click a bit on the buttons and you should see some measurements printed on the console.
![First Run](images/firstRun.png?raw=true "First run")

> What is printed on the console is not what is actually measured by the automated benchmark driver. The benchmark driver extracts events from chrome's timeline to calculate the duration for the operations. What get's printed on the console above is an approximation of the actual duration which is pretty close to the actual duration.

## Optional 3.1: Contributing a new implementation

For contributions it is basically sufficient to create a new directory for your framework that supports `npm install` and `npm run build-prod` and can be then opened in the browser. All other steps are optional. Let's simulate that by copying vanillajs.
```
cp -r vanillajs-keyed super-vanillajs-keyed
```
Then we edit super-vanillajs-keyed/index.html to have a correct index.html:
```
<title>Super-VanillaJS-"keyed"</title>
...
                    <h1>Super-VanillaJS-"keyed"</h1>
```
In most cases you'll need `npm install` and `npm run build-prod` and then check whether it works in the browser on [http://localhost:8080/super-vanillajs-keyed/](http://localhost:8080/super-vanillajs-keyed/).

## 4. Running a single framework with the automated benchmark driver

As mentioned above the benchmark uses an automated benchmark driver using chromedriver to measure the duration for each operation using chrome's timeline. Here are the steps to run is for a single framework:

```
cd webdriver-ts
```
and install the dependencies
```
npm install
```
and build the benchmark driver
```
npm run build-prod
```
now run the benchmark driver for the vanillajs-keyed framework:
```
npm run selenium -- --count 3 --framework vanillajs-keyed
```
Just lean back and watch chrome running the benchmarks. It runs each benchmark 3 times for the vanillajs-keyed framework.

You should keep the chrome window visible since otherwise it seems like paint events can be skipped leading to wrong results. On the terminal will appear various log statements.  

The results for that run will be saved in the `webdriver-ts/results` directory. We can take a look at the results of a single result:
```
cat results/vanillajs-keyed_01_run1k.json
{"framework":"vanillajs-keyed","benchmark":"01_run1k","type":"cpu","min":135.532,"max":154.821,"mean":143.79166666666666,"median":141.022,"geometricMean":143.56641695989177,"standardDeviation":8.114582360718808,"values":[154.821,135.532,141.022]}
```
As you can see the mean duration for create 1000 rows was 144 msecs.

## 6. Building the result table

In the webdriver-ts directory issue the follwing command:
```
npm run static-results
```
Now a static result table should have been created which can be opened on [http://localhost:8080/webdriver-ts/table.html](http://localhost:8080/webdriver-ts/table.html).
There won't be much in table except for the column vanillajs-keyed at the right end of the first table.
![First Run Results](images/staticResults.png?raw=true "First Run Results")

## Optional 6.1 Adding your new implementation to the results table.

If you want to contribute a new framework and created a new directory in step 3, you'll need to add that framework to [webdriver-ts/src/common.ts](https://github.com/krausest/js-framework-benchmark/blob/master/webdriver-ts/src/common.ts#L35). The first parameter will be your directory name, the second whether the implementation is keyed and an optional third parameter if you need a special url or need to use shadow dom. So let's add:
```javascript
export let frameworks = [
...
f("vanillajs-non-keyed", false),
f("super-vanillajs-keyed", true), // this line must be added now somewhere in the list
f("vanillajs-keyed", true),
...
```
then recompile in directory `webdriver-ts`
```
npm run build-prod
```
run the benchmark for super-vanillajs-keyed
```
npm run selenium -- --count 3 --framework super-vanillajs-keyed
```
and update the result table
```
npm run static-results
```
Super-VanillaJS-keyed should now be listed in [http://localhost:8080/webdriver-ts/table.html](http://localhost:8080/webdriver-ts/table.html)

## Optional 7. Building the interactive results table

There's a nicer result table that allows filtering and sorting.
Before calling it the first time we have to install the dependencies. So we have to go to the `webdriver-ts-results` directory
```
cd ..
cd webdriver-ts-results
```
and install the dependencies
```
npm install
```
Then we go back to `webdriver-ts`
```
cd ..
cd webdriver-ts
```
and let it create the interactive table
```
npm run interactive-results
```
This will take a bit, but you should see no errors and be able to see the interactive results on [http://localhost:8080/webdriver-ts-results/table.html](http://localhost:8080/webdriver-ts-results/table.html)

## Optional 8. Building and running the benchmarks for all frameworks

This is not for the faint at heart. You can build all frameworks simply by issuing
`npm run build-prod` in the root directory. After downloading the whole internet it starts building it. Basically there should be no errors during the build, but I can't guarantee that the dependencies won't break.
You can now run selenium for all frameworks by invoking
`npm run selenium`
in the root directory.

After that you can check all results in [http://localhost:8080/webdriver-ts/table.html](http://localhost:8080/webdriver-ts/table.html).



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
* *Currently we're experimenting with a travis-ci integration build. Currently pull requests seem to fail quite often. Please ignore that for now.*

This work is derived from a benchmark that Richard Ayotte published on https://gist.github.com/RichAyotte/a7b8780341d5e75beca7 and adds more framework and more operations. Thanks for the great work.

Thanks to Baptiste Augrain for making the benchmarks more sophisticated and adding frameworks.
