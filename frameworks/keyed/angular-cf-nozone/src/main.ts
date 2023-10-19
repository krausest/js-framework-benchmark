import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { NgZone, ɵNoopNgZone } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    // https://github.com/angular/angular/issues/47538
    { provide: NgZone, useClass: ɵNoopNgZone }
  ]
});
