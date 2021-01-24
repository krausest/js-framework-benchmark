import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';

import { AppModule } from './app/app.module';

enableProdMode();

platformBrowser().bootstrapModule(AppModule)
  .catch(err => console.error(err));
