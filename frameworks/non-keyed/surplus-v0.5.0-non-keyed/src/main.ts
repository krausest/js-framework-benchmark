import { Store } from './store';
import { AppView } from './view';
import S from 's-js';

var view = S.root(() => AppView(new Store()));
document.getElementById('main')!.appendChild(view);