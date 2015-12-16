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
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 300000
    },
    onPrepare: function () {
    }
};