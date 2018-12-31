import { ɵrenderComponent as renderComponent, ɵLifecycleHooksFeature as LifecycleHooksFeature } from '@angular/core';
import { AppComponent } from './app';

// TODO: lifecycle hooks still not being called, figure it out
renderComponent(AppComponent, { hostFeatures: [LifecycleHooksFeature] });
