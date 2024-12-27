<template>
  <el-container class="layout-container">
    <Sidebar @addTabs="addTabs" @openTabs="openTabs"/>
    <el-container>

      <el-header class="header">
        <HeaderBar ref="headerBar"
                   @handleOpenDrawer="handleOpenDrawer"
                   @handleTabRouter="handleTabRouter"
                   @handleBackMainBar="handleBackMainBar"/>
      </el-header>

      <el-main class="main">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
  <PersonalDrawer :isDrawer.sync="isDrawer" @update:isDrawer="val => isDrawer = val"></PersonalDrawer>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import PersonalDrawer from "../components/PersonalDrawer.vue";
import Sidebar from "./Sidebar.vue";
import HeaderBar from "./HeaderBar.vue";

const router = useRouter();
const isDrawer = ref(false);
const headerBar = ref(null);

//開啟右側抽屜
const handleOpenDrawer = () => {
  isDrawer.value = true;
}

//增加header的標籤
const addTabs = (menuText: string,) => {
  headerBar.value.handleAddTabs(menuText);
}

//增加標籤的主體內容
const openTabs = (menuName: string) => {
  router.push('/'+menuName);
}

//點擊標籤切換頁面
const handleTabRouter = (menuName: string) => {
  router.push('/'+menuName);
}

const handleBackMainBar = () => {
  router.push('/mainLayout');
}
</script>

<style scoped>
.layout-container {
  position: relative;
  background: url('../assets/maple2.jpg');
  background-size: cover;
}

.layout-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

.layout-container .el-header,
.layout-container .el-aside,
.layout-container .el-main {
  overflow: hidden;
  position: relative;
  z-index: 2;
}

.layout-container .el-header {
  height: 5%;
  display: flex;
  justify-content: flex-end;
  background-color: white;
}

.layout-container .el-aside {
  height: 100vh;
  overflow: hidden;
}

.layout-container .el-main {
  padding: 0;
  margin-top: 10px; /* 確保 main 的頂部有足夠的間隙 */
}
</style>