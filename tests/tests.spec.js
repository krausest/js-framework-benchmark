var benchpress = require('benchpress'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

// fix for memory leak issue
require('events').EventEmitter.prototype._maxListeners = 50;

var TEST = {
    SAMPLE_SIZE: 3, // number of times the test runs
    ADDRESS: 'http://localhost:8080/',
    TIMEOUT_INTERVAL_VAR: 1500000, // increase this if you're getting a timeout error
    FRAMEWORKS: ["react", "ractive", "mithril", "angular", "angular2"] // identical to URL
};

jasmine.DEFAULT_TIMEOUT_INTERVAL = TEST.TIMEOUT_INTERVAL_VAR;

var runner = new benchpress.Runner([
    benchpress.SeleniumWebDriverAdapter.PROTRACTOR_BINDINGS,
    benchpress.Validator.bindTo(benchpress.RegressionSlopeValidator),
    benchpress.bind(benchpress.RegressionSlopeValidator.SAMPLE_SIZE).toValue(TEST.SAMPLE_SIZE),
    benchpress.bind(benchpress.RegressionSlopeValidator.METRIC).toValue('scriptTime'),
    benchpress.bind(benchpress.Options.FORCE_GC).toValue(true)
]);

const IGNORE_SYNCHRONIZATION = true;

afterEach(async(function () {
    await(global.browser.quit());
}));

describe('Performance Tests', function () {

    function testLoad(framework) {
        var id = 'page load & create 1000 rows';
        it('time for ' + id, async(function (done) {
            browser.ignoreSynchronization = IGNORE_SYNCHRONIZATION;
            runner.sample({
                id: id,
                prepare: async(function () {
                    // FIXME: Without browser.get here the first execute will often return a duration of 0ms.
                    await(browser.get(TEST.ADDRESS + framework + "/"));
                }),
                execute: async(function () {
                    await(browser.get(TEST.ADDRESS + framework + "/"));
                    return await($('#run').click());
                })
            }).then(done, done.fail);
            addTitle(id, framework);
        }));
    }

    function testRun(framework) {
        var id = 'create 1000 rows';
        it('time for ' + id, async(function (done) {
            browser.ignoreSynchronization = IGNORE_SYNCHRONIZATION;
            runner.sample({
                id: id,
                prepare: async(function () {
                    await(browser.get(TEST.ADDRESS + framework + "/"));
                }),
                execute: async(function () {
                    return await($('#run').click());
                })
            }).then(done, done.fail);
            addTitle(id, framework);
        }));
    }

    function testRun10(framework) {
        var id = 'update 1000 rows';
        it('time for ' + id, async(function (done) {
            browser.ignoreSynchronization = IGNORE_SYNCHRONIZATION;
            runner.sample({
                id: id,
                prepare: async(function () {
                    await(browser.get(TEST.ADDRESS + framework + "/"));
                    for (var i=0;i<5;i++) {
                        await($('#run').click());
                    }
                }),
                execute: async(function () {
                    return await($('#run').click());
                })
            }).then(done, done.fail);
            addTitle(id, framework);
        }));
    }

    function testAdd10x10(framework) {
        var id = '10 x add 10 rows';
        it('time for ' + id, async(function (done) {
            browser.ignoreSynchronization = IGNORE_SYNCHRONIZATION;
            runner.sample({
                id: id,
                prepare: async(function () {
                    await(browser.get(TEST.ADDRESS + framework + "/"));
                }),
                execute: async(function () {
                    for (var i = 0; i < 10; i++) {
                        await($('#add').click());
                    }
                    return;
                })
            }).then(done, done.fail);
            addTitle(id, framework);
        }));
    }

    function testUpdate(framework) {
        var id = 'partial update';
        it('time for ' + id, async(function (done) {
            browser.ignoreSynchronization = IGNORE_SYNCHRONIZATION;
            runner.sample({
                id: id,
                prepare: async(function () {
                    await(browser.get(TEST.ADDRESS + framework + "/"));
                    return await($('#run').click());
                }),
                execute: async(function () {
                    return await($('#update').click());
                })
            }).then(done, done.fail);
            addTitle(id, framework);
        }));
    }

    function testClick(framework) {
        var id = 'select 10 rows';
        var num_iterations = 10;
        it('time for ' + id, async(function (done) {
            browser.ignoreSynchronization = IGNORE_SYNCHRONIZATION;
            runner.sample({
                id: id,
                prepare: async(function () {
                    await(browser.get(TEST.ADDRESS + framework + "/"));
                    return await($('#run').click());
                }),
                execute: async(function () {
                    var els = element.all(by.tagName('tr'));
                    for (i = 0; i < num_iterations; i++) {
                        await(els.get(i).all(by.tagName('a')).get(0).click());
                    }
                    return;
                })
            }).then(done, done.fail);
            addTitle(id, framework);
        }));
    }

    function testRemove10(framework) {
        var id = 'remove 10 rows';
        var num_iterations = 10;
        it('time for ' + id, async(function (done) {
            browser.ignoreSynchronization = IGNORE_SYNCHRONIZATION;
            runner.sample({
                id: id,
                prepare: async(function () {
                    await(browser.get(TEST.ADDRESS + framework + "/"));
                    return await($('#run').click());
                }),
                execute: async(function () {
                    for (i = 0; i < num_iterations; i++) {
                        await(element.all(by.tagName('tr')).first().all(by.tagName('a')).get(1).click());
                    }
                    return;
                })
            }).then(done, done.fail);
            addTitle(id, framework);
        }));
    }


    function addTitle(message, framework) {
        console.log('\n*********************************************************');
        console.log('************* Testing time for |' + message + '|' + framework+'| *************');
        console.log('*********************************************************\n');
    }

    TEST.FRAMEWORKS.forEach(function (framework) {
        testLoad(framework);
        testRun(framework);
        testRun10(framework);
        testUpdate(framework);
        testClick(framework);
        testAdd10x10(framework);
        testRemove10(framework);
    })
});
