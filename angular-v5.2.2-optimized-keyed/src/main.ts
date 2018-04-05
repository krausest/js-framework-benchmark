import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode, ApplicationRef } from '@angular/core';
import { AppModuleNgFactory } from './app.ngfactory';

enableProdMode();
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory, { ngZone: 'noop' })
