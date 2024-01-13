import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ɵprovideZonelessChangeDetection} from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [ɵprovideZonelessChangeDetection()]
});
