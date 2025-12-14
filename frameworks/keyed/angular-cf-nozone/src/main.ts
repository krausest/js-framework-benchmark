import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { NgZone, ɵNoopNgZone, provideZoneChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    // https://github.com/angular/angular/issues/47538
    provideZoneChangeDetection(),{ provide: NgZone, useClass: ɵNoopNgZone }
  ]
});
