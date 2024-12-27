import {ElMessage} from "element-plus";

const showMessage = (message,type,duration=3000) => {
    let htmlFlag = false;
    if (message.includes('\n')) {
        // 將\n替換爲<br>
        message = message.replace(/\n/g, '<br>');
        htmlFlag = true;
    }
    ElMessage({
        message: message,
        type: type,
        duration: duration,
        // 設置爲true以解析HTML字串
        dangerouslyUseHTMLString: htmlFlag
    })
}

export default showMessage;