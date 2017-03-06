import Vue from 'vue'
import App from './App.vue'

new Vue({
    el: '#main',
    beforeCreate() {
        console.info(`Hello Vue.js ${Vue.version}!`);
    },
    render: h => h(App)
})
