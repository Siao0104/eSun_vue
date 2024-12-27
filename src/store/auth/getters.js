import {
    IS_USER_AUTHENTICATED,
    GET_ACCOUNT, GET_TOKEN, GET_USERNAME, GET_CALENDAR_DATA
} from "../storeconstants.js";

export default {
    [IS_USER_AUTHENTICATED](state){
        return state.authenticated;
    },

    [GET_ACCOUNT](state){
        return state.account;
    },

    [GET_TOKEN](state){
        return state.token;
    },

    [GET_USERNAME](state){
        return state.userName;
    },
}