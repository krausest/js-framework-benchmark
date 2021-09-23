import * as puppeteer from "puppeteer-core";
import {Browser, Page} from "puppeteer-core";

import {config, BenchmarkDriverOptions} from './common'

interface PathPart {
    tagName: string;
    index: number;
}

let useShadowRoot = false;
let useRowShadowRoot = false;
let shadowRootName = "";
let buttonsInShadowRoot = false;

export function setUseShadowRoot(val: boolean) {
    useShadowRoot = val;
}

export function setUseRowShadowRoot(val: boolean) {
    useRowShadowRoot = val;
}

export function setShadowRootName(val: string) {
    shadowRootName = val;
}

export function setButtonsInShadowRoot(val: boolean) {
    buttonsInShadowRoot = val;
}

function convertPath(path: string): string {
    let parts = path.split(/\//).filter(v => !!v);
    let res = "";
    for (let part of parts) {
        let components = part.split(/\[|]/).filter(v => !!v);
        let tagName = components[0];
        let index:number = 0;
        if (res.length>0) res += " > ";
        if (components.length==2) {
            index = Number(components[1]);
            if (!index) {
                console.log("Index can't be parsed", components[1])
                throw "Index can't be parsed "+components[1];
            }
            res += `${tagName}:nth-of-type(${index})`;
        } else {
            index = 1;
            res += tagName;
        }
    }
    return res;
}
/*
async function shadowRoot(driver: WebDriver, selector: string): Promise<WebElement> {
    const el = await driver.findElement(By.css(selector));
    return driver.executeScript(`return arguments[0].shadowRoot`, el);
}

// Fake findByXPath for simple XPath expressions to allow usage with shadow dom
export async function findByXPath(driver: WebDriver, path: string, isInButtonArea: boolean): Promise<WebElement> {
    let root = await mainRoot(driver, isInButtonArea);
    let paths = convertPath(path);
     let n = root;
     try {
        for (let p of paths) {  
            let elem;
            if (useRowShadowRoot && p.tagName === 'tr') {
                try {
                    const shadowHost = await shadowRoot(driver, `benchmark-row:nth-of-type(${p.index})`);
                    elem = await shadowHost.findElement(By.tagName('tr'));
                    if (elem === null) {
                        return null;
                    }
                } catch (err) {
                    return null;
                }
            } else {
                let elems = await n.findElements(By.css(p.tagName+":nth-of-type("+(p.index)+")"));
                if (elems==null || elems.length==0) { return null};
                elem = elems[0];
            }

            n = elem;
        }
     } catch (e) {
         //can happen for StaleElementReferenceError
      return null;
     }
     return n;
}

function elemNull(v: any) {
    console.log("*** ELEMENT WAS NULL");
    return false;
}

function waitForCondition(driver: WebDriver) {
    return async function(text: string, fn: (driver:WebDriver) => Promise<boolean>, timeout: number): Promise<boolean> {
        return await driver.wait(new Condition<Promise<boolean>>(text, fn), timeout);
    }
}

// driver.findElement(By.xpath("//tbody/tr[1]/td[1]")).getText().then(...) can throw a stale element error:
// thus we're using a safer way here:
export async function testTextContains(driver: WebDriver, xpath: string, text: string, timeout = config.TIMEOUT, isInButtonArea: boolean) {
    return waitForCondition(driver)(`testTextContains ${xpath} ${text}`,
        async function(driver) {
            try {
                let elem = await findByXPath(driver, xpath, isInButtonArea);
                if (elem==null) return false;
                let v = await elem.getText();
                return v && v.indexOf(text)>-1;
            } catch(err) {
                console.log("ignoring error in testTextContains for xpath = "+xpath+" text = "+text,err.toString().split("\n")[0]);
            }
        }, timeout);
}

export async function testTextContainsJS(driver: WebDriver, xpath: string, text: string, timeout = config.TIMEOUT, isInButtonArea: boolean) {
    let value = await driver.executeAsyncScript(`
    let callback = arguments[arguments.length - 1];

    let convertPath = (path) => {
        let parts = path.split(/\\//).filter(v => !!v);
        let res = [];
        for (let part of parts) {
            let components = part.split(/\\[|]/).filter(v => !!v);
            let tagName = components[0];
            let index = 0;
            if (components.length==2) {
                index = Number(components[1]);
                if (!index) {
                    console.log("Index can't be parsed", components[1])
                    throw "Index can't be parsed "+components[1];
                }
            } else {
                index = 1;
            }
            res.push({tagName, index});
        }
        return res;
    }
    
    let findByXPath = (paths) => {
        function shadowRoot () {
            if (${useShadowRoot}) {
                if (!${buttonsInShadowRoot} && ${isInButtonArea}) {
                    return driver.findElement(By.tagName("body"))
                } else {
                    return document.querySelector("${shadowRootName}").shadowRoot; 
                }
            } else {
                return document.querySelector("body"); 
            }
        }

        let n = shadowRoot();

        for (let p of paths) {  
            let elem;
            if (false && useRowShadowRoot && p.tagName === 'tr') {
                / *elem = n.querySelector(p.tagName+":nth-of-type("+p.index+")"); 
                if (elem==null) { return null};
                const shadowHost = await shadowRoot(driver, benchmark-row:nth-of-type($ { p.index}));
                elem = await shadowHost.findElement(By.tagName('tr'));
                if (elem === null) {
                    return null;
                }* /
            } else {
                elem = n.querySelector(p.tagName+":nth-of-type("+p.index+")"); 
                if (elem==null) { return null};
            }
            n = elem;
        }
        return n;
    }
    
    let checkTestTextContains = (xpath, text) => {
        let n = findByXPath(xpath);
        if (!n) return false;  
        return (n.innerText.indexOf(text)>-1);  
    }
    
    
    let testTextContains = (xpath, text, timeout) => {
        let paths = convertPath(xpath);
        let i = 0;
        let cb = () => {
            if (checkTestTextContains(paths, text)) {
                callback(true);
            } else {
                if (i*1000 < timeout) {
                    i++;
                    window.setTimeout(cb, 1000);
                } else {
                    callback(false);
                }
            }
        }
        cb();
    }

    testTextContains("${xpath}","${text}",${timeout});
            `);
    return value;
}

export function testTextNotContained(driver: WebDriver, xpath: string, text: string, timeout = config.TIMEOUT, isInButtonArea: boolean) {
    return waitForCondition(driver)(`testTextNotContained ${xpath} ${text}`,
        async function(driver) {
            try {
                let elem = await findByXPath(driver, xpath, isInButtonArea);
                if (elem==null) return false;
                let v = await elem.getText();
                return v && v.indexOf(text)==-1;
            } catch(err) {
                console.log("ignoring error in testTextNotContained for xpath = "+xpath+" text = "+text,err.toString().split("\n")[0])
            }
        }, timeout);
}
*/
export async function testClassContains(page: Page, xpath: string, className: string, isInButtonArea: boolean) {
    let selector = convertPath(xpath);
    let locateInShadowRoot = useShadowRoot && (!isInButtonArea  || buttonsInShadowRoot);
    let fn = locateInShadowRoot ? 
        `document.querySelector('${shadowRootName}')?.shadowRoot?.querySelector('${selector}')`
        : `document.querySelector('${selector}')`;
    fn += `?.classList.contains('${className}')`;
    console.log(`testClassContains xpath ${xpath} className '${className}' JS-Selector: ${fn}`);
    let res = await page.waitForFunction(fn, {polling: 100});
    await res.dispose();

/*    return waitForCondition(driver)(`testClassContains ${xpath} ${text}`,
        async function(driver) {
            try {
                let elem = await findByXPath(driver, xpath, isInButtonArea);
                if (elem==null) return false;
                let v = await elem.getAttribute("class");
                return v && v.indexOf(text)>-1;
            } catch(err) {
                console.log("ignoring error in testClassContains for xpath = "+xpath+" text = "+text,err.toString().split("\n")[0])
            }
        }, timeout);
        */
}


export async function testElementNotLocatedByXPath(page: Page, xpath: string, isInButtonArea: boolean) {
    let selector = convertPath(xpath);
    let locateInShadowRoot = useShadowRoot && (!isInButtonArea  || buttonsInShadowRoot);
    let fn = locateInShadowRoot ? `document.querySelector('${shadowRootName}')?.shadowRoot?.querySelector('${selector}')` : `!document.querySelector('${selector}')`;
    console.log(`testElementNotLocatedByXPath xpath ${xpath} JS-Selector: ${fn}`);
    let res = await page.waitForFunction(fn);
    await res.dispose();
}


    /*    if (useShadowRoot) {
        if (!buttonsInShadowRoot && isInButtonArea) {
          let elem = await page.waitForXPath(xpath);
          elem.dispose();
        } else {
          let selector = convertPath(xpath);
          let fn = `document.querySelector('${shadowRootName}').shadowRoot.querySelector('${selector}')`;
          console.log("selector", fn);
          let shadowRoot = await page.waitForFunction(fn);
          console.log("shadowRoot", shadowRoot);
          return shadowRoot;
        }
      } else {
        let elem = await page.waitForXPath(xpath);
        elem.dispose();
    }*/

/*
export function testElementNotLocatedByXPath(driver: WebDriver, xpath: string, timeout = config.TIMEOUT, isInButtonArea: boolean) {
    return waitForCondition(driver)(`testElementNotLocatedByXPath ${xpath}`,
        async function(driver) {
            try {
                let elem = await findByXPath(driver, xpath, isInButtonArea);
                return elem ? false : true;
            } catch(err) {
                console.log("ignoring error in testElementNotLocatedByXPath for xpath = "+xpath,err.toString().split("\n")[0]);
            }
    }, timeout);
}
*/

export async function testElementLocatedById(page: Page, id: string, isInButtonArea: boolean) {
    //useShadowRoot  isInButtonArea    buttonsInShadowRoot    locateInShadowRoot
    //t                   t            t                        t
    //t                   t            f                        f
    //t                   f            t                        t
    //t                   f            f                        t
    let locateInShadowRoot = useShadowRoot && (!isInButtonArea  || buttonsInShadowRoot);
    let fn = (locateInShadowRoot: boolean,shadowRootName: string, selector: string) => 
    {
        let elem: HTMLElement = locateInShadowRoot ? document.querySelector(shadowRootName)?.shadowRoot?.querySelector(selector) 
        : document.querySelector(selector);
        if (!elem) return false;
        return true;
    }
    console.log(`testElementLocatedById id ${id}`);
    let res = await page.waitForFunction(fn, {polling: 100}, locateInShadowRoot, shadowRootName, "#"+id);
    await res.dispose();
/*
    if (useShadowRoot ) {
        if (!buttonsInShadowRoot && isInButtonArea) {
          let elem = await page.waitForSelector(`#${id}`);
          elem.dispose();
        } else {
          let fn = `document.querySelector('${shadowRootName}')?.shadowRoot?.querySelector('#${id}')`;
          console.log("selector", fn);
          let shadowRoot = await page.waitForFunction(fn);
          console.log("shadowRoot", shadowRoot);
          return shadowRoot;
        }
      } else {
        let elem = await page.waitForSelector(`#${id}`);
        elem.dispose();
    }*/
}
    
/*
async function retry<T>(retryCount: number, driver: WebDriver, fun : (driver:  WebDriver, retryCount: number) => Promise<T>):  Promise<T> {
    for (let i=0; i<retryCount; i++) {
        try {
            return await fun(driver, i);
        } catch (err) {
            console.log("comand failed. Retry #", i+1);
            await driver.sleep(200);
        }
    }
}
*/
export async function clickElementById(page: Page, id: string, isInButtonArea: boolean) {
    let locateInShadowRoot = useShadowRoot && (!isInButtonArea  || buttonsInShadowRoot);
    let fn = (locateInShadowRoot: boolean,shadowRootName: string, selector: string) => 
    {
        console.log("HERE!!");
        let elem: HTMLElement = locateInShadowRoot ? document.querySelector(shadowRootName).shadowRoot.querySelector(selector) 
        : document.querySelector(selector);
        if (!elem) return false;
        elem.click();
        return true;
    }
    let res = await page.evaluate(fn, locateInShadowRoot, shadowRootName, "#"+id);
    /*    let locateInShadowRoot = useShadowRoot && (!isInButtonArea  || buttonsInShadowRoot);
    let fn = locateInShadowRoot ? `document.querySelector('${shadowRootName}')?.shadowRoot?.querySelector('#${id}')` : `document.querySelector('#${id}')`;
    console.log(`clickElementById id ${id} JS-Selector: ${fn}`);
    let res = await page.waitForFunction(fn);
    await res.asElement().click()
    await res.dispose();
*/
/*    if (useShadowRoot) {
        if (!buttonsInShadowRoot && isInButtonArea) {
          let elem = await page.waitForSelector(`#${id}`);
          await elem.click();
          await elem.dispose();
        } else {
          let fn = `document.querySelector('${shadowRootName}').shadowRoot.querySelector('#${id}')`;
          console.log("selector", fn);
          let shadowRoot = await page.waitForFunction(fn);
          await shadowRoot.asElement().click()
          console.log("shadowRoot", shadowRoot);
          return shadowRoot;
        }
      } else {
        console.log(`SELECTOR #${id}`);
        let elem = await page.waitForSelector(`#${id}`, {visible:true});
        await elem.click();
        await elem.dispose();
    }*/
}

export async function clickElementByXPath(page: Page, xpath: string, isInButtonArea: boolean) {
   /* let selector = convertPath(xpath);
    let locateInShadowRoot = useShadowRoot && (!isInButtonArea  || buttonsInShadowRoot);
    let fn = (locateInShadowRoot: boolean,shadowRootName: string, selector: string) => 
    {
        let elem: HTMLElement = locateInShadowRoot ? document.querySelector(shadowRootName)?.shadowRoot?.querySelector(selector) 
        : document.querySelector(selector);
        return elem;
    }
    console.log("locateInShadowRoot, shadowRootName, selector", locateInShadowRoot, shadowRootName, selector);
    let res = await page.waitForFunction(fn, {polling: 20}, locateInShadowRoot, shadowRootName, selector);
    await res.asElement().click();
    console.log("clickElementByXPath returned");
*/

    let selector = convertPath(xpath);
    let locateInShadowRoot = useShadowRoot && (!isInButtonArea  || buttonsInShadowRoot);
    let fn = (locateInShadowRoot: boolean,shadowRootName: string, selector: string) => 
    {
        console.log("HERE!!", locateInShadowRoot, shadowRootName, selector);
        let elem: HTMLElement = locateInShadowRoot ? document.querySelector(shadowRootName).shadowRoot.querySelector(selector) 
        : document.querySelector(selector);
        elem.click();
        return 42;
    }
    let res = await page.evaluate(fn, locateInShadowRoot, shadowRootName, selector);
    console.log(`clickElementByXPath ${xpath}, res ${res}`);
}

export async function testElementLocatedByXpath(page: Page, xpath: string, isInButtonArea: boolean) {
    let selector = convertPath(xpath);
    let locateInShadowRoot = useShadowRoot && (!isInButtonArea  || buttonsInShadowRoot);
    let fn = (locateInShadowRoot: boolean,shadowRootName: string, selector: string) => 
    {
        console.log("HERE!!");
        let elem: HTMLElement = locateInShadowRoot ? document.querySelector(shadowRootName)?.shadowRoot?.querySelector(selector) 
        : document.querySelector(selector);
        if (!elem) return false;
        return elem.innerText.length >0;
    }
    console.log(`testElementLocatedByXpath xpath ${xpath} JS-Selector: ${fn}`);
    let res = await page.waitForFunction(fn, {polling: 100}, locateInShadowRoot, shadowRootName, selector);
    await res.dispose();
}

export async function testTextContains(page: Page, xpath: string, expectedText: string, isInButtonArea: boolean): Promise<void> {
    let selector = convertPath(xpath);
    let locateInShadowRoot = useShadowRoot && (!isInButtonArea  || buttonsInShadowRoot);
    let fn = (locateInShadowRoot: boolean,shadowRootName: string, selector: string, expectedText: string) => 
    {
        console.log("HERE!!");
        let elem: HTMLElement = locateInShadowRoot ? document.querySelector(shadowRootName)?.shadowRoot?.querySelector(selector) 
        : document.querySelector(selector);
        if (!elem) return false;
        return elem.innerText.includes(expectedText);
    }
    console.log(`testTextContains xpath ${xpath} JS-Selector: ${fn}`);
    let res = await page.waitForFunction(fn, {polling: 100}, locateInShadowRoot, shadowRootName, selector, expectedText);
    await res.dispose();

    // let selector = convertPath(xpath);
    // let locateInShadowRoot = useShadowRoot && (!isInButtonArea  || buttonsInShadowRoot);
    // let fn = locateInShadowRoot ? 
    //     `document.querySelector('${shadowRootName}')?.shadowRoot?.querySelector('${selector}')?.innerText?.includes('${expectedText}')` 
    //     : `document.querySelector('${selector}')?.innerText?.includes('${expectedText}')`;
    // console.log(`testTextContains ${xpath} expected '${expectedText}' JS-Selector: ${fn}`);

    // let res = await page.waitForFunction(fn);
    // // let actual:string = await res.jsonValue();
    // // if (actual!==expectedText) {
    // //     throw `testTextContains failed for xpath ${xpath} and text ${expectedText} but was ${actual}`;
    // // }
    // await res.dispose();

    // let selector = convertPath(xpath);
    // let locateInShadowRoot = useShadowRoot && (!isInButtonArea  || buttonsInShadowRoot);
    // let fn = locateInShadowRoot ? 
    //     `document.querySelector('${shadowRootName}')?.shadowRoot?.querySelector('${selector}')?.innerText === '${expectedText}'` 
    //     : `document.querySelector('${selector}')?.innerText === '${expectedText}'`;
    // try {
    //     let res = await page.waitForFunction(fn);
    //     await res.dispose();
    // } catch (e) {
    //     throw `testTextContains failed for xpath ${xpath} and text ${expectedText}`;
    // }
}



/*
export async function mainRoot(driver: WebDriver, isInButtonArea: boolean) : Promise<WebElement> {
  if (useShadowRoot) {
    if (!buttonsInShadowRoot && isInButtonArea) {
      return driver.findElement(By.tagName("body"))
    } else {
      return shadowRoot(driver, shadowRootName);
    }
  } else {
    return driver.findElement(By.tagName("body"))
  }
}
*/
// node_modules\.bin\chromedriver.cmd --verbose --port=9998 --log-path=chromedriver.log
// SELENIUM_REMOTE_URL=http://localhost:9998
export async function startBrowser(benchmarkOptions: BenchmarkDriverOptions): Promise<puppeteer.Browser> {
    const width = 1280;
    const height = 800;

    const browser = await puppeteer.launch({
        headless: benchmarkOptions.headless,
        // FIXME
        executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
        ignoreDefaultArgs: ["--enable-automation"],
        args: [`--window-size=${width},${height}`], // , '--disable-features=IsolateOrigins,site-per-process'
        dumpio: true,
        defaultViewport: {
          width,
          height,
        },
      });

    return browser;
/*
    let args = [
        "--js-flags=--expose-gc",
        "--enable-precise-memory-info",
        "--no-first-run",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-cache",
        "--disable-translate",
        "--disable-sync",
        "--disable-extensions",
        "--disable-default-apps",
        "--remote-debugging-port=" + (benchmarkOptions.remoteDebuggingPort).toFixed(),
        "--window-size=1200,800"
    ];

    if (process.platform == "darwin" && process.arch=="arm64") {
        console.log("INFO: Disabling site isolation as a workaround for Mac M1");
        args.push("--disable-features=IsolateOrigins,site-per-process");
    }

    if (benchmarkOptions.headless) {
        args.push("--headless");
        args.push("--disable-gpu"); // https://bugs.chromium.org/p/chromium/issues/detail?id=737678
        args.push("--no-sandbox");
    }

    let caps = new Capabilities({
        browserName: 'chrome',
        platform: 'ANY',
        version: 'stable',
        "goog:chromeOptions": {
            binary: benchmarkOptions.chromeBinaryPath,
            args: args,
            "perfLoggingPrefs": {
                "enableNetwork": true,
                "enablePage": true,
                "traceCategories": "devtools.timeline,blink.user_timing"
            },
            "excludeSwitches": [ "enable-automation" ]
        },
        "goog:loggingPrefs": {
            "browser": "ALL",
            "performance": "ALL"
        }
    });

    // port probing fails sometimes on windows, the following driver construction avoids probing:
    let service = new chrome.ServiceBuilder()
        .setPort(benchmarkOptions.chromePort).build();
    var driver = chrome.Driver.createSession(caps, service);

    return driver;
    */
}