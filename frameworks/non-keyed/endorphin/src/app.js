import endorphin from 'endorphin';
import DataStore from './DataStore';

import * as AppUI from './app-ui/app-ui.html';

const store = new DataStore();

endorphin('endorphin-app', AppUI, { target: document.getElementById('main'), store });
