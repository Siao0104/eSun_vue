import mutations from "./mutations.js";
import getters from "./getters.js";
import serviceApi from "../../request/request.js";
import {uiCheckToken} from "../../api/api.js";

export default {
    namespaced: true,
    state() {
        return {
            authenticated: false,
            account: "",
            token: null,
            userName: "",
        }
    },
    mutations,
    getters,
    actions: {
        checkToken(context){
            serviceApi.get(uiCheckToken).then(r => {});
        },
    },
}