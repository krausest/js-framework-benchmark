# js-framework-benchmark

This is a simple benchmark for several javascript frameworks. The benchmarks creates a large table with randomized entries and measures the time for various operations including rendering duration.

![Screenshot](images/screenshot.png?raw=true "Screenshot")

## Security advice

Currently there are 186 implemenations in this repository. It's of course impossible for me to make a security assessment
for all those implementations. `npm ci` and `npm install` can execute arbitraty commands, so they should be executed only for packages you trust. Consequently I build on a dedicated virtual private linux server such that I don't have to install the packages for all those implemenations on my laptop. There's a prebuild build.zip for each chrome release you can download such that you can avoid installing the packages from all implementations. 
(I don't know of any (attempted) case for malicious packages in this repository, so please take it just as a general warning.)

The server implemenation in this repository should only be started on your local machine and access should be restricted to your local machine. I recommend against starting the server such that it can be publically accessed from the internet.

## About the benchmarks

The following operations are benchmarked for each framework:

- create rows: Duration for creating 1,000 rows after the page loaded (no warmup).
- replace all rows: Duration for replacing all 1,000 rows of the table (with 5 warmup iterations).
- partial update: Time to update the text of every 10th row for a table with 10,000 rows (with 5 warmup iterations).
- select row: Duration to highlight a row in response to a click on the row. (with 5 warmup iterations).
- swap rows: Time to swap 2 rows on a table with 1,000 rows. (with 5 warmup iterations).
- remove row: Duration to remove a row for a table with 1,000 rows. (with 5 warmup iterations).
- create many rows: Duration to create 10,000 rows (no warmup)
- append rows to large table: Duration for adding 1,000 rows on a table of 10,000 rows (no warmup).
- clear rows: Duration to clear the table filled with 10,000 rows. (no warmup)
- ready memory: Memory usage after page load.
- run memory: Memory usage after adding 1,000 rows.
- update memory: Memory usage after clicking 5 times update for a table with 1,000 rows.
- replace memory: Memory usage after clicking 5 times create 1,000 rows.
- repeated clear memory: Memory usage after creating and clearing 1,000 rows for 5 times.
- update memory: Memory usage after clicking 5 times update for a table with 1,000 rows.
- startup time: Duration for loading and parsing the javascript code and rendering the page.
- consistently interactive: The lighthouse metric TimeToConsistentlyInteractive: A pessimistic TTI - when the CPU and network are both definitely very idle. (no more CPU tasks over 50ms)
- script bootup time: The lighthouse metric ScriptBootUpTtime: The total ms required to parse/compile/evaluate all the page's scripts
- main thread work cost: The lighthouse metric MainThreadWorkCost: Total amount of time spent doing work on the main thread includes style/layout/etc.
- total byte weight: The lighthouse metric TotalByteWeight: Network transfer cost (post-compression) of all the resources loaded into the page.

For all benchmarks the duration is measured including rendering time. You can read some details on this [article](http://www.stefankrause.net/wp/?p=218) and in the [wiki](https://github.com/krausest/js-framework-benchmark/wiki/How-the-duration-is-measured). Starting with chrome 118 the overall performance is computed as a [weighted geometric mean](https://github.com/krausest/js-framework-benchmark/wiki/Computation-of-the-weighted-geometric-mean).

## Official results

Official results are posted on the [official results page](https://krausest.github.io/js-framework-benchmark/index.html).
My [blog](http://www.stefankrause.net/wp) has a few articles about the benchmark.
Older results of this benchmark are outlined on my blog ([round 1](http://www.stefankrause.net/wp/?p=191), [round 2](http://www.stefankrause.net/wp/?p=283), [round 3](http://www.stefankrause.net/wp/?p=301), [round 4](http://www.stefankrause.net/wp/?p=316), [round 5](http://www.stefankrause.net/wp/?p=392), [round 6](http://www.stefankrause.net/wp/?p=431), [round 7](http://www.stefankrause.net/wp/?p=454) and [round 8](http://www.stefankrause.net/wp/?p=504)).

## Snapshot of the results

The current snapshot that may not have the same quality (i.e.
results might be for mixed browser versions, number of runs per benchmark may vary) can be seen [here](https://krausest.github.io/js-framework-benchmark/current.html)
[![Results](images/results.png?raw=true "Results")](https://krausest.github.io/js-framework-benchmark/current.html)

## Keyed vs non-keyed frameworks

Some frameworks like React, Vue.js or Angular, allow you to create a 1:1 relationship between a data item and a DOM node by assigning a “key” attribute (or for Angular, specifying “trackBy” in *ngFor). If you use some identifier of the data as the key, you get the “keyed” mode. Any update to the data will update the associated DOM node. If you reorder the list, the DOM nodes will be reordered accordingly.

The other mode is “non-keyed” and this is what e.g. vue.js uses by default for lists. In this mode, a change to the data items can modify DOM nodes that were associated with other data before. This can be more performant, since costly DOM operations can be avoided (e.g. first removing old nodes and then adding new nodes) and the existing DOM nodes are updated to display the new data. For React and Angular, using the item index as the key uses “non-keyed” mode for those frameworks.

Depending on your requirements, the “non-keyed” mode can be a performance gain or can cause severe problems, so one must carefully choose the mode and check that the framework supports that mode.

Read more here: [https://www.stefankrause.net/wp/?p=342](https://www.stefankrause.net/wp/?p=342)

# 1 Run pre-built binaries for all frameworks

There are currently 186 implementations in this repository. Installing (and maintaining) those can be challenging, but here are simplified instructions how to get started. See the security advice above to read why that might be a good idea.

## 1.1 Prerequisites

Have _node.js (>=v20.9.0)_ installed. If you want to do yourself a favour use nvm for that. The benchmark has been tested with node v20.9.0.
Please make sure that the following command work before trying to build:

```
> npm
npm -version
10.1.0
> node --version
v20.9.0
```

## 1.2 Downloading the pre-built binaries and starting the server
building all frameworks can be challenging. There's a new way that allows to skip that and just run the benchmark without builiding all implementations.


Start with checking out a tagged release like that. Pick the release that you want (e.g. chrome 100):
```
git clone https://github.com/krausest/js-framework-benchmark.git
cd js-framework-benchmark
git checkout chrome100 -b release
npm ci && npm run install-local
```
Download the build.zip for that release from https://github.com/krausest/js-framework-benchmark/releases
and put the build.zip into the js-framework-benchmark directory and unzip the prebuilt files:
```
unzip build.zip
```
You're now ready to start the http-server. Let the server run in the background
```
npm start
```
## 1.3 Running the benchmarks and handling errors

In a new console window you can now run the benchmarks:
```
npm run bench
```

This will take some time (currently about 12 hours on my machine). Finally create the results table:
```
npm run results
```

Open js-framework-benchmark/webdriver-ts-results/table.html in a browser and take a look at the results. You can open the result table with the link [http://localhost:8080/webdriver-ts-results/dist/index.html](http://localhost:8080/webdriver-ts-results/dist/index.html)


Here's what you should do when the benchmark run was not successful. Let's assume the benchmark printed the following to the console:
```
================================
The following benchmarks failed:
================================
Executing frameworks/non-keyed/ef-js and benchmark 04_select1k failed: No paint event found
run was not completely successful Benchmarking failed with errors
```
You'll now have to run the benchmark again for those that failed like that:
```
npm run bench -- --framework non-keyed/ef-js --benchmark 04_
```
The you can then continue with creating the results table `npm run results`.
Another workaround is to delete the folders of frameworks you can't run or you are not interested in.

# 2 The old and hard way: Building the frameworks and running the benchmark 

## 2.1 Prerequisites

Have _node.js (>=v16.14.2)_ installed. If you want to do yourself a favour use nvm for that and install yarn. The benchmark has been tested with node vv16.14.2.
For some frameworks you'll also need _java_ (>=8, e.g. openjdk-8-jre on ubuntu).
Please make sure that the following command work before trying to build:

```
> npm
npm -version
8.5.0
> node --version
v16.14.2
> echo %JAVA_HOME% / echo $JAVA_HOME
> java -version
java version "1.8.0_131" ...
> javac -version
javac 1.8.0_131
```

## 2.2 Start installing

As stated above building and running the benchmarks for all frameworks can be challenging, thus we start step by step...

Install global dependencies
This installs just a few top level dependencies for the building the frameworks and a local web server.

```
npm ci
```
Then install the server:
```
npm run install-server
```

We start the local web server in the root directory

```
npm start
```

Verify that the local web server works:
Try to open [http://localhost:8080/index.html](http://localhost:8080/index.html). If you see something like that you're on the right track:
![Index.html](images/index.png?raw=true "Index.html")

Now open a new terminal window and keep the web server running in background.

## 2.3 Building and viewing a single framework

We now try to build the first framework. Go to the vanillajs reference implementation

```
cd frameworks/keyed/vanillajs
```

and install the dependencies

```
npm ci
```

and build the framework

```
npm run build-prod
```

There should be no build errors and we can open the framework in the browser:
[http://localhost:8080/frameworks/keyed/vanillajs/](http://localhost:8080/frameworks/keyed/vanillajs/)

Some frameworks like binding.scala or ember can't be opened that way, because they need a 'dist' or 'target/web/stage' or something in the URL. You can find out the correct URL in the [index.html](http://localhost:8080/index.html) you've opened before or take a look whether there's a customURL property under js-framework-benchmark in the [package.json](https://github.com/krausest/js-framework-benchmark/blob/master/frameworks/keyed/ember/package.json#L10) that represents the url.

## 2.4 Running benchmarks for a single framework

The benchmark uses an automated benchmark driver using chromedriver to measure the duration for each operation using chrome's timeline. Here are the steps to run is for a single framework:

```
cd ../../..
cd webdriver-ts
```

and install the dependencies

```
npm ci
```

and build the benchmark driver

```
npm run compile
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
npm run isKeyed keyed/vanillajs
```

If it finds anything it'll report an ERROR.

## 2.5 Building the result table

Install libraries:

```
cd ..
cd webdriver-ts-results
npm ci
cd ..
cd webdriver-ts
```

In the webdriver-ts directory issue the following command:

```
npm run results
```

Now a result table should have been created which can be opened on [http://localhost:8080/webdriver-ts-results/dist/index.html](http://localhost:8080/webdriver-ts-results/dist/index.html).
There's nothing in table except for the column vanillajs-keyed at the right end of the first table.
![First Run Results](images/staticResults.png?raw=true "First Run Results")

## 2.6 [Optional] Updating the index.html file

This simply rebuilds the file used to display the table, not the results.

```
npm run index
```

## 2.7 [Optional] Building and running the benchmarks for all frameworks

This is not for the faint at heart. **Please read the security advice before running this command.**
You can build all frameworks by issuing:

```
cd ..
npm run rebuild-all
```

After downloading the whole internet it starts building it. Basically there should be no errors during the build, but I can't guarantee that the dependencies won't break. 

You can now run the benchmark for all frameworks by invoking:

```
npm run bench-all
```

in the root directory.

After that you can check all results in [http://localhost:8080/webdriver-ts/table.html](http://localhost:8080/webdriver-ts/table.html).

# 3 Tips and tricks

- You can run multiple implementations by passing their directory names (cd to webdriver-ts):
  `npm run bench keyed/angular keyed/react`.
- You can select multiple frameworks and benchmarks for running with prefixes like in the following example in the webdriver-ts directory:
  `npm run bench -- --benchmark 01_ 02_ --framework keyed/vanillajs keyed/react-hooks`
  runs the test for all frameworks that contain either angular or bob, which means all angular versions and bobril and all benchmarks whose id contain 01* or 02*
- The memory benchmarks assume certain paths for the chrome installation. If it doesn't fit use
  `npm run bench -- --chromeBinary /usr/bin/google-chrome`
- If you can't get one framework to compile or run, just move it out of the frameworks directory and re-run
- One can check whether an implementation is keyed or non-keyed via `npm run isKeyed` in the webdriver-ts directory. You can limit which frameworks to check in the same way as the webdriver test runner like e.g. `npm run isKeyed keyed/svelte`. The program will report an error if a benchmark implementation is incorrectly classified.

## 4. Contributing a new implementation

## 4.1 Example instructions for a real implementation
Thanks @dsvorc41 for providing the following description:
TL;DR:
![demo](https://github.com/dsvorc41/js-framework-benchmark/assets/20287188/91ae2d64-7362-4be8-b88f-e52637b33fa5)

1. Install all of the root-level dependencies
    1. `cd js-framework-benchmark/`
    1. `npm ci` or `npm i`
    1. `npm run install-local`
2. Make a new directory for your desired framework, for example Fast framework: `mkdir /frameworks/keyed/fast`
3. Set up your new directory in whatever way is appropriate for that framework, for example:
    1. Set up prettier, eslint, dependencies (i.e. `@microsoft/fast-element`) etc
    2. Create `index.html` in the root of your folder where your app will be served `touch /frameworks/keyed/fast/index.html`
    3. Note: your html file must use the global CSS styles `<link href="/css/currentStyle.css" rel="stylesheet" />`
4.  Serve the page - Test that your html page is loaded properly in the browser
    1. For example put `<h1>Hello World - Fast Framework</h1>` somewhere
    2. Run the server from the root directory: `npm start`
    3. Visit your page in the browser (URL follows the folder structure): `http://localhost:8080/frameworks/keyed/fast/index.html`
    4. Note: Its important to always start the server from the root, because that way you'll get access to global CSS that all apps must share
    5. Note 2: **AVOID SHADOW DOM** - if your framework relies on Shadow Dom (like Fast framework does), you should turn it off. Otherwise you won't get access to global CSS.
5. Add the "action triggers" - buttons that all apps must have (see `frameworks/keyed/vanillajs/index.html`)
   1. Note: Action triggers are simply buttons that are used to run the benchmarks (adding rows, deleting rows, swapping them, etc). Those buttons can be static HTML, or you can render them dynamically (with JS) with your framework of choice 
   2. Make sure your HTML elements have the same classes and structure as VanillaJS, otherwise benchmarks won't be able to find your elements on the page, and you will not get the global CSS (Bootstrap)
   3. Add the html example below and open the page. You should see nicely formatted elements on the page, like in the GIF image above.
   4. Example for action triggers
      ```html
          <body>
            <div id="main">
              <div class="container">
                <div class="jumbotron">
                  <div class="row">
                    <div class="col-md-6">
                      <h1>VanillaJS-"keyed"</h1>
                    </div>
                    <div class="col-md-6">
                      <div class="row">
                        <div class="col-sm-6 smallpad">
                          <button
                            type="button"
                            class="btn btn-primary btn-block"
                            id="run"
                          >
                            Create 1,000 rows
                          </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                          <button
                            type="button"
                            class="btn btn-primary btn-block"
                            id="runlots"
                          >
                            Create 10,000 rows
                          </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                          <button
                            type="button"
                            class="btn btn-primary btn-block"
                            id="add"
                          >
                            Append 1,000 rows
                          </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                          <button
                            type="button"
                            class="btn btn-primary btn-block"
                            id="update"
                          >
                            Update every 10th row
                          </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                          <button
                            type="button"
                            class="btn btn-primary btn-block"
                            id="clear"
                          >
                            Clear
                          </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                          <button
                            type="button"
                            class="btn btn-primary btn-block"
                            id="swaprows"
                          >
                            Swap Rows
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <table class="table table-hover table-striped test-data"> 
                  <!-- your dynamic content should render here --> 
                </table>
              </div>
            </div>
          </body>
      ```
6. Generate dummy data for rendering
   1. See `frameworks/keyed/fast/src/utils/build-dummy-data.ts` as an example
   2. Note: `id` is an important attribute and it must be initialized as `1`, and continuously incremented. The only time `id` resets back to `1` is when the page reloads - otherwise it should just keep incrementing each time a new row is created. Doing anything else will cause errors when benchmarks try to find elements with specific IDs. Trust me, I learned the hard way.
7. . Your app needs to support several actions that correspond to "Action triggers" listed above. Here's an example from Fast framework `frameworks\keyed\fast\src\App.ts` and `frameworks\keyed\fast\src\components\Table.ts`:
   1. Code example:
      ```typescript
        export class BenchmarkApp extends FASTElement {
          createOneThousandRows() {}
          createTenThousandRows() {}
          appendOneThousandRows() {}
          updateEveryTenthRowLabel() {}
          deleteAllRows() {}
          swapTwoRows() {}
          deleteSingleRow(rowId: number) {}
        }

        export class Table extends FASTElement {
          selectRow(rowId: number) {}
        }
      ```
    2. Note: your app doesn't need methods with the same name - you should write idiomatic code and follow the best practices of your framework of choice. The example above is just to give you an idea of which operations must be supported, but how you choose to implement those methods can be very different from one framework to the next. 
8. Manually testing your app - do this before you run the benchmarks
   1. Open your page and click on the buttons, make sure your app adds 1000 rows, then removes them, or swaps them, or adds/removes 10,000 rows. 
   2. To do this, you'll probably need to watch your local files and compile them into some sort of a bundle, like `frameworks\keyed\fast\dist\bundle.js` which will be loaded through a script tag in your HTML file
   3. For example, in Fast folder we have webpack watching our files: ` "dev": "rimraf dist && webpack --config webpack.config.js --watch --mode=development",` 
   4. That means we have two terminal tabs running
      1. One for the server from the root folder `npm start`
      2. And another in our local folder where webpack is watching the files
9. Run the single benchmark for your framework
   1.  Once you manually verified that everything works as expected, run a single benchmark and make sure all of the tests are running
   2.  If you forgot something, one of the benchmarks will probably fail - for example it won't be able to find an element on the page or similar
   3.  Keep the server in the root folder running `npm start`, and in another terminal tab, also from the root folder run `npm run bench -- --framework keyed/fast` (or whatever is your framework `keyed/react`, `keyed/angular`, etc.).
   4.  The benchmark runner will open and close Chrome multiple times. The whole thing will take a couple of minutes.
10. Optional: run the benchmark for VanillaJS as comparison
    1.  ` npm run bench -- --framework keyed/vanillajs`
11. Build the report
    1. `npm run results`
12. Open the report in your browser (NOTE: the server must still be running if you want to see this page)
    1. `http://localhost:8080/webdriver-ts-results/table.html`

## 4.2 Building the app

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

## 4.3 Adding your new implementation to the results table.

(Notice: Updating common.ts is no longer necessary, super-vanillajs is visible in the result table)

Your package.json must include some information for the benchmark. Since you copied it, the important section is already there:

```
  ...
  "js-framework-benchmark": {
    "frameworkVersion": "",
    "frameworkHomeURL": ""
  },
  ...
```

This one is a bit exceptional since vanillajs has no version and there no framework involved. If you use a normal framework like react it carries a version information and the framework should have an URL. For most frameworks you'll add a
dependency to your framework in package.json. The benchmark can automatically determine the correct version information from package.json and package-lock.json if you specify the
package name like that:

```
  "js-framework-benchmark": {
    "frameworkVersionFromPackage": "react"
    "frameworkHomeURL": "https://www.reactjs.org"
  },
```

Now the benchmark will fetch the installed react version from package-lock.json in the react directory and use that version number to compute the correct version string.
If your library has multiple important packages like react + redux you can put them separated with a colon there like "react:redux".
If you don't pull your framework from npm you can hardcode a version like `"frameworkVersion": "0.0.1"`.
The other important, but optional properties for js-framework-benchmark are shown in the following example:

```
"customURL": "/target/web/stage",
"useShadowRoot": true
```

You can set an optional different URL if needed or specify that your DOM uses a shadow root.

## 4.4 Submitting your implementation

Please take a look at https://github.com/krausest/js-framework-benchmark/wiki/Process-for-merging-a-pull-request for informations how pull requests are merged.



Contributions are very welcome. Please use the following rules:

- Name your directory frameworks/[keyed|non-keyed]/[FrameworkName]
- The package.json in your directory must contain some important information see section 4.2 above.
- Each contribution must be buildable by `npm install` and `npm run build-prod` command in the directory. What build-prod does is up to you. Often there's an `npm run dev` that creates a development build
- Every implementation must use bootstrap provided in the root css directory.
- All npm dependencies should be installed locally (i.e. listed in your package.json). Http-server or other local web servers should not be local dependencies. It is installed from the root directory to allow access to bootstrap.
- Please use _fixed version_ numbers, no ranges, in package.json. Otherwise the build will break sooner or later - believe me. Updating works IMO best with npm-check-updates, which keeps the version format.
- Webdriver-ts must be able to run the perf tests for the contribution. This means that all buttons (like "Create 1,000 rows") must have the correct id e.g. like in vanillajs. Using shadow DOM is a real pain for webdriver. The closer you can get to polymer the higher the chances I can make that contribution work.
- Don't change the ids in the index.html, since the automated benchmarking relies on those ids.
- Please push only files in your framework folder (not index.html or results.json)
- **Please make sure your implementation is validated by the test tool.** cd to the root directory and perform a check  `npm run rebuild-ci [keyed|non-keyed]/[FrameworkName]`. It'll print an error if your framework doesn't build, the benchmark can't be run or behaves other as specified. It'll print a big ERROR explaining if it isn't happy with the implementation. Some common errors include:
  - Your package.json is missing some required fields
  - Incorrect classification (Keyed/NonKeyed)
  - You have gzipped files in /dist (unfortunately the web server prefers these when they exist)
- Please don't commit any of the result file webdriver-ts/table.html, webdriver-ts-results/src/results.ts or webdriver-ts-results/table.html. I use to run the benchmarks after merging and publish updated (temporary) results.
- The latest stable chrome can be used regarding web features and language level (babel-preset-env "last 1 chrome versions")
- The vanillajs implementations and some others include code that try to approximate the repaint duration through javascript code. Implementations are not required to include that measurement. Remember: The real measurements are taken by the automated test driver by examining chrome timeline entries.
- **Please don't over-optimize.** This benchmark is most useful if you apply an idiomatic style for the framework you're using. We've sharpened the rules what kind of implementation is considered correct and will add errors or notes when an implementations handles things wrongly (errors) or in a way that looks like a shortcut (notes).
  - The html must be identical with the one created by the reference implementation vanillajs. It also must include all the aria-hidden attributes. Otherwise the implementation is considered erroneous and will be marked with issue [#634](https://github.com/krausest/js-framework-benchmark/issues/634).
  - Keyed implementations must pass the `npm run isKeyed` test in the test driver otherwise they are erroneous. Not that this test might not be sufficient, but just necessary to be keyed (from time to time we find new loop holes). There's error [#694](https://github.com/krausest/js-framework-benchmark/issues/694) for such cases.
  - Using request animation frame calls in client code, especially when applied only for some benchmark operations, is considered bad style and gets note [#796](https://github.com/krausest/js-framework-benchmark/issues/796) applied. Note that frameworks are free to choose whether they use RAF of not.
  - Manual DOM manipulation (like setting the danger class directly on the selected row) lead to some controversial debates. Depending on the framework you're using it might be idiomatic style or not. In any case it gets note [#772](https://github.com/krausest/js-framework-benchmark/issues/772) applied.
  - Implementations should keep the selected rows in the state (i.e. not a flag for each row, but one reference, id or index for the table) and use that information for rendering. Keeping a selection flag for each row might be faster, but it's considered bad style. Thus those implementations get note [#800](https://github.com/krausest/js-framework-benchmark/issues/800).
  - Explicit event delegation is another area where many discussions came up. Implementations that use explicit event delegation in client code get note [#801](https://github.com/krausest/js-framework-benchmark/issues/801). Frameworks themselves are free to use event delegation.

Helpful tips:

- Do not start your implementation using vanillajs as the reference. It uses direct DOM manipulation (and thus has note [#772](https://github.com/krausest/js-framework-benchmark/issues/772)) and serves only as a performance baseline but not as a best practice implementation. Instead pick a framework which is similar to yours.
- Do not forget to preload the glyphicon by adding this somewhere in your HTML: `<span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>` or you will get terrible performance.
- Be careful not to leave gzipped files in your /dist directory. Unfortunately the web server prefers these when they exist and we cannot change that (meaning you could be observing an outdated build).

This work is derived from a benchmark that Richard Ayotte published on https://gist.github.com/RichAyotte/a7b8780341d5e75beca7 and adds more framework and more operations. Thanks for the great work.

Thanks to Baptiste Augrain for making the benchmarks more sophisticated and adding frameworks.

# History

Frameworks without significant activity on github or npm for more than a year will be removed (_automatic commits like dependabot and minor updates, like docs editions, are ignored_).

## 2024-12-11
The following frameworks were archived after chrome 131. Their last results are included in [chrome 131 results](https://krausest.github.io/js-framework-benchmark/2024/table_chrome_131.0.6778.85.html)
- [x] react-signalis
- [x] react-recoil
- [x] doz
- [x] ef.js
- [x] metron
- [x] mimbl
- [x] react-focal
- [x] react-diagon
- [x] rax
- [x] scarlets-frame
- [x] strv, strve-rv, strve-reactivity
- [x] unis
- [x] whatsup

## 2023-12-10
The following frameworks were archived after chrome 120. Their last results are included in [chrome 120 results](https://krausest.github.io/js-framework-benchmark/2023/table_chrome_120.0.6099.62.html).
- [x] petite-vue

## 2023-11-07
The following frameworks were archived after chrome 119. Their last results are included in [chrome 119 results](https://krausest.github.io/js-framework-benchmark/2023/table_chrome_119.0.6045.105.html).
- [x] sifrr

## 2023-10-22
The following frameworks were archived after chrome 118. Their last results are included in [chrome 118 results](https://krausest.github.io/js-framework-benchmark/2023/table_chrome_118.0.5993.70.html).
- [x] 1more
- [x] bdc
- [x] choo
- [x] domdiff
- [x] domvm
- [x] endorphin
- [x] etch
- [x] forgo
- [x] fullweb-helpers
- [x] fullweb-template
- [x] heresy
- [x] hullo
- [x] lighterhtml
- [x] neverland
- [x] resonatejs
- [x] sledgehammer
- [x] uhydro


## 2020-7-9

- [x] etch Last commit Sep 12, 2018
- [x] hyperoop Last significant commit Dec 23, 2018
- [x] faster-dom (to be replaced by a new revact implementation)
- [x] plastiq (to be replaced by a new Hyperdom implementation)
- [x] rawact Last commit Dec 3, 2018
- [x] react-djinn Last NPM publish 2019-05-03 (the Github org a repo aren't available anymore)
- [x] react-lite Last commit Mar 29, 2019
- [x] redux-combiner Last commit May 14, 2018
- [x] surplus Last commit Jan 5, 2019
- [x] gruu Last commit Jun 23, 2019
- [x] lite-html Last commit Sep 7, 2018

## 2019-9-16

- [x] angular-light Last commit Nov 30, 2017
- [x] nx. Last commit Feb 2017
- [x] maik-h Last commit Dec 15, 2017
- [x] rivets Last commit Oct 22, 2016
- [x] tsers. Last commit Jun 19, 2016

