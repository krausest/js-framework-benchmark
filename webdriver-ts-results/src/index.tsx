import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux'
import { createStore } from 'redux'
import { reducer } from './reducer';

const store = createStore(reducer)

ReactDOM.render(
    <Provider store={store}>
      <App/>
  </Provider>,
  document.getElementById('root')
);

