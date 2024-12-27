import { createStore } from 'vuex';
import auth from './auth/index.js'
import uiPage from './uipage/index.js'

export default createStore({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        auth,
        uiPage
    },
})