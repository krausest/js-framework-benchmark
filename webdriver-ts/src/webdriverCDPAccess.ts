import { By, Capabilities, Condition, WebDriver, WebElement } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import { BenchmarkDriverOptions, config } from "./common";

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

function convertPath(path: string): Array<PathPart> {
  let parts = path.split(/\//).filter((v) => !!v);
  let res: Array<PathPart> = [];
  for (let part of parts) {
    let components = part.split(/\[|]/).filter((v) => !!v);
    let tagName = components[0];
    let index: number = 0;
    if (components.length == 2) {
      index = Number(components[1]);
      if (!index) {
        console.log("Index can't be parsed", components[1]);
        throw "Index can't be parsed " + components[1];
      }
    } else {
      index = 1;
    }
    res.push({ tagName, index });
  }
  return res;
}

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
      if (useRowShadowRoot && p.tagName === "tr") {
        try {
          const shadowHost = await shadowRoot(driver, `benchmark-row:nth-of-type(${p.index})`);
          elem = await shadowHost.findElement(By.tagName("tr"));
          if (elem === null) {
            return null;
          }
        } catch (err) {
          return null;
        }
      } else {
        let elems = await n.findElements(By.css(p.tagName + ":nth-of-type(" + p.index + ")"));
        if (elems == null || elems.length == 0) {
          return null;
        }
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
  return async function (text: string, fn: (driver: WebDriver) => Promise<boolean>, timeout: number): Promise<boolean> {
    return await driver.wait(new Condition<Promise<boolean>>(text, fn), timeout);
  };
}

// driver.findElement(By.xpath("//tbody/tr[1]/td[1]")).getText().then(...) can throw a stale element error:
// thus we're using a safer way here:
export async function testTextContains(driver: WebDriver, xpath: string, text: string, timeout = config.TIMEOUT, isInButtonArea: boolean) {
  return waitForCondition(driver)(
    `testTextContains ${xpath} ${text}`,
    async function (driver) {
      try {
        let elem = await findByXPath(driver, xpath, isInButtonArea);
        if (elem == null) return false;
        let v = await elem.getText();
        return v && v.indexOf(text) > -1;
      } catch (err) {
        console.log("ignoring error in testTextContains for xpath = " + xpath + " text = " + text, err.toString().split("\n")[0]);
      }
    },
    timeout
  );
}

export function testTextNotContained(driver: WebDriver, xpath: string, text: string, timeout = config.TIMEOUT, isInButtonArea: boolean) {
  return waitForCondition(driver)(
    `testTextNotContained ${xpath} ${text}`,
    async function (driver) {
      try {
        let elem = await findByXPath(driver, xpath, isInButtonArea);
        if (elem == null) return false;
        let v = await elem.getText();
        return v && v.indexOf(text) == -1;
      } catch (err) {
        console.log("ignoring error in testTextNotContained for xpath = " + xpath + " text = " + text, err.toString().split("\n")[0]);
      }
    },
    timeout
  );
}

export function testClassContains(driver: WebDriver, xpath: string, text: string, timeout = config.TIMEOUT, isInButtonArea: boolean) {
  return waitForCondition(driver)(
    `testClassContains ${xpath} ${text}`,
    async function (driver) {
      try {
        let elem = await findByXPath(driver, xpath, isInButtonArea);
        if (elem == null) return false;
        let v = await elem.getAttribute("class");
        return v && v.indexOf(text) > -1;
      } catch (err) {
        console.log("ignoring error in testClassContains for xpath = " + xpath + " text = " + text, err.toString().split("\n")[0]);
      }
    },
    timeout
  );
}

export function testElementLocatedByXpath(driver: WebDriver, xpath: string, timeout = config.TIMEOUT, isInButtonArea: boolean) {
  return waitForCondition(driver)(
    `testElementLocatedByXpath ${xpath}`,
    async function (driver) {
      try {
        let elem = await findByXPath(driver, xpath, isInButtonArea);
        return elem ? true : false;
      } catch (err) {
        console.log("ignoring error in testElementLocatedByXpath for xpath = " + xpath, err.toString());
      }
    },
    timeout
  );
}

export function testElementNotLocatedByXPath(driver: WebDriver, xpath: string, timeout = config.TIMEOUT, isInButtonArea: boolean) {
  return waitForCondition(driver)(
    `testElementNotLocatedByXPath ${xpath}`,
    async function (driver) {
      try {
        let elem = await findByXPath(driver, xpath, isInButtonArea);
        return elem ? false : true;
      } catch (err) {
        console.log("ignoring error in testElementNotLocatedByXPath for xpath = " + xpath, err.toString().split("\n")[0]);
      }
    },
    timeout
  );
}

export function testElementLocatedById(driver: WebDriver, id: string, timeout = config.TIMEOUT, isInButtonArea: boolean) {
  return waitForCondition(driver)(
    `testElementLocatedById ${id}`,
    async function (driver) {
      try {
        let elem = await mainRoot(driver, isInButtonArea);
        elem = await elem.findElement(By.id(id));
        return true;
      } catch (err) {
        // console.log("ignoring error in testElementLocatedById for id = "+id,err.toString().split("\n")[0]);
      }
    },
    timeout
  );
}

async function retry<T>(retryCount: number, driver: WebDriver, fun: (driver: WebDriver, retryCount: number) => Promise<T>): Promise<T> {
  for (let i = 0; i < retryCount; i++) {
    try {
      return await fun(driver, i);
    } catch (err) {
      console.log("comand failed. Retry #", i + 1);
      await driver.sleep(200);
    }
  }
}

// Stale element prevention. For aurelia even after a testElementLocatedById clickElementById for the same id can fail
// No idea how that can be explained
export function clickElementById(driver: WebDriver, id: string, isInButtonArea: boolean) {
  return retry(5, driver, async function (driver) {
    let elem = await mainRoot(driver, isInButtonArea);
    elem = await elem.findElement(By.id(id));
    await elem.click();
  });
}

export function clickElementByXPath(driver: WebDriver, xpath: string, isInButtonArea: boolean) {
  return retry(5, driver, async function (driver, count) {
    if (count > 1 && config.LOG_DETAILS) console.log("clickElementByXPath ", xpath, " attempt #", count);
    let elem = await findByXPath(driver, xpath, isInButtonArea);
    await elem.click();
  });
  // Stale element possible:
  // return to(driver.findElement(By.xpath(xpath)).click());
}

export async function getTextByXPath(driver: WebDriver, xpath: string, isInButtonArea: boolean): Promise<string> {
  return await retry(5, driver, async function (driver, count) {
    if (count > 1 && config.LOG_DETAILS) console.log("getTextByXPath ", xpath, " attempt #", count);
    let elem = await findByXPath(driver, xpath, isInButtonArea);
    return await elem.getText();
  });
}

export async function mainRoot(driver: WebDriver, isInButtonArea: boolean): Promise<WebElement> {
  if (useShadowRoot) {
    if (!buttonsInShadowRoot && isInButtonArea) {
      return driver.findElement(By.tagName("body"));
    } else {
      return shadowRoot(driver, shadowRootName);
    }
  } else {
    return driver.findElement(By.tagName("body"));
  }
}

// node_modules\.bin\chromedriver.cmd --verbose --port=9998 --log-path=chromedriver.log
// SELENIUM_REMOTE_URL=http://localhost:9998
export function buildDriver(benchmarkOptions: BenchmarkDriverOptions): WebDriver {
  let width = 1280;
  let height = 800;

  let args = [
    "--js-flags=--expose-gc",
    "--enable-precise-memory-info",
    // "--enable-gpu-rasterization",
    "--no-first-run",
    "--disable-background-networking",
    "--disable-background-timer-throttling",
    "--disable-cache",
    "--disable-translate",
    "--disable-sync",
    "--disable-extensions",
    "--disable-default-apps",
    "--remote-debugging-port=" + benchmarkOptions.remoteDebuggingPort.toFixed(),
    `--window-size=${width},${height}`,
  ];

  if (process.platform == "darwin" && process.arch == "arm64") {
    console.log("INFO: Disabling site isolation as a workaround for Mac M1");
    args.push("--disable-features=IsolateOrigins,site-per-process");
  }

  if (benchmarkOptions.headless) {
    args.push("--headless");
    args.push("--disable-gpu"); // https://bugs.chromium.org/p/chromium/issues/detail?id=737678
    args.push("--no-sandbox");
  }

  let caps = new Capabilities({
    browserName: "chrome",
    platform: "ANY",
    version: "stable",
    "goog:chromeOptions": {
      binary: benchmarkOptions.chromeBinaryPath,
      args: args,
      excludeSwitches: ["enable-automation"],
    },
  });

  // port probing fails sometimes on windows, the following driver construction avoids probing:
  let service = new chrome.ServiceBuilder().setPort(benchmarkOptions.chromePort).build();
  var driver = chrome.Driver.createSession(caps, service);

  return driver;
}
