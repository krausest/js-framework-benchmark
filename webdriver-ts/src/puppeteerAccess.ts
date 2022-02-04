import * as puppeteer from "puppeteer-core";
import { Page } from "puppeteer-core";
import { BenchmarkDriverOptions, config } from "./common";

//
async function waitForSelector(page: Page, selector: string) {
  // await page.waitForSelector(id); doesn't work right for pierce/#add and polyer
  for (let k = 0; k < 10 * 1000; k += 1000) {
    let sel = await page.$(selector);
    if (sel) {
      return sel;
    }
    await page.waitForTimeout(1000);
  }
  throw `waitForElementNotLocatedByXPath failed for ${selector};`;
}

export async function waitForElementNotLocatedByXPath(page: Page, selector: string) {
  for (let k = 0; k < 10 * 1000; k += 1000) {
    let sel = await page.$x(selector);
    if (!sel || !sel[0]) {
      return;
    }
    await sel[0].dispose();
    await page.waitForTimeout(1000);
  }
  throw `waitForElementNotLocatedByXPath failed for ${selector};`;
}

export async function waitForElementLocatedByXPath(page: Page, selector: string) {
  for (let k = 0; k < 10 * 1000; k += 1000) {
    let sel = await page.$x(selector);
    if (sel && sel[0]) {
      return sel[0];
    }
    await page.waitForTimeout(1000);
  }
  throw `waitForElementLocatedByXPath failed for ${selector};`;
}

export async function waitForElement(page: Page, selector: string) {
  let sel = await waitForSelector(page, selector);
  await sel.dispose();
}

export async function waitForElementX(page: Page, selector: string) {
  let sel = await waitForElementLocatedByXPath(page, selector);
  await sel?.dispose();
}

export async function clickElementById(page: Page, id: string) {
  let elem = await page.$(id);
  if (!elem) throw `clickElementById ${id} failed. Element was not found.`;
  await elem.click();
  await elem.dispose();
}

export async function clickElementByXPath(page: Page, selector: string) {
  let elem = await page.$(selector);
  if (!elem.asElement()) throw `clickElementByXPath ${selector} failed. Element was not found.`;
  await elem.asElement().click();
  await elem.dispose();
}

export async function waitForTextContains(page: Page, selector: string, expectedText: string): Promise<void> {
  let txt;
  for (let k = 0; k < 10 * 1000; k += 1000) {
    let elem = await waitForElementLocatedByXPath(page, selector);
    txt = await elem.evaluate((e: any) => e.innerText);
    let result = txt.includes(expectedText);
    await elem.dispose();
    if (result) return;
    await page.waitForTimeout(1000);
  }
  throw `waitForTextContains ${selector} failed. expected ${expectedText}, but was ${txt}`;
}

function browserPath(benchmarkOptions: BenchmarkDriverOptions) {
  if (benchmarkOptions.chromeBinaryPath) return benchmarkOptions.chromeBinaryPath;
  if (process.platform == "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  } else if (process.platform == "linux") {
    return "google-chrome";
  } else {
    throw new Error("Path to Google Chrome executable must be specified");
  }
}

export async function startBrowser(benchmarkOptions: BenchmarkDriverOptions): Promise<puppeteer.Browser> {
  let width = 1280;
  let height = 800;
  let window_width = width,
    window_height = height;

  const browser = await puppeteer.launch({
    headless: benchmarkOptions.headless,
    executablePath: browserPath(benchmarkOptions),
    ignoreDefaultArgs: ["--enable-automation"],
    args: [`--window-size=${window_width},${window_height}`],
    dumpio: false,
    defaultViewport: {
      width,
      height,
    },
  });
  return browser;
}
