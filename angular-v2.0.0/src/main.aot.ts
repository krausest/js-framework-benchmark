import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import { AppModuleNgFactory } from './app.ngfactory';
if (process.env.ENV === 'production') {
  console.log("enable prod mode");
  enableProdMode();
}
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
