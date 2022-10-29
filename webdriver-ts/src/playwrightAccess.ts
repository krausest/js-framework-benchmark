import { Browser, Page } from "playwright-core";
import { chromium } from "playwright";
import { BenchmarkDriverOptions, config } from "./common";



export async function checkElementNotExists(page: Page, selector: string) {
  let start = Date.now();
  for (let k = 0; k < 10;k++) {
    let sel = await page.$(selector);
    if (!sel) {
      return;
    }
    console.log("checkElementNotExists element found");
    await sel.dispose();
    await page.waitForTimeout(k < 3 ? 10 : 1000);
  }
  console.log("checkElementNotExists waited "+(Date.now()-start)+" but no luck");
  throw `checkElementNotExists failed for ${selector};`;
}

export async function checkElementExists(page: Page, selector: string) {
  let start = Date.now();
  for (let k = 0; k < 10;k++) {
    let sel = await page.$(selector);
    if (sel) {
      await sel.dispose();
      return sel;
    }
    console.log(`checkElementExists element ${selector} not found`);
    await page.waitForTimeout(k < 3 ? 10 : 1000);
  }
  console.log("checkElementExists waited "+(Date.now()-start)+" but no luck");
  throw `checkElementExists failed for ${selector};`;
}

export async function clickElement(page: Page, selector: string) {
  let elem = await page.$(selector);
    // let elem = await page.locator(selector);
  if (!elem) throw `clickElementByXPath ${selector} failed. Element was not found.`;
  await elem.click();
  await elem.dispose();
}

export async function checkElementContainsText(page: Page, selector: string, expectedText: string): Promise<void> {
  let start = Date.now();
  let txt;
  for (let k = 0; k < 10;k++) {
    let elem = await page.$(selector);
    if (elem) {
      txt = await elem.innerText();
      if (txt===undefined) console.log("WARNING: checkElementContainsText was undefined");
      if (txt) {
        let result = txt.includes(expectedText);
        await elem.dispose();
        if (result) return;
      }
    }
    await page.waitForTimeout(k < 3 ? 10 : 1000);
  }
  console.log("checkElementExists waited "+(Date.now()-start)+" but no luck");
  throw `checkElementContainsText ${selector} failed. expected ${expectedText}, but was ${txt}`;
}

export async function checkElementHasClass(page: Page, selector: string, className: string): Promise<void> {
  let clazzes;
  for (let k = 0; k < 10;k++) {
    let elem = await page.$(selector);
    if (elem) {
      let clazzes = await elem.evaluate((e: any) => e?.classList);
      if (clazzes===undefined) console.log("WARNING: checkElementHasClass was undefined");
      if (clazzes) {
        let result = Object.values(clazzes).includes(className);
        await elem.dispose();
        if (result) return;
      }
    }
    await page.waitForTimeout(k < 3 ? 10 : 1000);
  }
  throw `checkElementHasClass ${selector} failed. expected ${className}, but was ${clazzes}`;
}

function browserPath(benchmarkOptions: BenchmarkDriverOptions) {
  if (benchmarkOptions.chromeBinaryPath) return benchmarkOptions.chromeBinaryPath;
  if (process.platform == "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  } else if (process.platform == "linux") {
    return "/usr/bin/google-chrome";
  } else if(/^win/i.test(process.platform)) {
    return 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';    
  } else {
    throw new Error("Path to Google Chrome executable must be specified");
  }
}

export async function startBrowser(benchmarkOptions: BenchmarkDriverOptions): Promise<Browser> {
  let args = ['--window-size=1000,800', '--js-flags=--expose-gc'];
  if (benchmarkOptions.headless) args.push('--headless=chrome');
  const browser = await chromium.launch({
    args,
    headless: false,
    // executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    executablePath: browserPath(benchmarkOptions),
  });
  return browser;
}
