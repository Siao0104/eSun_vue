<script lang="ts" setup>
import {computed, defineProps, ref} from 'vue';
import {useStore} from "vuex";
import {GET_ACCOUNT, SET_CALENDAR_DATA} from "../store/storeconstants.js";
import serviceApi from "../request/request.js";
import {uiAddOwnCalendar} from "../api/api";
import showMessage from "./message/message";

const props = defineProps({
  isDrawer: Boolean,
})
const emits = defineEmits(['update:isDrawer']);

const store = useStore();
const remark = ref('');
const executeDay = ref('');
const enabled = ref(0);
const handleClose = () => {
  emits('update:isDrawer',false)
}
const userAccount = computed(() => store.getters[`auth/${GET_ACCOUNT}`]);
const saveUserCalendar = async () => {
  let patCalendar = {
    version: 0,
    remark: remark.value,
    executeDay: executeDay.value,
    enabled: enabled.value,
    userName: userAccount.value,
  }
  const response = await serviceApi.post(uiAddOwnCalendar,patCalendar);
  if(response.status === 200){
    remark.value = '';
    enabled.value = 0;
    executeDay.value = '';
    emits('update:isDrawer',false)
    showMessage(response.data,"success")
    store.commit(`uiPage/${SET_CALENDAR_DATA}`, true);
  }
}
</script>

<template>
  <el-drawer v-model="props.isDrawer" @closed="handleClose" :with-header="false" size="300px">
    <h2 class="title">個人行事曆</h2>
    <el-form title="個人行事曆">
      <el-form-item label="內容 :">
        <el-input v-model="remark" placeholder="請輸入代辦事項" clearable></el-input>
      </el-form-item>
      <el-form-item label="日期 :">
        <el-date-picker
            v-model="executeDay"
            type="date"
            placeholder="請選擇日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            clearable
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="重要否 :">
        <el-radio-group v-model="enabled">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="button-section">
        <el-button type="primary" @click="saveUserCalendar">保存</el-button>
      </div>
    </el-form>
  </el-drawer>
</template>

<style scoped>
.drawer-content {
  padding: 2px;
}
.title {
  font-size: 15px;
  text-align: center;
  margin-bottom: 20px;
}

.button-section {
  display: flex;
  justify-content: flex-end;
}
</style>