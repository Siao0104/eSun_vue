import {
GET_CALENDAR_DATA
} from "../storeconstants.js";

export default {
    [GET_CALENDAR_DATA](state){
        return state.calendarData;
    }
}