exports.config = {
    directConnect: true,
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            'args': ['--js-flags=--expose-gc'],
            'perfLoggingPrefs': {
                'traceCategories': 'v8,blink.console,devtools.timeline'
            }
        },
        loggingPrefs: {
            performance: 'ALL'
        }
    },
    specs: ['./tests.spec.js'],
    chromeDriver: './node_modules/webdriver-manager/selenium/chromedriver',
    seleniumServerJar: './node_modules/webdriver-manager/selenium/selenium-server-standalone-2.46.0.jar',
    framework: 'jasmine2',
    restartBrowserBetweenTests: true,
    onPrepare: function() {
  /*      // open a new browser for every benchmark
        var originalBrowser = browser;
        var _tmpBrowser;
        beforeEach(function() {
            global.browser = originalBrowser.forkNewDriverInstance();
            global.element = global.browser.element;
            global.$ = global.browser.$;
            global.$$ = global.browser.$$;
        });
        afterEach(function() {
            global.browser.quit();
            global.browser = originalBrowser;
        });
        */
    },
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    },
};