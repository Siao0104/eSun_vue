import {
    SET_CALENDAR_DATA,
} from "../storeconstants.js";

function getDefaultState() {
    return {
        calendarData: false,
    }
}

export default {
    [SET_CALENDAR_DATA](state,calendarData){
        state.calendarData = calendarData;
    },
}