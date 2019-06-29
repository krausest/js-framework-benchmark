import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {rows: []},
    getters : {Rows: state => state.rows},
    mutations: {Rows: (state,rows) => state.rows = rows},
})
