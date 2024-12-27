<script lang="ts" setup>
import { Menu as IconMenu, Edit, Setting, Star, SetUp } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter()

const emits = defineEmits(['addTabs','openTabs']);
const handleMenuSelect = (index) => {
  emits('openTabs',index)
  emits('addTabs', index)
}

</script>

<template>
  <el-aside width="200px">
    <el-scrollbar>
      <el-menu @select="handleMenuSelect">
        <el-sub-menu index="1">
          <template #title>
            <el-icon><icon-menu /></el-icon>開發項目
          </template>
          <el-menu-item index="voting1000"><el-icon><Edit /></el-icon>投票項目維護</el-menu-item>
          <el-menu-item index="voting1010"><el-icon><Star /></el-icon>投票紀錄</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><setting /></el-icon>設定檔
          </template>
          <el-menu-item index="utility1010"> <el-icon><Edit /></el-icon>代碼維護</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<style scoped>

</style>