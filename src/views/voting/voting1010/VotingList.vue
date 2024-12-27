<script lang="ts" setup>
import {getHeaderCellStyle} from "../../utils/commcss.js";
import {computed, onMounted, reactive, ref} from "vue";
import serviceApi from "../../../request/request"
import {uiGetAllVotingItemsPageable,uiGetPersonalVotingRecords,uiSaveVotingRecords} from "../../../api/api";
import {ComponentSize} from "element-plus";
import {useStore} from "vuex";
const store = useStore();
import {GET_USERNAME, GET_ACCOUNT} from "../../../store/storeconstants";
import {SetUp} from "@element-plus/icons-vue";
import showMessage from "../../../components/message/message"

interface VotingItem {
  itemCode: string
  itemName: string
  rowStatus: string
}
let tableData = reactive<VotingItem[]>([])
const multipleSelection = ref<VotingItem[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const size = ref<ComponentSize>('small')
const userName = computed(() => store.getters[`auth/${GET_USERNAME}`]);
const userAccount = computed(() => store.getters[`auth/${GET_ACCOUNT}`]);
const votingTable = ref(null);
const personalVoting = ref(null);

const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleGetVotingItems()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleGetVotingItems()
}

const handleSelect = (selection: VotingItem[], row: VotingItem) => {
  const isNewSelect = multipleSelection.value.some(item => item.itemCode === row.itemCode)
  if(!isNewSelect){
    row.rowStatus = 'C'
    const newSelection = reactive({
      id: 0,
      itemCode: row.itemCode,
      itemName: row.itemName,
      voterName: userAccount.value,
      rowStatus: 'C',
    })
    multipleSelection.value.push(newSelection)
  } else {
    if(row.rowStatus === 'C'){
      multipleSelection.value = multipleSelection.value.filter(item => item.itemCode !== row.itemCode)
    }else if (row.rowStatus === 'R'){
      row.rowStatus = 'D'
      multipleSelection.value.forEach(item => {
        if (item.itemCode === row.itemCode) {
          item.rowStatus = 'D';
        }
      });
    }else if (row.rowStatus === 'D'){
      row.rowStatus = 'R'
      multipleSelection.value.forEach(item => {
        if (item.itemCode === row.itemCode) {
          item.rowStatus = 'R';
        }
      });
    }
  }
}

const handleGetVotingItems = async () => {
  const searchParams = {
    dataType: '',
    page: currentPage.value,
    size: pageSize.value,
  }
  const response = await serviceApi.post(uiGetAllVotingItemsPageable,searchParams)
  if(response.status === 200){
    tableData.splice(0,tableData.length,...response.data.data)
    totalItems.value = response.data.totalItems
    await handleGetPersonalVotingRecords()
  }
}

const handleGetPersonalVotingRecords = async () => {
  const response = await serviceApi.get(`${uiGetPersonalVotingRecords}${userAccount.value}`)
  multipleSelection.value = response.data
  tableData.forEach(item => {
    const isVoted = response.data.some(record => record.itemCode === item.itemCode);
    if (isVoted) {
      votingTable.value.toggleRowSelection(item, true);
    }
  });
}

const handleVoting = async () => {
  if(multipleSelection.value.length === 0){
    showMessage("請選擇投票項目","warning")
    return
  }
  const response = await serviceApi.post(uiSaveVotingRecords,multipleSelection.value)
  if(response.status === 200){
    showMessage(response.data,"success")
    await handleGetVotingItems()
  }else{
    showMessage(response.data,"error")
  }
}

onMounted(() => {
  handleGetVotingItems()
})
</script>

<template>
  <div class="header">
    <h1 class="title">歡迎回來，{{userName}}! 請進行下列投票動作</h1>
    <el-button type="success" @click="handleVoting"><el-icon><SetUp/></el-icon>投票</el-button>
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
  <el-table
            ref="votingTable"
            highlight-current-row
            :data="tableData"
            class="table-style"
            :header-cell-style="getHeaderCellStyle"
            @select="handleSelect">
    <el-table-column type="selection" width="55"/>
    <el-table-column prop="itemCode" label="投票項目編號" width="200"></el-table-column>
    <el-table-column prop="itemName" label="投票項目名稱"></el-table-column>
  </el-table>
</template>

<style scoped>
.header {
  display: flex; /* 使用 Flexbox 佈局 */
  justify-content: space-between; /* 兩邊對齊 */
  align-items: center; /* 垂直居中 */
}
.title {
  font-size: 1rem; /* 字體大小 */
  font-weight: bold; /* 字體粗細 */
}
</style>