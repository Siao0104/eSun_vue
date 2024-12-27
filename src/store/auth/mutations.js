import {
    CLEAR,
    RESET_STATE,
    SET_ACCOUNT,
    SET_AUTHENTICATION, SET_CALENDAR_DATA,
    SET_TOKEN, SET_USERNAME,
} from "../storeconstants.js";

function getDefaultState() {
    return {
        authenticated: false,
        account: "",
        token: null,
        calendarData: false,
    }
}

export default {
    [SET_AUTHENTICATION](state,authenticated){
        state.authenticated = authenticated;
    },
    [SET_ACCOUNT](state,account){
        state.account = account;
    },
    [SET_TOKEN](state,token){
        state.token = token;
    },
    [RESET_STATE](state){
        Object.assign(state,getDefaultState());
    },
    [SET_USERNAME](state,userName){
        state.userName = userName;
    },
    [CLEAR](state){
        state.authenticated = false;
        state.account = null;
        state.token = null;
        state.userName = null;
    },
}