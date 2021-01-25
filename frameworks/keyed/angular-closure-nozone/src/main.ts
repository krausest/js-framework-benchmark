import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode, ApplicationRef } from '@angular/core';
import { AppModule } from './app';

window['Zone'] = {
  get current() { return this },
  assertZonePatched() { },
  fork() { return this },
  get() { return true },
  run(fn: Function) { return fn() },
  runGuarded(fn: Function) { return fn() },
}

enableProdMode();
platformBrowser().bootstrapModule(AppModule, { ngZone: 'noop' });
