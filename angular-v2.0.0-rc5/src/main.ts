import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { App } from './app';
if (process.env.ENV === 'production') {
  console.log("enable prod mode");
  enableProdMode();
}
bootstrap(App, []);
