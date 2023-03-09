import React from 'react';
import App from './App';
import {Provider} from 'react-redux'
import { createStore } from 'redux'
import { reducer } from './reducer';

const store = createStore(reducer)

import { createRoot } from 'react-dom/client';

window.onload = () => {

  const root = createRoot(document.getElementById('root')!);
  
  root.render(
    <Provider store={store}>
      <App/>
  </Provider>
);
}
