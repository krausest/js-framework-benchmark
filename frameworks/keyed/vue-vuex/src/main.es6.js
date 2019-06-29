import Vue from 'vue'
import App from './App.vue'
import {store } from './vuexstore';

new Vue({
    el: '#main',
    store,
    render: h => h(App)
})
