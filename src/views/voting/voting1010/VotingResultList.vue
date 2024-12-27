<script lang="ts" setup>
import {getHeaderCellStyle} from "../../utils/commcss.js";
import {onMounted, reactive} from "vue";
import {uiGetTotalVotingResult} from "../../../api/api"
import serviceApi from "../../../request/request";

interface VotingResult {
  itemCode: string
  itemName: string
  totalVotes: number
}
let tableData = reactive<VotingResult[]>([])

const handleGetTotalVotingResult = async () => {
  const response = await serviceApi.get(uiGetTotalVotingResult)
  tableData.splice(0, tableData.length, ...response.data)
}

onMounted(() => {
  handleGetTotalVotingResult()
})
</script>

<template>
  <el-table highlight-current-row
            :data="tableData"
            class="table-style"
            :header-cell-style="getHeaderCellStyle">
    <el-table-column prop="itemCode" label="投票項目編號" width="150"></el-table-column>
    <el-table-column prop="itemName" label="投票項目名稱"></el-table-column>
    <el-table-column prop="totalVotes" label="總得票數" width="100"></el-table-column>
  </el-table>
</template>

<style scoped>
.table-style {
  width: 100%;
  max-height: 800px;
  height: 800px;
  overflow: auto;
}
</style>