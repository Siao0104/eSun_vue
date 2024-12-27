import mutations from "./mutations.js";
import getters from "./getters.js";

export default {
    namespaced: true,
    state() {
        return {
            calendarData: false,
        }
    },
    mutations,
    getters,
    actions: {

    },
}