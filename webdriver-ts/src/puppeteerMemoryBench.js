const puppeteer = require('puppeteer-core');

const countObjects = async (page) => {
    const prototypeHandle = await page.evaluateHandle(() => Object.prototype);
    const objectsHandle = await page.queryObjects(prototypeHandle);
    const numberOfObjects = await page.evaluate((instances) => instances.length, objectsHandle);

    await Promise.all([
        prototypeHandle.dispose(),
        objectsHandle.dispose()
    ]);

    return numberOfObjects;
};

async function runPuppeteer24(url, name)
{
    const width = 1200;
    const height = 800;
    const browser = await puppeteer.launch(
        { headless: false, 
            executablePath: '/usr/bin/google-chrome' ,
            ignoreDefaultArgs: ['--enable-automation'],
        args: [
            `--window-size=${ width },${ height }`,
        ],
        defaultViewport: {
            width,
            height
        }});
    const page = await browser.newPage();
    // await (page as any)._client.send('HeapProfiler.enable');
    await page.goto(url);

    for (let i = 0; i < 5; i++) {
        await page.click('#run');
        await page.waitForTimeout(100);
        let element = await page.waitForXPath("//*[position()=7][text()='" + ( i * 1000 + 7 ) + "']");
        if (!element?.length) {
            console.log("**** WRONG! Value ", value, "expected");
        }
    }

    await page.waitForTimeout(1000);    
    let count2 = await countObjects(page);
    // await (page as any)._client.send('HeapProfiler.collectGarbage');
    await page.waitForTimeout(1000);    

    let metrics = await page.metrics();
    let memory24_after_GC = metrics.JSHeapUsedSize;

    console.log("Benchmark 24: memory Memory usage after clicking create 1000 rows 5 times:",memory24_after_GC);
    await browser.close();
}

async function main() {
    const urls = [
        {name:'vanilla', url:'https://stefankrause.net/chrome-perf/frameworks/keyed/vanillajs/index.html'},
        {name:'domvm', url:'https://stefankrause.net/chrome-perf/frameworks/keyed/domvm/index.html'},
    ];
    for (let u of urls) {
        console.log(`results for ${u.name}`);
        await runPuppeteer24(u.url, u.name);
    };
}

main().then(() => {
    console.log("finished");
})