<script lang="ts" setup>
import { onMounted } from 'vue'; // 導入 onMounted 生命週期鉤子
import { uiRedirectToGoogleOAuth, uiCheckTokenDead } from "../api/api.js";
import serviceApi from "../request/request.js";
import showMessage from "./message/message";
import {useRouter} from "vue-router";

const router = useRouter();

// 元件載入後呼叫 Google API
onMounted(async () => {
  // 取得當前 URL 中的查詢參數
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const token = urlParams.get('token'); // 取得 token 參數
  const response = await serviceApi.get(`${uiCheckTokenDead}?token=${token}`);
  if (response.status === 200) {
    try {
      // 取得重定向 URL 並將用戶重定向到 Google OAuth
      window.location.href =`http://localhost:8080${uiRedirectToGoogleOAuth}`;
    }catch(error) {
      showMessage("Google OAuth 驗證失敗，請重新嘗試。","error",5000);
    }
  } else {
    showMessage(response.data,"error",5000);
  }
});
</script>

<template>
  <div class="container">
    <p>正在跳轉到 Google 驗證...</p>
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
