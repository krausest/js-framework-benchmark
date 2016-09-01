import * as chrome from 'selenium-webdriver/chrome'
import {By, until, Builder, WebDriver, Locator} from 'selenium-webdriver'
import {config} from './common'


// driver.findElement(By.xpath("//tbody/tr[1]/td[1]")).getText().then(...) can throw a stale element error: 
// thus we're using a safer way here:
export function testTextContains(driver: WebDriver, xpath: string, text: string) {
    return driver.wait(new until.Condition<boolean>(`testTextContains ${xpath} ${text}`,
        (driver) => driver.findElement(By.xpath(xpath)).getText().then(
                v => v && v.indexOf(text)>-1,
                err => console.log("ignoring error in testTextContains for xpath = "+xpath+" text = "+text,err.toString().split("\n")[0])
            )                        
    ), config.TIMEOUT);        
}
export function testClassContainsNot(driver: WebDriver, xpath: string, text: string) {
    return driver.wait(new until.Condition<boolean>(`testClassContainsNot ${xpath} ${text}`,
        (driver) => driver.findElement(By.xpath(xpath)).getText().then(
                v => v && v.indexOf(text)==-1,
                err => console.log("ignoring error in testClassContainsNot for xpath = "+xpath+" text = "+text,err.toString().split("\n")[0])
            )                        
        ), config.TIMEOUT);        
}

export function testClassContains(driver: WebDriver, xpath: string, text: string) {
    return driver.wait(new until.Condition<boolean>(`testClassContains ${xpath} ${text}`,
            (driver) => driver.findElement(By.xpath(xpath)).getAttribute("class").then(
            v => v && v.indexOf(text)>-1,
            err => console.log("ignoring error in testClassContains for xpath = "+xpath+" text = "+text,err.toString().split("\n")[0])
        )), config.TIMEOUT); 
}

export function testElementLocatedByXpath(driver: WebDriver, xpath: string) {
    return driver.wait(until.elementLocated(By.xpath(xpath)), 3000);
}

export function testElementNotLocatedByXPath(driver: WebDriver, xpath: string)
{
    return driver.wait(new until.Condition<boolean>(`testElementNotLocatedByXPath ${xpath}`,
        (driver) => driver.isElementPresent(By.xpath(xpath)).then(
            v => !v,
            err => console.log("ignoring error in testElementNotLocatedByXPath for xpath = "+xpath,err.toString().split("\n")[0]))
        ), config.TIMEOUT);
}

export function testElementLocatedById(driver: WebDriver, id: string) {
    return driver.wait(new until.Condition<boolean>(`testElementLocatedById ${id}`,
        (driver) => driver.isElementPresent(By.id(id)).then(
            v => v,
            err => console.log("ignoring error in testElementLocatedById for id = "+id,err.toString().split("\n")[0]))
        )
        , config.TIMEOUT);
}

function retry<T>(retryCount: number, driver: WebDriver, fun : (driver:  WebDriver) => webdriver.promise.Promise<T>):  webdriver.promise.Promise<T> {
    return fun(driver).then(
        val => { return val;},
        err => { console.log("retry failed"); 
            if (retryCount>0) {
                retry(retryCount-1, driver, fun);
            } else {
                throw "Retrying failed"; 
            }
        }
    );
}

export function forProm(from: number, to: number, fun : (idx: number) => webdriver.promise.Promise<any>):  webdriver.promise.Promise<any[]> {
    let res: any[] = []; 
    let p = fun(from);
    for (let i=from+1; i<to; i++) {
        p = p.then(val => { res.push(val); return fun(i) });
    }
    return p.then(
        (val) => {
            res.push(val);
            return res;
        }
    );
}

// Stale element prevention. For aurelia even after a testElementLocatedById clickElementById for the same id can fail
// No idea how that can be explained
export function clickElementById(driver: WebDriver, id: string) {
    let count = 0;
    return retry(5, driver, (driver) => driver.findElement(By.id(id)).click() );
    // return to(driver.findElement(By.id(id)).click());
}

export function clickElementByXPath(driver: WebDriver, xpath: string) {
    let count = 0;
    return retry(5, driver, (driver)=> { count++; 
            if (count>1 && config.LOG_DETAILS) console.log("clickElementByXPath ",xpath," attempt #",count); 
            return driver.findElement(By.xpath(xpath)).click(); });
    // Stale element possible:
    // return to(driver.findElement(By.xpath(xpath)).click());
}
export function getTextByXPath(driver: WebDriver, xpath: string): webdriver.promise.Promise<string> {
    let count = 0;
    return retry(5, driver, (driver) => { count++; 
            if (count>1 && config.LOG_DETAILS) console.log("getTextByXPath ",xpath," attempt #",count); 
            return driver.findElement(By.xpath(xpath)).getText(); });
    // Stale element possible:
    // return to(driver.findElement(By.xpath(xpath)).getText());
}
