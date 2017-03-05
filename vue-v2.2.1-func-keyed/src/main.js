import { default as Vue } from 'vue';

import './components/app.component';
import './components/table.component';

new Vue({
    el: '#vue',
    beforeCreate() {
        console.info(`Hello Vue.js ${Vue.version}!`);
    }
})
