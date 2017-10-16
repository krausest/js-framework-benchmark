import * as chrome from 'selenium-webdriver/chrome'
import {By, until, Builder, WebDriver, Locator, promise, WebElement, Condition} from 'selenium-webdriver'
import {config} from './common'

interface PathPart {
    tagName: string;
    index: number;
}

let useShadowRoot = false;

export function setUseShadowRoot(val: boolean) {
    useShadowRoot = val;
}

function convertPath(path: string): Array<PathPart> {
    let parts = path.split(/\//).filter(v => !!v);
    let res: Array<PathPart> = [];
    for (let part of parts) {
        let components = part.split(/\[|]/).filter(v => !!v);
        let tagName = components[0];
        let index:number = 0;
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

// Fake findByXPath for simple XPath expressions to allow usage with shadow dom
function findByXPath(node: WebElement, path: string): promise.Promise<WebElement> {
    // if there wasn't polymer with it's shadow dom useage one would like to use:

     let paths = convertPath(path);
     let n = promise.fulfilled(node);
     for (let p of paths) {
         // n = n.then(nd => nd.findElements(By.tagName(p.tagName))).then(elems => { // costly since it fetches all elements
         n = n.then(nd => (nd===null) ? null : nd.findElements(By.css(p.tagName+":nth-child("+(p.index)+")"))).then(elems => {
             if (elems==null || elems.length==0) { console.log("not found"); return null}; 
             return elems[0];
         }).catch(e => {console.log("REJECTED PROMISE",e); return null;});
     }
     return n;    
  
    // if (!useShadowRoot) {
    //     return node.findElements(By.xpath(path)).then(nodes => {
    //             if (nodes.length === 0) {
    //                 return null;
    //             } else {
    //                 return nodes[0];
    //             }
    //     })
    // } else {
    //     let paths = convertPath(path);
    //     let n = promise.fulfilled(node);
    //     for (let p of paths) {
    //         n = n.then(nd => nd.findElements(By.tagName(p.tagName))).then(elems => { // costly since it fetches all elements
    //             if (elems.length < p.index) { console.log("not found"); return null}; //throw "Element not found "+p.tagName+"["+p.index+"]";
    //             return elems[p.index-1];
    //         });
    //         // n = n.then(nd => nd.findElements(By.css(p.tagName+":nth-child("+(p.index)+")"))).then(elems => {
    //         //     console.log("*", elems.length);
    //         //     if (elems.length==0) { console.log("not found"); return null}; //throw "Element not found "+p.tagName+"["+p.index+"]";
    //         //     return elems[0];
    //         // });
    //     }
    //     return n;
    // }
}

function elemNull(v: any) {
    console.log("*** ELEMENT WAS NULL");
    return false;
}

function waitForCondition(driver: WebDriver) {
    return function(text: string, fn: (driver:WebDriver) => promise.Promise<boolean>, timeout: number): promise.Promise<boolean> {
        return driver.wait(new Condition<boolean>(text, fn), timeout);
    }
}

// driver.findElement(By.xpath("//tbody/tr[1]/td[1]")).getText().then(...) can throw a stale element error: 
// thus we're using a safer way here:
export function testTextContains(driver: WebDriver, xpath: string, text: string, timeout = config.TIMEOUT) {
    return waitForCondition(driver)(`testTextContains ${xpath} ${text}`,
        (driver) => shadowRoot(driver).then(elem => findByXPath(elem, xpath))
            .then(elem => elem==null ? elemNull(false) : elem.getText().then(
                v => v && v.indexOf(text)>-1,
                err => console.log("ignoring error in testTextContains for xpath = "+xpath+" text = "+text,err.toString().split("\n")[0])
        )), timeout);        
}

export function testTextNotContained(driver: WebDriver, xpath: string, text: string, timeout = config.TIMEOUT) {
    return waitForCondition(driver)(`testTextNotContained ${xpath} ${text}`,
        (driver) => shadowRoot(driver).then(elem => findByXPath(elem, xpath))
            .then(elem => elem==null ? elemNull(false) : elem.getText().then(
                v => v && v.indexOf(text)==-1,
                err => console.log("ignoring error in testTextNotContained for xpath = "+xpath+" text = "+text,err.toString().split("\n")[0])
        )), timeout);        
}

export function testClassContains(driver: WebDriver, xpath: string, text: string, timeout = config.TIMEOUT) {
    return waitForCondition(driver)(`testClassContains ${xpath} ${text}`,
        (driver) => shadowRoot(driver).then(elem => findByXPath(elem, xpath))
            .then(elem => elem==null ? elemNull(false) : elem.getAttribute("class").then(
            v => v && v.indexOf(text)>-1,
            err => console.log("ignoring error in testClassContains for xpath = "+xpath+" text = "+text,err.toString().split("\n")[0])
        )), timeout); 
}

export function testElementLocatedByXpath(driver: WebDriver, xpath: string, timeout = config.TIMEOUT) {
    return waitForCondition(driver)(`testElementLocatedByXpath ${xpath}`, (driver) => 
            shadowRoot(driver).then(elem => 
                    elem==null ? elemNull(false) : findByXPath(elem, xpath).then(
                    (v:any) => v,
                    (err:any) => console.log("ignoring error in testElementLocatedByXpath for xpath = "+xpath,err.toString())
            )), config.TIMEOUT); 
}

export function testElementNotLocatedByXPath(driver: WebDriver, xpath: string, timeout = config.TIMEOUT)
{
    return waitForCondition(driver)(`testElementNotLocatedByXPath ${xpath}`,
        (driver) => shadowRoot(driver).then(elem => findByXPath(elem, xpath)).then(
            v => !v,
            err => console.log("ignoring error in testElementNotLocatedByXPath for xpath = "+xpath,err.toString().split("\n")[0]))
        , timeout);
}

export function testElementLocatedById(driver: WebDriver, id: string, timeout = config.TIMEOUT) {
    return waitForCondition(driver)(`testElementLocatedById ${id}`,
        (driver) => shadowRoot(driver).then(elem => elem.findElement(By.id(id))).then(
            v => true,
            err => console.log("ignoring error in testElementLocatedById for id = "+id,err.toString().split("\n")[0]))
        , timeout);
}

function retry<T>(retryCount: number, driver: WebDriver, fun : (driver:  WebDriver) => promise.Promise<T>):  promise.Promise<T> {
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

export function forPromRec(priorResults : any[], from: number, to: number, fun : (idx: number) => promise.Promise<any>):  promise.Promise<any[]> {
    if (from >= to) throw "fromProm from (="+from+") >=to (="+to+")";
    else if (from < to-1) return fun(from).then(val => forPromRec(priorResults.concat([val]), from+1, to, fun));
    else return fun(from).then(val => priorResults.concat([val]));
}

export function forProm(from: number, to: number, fun : (idx: number) => promise.Promise<any>):  promise.Promise<any[]> {
    return forPromRec([], from, to, fun);
}
// export function forProm(from: number, to: number, fun : (idx: number) => promise.Promise<any>):  promise.Promise<any[]> {
//     let res: any[] = []; 
//     let p = fun(from);
//     for (let i=from+1; i<to; i++) {
//         p = p.then(val => { res.push(val); return fun(i) });
//     }
//     return p.then(
//         (val) => {
//             res.push(val);
//             return res;
//         }
//     );
// }

// Stale element prevention. For aurelia even after a testElementLocatedById clickElementById for the same id can fail
// No idea how that can be explained
export function clickElementById(driver: WebDriver, id: string) {
    let count = 0;
    return retry(5, driver, (driver) => shadowRoot(driver).then(elem => elem.findElement(By.id(id)).click()));
    // return to(driver.findElement(By.id(id)).click());
}

export function clickElementByXPath(driver: WebDriver, xpath: string) {
    let count = 0;
    return retry(5, driver, (driver)=> { count++; 
            if (count>1 && config.LOG_DETAILS) console.log("clickElementByXPath ",xpath," attempt #",count);
            return shadowRoot(driver).then(elem =>  
            findByXPath(elem, xpath)).then(elem => elem.click() ); });
    // Stale element possible:
    // return to(driver.findElement(By.xpath(xpath)).click());
}

export function getTextByXPath(driver: WebDriver, xpath: string): promise.Promise<string> {
    let count = 0;
    return retry(5, driver, (driver) => { count++; 
            if (count>1 && config.LOG_DETAILS) console.log("getTextByXPath ",xpath," attempt #",count); 
            return shadowRoot(driver).then(elem =>  
            findByXPath(elem, xpath)).then(elem => elem.getText());
    });
    // Stale element possible:
    // return to(driver.findElement(By.xpath(xpath)).getText());
}

function shadowRoot(driver: WebDriver) : promise.Promise<WebElement> {
    return useShadowRoot ? driver.executeScript('return document.querySelector("main-element").shadowRoot') : driver.findElement(By.tagName("body")); 
}
