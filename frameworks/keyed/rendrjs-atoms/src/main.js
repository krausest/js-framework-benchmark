import { mount, rendr } from '@rendrjs/core';
import { App } from './App';

mount(document.querySelector('#root'), rendr(App));
