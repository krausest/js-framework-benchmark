[![CircleCI](https://circleci.com/gh/krausest/js-framework-benchmark.svg?style=svg)](https://circleci.com/gh/krausest/js-framework-benchmark)

# js-framework-benchmark

This is a simple benchmark for several javascript frameworks. The benchmarks creates a large table with randomized entries and measures the time for various operations including rendering duration.

![Screenshot](images/screenshot.png?raw=true "Screenshot")

## About the benchmarks

The following operations are benchmarked for each framework:

* create rows: Duration for creating 1,000 rows after the page loaded (no warmup).
* replace all rows: Duration for replacing all 1,000 rows of the table (with 5 warmup iterations).
* partial update: Time to update the text of every 10th row for a table with 10,000 rows (with 5 warmup iterations).
* select row: Duration to highlight a row in response to a click on the row. (with 5 warmup iterations).
* swap rows: Time to swap 2 rows on a table with 1,000 rows. (with 5 warmup iterations).
* remove row: Duration to remove a row for a table with 1,000 rows. (with 5 warmup iterations).
* create many rows: Duration to create 10,000 rows (no warmup)
* append rows to large table: Duration for adding 1,000 rows on a table of 10,000 rows (no warmup).
* clear rows: Duration to clear the table filled with 10,000 rows. (no warmup)
* ready memory: Memory usage after page load.
* run memory: Memory usage after adding 1,000 rows.
* update memory: Memory usage after clicking 5 times update for a table with 1,000 rows.
* replace memory: Memory usage after clicking 5 times create 1,000 rows.
* repeated clear memory: Memory usage after creating and clearing 1,000 rows for 5 times.
* update memory: Memory usage after clicking 5 times update for a table with 1,000 rows.
* startup time: Duration for loading and parsing the javascript code and rendering the page.
* consistently interactive: The lighthouse metric TimeToConsistentlyInteractive: A pessimistic TTI - when the CPU and network are both definitely very idle. (no more CPU tasks over 50ms)
* script bootup time: The lighthouse metric ScriptBootUpTtime: The total ms required to parse/compile/evaluate all the page's scripts
* main thread work cost: The lighthouse metric MainThreadWorkCost: Total amount of time spent doing work on the main thread. includes style/layout/etc.
* total byte weight: The lighthouse metric TotalByteWeight: Network transfer cost (post-compression) of all the resources loaded into the page.

For all benchmarks the duration is measured including rendering time. You can read some details on this [article](http://www.stefankrause.net/wp/?p=218).


## Official results
Official results are posted on the [official results page](https://krausest.github.io/js-framework-benchmark/index.html).
My [blog](http://www.stefankrause.net/wp) has a few articles about about the benchmark.
Older results of this benchmark are outlined on my blog ([round 1](http://www.stefankrause.net/wp/?p=191), [round 2](http://www.stefankrause.net/wp/?p=283), [round 3](http://www.stefankrause.net/wp/?p=301), [round 4](http://www.stefankrause.net/wp/?p=316), [round 5](http://www.stefankrause.net/wp/?p=392), [round 6](http://www.stefankrause.net/wp/?p=431), [round 7](http://www.stefankrause.net/wp/?p=454) and [round 8](http://www.stefankrause.net/wp/?p=504)).

## Snapshot of the results

The current snapshot that may not have the same quality (i.e.
results might be for mixed browser versions, number of runs per benchmark may vary) can be seen [here](https://rawgit.com/krausest/js-framework-benchmark/master/webdriver-ts-results/table.html)
[![Results](images/results.png?raw=true "Results")](https://krausest.github.io/js-framework-benchmark/current.html)

## How to get started - building and running

There are currently ~60 framework entries in this repository. Installing (and maintaining) those can be challenging, but here are simplified instructions how to get started.

### 1. Prerequisites

Have *node.js (>=10.0)* installed. If you want to do yourself a favour use nvm for that and install yarn. The benchmark has been tested with node v10.16.3.
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
This installs just a few top level dependencies for the building the frameworks and a local web server.
```
npm install
```
We start the local web server in the root directory
```
npm start
```
Verify that the local web server works:
Try to open [http://localhost:8080/index.html](http://localhost:8080/index.html). If you see something like that you're on the right track:
![Index.html](images/index.png?raw=true "Index.html")

Now open a new terminal window and keep the web server running in background.

### 3. Building and running a single framework

We now try to build the first framework. Go to the vanillajs reference implementation
```
cd frameworks/keyed/vanillajs
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
[http://localhost:8080/frameworks/keyed/vanillajs/](http://localhost:8080/frameworks/keyed/vanillajs/)

Some frameworks like binding.scala or ember can't be opened that way, because they need a 'dist' or 'target/web/stage' or something in the URL. You can find out the correct URL in the [index.html](http://localhost:8080/index.html) you've opened before or take a look whether there's a customURL property under js-framework-benchmark in the [package.json](https://github.com/krausest/js-framework-benchmark/blob/master/frameworks/keyed/ember/package.json#L10) that represents the url.

## Optional 3.1: Contributing a new implementation

For contributions it is basically sufficient to create a new directory for your framework that supports `npm install` and `npm run build-prod` and can be then opened in the browser. All other steps are optional. Let's simulate that by copying vanillajs.
```
cd ../frameworks/keyed
cp -r vanillajs super-vanillajs
cd super-vanillajs
```
Then we edit super-vanillajs/index.html to have a correct index.html:
```
<title>Super-VanillaJS-"keyed"</title>
...
                    <h1>Super-VanillaJS-"keyed"</h1>
```
In most cases you'll need `npm install` and `npm run build-prod` and then check whether it works in the browser on [http://localhost:8080/frameworks/keyed/super-vanillajs/](http://localhost:8080/frameworks/keyed/super-vanillajs/).

(Of course in reality you'd rather throw out the javascript source files and use your framework there instead of only changing the html file.)

## 4. Running a single framework with the automated benchmark driver

The benchmark uses an automated benchmark driver using chromedriver to measure the duration for each operation using chrome's timeline. Here are the steps to run is for a single framework:

```
cd ../../..
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
npm run bench keyed/vanillajs
```
Just lean back and watch chrome run the benchmarks.
If it doesn't complain then the html for the table should be fine and your categorization as keyed or non-keyed should also be correct.


You should keep the chrome window visible since otherwise it seems like paint events can be skipped leading to wrong results. On the terminal will appear various log statements.

The results for that run will be saved in the `webdriver-ts/results` directory. We can take a look at the results of a single result:
```
cat results/vanillajs-keyed_01_run1k.json
{"framework":"vanillajs-keyed","benchmark":"01_run1k","type":"cpu","min":135.532,"max":154.821,"mean":143.79166666666666,"median":141.022,"geometricMean":143.56641695989177,"standardDeviation":8.114582360718808,"values":[154.821,135.532,141.022]}
```
As you can see the mean duration for create 1000 rows was 144 msecs.

You can also check whether the implementation appears to be compliant to the rules:
```
npm run check keyed/vanillajs
```
If it finds anything it'll report an ERROR.

## 6. Building the result table

Install libraries
```
cd ..
cd webdriver-ts-results
npm install
cd ..
cd webdriver-ts
```

In the webdriver-ts directory issue the follwing command:
```
npm run results
```
Now a result table should have been created which can be opened on [http://localhost:8080/webdriver-ts-results/table.html](http://localhost:8080/webdriver-ts-results/table.html).
There's nothing in table except for the column vanillajs-keyed at the right end of the first table.
![First Run Results](images/staticResults.png?raw=true "First Run Results")

## 6.1 Adding your new implementation to the results table.

(Notice: Updating common.ts is no longer necessary, super-vanillajs is visible in the result table)

Your package.json must include some information for the benchmark. Since you copied it, the important section is already there:
```
  ...
  "js-framework-benchmark": {
    "frameworkVersion": ""
  },
  ...

```
This one is a bit exceptional since vanillajs has no version. If you use a normal framework like react it carries a version information. For most frameworks you'll add a
dependency to your framework in package.json. The benchmark can automatically determine the correct version information from package.json and package-lock.json if you specify the
package name like that:
```
  "js-framework-benchmark": {
    "frameworkVersionFromPackage": "react"
  },
```
Now the benchmark will fetch the installed react version from package-lock.json in the react directory and use that version number to compute the correct version string.
If your library has multiple important packages like react + redux you can put them separated with a colon there like "react:redux".
If you don't pull your framework from npm you can hardcode a version like `"frameworkVersion": "0.0.1"`.
The other important, but optional properties for js-framework-benchmark are shown in the following example:
```
"customURL": "/target/web/stage",
"useShadowRoot": true
````
You can set an optional different URL if needed or specify that your DOM uses a shadow root.

## Optional 6.2 Updating the index.html file
With
```
npm run index
```
you include Super-VanillaJS-keyed in [http://localhost:8080/index.html](http://localhost:8080/index.html)

## Optional 7. Building and running the benchmarks for all frameworks

This is not for the faint at heart. You can build all frameworks simply by issuing
```
cd ..
npm run build-prod
```
After downloading the whole internet it starts building it. Basically there should be no errors during the build, but I can't guarantee that the dependencies won't break. (There's a docker build on the way which might make building it more robust. See https://github.com/krausest/js-framework-benchmark/wiki/%5BUnder-construction%5D-Build-all-frameworks-with-docker)
You can now run the benchmark for all frameworks by invoking
`npm run bench-all`
in the root directory.

After that you can check all results in [http://localhost:8080/webdriver-ts/table.html](http://localhost:8080/webdriver-ts/table.html).

## Tips and tricks

* You can select multiple frameworks and benchmarks for running with prefixes like in the following example in the webdriver-ts directory:
`npm run bench -- --framework angular bob --benchmark 01_ 02_`
runs the test for all frameworks that contain either angular or bob, which means all angular versions and bobril and all benchmarks whose id contain 01_ or 02_
* You can also run implementations by passing their directory names (cd to webdriver-ts):
`npm run bench keyed/angular keyed/react` or if you want to pass more options it becomes:
`npm run bench -- --count 3 keyed/angular keyed/react`.
* You can run all of the frameworks you've installed using `npm run bench -- --installed`
* If you can't get one framework to compile or run, just move it out of the root directory and remove it from common.ts, recompile and re-run
* To achieve good precision you should run each framework often enough. I recommend at least 10 times, more is better. The result table contains the mean and the standard deviation. You can seen the effect on the latter pretty well if you increase the count.
* One can check whether an implementation is keyed or non-keyed via `npm run isKeyed` in the webdriver-ts directory. You can limit which frameworks to check in the same way as the webdriver test runner like e.g. `npm run isKeyed -- --framework svelte`. The program will report an error if a benchmark implementation is incorrectly classified.

## How to contribute

Contributions are very welcome. Please use the following rules:
* Name your directory frameworks/[keyed|non-keyed]/[FrameworkName]
* Each contribution must be buildable by `npm install` and `npm run build-prod` command in the directory. What build-prod does is up to you. Often there's an `npm run build-dev` that creates a development build
* Every implementation must use bootstrap provided in the root css directory.
* All npm dependencies should be installed locally (i.e. listed in your package.json). Http-server or other local web servers should not be local dependencies. It is installed from the root directory to allow access to bootstrap.
* Please use *fixed version* numbers, no ranges, in package.json. Otherwise the build will break sooner or later - believe me. Updating works IMO best with npm-check-updates, which keeps the version format.
* Webdriver-ts must be able to run the perf tests for the contribution. This means that all buttons (like "Create 1,000 rows") must have the correct id e.g. like in vanillajs. Using shadow DOM is a real pain for webdriver. The closer you can get to polymer the higher the chances I can make that contribution work.
* Don't change the ids in the index.html, since the automated benchmarking relies on those ids.
* Please push only files in your framework folder (not index.html or results.json)
* **Please make sure your implementation is validated by the test tool.** cd to webdriver-ts and invoke it with `npm run check [keyed|non-keyed]/[FrameworkName]`. It'll print an error if your framework behaves other as specified. It'll print a big ERROR explaining if it isn't happy with the implementation.
* Please don't commit any of the result file webdriver-ts/table.html, webdriver-ts-results/src/results.ts or webdriver-ts-results/table.html. I use to run the benchmarks after merging and publish updated (temporary) results.
* The latest stable chrome can be used regarding web features and language level (babel-preset-env "last 1 chrome versions")
* The vanillajs implementations and some others include code that try to approximate the repaint duration through javascript code. Implemenatations are not required to include that measurement. Remember: The real measurements are taken by the automated test driver by examining chrome timeline entries.
* **Please don't over-optimize. Other contributors will review your implementation so beware of discussions ([#521](https://github.com/krausest/js-framework-benchmark/pull/521), [#519](https://github.com/krausest/js-framework-benchmark/pull/519), [#430](https://github.com/krausest/js-framework-benchmark/issues/430)) and rejection if the community finds you cheating. When are you safe?**
  * If the initial rendering is able to render the selection state
  * The implementation uses only the idiomatic style of its library
  * If you don't use userland hacks in your implementation like dom manipulations or request animation frame calls
Tip: If you start with your implementation do not take vanillajs as the reference. It violates those rules and serves only as a performance baseline and not as a best practice implementation.

This work is derived from a benchmark that Richard Ayotte published on https://gist.github.com/RichAyotte/a7b8780341d5e75beca7 and adds more framework and more operations. Thanks for the great work.

Thanks to Baptiste Augrain for making the benchmarks more sophisticated and adding frameworks.

## History

Frameworks without significant activity on github or npm for more than a year will be removed (_automatic commits like dependabot and minor updates, like docs editions, are ignored_).

### 2020-7-9

- [x] crui Last significant commit Jul 28, 2019
- [x] etch Last commit Sep 12, 2018
- [x] hyperoop Last significant commit Dec 23, 2018
- [ ] faster-dom (to be replaced by a new revact implementation)
- [x] marionette Last significant commit Apr 20, 2019
- [ ] plastiq (to be replaced by a new Hyperdom implementation)
- [x] rawact Last commit Dec 3, 2018
- [x] react-djinn Last NPM publish 2019-05-03 (the Github org a repo aren't available anymore)
- [ ] react-easy-state (test new @risingstack/react-easy-state package name)
- [x] react-lite Last commit Mar 29, 2019
- [x] redux-combiner Last commit May 14, 2018
- [x] surplus Last commit Jan 5, 2019
- [x] gruu Last commit Jun 23, 2019
- [x] lite-html Last commit Sep 7, 2018

### 2019-9-16

- [x] angular-light Last commit Nov 30, 2017
- [x] nx. Last commit Feb 2017
- [x]  maik-h  Last commit Dec 15, 2017
- [x] rivets Last commit Oct 22, 2016
- [x] tsers. Last commit Jun 19, 2016
