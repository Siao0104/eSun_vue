<script lang="ts" setup>
import {Setting, UserFilled, HomeFilled} from "@element-plus/icons-vue";
import {CLEAR, GET_USERNAME} from "../store/storeconstants.js";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {computed, ref} from "vue";

const router = useRouter();
const store = useStore();
const userName = computed(() => store.getters[`auth/${GET_USERNAME}`]);

const emits = defineEmits(['handleOpenDrawer','handleTabRouter','handleBackMainBar']);

let tabIndex = 0;
const editableTabsValue = ref('')
const editableTabs = ref([])
const logOut = () => {
  store.commit(`auth/${CLEAR}`);
  localStorage.clear();
  router.push("/");
  window.addEventListener('popstate', function () {
    window.history.forward();
  });
};

const handleDrawer = () => {
  emits('handleOpenDrawer')
}

const handleAddTabs = (menuText: string) => {
  // 檢查頁籤是否已經存在
  const existingTab = editableTabs.value.find(tab => tab.title === menuText);
  if (existingTab) {
    // 如果頁籤已經存在，直接切換到該頁籤
    editableTabsValue.value = existingTab.name;
    return;
  }

  // 如果頁籤不存在，新增一個頁籤
  const newTabName = `${++tabIndex}`;
  editableTabs.value.push({
    title: menuText,
    name: newTabName,
  });
  editableTabsValue.value = newTabName;
}

const removeTab = (targetName: string) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }
  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
  const tabTitle = JSON.parse(JSON.stringify(editableTabs.value))
  const tabName = tabTitle.filter((tab) => tab.name === activeName)
  if(tabName.length > 0){
    emits('handleTabRouter', tabName[tabName.length-1].title)
  }else{
    emits('handleBackMainBar')
  }
}

//header上方切換標籤的事件
const handleTabClick = (tab: any) => {
  const tabName = JSON.parse(JSON.stringify(tab.props))
  emits('handleTabRouter', tabName.label)
}

//返回主頁面
const handleBackMainBar = () => {
  emits('handleBackMainBar')
}

defineExpose({
  handleAddTabs
});
</script>

<template>
  <div class="toolbar-left">
    <el-icon class="large-coin" @click="handleBackMainBar">
      <HomeFilled/>
    </el-icon>
  </div>
  <div class="edit-tabs">
    <el-tabs
        v-model="editableTabsValue"
        type="card"
        closable
        @tab-remove="removeTab"
        @tab-click="handleTabClick"
    >
      <el-tab-pane
          v-for="item in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>
  </div>
  <div class="toolbar-right">
    <el-dropdown>
      <div class="custom-avatar">
        <el-icon class="large-coin"><UserFilled/></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click.native="logOut">登出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span style="width:50px" >{{userName}}</span>
    <el-icon class="large-coin" @click="handleDrawer">
      <setting />
    </el-icon>
  </div>
</template>

<style scoped>
.large-coin {
  font-size: 24px;
  margin-right: 5px;
  margin-left: 8px;
  margin-top: 1px;
  cursor: pointer;
}

.toolbar-right {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 10px;
  position: relative;
}

.toolbar-left {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  left: 1px;
  position: relative;
  padding-right: 10px;
}

.edit-tabs {
  display: flex;
  justify-content: flex-start;
  overflow-x: auto;
  overflow-y: hidden; /* 禁止上下滾動 */
  white-space: nowrap;
  height: 40px; /* 明確設置頁籤高度 */
  flex-grow: 1;
  margin-right: 20px;
  padding-top: 5px; /* 如果需要，添加內邊距確保不擠 */
  padding-bottom: 5px;
  box-sizing: border-box;
  width: 1500px;
}

/* 自定義滾動條的樣式 */
.edit-tabs::-webkit-scrollbar {
  height: 4px; /* 調整滾動條的高度，使其更細 */
}

.edit-tabs::-webkit-scrollbar-thumb {
  background-color: #ccc; /* 滾動條顏色 */
  border-radius: 10px; /* 讓滾動條有圓角，增強美觀 */
}

.edit-tabs::-webkit-scrollbar-thumb:hover {
  background-color: #888; /* 滾動條在懸停時的顏色 */
}

.edit-tabs::-webkit-scrollbar-track {
  background-color: #f0f0f0; /* 滾動條軌道顏色 */
}

</style>