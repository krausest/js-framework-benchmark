import { renderComponent } from '@lifeart/gxt';
import { Application } from './App.gts';

// @ts-expect-error app is unknown
renderComponent(new Application().template(), window['app']);
