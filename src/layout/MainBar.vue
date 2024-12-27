<script lang="ts" setup>
import {ElCalendar, CalendarDateType, CalendarInstance} from "element-plus";
import elementUiImage from '../assets/elementui.png';
import githubImage from '../assets/github.png';
import {computed, onMounted, ref, watch} from "vue";
import serviceApi from "../request/request.js";
import {uiDelOwnCalendar, uiGetAllCalendar} from "../api/api.js";
import showMessage from "../components/message/message";
import {GET_ACCOUNT, GET_CALENDAR_DATA, SET_CALENDAR_DATA} from "../store/storeconstants";
import {useStore} from "vuex";
import {useRouter} from "vue-router";

const store = useStore();
const calendar = ref<CalendarInstance>()
const calendarData = ref([]);
const currentPage = ref(1);
const pageSize = ref(12);
const userAccount = computed(() => store.getters[`auth/${GET_ACCOUNT}`]);
const refreshCalendar = computed(() => store.getters[`uiPage/${GET_CALENDAR_DATA}`]);
const paginatedData = computed(()=>{
  const start = (currentPage.value-1)*pageSize.value;
  const end = start + pageSize.value;
  return calendarData.value.slice(start,end);
})
const router = useRouter();

//外部連結圖片
const images = [
  {
    src: elementUiImage,
    url: 'https://element-plus.org/en-US/',
  },
  {
    src: githubImage,
    url: 'https://github.com/',
  }
]

const handlePageChange = (page) => {
  currentPage.value = page;
}

//開啟外部網站
const externalWebPage = (url) =>{
  window.open(url,'_blank');
}

//日曆組件日期選擇
const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return
  calendar.value.selectDate(val)
}

//取月曆中的日期
const obtainDay = (date) => {
  const dateParts = date.split('-');
  return dateParts[dateParts.length-1];
}

//代辦事項顏色判斷
const getCellClass = (item) => {
  return item.enabled == 1 ? 'important-cell' : 'normal-cell';
}

//取得日曆/Table上資訊
const handleGetCalendar = async (account) => {
  const response = await serviceApi.get(`${uiGetAllCalendar}${account.value}`);
  calendarData.value = response.data;
}

//刪除代辦事項
const handleDelCalendar = async (item) => {
  const response = await serviceApi.delete(`${uiDelOwnCalendar}${item.id}`);
  if(response.status === 200){
    resetCalendar();
    showMessage(response.data,"success")
  }else{
    showMessage(response.data,"error")
  }
}

const resetCalendar = () => {
  handleGetCalendar(userAccount);
}

// 在 refreshCalendar 變成 true 時，重新獲取日曆數據
watch(refreshCalendar, (newValue) => {
  if (newValue === true) {
    handleGetCalendar(userAccount);
    store.commit(`uiPage/${SET_CALENDAR_DATA}`, false);
  }
});

onMounted(()=>{
  handleGetCalendar(userAccount);
})

defineExpose({
  handleGetCalendar,
});
</script>

<template>
  <el-scrollbar>
    <div class="top-section">
      <el-carousel height="150px">
        <el-carousel-item v-for="(item,index) in images" :key="index">
          <img :src="item.src" class="carousel-image" @click="externalWebPage(item.url)">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="bottom-section">
      <div class="left-panel">
        <el-calendar ref="calendar">
          <template #header="{ date }">
            <span>行事曆</span>
            <span>{{ date }}</span>
            <el-button-group>
              <el-button size="small" @click="selectDate('prev-year')">去年</el-button>
              <el-button size="small" @click="selectDate('prev-month')">上個月</el-button>
              <el-button size="small" @click="selectDate('today')">今天</el-button>
              <el-button size="small" @click="selectDate('next-month')">下個月</el-button>
              <el-button size="small" @click="selectDate('next-year')">明年</el-button>
            </el-button-group>
          </template>
          <template #date-cell=" { data,date } ">
            <span>{{ obtainDay(data.day) }}</span>
            <div v-for="(item,index) in calendarData" :key="index">
              <div v-if="item.executeDay === data.day" :class="getCellClass(item)">
                {{ item.remark }}
              </div>
            </div>
          </template>
        </el-calendar>
      </div>
      <div class="right-panel">
        <el-scrollbar>
          <el-table :data="paginatedData">
            <el-table-column prop="executeDay" label="日期" width="140" />
            <el-table-column prop="remark" label="代辦事項" width="300">
              <template #default="scope">
                <el-tag :class="getCellClass(scope.row)">{{scope.row.remark}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="刪除" width="80">
              <template #default="scope">
                <el-button size="small" type="danger" @click="handleDelCalendar(scope.row)">刪</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
                :current-page="currentPage"
                :page-size="pageSize"
                :total="calendarData.length"
                @current-change="handlePageChange"
                layout="prev, pager, next"
            />
          </div>
        </el-scrollbar>
      </div>
    </div>
  </el-scrollbar>
</template>

<style scoped>
.top-section {
  height: 20%;
}

.bottom-section {
  display: flex;
  height: 80%;
}

.left-panel {
  flex: 2;
  padding: 10px;
}

.right-panel {
  flex: 1;
  padding: 10px;
}

.carousel-image {
  width: 100%;
  height: 100%;
  max-height: 150px; /* 設置最大高度，保持圖片比例 */
  cursor: pointer;
  object-fit: contain; /* 使圖片按比例縮放 */
  padding: 1px;
}

.el-pagination {
  text-align: center;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.important-cell {
  background-color: orange;
  color: black;
  font-size: 12px;
}

.normal-cell {
  background-color: lightblue;
  color: black;
  font-size: 12px;
}
</style>