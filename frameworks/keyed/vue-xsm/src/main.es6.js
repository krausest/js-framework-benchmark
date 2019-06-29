import Vue from 'vue'
import App from './App.vue'
import mytable from './table.vue';

//Vue.component('mytable', mytable);

new Vue({
    el: '#main',
    render: h => h(App)
})
