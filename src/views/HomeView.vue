<template>
  <div class="home">
    <div class="main" v-if="data.name">
      <div class="header">
        <span class="number">{{ data.name[0] }}同学，您好</span>
        <el-button type="text" style="margin-left: auto;" @click="handleLogout">注销</el-button>
      </div>
      <div class="content" style="text-align:center;">
        <div style="font-size: 24px;">平均时长</div>
        <div style="margin-top: 20px;"><span class="number">{{ data.avgHours }}</span>小时</div>
<!--        <div style="margin-top: 20px;color: #666;font-size: 12px;">-->
<!--          保持 8.46 小时， 19:12 下班-->
<!--        </div>-->
      </div>
    </div>
    <div class="main" v-if="!data.name">
      <div class="header">
        <span class="number">万兴人，您好</span>
      </div>
      <div class="content input-content">
        <el-form ref="myform" :rules="rules" :model="form" label-width="60px">
          <el-form-item label="工号" prop="wsId">
            <el-input v-model="form.wsId"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-popover
              placement="top-start"
              title="加密密码"
              :width="200"
              trigger="hover"
              content="请在员工之家抓包获取算法加密过的32位字符"
            >
              <template #reference>
                <el-input type="password" v-model="form.password"></el-input>
              </template>
            </el-popover>
          </el-form-item>
          <el-form-item>
            <!--            <el-checkbox label="记住账号和密码" name="type" checked></el-checkbox>-->
            <el-button style="margin-left: auto;" @click="handleLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'HomeView',
  data() {
    return {
      form: {
        wsId: "",
        password: "",
      },
      data: {},
      calData: {},
      rules: {
        wsId: [
          {required: true, message: '请输工号', trigger: 'blur'},
          {min: 8, max: 8, message: '长度为 8 位字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输加密密码', trigger: 'blur'},
          {min: 32, max: 32, message: '长度为 32 位字符', trigger: 'blur'}
        ],
      }
    }
  },
  mounted() {
    this.form = {
      wsId: localStorage.getItem('wsId'),
      password: localStorage.getItem('password'),
    }
    if (!this.form.wsId || !this.form.password) return
    this.getData()
  },
  methods: {
    getData() {
      this.axios.post('https://gw.300624.cn/users/authentication', this.form).then((response) => {
        if (response.data.status > 200) {
          localStorage.clear()
          return this.$message.error(response.data.message)
        }
        localStorage.setItem('wsId', this.form.wsId)
        localStorage.setItem('password', this.form.password)
        const data = response.data.data
        console.log(data)
        const timeDiff = Math.round((new Date().getTime() - new Date(data.joinDate).getTime()) / 1000 / 60 / 60 / 24)
        const work_day = Math.floor(data.attend / data.avgHours)
        const left_day = data.needAttend + 1;
        const totol_day = work_day + left_day
        const now = new Date()
        const yestoday = new Date(now.getTime() - 1000 * 24 * 60 * 60)
        const left_time75 = new Date('2022-10-01 18:40:00') // 下班时间，随便举某天的下班18:40点 为7.5个小时
        const left_hour102 = ((totol_day * 10.2 - work_day * data.attend) / left_day).toFixed(2)// 奋斗者 对标10.2个小时
        const left_time102 = new Date(left_time75.getTime() + (10.2 - left_hour102) * 60 * 60 * 1000)// 奋斗者 对标10.2个小时
        const left_hour9 = ((totol_day * 9 - work_day * data.attend) / left_day).toFixed(2)// 思考者 对标9个小时
        const left_time9 = new Date(left_time75.getTime() + (9 - left_hour102) * 60 * 60 * 1000)// 思考者 对标9个小时
        this.data = data
        this.calInfo = {}
      })
    },
    handleLogin() {
      this.$refs.myform.validate((valid) => {
        if (valid) {
          this.getData()
        } else {
          return false;
        }
      });
    },
    handleLogout(){
      this.data={}
      localStorage.clear()
      this.form={
        wsId: "",
        password: "",
      }
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  padding: 20px;
  font-size: 14px;

  .main {
    .header {
      padding: 10px 20px;
      background-color: rgba(255, 255, 255, 0.6);
      display: flex;
      align-items: center;
    }

    .content {
      background-color: rgba(255, 255, 255, 0.8);
      padding: 20px;
    }

    .input-content {

    }

    .number {
      font-size: 18px;
    }
  }

}
</style>
