import { ApplicationConfig, NgZone, ɵNoopNgZone } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // https://github.com/angular/angular/issues/47538
    { provide: NgZone, useClass: ɵNoopNgZone }
  ]
};
