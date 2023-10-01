import * as puppeteer from "puppeteer-core";
import { Page } from "puppeteer-core";
import { BenchmarkOptions } from "./common.js";

export async function checkElementNotExists(page: Page, selector: string) {
  const start = Date.now();
  for (let k = 0; k < 10; k++) {
    const sel = await page.$(selector);
    if (!sel) {
      return;
    }
    console.log("checkElementNotExists element found");
    await sel.dispose();
    await page.waitForTimeout(k < 3 ? 10 : 1000);
  }
  console.log(
    "checkElementNotExists waited " + (Date.now() - start) + " but no luck",
  );
  throw `checkElementNotExists failed for ${selector};`;
}

export async function checkElementExists(page: Page, selector: string) {
  const start = Date.now();
  for (let k = 0; k < 10; k++) {
    const sel = await page.$(selector);
    if (sel) {
      await sel.dispose();
      return sel;
    }
    console.log(`checkElementExists element ${selector} not found`);
    await page.waitForTimeout(k < 3 ? 10 : 1000);
  }
  console.log(
    "checkElementExists waited " + (Date.now() - start) + " but no luck",
  );
  throw `checkElementExists failed for ${selector};`;
}

export async function clickElement(page: Page, selector: string) {
  const elem = await page.$(selector);
  if (!elem.asElement())
    throw `clickElementByXPath ${selector} failed. Element was not found.`;
  await elem.asElement().click();
  await elem.dispose();
}

export async function checkElementContainsText(
  page: Page,
  selector: string,
  expectedText: string,
): Promise<void> {
  const start = Date.now();
  let txt;
  for (let k = 0; k < 10; k++) {
    const elem = await page.$(selector);
    if (elem) {
      txt = await elem.evaluate((e: any) => e?.innerText);
      if (txt === undefined)
        console.log("WARNING: checkElementContainsText was undefined");
      if (txt) {
        const result = txt.includes(expectedText);
        await elem.dispose();
        if (result) return;
      }
    }
    await page.waitForTimeout(k < 3 ? 10 : 1000);
  }
  console.log(
    "checkElementExists waited " + (Date.now() - start) + " but no luck",
  );
  throw `checkElementContainsText ${selector} failed. expected ${expectedText}, but was ${txt}`;
}

export async function checkElementHasClass(
  page: Page,
  selector: string,
  className: string,
): Promise<void> {
  let clazzes;
  for (let k = 0; k < 10; k++) {
    const elem = await page.$(selector);
    if (elem) {
      const clazzes = await elem.evaluate((e: any) => e?.classList);
      if (clazzes === undefined)
        console.log("WARNING: checkElementHasClass was undefined");
      if (clazzes) {
        const result = Object.values(clazzes).includes(className);
        await elem.dispose();
        if (result) return;
      }
    }
    await page.waitForTimeout(k < 3 ? 10 : 1000);
  }
  throw `checkElementHasClass ${selector} failed. expected ${className}, but was ${clazzes}`;
}

export async function checkCountForSelector(
  page: Page,
  selector: string,
  expectedCount: number,
): Promise<void> {
  const elems = await page.$$(selector);
  if (elems) {
    if (expectedCount !== elems.length) {
      throw `checkCountForSelector ${selector} failed. expected ${expectedCount}, but ${elems.length} were found`;
    }
  } else {
    if (expectedCount !== 0) {
      throw `checkCountForSelector ${selector} failed. expected ${expectedCount}, but selector was not found`;
    }
  }
}

function browserPath(benchmarkOptions: BenchmarkOptions) {
  if (benchmarkOptions.chromeBinaryPath)
    return benchmarkOptions.chromeBinaryPath;
  if (process.platform == "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  } else if (process.platform == "linux") {
    return "google-chrome";
  } else if (/^win/i.test(process.platform)) {
    return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  } else {
    throw new Error("Path to Google Chrome executable must be specified");
  }
}

export async function startBrowser(
  benchmarkOptions: BenchmarkOptions,
): Promise<puppeteer.Browser> {
  const width = 1280;
  const height = 800;

  const args = [`--window-size=${width},${height}`, "--js-flags=--expose-gc"];
  if (benchmarkOptions.headless) args.push("--headless=new");

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: browserPath(benchmarkOptions),
    ignoreDefaultArgs: [
      "--enable-automation", // 92/115
      "--disable-background-networking",
      "--enable-features=NetworkService,NetworkServiceInProcess",
      "--disable-background-timer-throttling",
      // "--disable-backgrounding-occluded-windows",
      // "--disable-breakpad",
      // "--disable-client-side-phishing-detection",
      // "--disable-component-extensions-with-background-pages",
      // "--disable-default-apps",
      // "--disable-dev-shm-usage",
      // // "--disable-extensions",
      // // "--disable-features=Translate",
      // "--disable-hang-monitor",
      // "--disable-ipc-flooding-protection",
      // "--disable-popup-blocking",
      // "--disable-prompt-on-repost",
      // "--disable-renderer-backgrounding",
      // // "--disable-sync",
      // "--force-color-profile=srgb",
      // "--metrics-recording-only",
      // // "--no-first-run",
      // // "--password-store=basic",
      // // "--use-mock-keychain",
      // "--enable-blink-features=IdleDetection",
      // // "--export-tagged-pdf"
    ],
    args,
    dumpio: false,
    defaultViewport: {
      width,
      height,
    },
  });
  return browser;
}
