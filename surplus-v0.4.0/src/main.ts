import { Store } from './store';
import { App } from './controller';
import { AppView } from './view';
import * as S from 's-js';

var view = S.root(() => AppView(new App(new Store()))) ;
document.getElementById('main')!.appendChild(view);