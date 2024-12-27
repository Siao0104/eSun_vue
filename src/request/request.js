import axios from "axios";
import { localHost } from "../components/constant/constant.js"
import showMessage from "../components/message/message.js";
import {GET_TOKEN, RESET_STATE} from "../store/storeconstants.js";
import store from "../store/index.js";
import router from "../router/route.js";

const serviceApi = axios.create({
    baseURL: localHost,
    withCredentials: false,
    timeout: 3000,
})

serviceApi.interceptors.request.use(
    config=>{
        console.log("攔截器發出成功request : ",config)
        const accessToken = store.getters[`auth/${GET_TOKEN}`]
        if(accessToken){
            config.headers["Authorization"] = "Bearer " +accessToken;
        }
        return config;
    },error => {
        console.log("攔截器發出失敗request : ",error)
        return Promise.reject(error)
})

serviceApi.interceptors.response.use(
    res=>{
        console.log("攔截器回傳成功response : ",res)
        return res
    },error => {
        console.log("攔截器回傳失敗response : ",error)
        if(error.response.status === 403){
            if(error.response.data.msg!==undefined){
                showMessage(error.response.data.msg,"error");
                router.push("/");
                store.commit(`auth/${RESET_STATE}`)
            }else{
                showMessage("查無此帳號相關權限，請重新確認帳密!!","error");
            }
        }else{
            showMessage(error.response.data,"error");
        }
        return Promise.reject(error)
})

export default serviceApi