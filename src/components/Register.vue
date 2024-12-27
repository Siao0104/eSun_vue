<template>
  <div class="register-container">
    <div class="register-form">
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-position="right" label-width="100px">
        <el-form-item class="register-title">
          <h2>註冊</h2>
        </el-form-item>
        <el-form-item label="帳號 : " prop="account">
          <el-input v-model="ruleForm.account"/>
        </el-form-item>
        <el-form-item label="密碼 : " prop="password">
          <el-input v-model="ruleForm.password" show-password/>
        </el-form-item>
        <el-form-item label="密碼確認 : " prop="confirmPassword">
          <el-input v-model="ruleForm.confirmPassword" show-password/>
        </el-form-item>
        <el-form-item label="姓名 : " prop="userName">
          <el-input v-model="ruleForm.userName"/>
        </el-form-item>
        <el-form-item label="生日 : " prop="birthday">
          <el-date-picker
              v-model="ruleForm.birthday"
              type="date"
              placeholder="請選擇"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="email : " prop="email">
          <el-input
              v-model="ruleForm.email"
              placeholder="請輸入"
          ></el-input>
        </el-form-item>
        <el-form-item label="性別 : ">
          <el-radio-group v-model="ruleForm.sex" >
            <el-radio value="M">男</el-radio>
            <el-radio value="F">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="國籍 : " prop="country">
          <el-select v-model="ruleForm.country" placeholder="請選擇">
            <el-option
                v-for="(item,index) in codeDtlOptions"
                :key="index"
                :label="item.codeDesc"
                :value="item.code"
                :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="register(ruleFormRef)">註冊</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import serviceApi from "../request/request.js";
import { onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { uiGetAllUserByAccount, uiGetAllUserByEmail, uiGetDtlCodeDesc, uiRegisterUser } from "../api/api.js";
import { countryStr } from "./constant/constant.js";
import showMessage from "./message/message.js";
import type { FormInstance, FormRules } from "element-plus";

interface RuleForm {
  account: string,
  password: string,
  confirmPassword: string,
  userName: string,
  birthday: string,
  sex: string,
  country: string,
  email: string,
}

let codeDtlOptions = ref([]);
const router = useRouter();
const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive<RuleForm>({
  account: '',
  password: '',
  confirmPassword: '',
  userName: '',
  birthday: '',
  sex: "M",
  country: '',
  email: '',
});

const checkPass = (rule: any,value: any, callback: any) => {
  if(value!==ruleForm.password){
    callback(new Error("密碼確認不相符，請重新輸入!!!"))
  }else{
    callback()
  }
}

const rules = reactive<FormRules<typeof ruleForm>>({
  account: [
    { required:true, message: "請輸入帳號", trigger: "blur"},
    { max:20, message: "帳號不超過20個字", trigger: "blur"}
  ],
  password:[
    { required:true, message: "請輸入密碼", trigger: "blur"},
    { max:16, message: "密碼不超過16個字", trigger: "blur"}
  ],
  confirmPassword:[
    { required:true, message: "請輸入二次密碼", trigger: "blur"},
    { validator: checkPass, trigger: "blur"}
  ],
  userName:[
    { required:true, message: "請輸入姓名", trigger: "blur"},
    { max:10, message: "姓名不超過10個字", trigger: "blur"}
  ],
  birthday:[
    { type: "date", required:true, message: "請輸入生日", trigger: "change"}
  ],
  country:[
    { required:true, message: "請選擇國籍", trigger: "blur"}
  ],
  email:[
      { required:true, message: "請輸入email", trigger: "blur"},
      { type: "email", message: "請輸入正確的email格式", trigger: "blur"}
  ],
})

onMounted(async () => {
  const resCodeDtl = await serviceApi.get(`${uiGetDtlCodeDesc}${countryStr}`)
  codeDtlOptions.value = resCodeDtl.data;
})
const register = async (formEl: FormInstance | undefined) => {
  if(!formEl) return
  await formEl.validate(async (valid, fields)=>{
    if(valid){
      if(await getAllUserByAccount() && await getAllUserByEmail()){
        let patMap = {
          account: ruleForm.account,
          password: ruleForm.password,
          confirmPassword: ruleForm.confirmPassword,
          userName: ruleForm.userName,
          birthday: ruleForm.birthday,
          sex: ruleForm.sex,
          country: ruleForm.country,
          email: ruleForm.email,
        }
        const registerData = await serviceApi.post(uiRegisterUser,patMap)
        if(registerData.status === 200){
          showMessage(registerData.data,"success")
          goBack();
        }
      }else{
        showMessage("該帳號/email已被使用!!!","warning")
      }
    }
  })
};
const goBack = () => {
  router.push("/");
};

const getAllUserByAccount = async () => {
  const userTotal = await serviceApi.get(`${uiGetAllUserByAccount}${ruleForm.account}`)
  if(userTotal.data.length>0){
    return false;
  }else{
    return true;
  }
}

const getAllUserByEmail = async () => {
  const userTotal = await serviceApi.get(`${uiGetAllUserByEmail}${ruleForm.email}`)
  if(userTotal.data.length>0){
    return false;
  }else{
    return true;
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.register-form {
  background-color: rgba(255, 255, 255, 0.8); /* 設定半透明背景色 */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 加入陰影效果 */
}

.register-title {
  text-align: center;
  margin-bottom: 20px;
}
</style>
