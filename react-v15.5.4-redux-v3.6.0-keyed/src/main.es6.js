'use strict';

import React from "react";
import Controller from './controller';

import ReactDOM from 'react-dom';
import store from './store';
import {Provider} from 'react-redux';

ReactDOM.render(
  (
    <Provider store={store}>
      <Controller />
    </Provider>
  ),
  document.getElementById("main")
);
