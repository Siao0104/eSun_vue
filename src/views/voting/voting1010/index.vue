<script lang="ts" setup>
import VotingResultList from "../voting1010/VotingResultList.vue"
import VotingList from "../voting1010/VotingList.vue"
</script>

<template>
  <div class="voting-page">
    <div class="left-panel">
      <VotingResultList />
    </div>
    <div class="right-panel">
      <VotingList />
    </div>
  </div>
</template>

<style scoped>
.voting-page {
  display: flex; /* 使用 Flexbox 佈局 */
}
.left-panel, .right-panel {
  padding: 10px;
}
.left-panel {
  flex: 4; /* 左側佔 40% 寬度 */
  background-color: #f0f0f0;
  /* 左側背景顏色 */
}
.right-panel {
  flex: 6; /* 右側佔 60% 寬度 */
  background-color: #ffffff; /* 右側背景顏色 */
}
</style>