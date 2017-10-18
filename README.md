[![CircleCI](https://circleci.com/gh/krausest/js-framework-benchmark.svg?style=svg)](https://circleci.com/gh/krausest/js-framework-benchmark)

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

Have *node.js (>=7.6)* installed. If you want to do yourself a favour use nvm for that and install yarn. The benchmark has been tested with node 8.4.0.
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

Now open a new terminal window and keep http-server running in background.

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
cd ..
cp -r vanillajs-keyed super-vanillajs-keyed
cd super-vanillajs-keyed
```
Then we edit super-vanillajs-keyed/index.html to have a correct index.html:
```
<title>Super-VanillaJS-"keyed"</title>
...
                    <h1>Super-VanillaJS-"keyed"</h1>
```
In most cases you'll need `npm install` and `npm run build-prod` and then check whether it works in the browser on [http://localhost:8080/super-vanillajs-keyed/](http://localhost:8080/super-vanillajs-keyed/).

(Of course in reality you'd rather throw out the javascript source files and use your framework there instead of only changing the html file.)

## 4. Running a single framework with the automated benchmark driver

As mentioned above the benchmark uses an automated benchmark driver using chromedriver to measure the duration for each operation using chrome's timeline. Here are the steps to run is for a single framework:

```
cd ..
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
Just lean back and watch chrome run the benchmarks. It runs each benchmark 3 times for the vanillajs-keyed framework.

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
There's nothing in table except for the column vanillajs-keyed at the right end of the first table.
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

> If you compare the results chances are that one of both is significantly faster. This is due to the very low number of runs and maybe some distracting background processes. Try again with a much higher count and you'll see the numbers converge.

## Optional 6.2 Updating the index.html file 
With
```
npm run index
```
you include Super-VanillaJS-keyed in [http://localhost:8080/index.html](http://localhost:8080/index.html)

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
This will take a bit, but you should see no errors besides some "MISSING FILE" messages and be able to see the interactive results on [http://localhost:8080/webdriver-ts-results/table.html](http://localhost:8080/webdriver-ts-results/table.html). The "MISSING FILE" warnings will disappear if the results for all frameworks are available.

## Optional 8. Building and running the benchmarks for all frameworks

This is not for the faint at heart. You can build all frameworks simply by issuing 
```
cd ..
npm run build-prod
```
After downloading the whole internet it starts building it. Basically there should be no errors during the build, but I can't guarantee that the dependencies won't break.
You can now run selenium for all frameworks by invoking
`npm run selenium`
in the root directory.

After that you can check all results in [http://localhost:8080/webdriver-ts/table.html](http://localhost:8080/webdriver-ts/table.html).

## Tips and tricks

* You can select multiple frameworks and benchmarks for running with prefixes like in the following example:
`npm run selenium -- --framework angular bob --benchmark 01_ 02_`
runs the test for all frameworks that contain either angular or bob, which means all angular versions and bobril and all benchmarks whose id contain 01_ or 02_
* If you can't get one framework to compile or run, just move it out of the root directory and remove it from common.ts, recompile and re-run
* To achieve good precision you should run each framework often enough. I recommend at least 10 times, more is better. The result table contains the mean and the standard deviation. You can seen the effect on the latter pretty well if you increase the count.

## How to contribute

Contributions are very welcome. Please use the following rules:
* Name your directory [FrameworkName]-v[Version]-[keyed|non-keyed]
* Each contribution must be buildable by `npm install` and `npm run build-prod` command in the directory. What build-prod does is up to you. Often there's an `npm run build-dev` that creates a development build
* Every implementation must use bootstrap provided in the root css directory. 
* All npm dependencies should be installed locally (i.e. listed in your package.json). Http-server should not be a local dependency. It is installed from the root directory to allow access to bootstrap.
* Please use fixed version number, no ranges, in package.json. Otherwise the build will break sooner or later - believe me. Updating works IMO best with npm-check-updates, which keeps the version format.
* Webdriver-ts must be able to run the perf tests for the contribution. This means that all buttons (like "Create 1,000 rows") must have the correct id e.g. like in vanillajs. Using shadow DOM is a real pain for webdriver. The closer you can get to polymer the higher the chances I can make that contribution work.
* Don't change the ids in the index.html, since the automated benchmarking relies on those ids.
* You don't need to update /index.html. It's created with a script (see 6.2 above).
* You don't need to edit webdriver-ts/common.ts. If you have a conflict in common.ts you don't need to resolve it. More often than not I'm just merging the pull request in the moment you're fixing the conflict.
* Currently we're experimenting with a circleci integration build.

This work is derived from a benchmark that Richard Ayotte published on https://gist.github.com/RichAyotte/a7b8780341d5e75beca7 and adds more framework and more operations. Thanks for the great work.

Thanks to Baptiste Augrain for making the benchmarks more sophisticated and adding frameworks.
