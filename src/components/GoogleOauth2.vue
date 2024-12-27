<script lang="ts" setup>
import { onMounted } from 'vue'; // 導入 onMounted 生命週期鉤子
import showMessage from "./message/message";
import {useRouter} from "vue-router";
import {SET_ACCOUNT, SET_AUTHENTICATION, SET_TOKEN, SET_USERNAME} from "../store/storeconstants";
import store from "../store";

const router = useRouter();

// 元件載入後呼叫 Google API
onMounted(async () => {
  // 取得當前 URL 中的查詢參數
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const accessToken = urlParams.get('accessToken'); // 取得 accessToken 參數
  const tokenObject = JSON.parse(accessToken);
  if (accessToken) {
    // 將 accessToken 儲存在 localStorage
    localStorage.setItem("accessToken", tokenObject.accessToken);
    store.commit(`auth/${SET_AUTHENTICATION}`, true);
    store.commit(`auth/${SET_ACCOUNT}`, tokenObject.userName);
    store.commit(`auth/${SET_USERNAME}`,tokenObject.account);
    store.commit(`auth/${SET_TOKEN}`, tokenObject.accessToken);
    await router.push('/mainLayout');
  } else {
    showMessage("沒有 accessToken，請重新登入", "error", 5000);
    await router.push('/');
  }
});
</script>

<template>
  <div class="container">
    <p>驗證成功，跳轉登入中...</p>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center; /* 垂直居中 */
  align-items: center; /* 水平居中 */
  height: 100vh; /* 占滿整個視口高度 */
}

p {
  font-size: 24px; /* 放大字體 */
  color: #333;
}
</style>
