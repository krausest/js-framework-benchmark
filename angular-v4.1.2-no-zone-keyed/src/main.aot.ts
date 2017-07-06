import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode, ApplicationRef } from '@angular/core';
import { AppModuleNgFactory } from './app.ngfactory';



window['Zone'] = {
  get current() { return this },
  assertZonePatched() { },
  fork() { return this },
  get() { return true },
  run(fn: Function) { return fn() },
  runGuarded(fn: Function) { return fn() },
}

enableProdMode();
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory)
