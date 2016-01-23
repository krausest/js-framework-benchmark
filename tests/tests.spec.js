var benchpress = require('benchpress'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

// fix for memory leak issue
require('events').EventEmitter.prototype._maxListeners = 200;

var TEST = {
    SAMPLE_SIZE: 5, // number of times the test runs
    ADDRESS: 'http://localhost:8080/',
    TIMEOUT_INTERVAL_VAR: 15000000, // increase this if you're getting a timeout error
    FRAMEWORKS: ["aurelia"] //["angular", "angular2","aurelia", "ember/dist", "mithril", "ractive", "react",  "vidom", "vue" ] // identical to URL
};

jasmine.DEFAULT_TIMEOUT_INTERVAL = TEST.TIMEOUT_INTERVAL_VAR;

var runner = new benchpress.Runner([
    benchpress.SeleniumWebDriverAdapter.PROTRACTOR_BINDINGS,
    benchpress.Validator.bindTo(benchpress.RegressionSlopeValidator),
    benchpress.bind(benchpress.RegressionSlopeValidator.SAMPLE_SIZE).toValue(TEST.SAMPLE_SIZE),
    benchpress.bind(benchpress.RegressionSlopeValidator.METRIC).toValue('scriptTime'),
    benchpress.bind(benchpress.Options.FORCE_GC).toValue(true)
]);

//const IGNORE_SYNCHRONIZATION = true;

function ignoreSynchronization(framework) {
    return "angular" !== framework; // && "aurelia" !== framework;
}

afterEach(async(function () {
    await(global.browser.quit());
}));

describe('Performance Tests', function () {

    function testLoad(framework) {
        var id = 'page load & create 1000 rows';
        it('time for ' + id, async(function (done) {
            browser.ignoreSynchronization = ignoreSynchronization(framework);
            browser.get(TEST.ADDRESS + framework + "/");

            runner.sample({
                id: id,
                prepare: function () {
                    // FIXME: Without browser.get here the first execute will often return a duration of 0ms.
                    //return await(browser.get(TEST.ADDRESS + framework + "/"));
                },
                execute: async(function () {
                    var p = new Date().getTime();
                    $('#run').click();
                })
            }).then(done, done.fail);
            addTitle(id, framework);
        }));
    }

    function testRun(framework) {
        var id = 'run';
        it('time for ' + id, async(function (done) {
            browser.ignoreSynchronization = ignoreSynchronization(framework);
            runner.sample({
                id: id,
                prepare: async(function () {
                    browser.get(TEST.ADDRESS + framework + "/");
                    browser.driver.wait(function() {
                        return browser.driver.isElementPresent(by.id('run'));
                    });
                }),
                execute: async(function () {
                    return await($('#run').click());
                })
            }).then(done, done.fail);
            addTitle(id, framework);
        }));
    }

    function testRunHot(framework) {
        var id = 'runHot';
        it('time for ' + id, async(function (done) {
            browser.ignoreSynchronization = ignoreSynchronization(framework);
            runner.sample({
                id: id,
                prepare: async(function () {
                    browser.get(TEST.ADDRESS + framework + "/");
                    browser.driver.wait(function() {
                        return browser.driver.isElementPresent(by.id('run'));
                    });
                    for (var i=0;i<10;i++) {
                        $('#run').click();
                    }
                }),
                execute: async(function () {
                    return $('#run').click();
                })
            }).then(done, done.fail);
            addTitle(id, framework);
        }));
    }

    function testAdd10x10(framework) {
        var id = 'add 10 rows';
        it('time for ' + id, async(function (done) {
            browser.ignoreSynchronization = ignoreSynchronization(framework);
            runner.sample({
                id: id,
                prepare: async(function () {
                    browser.get(TEST.ADDRESS + framework + "/");
                    browser.driver.wait(function() {
                        return browser.driver.isElementPresent(by.id('run'));
                    });
                }),
                execute: async(function () {
                    for (var i = 0; i < 10; i++) {
                        $('#add').click();
                    }
                    return;
                })
            }).then(done, done.fail);
            addTitle(id, framework, 10);
        }));
    }

    function testUpdate(framework) {
        var id = 'partial update';
        it('time for ' + id, async(function (done) {
            browser.ignoreSynchronization = ignoreSynchronization(framework);
            runner.sample({
                id: id,
                prepare: async(function () {
                    browser.get(TEST.ADDRESS + framework + "/");
                    browser.driver.wait(function() {
                        return browser.driver.isElementPresent(by.id('run'));
                    });
                    browser.driver.findElement(by.id('run')).click();
                }),
                execute: async(function () {
                    $('#update').click();
                })
            }).then(done, done.fail);
            addTitle(id, framework);
        }));
    }

    function testClick(framework) {
        var id = 'select row';
        it('time for ' + id, async(function (done) {
            browser.ignoreSynchronization = ignoreSynchronization(framework);
            runner.sample({
                id: id,
                prepare: async(function () {
                    browser.get(TEST.ADDRESS + framework + "/");
                    browser.driver.wait(function() {
                        return browser.driver.isElementPresent(by.id('run'));
                    });
                    $('#run').click();
                    browser.driver.wait(function() {
                        return browser.driver.isElementPresent(by.tagName('tr'));
                    });
                    //var els = element.all(by.tagName('tr'));
                    //els.get(0).all(by.tagName('a')).get(0).click();
                    //els.get(1).all(by.tagName('a')).get(0).click();
                    //els.get(2).all(by.tagName('a')).get(0).click();
                }),
                execute: async(function () {
                    var els = element.all(by.tagName('tr'));
                    els.get(0).all(by.tagName('a')).get(0).click();
                })
            }).then(done, done.fail);
            addTitle(id, framework, 1);
        }));
    }

    function testRemove(framework) {
        var id = 'remove row';
        it('time for ' + id, async(function (done) {
            browser.ignoreSynchronization = ignoreSynchronization(framework);
            runner.sample({
                id: id,
                prepare: async(function () {
                    browser.get(TEST.ADDRESS + framework + "/");
                    browser.driver.wait(function() {
                        return browser.driver.isElementPresent(by.id('run'));
                    });
                    element(by.id('run')).click();
                    browser.driver.wait(function() {
                        return browser.driver.isElementPresent(by.tagName('tr'));
                    });
                    var elements = element.all(by.tagName('tr'));
                    for (j=8;j>=5;j--) {
                        var elements = element.all(by.tagName('tr'));
                        elements.get(j).all(by.tagName('a')).get(1).click();
                    }
                }),
                execute: async(function () {
                    var elements = element.all(by.tagName('tr'));
                    elements.get(0).all(by.tagName('a')).get(1).click();
                    return;
                })
            }).then(done, done.fail);
            addTitle(id, framework, 1);
        }));
    }


    function addTitle(message, framework, count) {
        count = count || 1;
        console.log('\n*********************************************************');
        console.log('************* Testing time for |' + message + '|' + framework+'|'+count+' *************');
        console.log('*********************************************************\n');
    }

    TEST.FRAMEWORKS.forEach(function (framework) {
        // Currently not used, no surprises here
        //testAdd10x10(framework);
        //testLoad(framework);

        //testRun(framework);
        //testRunHot(framework);
        //testUpdate(framework);
        testClick(framework);
        //testRemove(framework);
    })
});
