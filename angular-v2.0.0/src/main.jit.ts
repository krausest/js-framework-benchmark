import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app';
if (process.env.ENV === 'production') {
  console.log("enable prod mode");
  enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule);
