<script lang="ts" setup>
import {getHeaderCellStyle} from "../../utils/commcss.js";
import {onMounted, reactive, ref} from "vue";
import showMessage from "../../../components/message/message"
import {Check, DeleteFilled, Plus, Refresh} from "@element-plus/icons-vue";
import serviceApi from "../../../request/request"
import {uiGetAllVotingItemsPageable,uiSaveVotingItems,uiDeleteVotingItems,uiGetAllVotingItems,uiCheckVotingRecords} from "../../../api/api";
import {Action, ComponentSize, ElMessage, ElMessageBox} from "element-plus";
interface VotingItem {
  id: number
  itemCode: string
  itemName: string
}
let tableData = reactive<VotingItem[]>([])
const search = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const size = ref<ComponentSize>('small')
const totalItems = ref(0)

const handleGetVotingItems = async () => {
  const searchParams = {
    dataType: search.value,
    page: currentPage.value,
    size: pageSize.value,
  }
  const response = await serviceApi.post(uiGetAllVotingItemsPageable,searchParams)
  if(response.status === 200){
    tableData.splice(0,tableData.length,...response.data.data)
    totalItems.value = response.data.totalItems
  }
}

const handleSearch = (value: string) => {
  search.value = value
  handleGetVotingItems()
}

const handleRefresh = () => {
  search.value = ''
  handleGetVotingItems()
}

const handleNewRow = () => {
  const newRow: VotingItem = {
    id: 0,
    itemCode: '',
    itemName: '',
  }
  tableData.unshift(newRow)
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleGetVotingItems()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleGetVotingItems()
}

const handleSave = async (index: number, row: VotingItem) => {
  const allVoteItems = await serviceApi.get(uiGetAllVotingItems)
  for(const item of allVoteItems.data){
    if(item.itemCode === row.itemCode){
      showMessage("投票項目編號已存在，請重新輸入！","warning")
      return
    }
  }
  if(row.itemCode === '' || row.itemName === ''){
    showMessage("請輸入投票項目編號及名稱！","warning")
    return
  }
  const response = await serviceApi.post(uiSaveVotingItems,row)
  if(response.status === 200){
    showMessage(response.data,"success")
    handleRefresh()
  }else{
    showMessage(response.data,"error")
  }
}

const handleDelete = async (index: number, row: VotingItem) => {
  const resCheck = await serviceApi.get(`${uiCheckVotingRecords}${row.itemCode}`)
  if (resCheck.data){
    const response = await serviceApi.delete(`${uiDeleteVotingItems}${row.id}`)
    if(response.status === 200){
      showMessage(response.data,"success")
      handleRefresh()
    }else{
      showMessage(response.data,"error")
    }
  } else {
    ElMessageBox.confirm(
        '刪除該投票項目將會刪除所有與其相關的投票紀錄，確定要刪除嗎？',
        '警告!!!',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '是',
          cancelButtonText: '否',
        }
    )
      .then(async () => {
        const response = await serviceApi.delete(`${uiDeleteVotingItems}${row.id}`)
        if (response.status === 200) {
          showMessage(response.data, "success")
          handleRefresh()
        } else {
          showMessage(response.data, "error")
        }
      })
  }
}

onMounted(() => {
  handleGetVotingItems()
})
</script>

<template>
  <div class="header">
    <h1 class="title">投票項目維護</h1>
    <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20]"
        :background=true
        :size="size"
        layout="sizes, prev, pager, next"
        :total="totalItems"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>
  <el-table highlight-current-row
            :data="tableData"
            class="table-style"
            :header-cell-style="getHeaderCellStyle">
    <el-table-column label="投票項目編號" prop="itemCode" sortable>
      <template #default="scope">
        <el-input v-model="scope.row.itemCode"/>
      </template>
    </el-table-column>
    <el-table-column label="投票項目名稱" prop="itemName" sortable>
      <template #default="scope">
        <el-input v-model="scope.row.itemName"/>
      </template>
    </el-table-column>
    <el-table-column align="right">
      <template #header>
        <div class="header-button">
          <el-button size="small" @click="handleNewRow"><el-icon><Plus/></el-icon>新增</el-button>
          <el-button size="small" style="margin-left: 1px" @click="handleRefresh"><el-icon><Refresh/></el-icon>刷新</el-button>
          <el-input clearable @change="handleSearch" v-model="search" size="small" placeholder="查詢(投票項目編號/投票項目名稱)" />
        </div>
      </template>
      <template #default="scope">
        <el-button size="small" type="primary" @click="handleSave(scope.$index, scope.row)"><el-icon><Check/></el-icon>保存</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"><el-icon><DeleteFilled/></el-icon>刪除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>
.table-style {
  width: 100%;
  max-height: 550px;
  height: 550px;
  overflow: auto;
}
.header-button {
  display: flex;
  gap: 5px;
  align-items: center;
}
.header {
  display: flex; /* 使用 Flexbox 佈局 */
  justify-content: space-between; /* 兩邊對齊 */
  align-items: center; /* 垂直居中 */
}
.title {
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
</style>