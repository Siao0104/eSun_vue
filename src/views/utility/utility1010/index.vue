<script lang="ts" setup>
import CodeMst from "../utility1010/CodeMst.vue"
import CodeDtl from "../utility1010/CodeDtl.vue"
import {ref} from 'vue'
import {ComponentSize} from "element-plus";
import serviceApi from "../../../request/request"
import { uiSaveCodeMst } from "../../../api/api"
import showMessage from "../../../components/message/message"

const mstCurrentPage = ref(1)
const mstPageSize = ref(10)
const dtlCurrentPage = ref(1)
const dtlPageSize = ref(10)
const mstTotalItems = ref(0)
const dtlTotalItems = ref(0)
const size = ref<ComponentSize>('small')
const codeMst = ref(null)
const codeDtl = ref(null)
const defaultTable = ref('mst')

//mst頁面大小更動，查詢mst資料
const handleMstSizeChange = (val: number) => {
  mstPageSize.value = val
  codeMst.value.handleCodeMst()
}

//mst當前頁面更動
const handleMstCurrentChange = (val: number) => {
  mstCurrentPage.value = val
}

//更動mst pagination
const handleUpdateMstPagination = (total: number) => {
  mstTotalItems.value = total
}

//點擊mst table row，刷新dtl table
const handleMstRowClick = (id: number) => {
  codeDtl.value.handleCodeDtl(id,dtlCurrentPage.value,dtlPageSize.value)
}

//dtl頁面大小更動，查詢dtl資料
const handleDtlSizeChange = (val: number) => {
  dtlPageSize.value = val
  codeDtl.value.handleCodeDtl(codeMst.value.mstId,dtlCurrentPage.value,dtlPageSize.value)
}

//dtl當前頁面更動
const handleDtlCurrentChange = (val: number) => {
  dtlCurrentPage.value = val
  codeDtl.value.handleCodeDtl(codeMst.value.mstId,dtlCurrentPage.value,dtlPageSize.value)
}

//更動dtl pagination
const handleUpdateDtlPagination = (total: number) =>{
  dtlTotalItems.value = total
}

//根據點擊的table，決定新增按鈕的狀態、要新增的table row
const currentTableClick = (table: string) => {
  if(table === 'mst'){
    defaultTable.value = table
  }else if(table === 'dtl'){
    defaultTable.value = table
    codeMst.value.handleChangeBtnStatus(false);
  }
}

//刷新mst、dtl table
const handleRefresh = () => {
  defaultTable.value ='mst'
  codeMst.value.handleCodeMst()
  codeDtl.value.handleCodeDtl(codeMst.value.mstId,dtlCurrentPage.value,dtlPageSize.value)
}

//決定新增的table row，mst都新增、dtl只新增dtl
const handleSelectNewRow = () => {
  if(defaultTable.value ==='mst'){
    codeMst.value.handleNewRow()
    codeDtl.value.handleNewRow(codeMst.value.mstId)
    codeMst.value.handleChangeBtnStatus(true);
  }else if(defaultTable.value === 'dtl'){
    codeDtl.value.handleNewRow(codeMst.value.mstId)
  }
}

//儲存mst、dtl資料
const saveMstAndDtl = async (mstTable: any) => {
  let saveArray = []
  mstTable.forEach((item: any) => {
    if(item.id === codeDtl.value.tableData[0].codeMstId || (item.id === 0 && codeDtl.value.tableData[0].id === 0)){
      item.codeDtlEntities = codeDtl.value.tableData
      saveArray.push(item)
    }
  })
  const response = await serviceApi.post(uiSaveCodeMst, saveArray);
  if(response.status === 200){
    showMessage(response.data,"success")
    handleRefresh()
  }else{
    showMessage(response.data,"error")
    handleRefresh()
  }
}
</script>

<template>
  <div class="app-container">
    <div class="ui-up-container">
      <div class="header">
        <h1 class="md-title">代碼維護-主檔</h1>
        <el-pagination
            v-model:current-page="mstCurrentPage"
            v-model:page-size="mstPageSize"
            :page-sizes="[5, 10, 20]"
            :background=true
            :size="size"
            layout="sizes, prev, pager, next"
            :total="mstTotalItems"
            @size-change="handleMstSizeChange"
            @current-change="handleMstCurrentChange"
        />
      </div>
      <div class="content">
        <CodeMst
            ref="codeMst"
            :current-page="mstCurrentPage"
            :page-size="mstPageSize"
            @updateMstPagination="handleUpdateMstPagination"
            @mstRowClick="handleMstRowClick"
            @currentTableClick="currentTableClick"
            @handleSelectNewRow="handleSelectNewRow"
            @saveMstAndDtl="saveMstAndDtl"
            @handleRefresh="handleRefresh"></CodeMst>
      </div>
    </div>
    <div class="ui-down-container">
      <div class="header">
        <h1 class="md-title">代碼維護-明細</h1>
        <el-pagination
            v-model:current-page="dtlCurrentPage"
            v-model:page-size="dtlPageSize"
            :page-sizes="[5, 10, 20]"
            :background=true
            :size="size"
            layout="sizes, prev, pager, next"
            :total="dtlTotalItems"
            @size-change="handleDtlSizeChange"
            @current-change="handleDtlCurrentChange"
        />
      </div>
      <div class="content">
        <CodeDtl
            ref="codeDtl"
            @updateDtlPagination="handleUpdateDtlPagination"
            @currentTableClick="currentTableClick"></CodeDtl>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 確保容器佔滿整個視口高度 */
}
.content {
  flex: 1;
  height: 100%; /* 設定固定高度或使用flex來平分空間 */
  overflow-y: hidden; /* 僅在內容溢位時顯示捲動條 */
}
.md-title {
  font-size: 1rem; /* 字體大小 */
  font-weight: bold; /* 字體粗細 */
  color: green; /* 字體顏色 */
  background-color: yellowgreen; /* 背景顏色 */
  padding: 5px 5px; /* 內邊距 */
  margin-bottom: 10px; /* 外邊距 */
  border-radius: 8px; /* 邊框圓角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 陰影 */
  text-align: center; /* 置中 */
  width: 7%;
}
.ui-up-container {
  padding: 10px 10px 50px 10px;
  overflow: hidden;
}
.ui-down-container {
  padding: 10px 10px 150px 10px;
  overflow: hidden;
}
.header {
  display: flex; /* 使用 Flexbox 佈局 */
  justify-content: space-between; /* 兩邊對齊 */
  align-items: center; /* 垂直居中 */
}
</style>