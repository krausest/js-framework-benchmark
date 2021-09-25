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

export async function waitForClassContained(page: Page, xpath: string, className: string, isInButtonArea: boolean) {
    let selector = convertPath(xpath);
    let locateInShadowRoot = useShadowRoot && (!isInButtonArea  || buttonsInShadowRoot);
    let fn = (locateInShadowRoot: boolean,shadowRootName: string, selector: string, className: string) => 
    {
        let elem: HTMLElement = locateInShadowRoot ? document.querySelector(shadowRootName)?.shadowRoot?.querySelector(selector) 
        : document.querySelector(selector);
        if (!elem) {
            console.log(`testClassContains selector ${selector} shadow dom? ${locateInShadowRoot} element not found`);
            return false;
        }
        console.log(`testClassContains selector ${selector} shadow dom? ${locateInShadowRoot} classList ${elem.classList} expected ${className}`);
        return elem.classList.contains(className);
    }
    // console.log(`testClassContains xpath ${xpath} className '${className}'`);
    let res = await page.waitForFunction(fn, {polling: 100}, locateInShadowRoot, shadowRootName, selector, className);
    await res.dispose();
}

export async function waitForTextNotContained(page: Page, xpath: string, testText: string, isInButtonArea: boolean) {
    let selector = convertPath(xpath);
    let locateInShadowRoot = useShadowRoot && (!isInButtonArea  || buttonsInShadowRoot);
    let fn = (locateInShadowRoot: boolean,shadowRootName: string, selector: string, testText: string) => 
    {
        let elem: HTMLElement = locateInShadowRoot ? document.querySelector(shadowRootName)?.shadowRoot?.querySelector(selector) 
        : document.querySelector(selector);
        if (!elem) {
            console.log(`waitForTextNotContained selector ${selector} shadow dom? ${locateInShadowRoot} element not found`);
            return false;
        }
        console.log(`waitForTextNotContained selector ${selector} shadow dom? ${locateInShadowRoot} classList ${elem.textContent} expected ${testText}`);
        return !elem.textContent.includes(testText);
    }
    let res = await page.waitForFunction(fn, {polling: 100}, locateInShadowRoot, shadowRootName, selector, testText);
    await res.dispose();
}


export async function waitForElementNotLocatedByXPath(page: Page, xpath: string, isInButtonArea: boolean) {
    let selector = convertPath(xpath);
    let locateInShadowRoot = useShadowRoot && (!isInButtonArea  || buttonsInShadowRoot);
    let fn = (locateInShadowRoot: boolean,shadowRootName: string, selector: string) => 
    {
        let elem: HTMLElement = locateInShadowRoot ? document.querySelector(shadowRootName)?.shadowRoot?.querySelector(selector) 
        : document.querySelector(selector);
        if (!elem) {
            console.log(`testElementNotLocatedByXPath selector ${selector} shadow dom? ${locateInShadowRoot} element not found`);
            return true;
        }
        console.log(`testElementNotLocatedByXPath selector ${selector} shadow dom? ${locateInShadowRoot} element ${elem}`);
        return false;
    }
    // console.log(`testElementNotLocatedByXPath xpath ${xpath}`);
    let res = await page.waitForFunction(fn, {polling: 100}, locateInShadowRoot, shadowRootName, selector);
    await res.dispose();
}

export async function waitForElementLocatedById(page: Page, id: string, isInButtonArea: boolean) {
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
        if (!elem) {
            console.log(`testElementLocatedById id ${selector} shadow dom? ${locateInShadowRoot} element not found`);
            return false;
        }
        console.log(`testElementLocatedById id ${selector} shadow dom? ${locateInShadowRoot} element ${elem}`);
        return true;
    }
    // console.log(`testElementLocatedById id ${id}`);
    let res = await page.waitForFunction(fn, {polling: 100}, locateInShadowRoot, shadowRootName, "#"+id);
    await res.dispose();
}
    
export async function clickElementById(page: Page, id: string, isInButtonArea: boolean) {
    let locateInShadowRoot = useShadowRoot && (!isInButtonArea  || buttonsInShadowRoot);
    let fn = (locateInShadowRoot: boolean,shadowRootName: string, selector: string) => 
    {
        let elem: HTMLElement = locateInShadowRoot ? document.querySelector(shadowRootName).shadowRoot.querySelector(selector) 
        : document.querySelector(selector);
        console.log(`clickElementById id ${selector} shadow dom? ${locateInShadowRoot} element ${elem}`);
        return elem;
    }
    // console.log(`clickElementById id ${id}`);
    let elem = await page.evaluateHandle(fn, locateInShadowRoot, shadowRootName, "#"+id);
    await elem.asElement().click();
    await elem.dispose();
}

export async function getElementByXPath(page: Page, xpath: string, isInButtonArea: boolean): Promise<puppeteer.ElementHandle> {
    let selector = convertPath(xpath);
    let locateInShadowRoot = useShadowRoot && (!isInButtonArea  || buttonsInShadowRoot);
    let fn = (locateInShadowRoot: boolean,shadowRootName: string, selector: string) => 
    {
        let elem: HTMLElement = locateInShadowRoot ? document.querySelector(shadowRootName).shadowRoot.querySelector(selector) 
        : document.querySelector(selector);
        console.log(`clickElementByXPath selector ${selector} shadow dom? ${locateInShadowRoot} element ${elem}`);
        return elem;
    }
    // console.log(`clickElementByXPath ${xpath}`);
    let elem = await page.evaluateHandle<puppeteer.ElementHandle>(fn, locateInShadowRoot, shadowRootName, selector);
    return elem;
}

export async function clickElementByXPath(page: Page, xpath: string, isInButtonArea: boolean) {
    let elem = await getElementByXPath(page, xpath, isInButtonArea)
    await elem.asElement().click();
    await elem.dispose();
}

export async function waitForElementLocatedByXpath(page: Page, xpath: string, isInButtonArea: boolean) {
    let selector = convertPath(xpath);
    let locateInShadowRoot = useShadowRoot && (!isInButtonArea  || buttonsInShadowRoot);
    let fn = (locateInShadowRoot: boolean,shadowRootName: string, selector: string) => 
    {
        let elem: HTMLElement = locateInShadowRoot ? document.querySelector(shadowRootName)?.shadowRoot?.querySelector(selector) 
        : document.querySelector(selector);
        if (!elem) {
            console.log(`testElementLocatedByXpath selector ${selector} shadow dom? ${locateInShadowRoot} not found`);
            return false;
        }
        console.log(`testElementLocatedByXpath selector ${selector} found.`);
        return elem != null;
    }
    // return elem.innerText.length > 0;
    // console.log(`testElementLocatedByXpath xpath ${xpath}`);
    let res = await page.waitForFunction(fn, {polling: 100}, locateInShadowRoot, shadowRootName, selector);
    await res.dispose();
}

export async function waitForTextContains(page: Page, xpath: string, expectedText: string, isInButtonArea: boolean): Promise<void> {
    let selector = convertPath(xpath);
    let locateInShadowRoot = useShadowRoot && (!isInButtonArea  || buttonsInShadowRoot);
    let fn = (locateInShadowRoot: boolean,shadowRootName: string, selector: string, expectedText: string) => 
    {
        let elem: HTMLElement = locateInShadowRoot ? document.querySelector(shadowRootName)?.shadowRoot?.querySelector(selector) 
        : document.querySelector(selector);
        if (!elem) {
            console.log(`testTextContains selector ${selector} shadow dom? ${locateInShadowRoot} not found`);
            return false;
        }
        console.log(`testTextContains selector ${selector} shadow dom? ${locateInShadowRoot} inner text ${elem.innerText} expected ${expectedText}`);
        return elem.innerText.includes(expectedText);
    }
    // console.log(`testTextContains xpath ${xpath}`);
    let res = await page.waitForFunction(fn, {polling: 100}, locateInShadowRoot, shadowRootName, selector, expectedText);
    await res.dispose();
}

function browserPath() {
    if (process.platform == "darwin") {
        return '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'
    } else if (process.platform == "linux") {
        return 'google-chrome';
    } else {
        throw new Error("Path to Google Chrome executable must be specified");
    } 
}

export async function startBrowser(benchmarkOptions: BenchmarkDriverOptions): Promise<puppeteer.Browser> {
    const width = 1280;
    const height = 800;

    const browser = await puppeteer.launch({
        headless: benchmarkOptions.headless,
        // FIXME
        executablePath: 'google-chrome', //'/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
        ignoreDefaultArgs: ["--enable-automation"],
        args: [`--window-size=${width},${height}`], 
        dumpio: false,
        defaultViewport: {
          width,
          height,
        },
      });
    return browser;
}