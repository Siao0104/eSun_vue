<template>
  <el-table
      highlight-current-row
      :data="tableData"
      class="table-style"
      :header-cell-style="getHeaderCellStyle"
      @row-click="handleRowClick">
    <el-table-column label="代碼" prop="code">
      <template #default="scope">
        <el-input v-model="scope.row.code" />
      </template>
    </el-table-column>
    <el-table-column label="代碼描述" prop="codeDesc">
      <template #default="scope">
        <el-input v-model="scope.row.codeDesc" />
      </template>
    </el-table-column>
    <el-table-column label="生效否" prop="enabled">
      <template #default="scope">
        <el-switch
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            :model-value="scope.row.enabled === 'Y'"
            @change="handleSwitchChange(scope.row)"
            @click.stop
            inline-prompt
            active-text="Y"
            inactive-text="N"/>
      </template>
    </el-table-column>
    <el-table-column align="right">
      <template #default="scope">
        <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
        >
          <el-icon><DeleteFilled/></el-icon>
          刪除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { getHeaderCellStyle } from '../../utils/commcss'
import {DeleteFilled, Plus, Check} from "@element-plus/icons-vue"
import {reactive, watch} from 'vue'
import serviceApi from "../../../request/request"
import { uiGetAllCodeDtlPageable, uiDeleteCodeDtl } from '../../../api/api'
import showMessage from "../../../components/message/message"

interface Code {
  id: number
  version: number
  code: string
  codeDesc: string
  enabled: string
  codeMstId: number
  rowStatus: string
}
const tableData = reactive<Code[]>([])
const emits = defineEmits(['updateDtlPagination','dtlRowClick','currentTableClick'])
let firstCreated = true

//刪除dtl，新增時為移除
const handleDelete = async (index: number, row: Code) => {
  if(row.id === 0){
    tableData.splice(index, 1)
  }else{
    const response = await serviceApi.delete(`${uiDeleteCodeDtl}${row.id}/${row.codeMstId}`)
    if(response.status === 200){
      showMessage(response.data,"success")
      await handleCodeDtl(row.codeMstId,1,10)
    }else{
      showMessage(response.data,"error")
    }
  }
}

//新增dtl
const handleNewRow = (codeMstId: number) => {
  console.log(firstCreated)
  const newRow: Code = {
    id: 0,
    version: 0,
    code: '',
    codeDesc: '',
    enabled: 'Y',
    codeMstId: codeMstId,
    rowStatus: 'C'
  }
  //mstId為0時，新增一個空白的dtl，否則直接新增dtl
  if(codeMstId!==0){
    tableData.unshift(newRow)
  }else{
    //只有第一次mst新增才要清dtl
    if(firstCreated) {
      firstCreated = false
      tableData.splice(0)
    }
    tableData.unshift(newRow)
  }
}

//查詢dtl
const handleCodeDtl = async (id: number,page: number,pageSize: number) => {
  //重新查詢時刷新firstCreated判斷
  firstCreated = true
  const searchParams = {
    codeMstId: id,
    page: page,
    size: pageSize,
  }
  const response = await serviceApi.post(uiGetAllCodeDtlPageable,searchParams)
  if(response.status === 200){
    tableData.splice(0,tableData.length,...response.data.data)
    emits('updateDtlPagination', response.data.totalItems)
  }
}

const handleSwitchChange = (row) => {
  row.enabled = row.enabled === 'Y' ? 'N' : 'Y';
}

const handleRowClick = () => {
  emits('currentTableClick', 'dtl')
}

defineExpose({
  handleCodeDtl,
  handleNewRow,
  tableData
})
</script>

<style scoped>
.table-style {
  width: 100%;
  max-height: 350px;
  height: 350px;
  overflow: auto;
}
.header-button {
  display: flex;
  gap: 5px;
  align-items: center;
}
</style>