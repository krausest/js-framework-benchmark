import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app';

enableProdMode();
platformBrowser().bootstrapModule(AppModule);
