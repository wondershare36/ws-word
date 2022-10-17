<template>
  <div class="home">
    <div class="main card" v-if="data.name">
      <div class="header">
        <span class="name">{{ data.name[0] }}同学，您好！</span>
        <el-button type="text" style="margin-left: auto;" @click="handleLogout">注销</el-button>
      </div>
      <div class="content" style="text-align:center;">
        <div style="font-size: 16px;">平均时长</div>
        <div style="margin-top: 0px;"><span class="number">{{ data.avgHours }}</span> 小时</div>
      </div>
      <div class="bottom">
        <div class="bottom-left">
          <div class="bottom-title">追求奋斗者</div>
          <div class="bottom-time"><span class="number">{{ formatTime(calData.left_time102,'hh:mm') }}</span>下班</div>
        </div>
        <div class="bottom-right">
          <div class="bottom-title">追求实践者</div>
          <div class="bottom-time"><span class="number">{{ formatTime(calData.left_time9,'hh:mm') }}</span>下班</div>
        </div>
      </div>
    </div>
    <div class="card" style="margin-top: 20px;">
      本月共有{{total_day}}工作日，本月已经熬过了{{calData.work_day}}个工作日，包含今天还剩工作日{{calData.left_day}}天
      <el-progress :text-inside="true" :stroke-width="26" :percentage="calData.percent" :format="format"></el-progress>
    </div>
    <div class="card" style="margin-top: 20px;">
      <div class="row">
        <div>
          <div>距离入职</div>
          <div>{{data.joinDate}}</div>
        </div>
        <div class="number">{{calData.timeDiff}}天</div>
      </div>
    </div>
    <div class="holiday card" style="margin-top: 20px;">
      <div class="row">
        <div class="">
          <div class="title">春节倒计时</div>
          <div>2023-01-22</div>
        </div>
        <div class="number">{{calHoliday}}天</div>
      </div>
    </div>
    <div class="main" v-if="!data.name">
      <div class="header">
        <span class="name">万兴人，您好！</span>
      </div>
      <div class="content input-content">
        <el-form ref="myform" :rules="rules" :model="form">
          <el-form-item prop="wsId">
            <el-input v-model="form.wsId" placeholder="工号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-popover
              placement="top-start"
              title="加密密码"
              :width="200"
              trigger="hover"
              content="请在员工之家抓包获取算法加密过的32位字符"
            >
              <template #reference>
                <el-input type="password" placeholder="密码" v-model="form.password"></el-input>
              </template>
            </el-popover>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       style="background-color:#006DFF;width: 100%;font-size: 18px;font-weight: 700;letter-spacing:14px;height: 42px;"
                       @click="handleLogin">登录
            </el-button>
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
      total_day:0,
      data: {},
      rules: {
        wsId: [
          {required: true, message: '请输入工号', trigger: 'blur'},
          {min: 8, max: 8, message: '长度为 8 位字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 32, max: 32, message: '长度为 32 位字符', trigger: 'blur'}
        ],
      }
    }
  },
  mounted() {
    this.getWordDay()
    this.form = {
      wsId: localStorage.getItem('wsId'),
      password: localStorage.getItem('password'),
    }
    if (!this.form.wsId || !this.form.password) return
    this.getData()
  },
  computed:{
    calHoliday(){
      const timeDiff = Math.round((new Date('2023-01-22').getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24)
      return timeDiff
    },
    calData(){
      const data=this.data
      if(!data.name) return {
      }
      const lastName = `${data.name[data.name.length - 1]}`
      const name = `小${lastName}${lastName}宝贝`
      const timeDiff = Math.round((new Date().getTime() - new Date(data.joinDate).getTime()) / 1000 / 60 / 60 / 24)
      const work_day = Math.floor(data.needAttend / 7.5)
      const totol_day = this.total_day
      const left_day = totol_day-work_day
      const now = new Date()
      const yestoday = new Date(now.getTime() - 1000 * 24 * 60 * 60)
      const left_time75 = new Date('2022-10-01 18:40:00') // 下班时间，随便举某天的下班18:40点 为7.5个小时
      const left_hour102 = ((totol_day * 10.2 - work_day * data.avgHours) / left_day).toFixed(2)// 奋斗者 对标10.2个小时
      const left_time102 = new Date(left_time75.getTime() + (left_hour102 - 7.5) * 60 * 60 * 1000)// 奋斗者 对标10.2个小时
      const left_hour9 = ((totol_day * 9 - work_day * data.avgHours) / left_day).toFixed(2)// 思考者 对标9个小时
      const left_time9 = new Date(left_time75.getTime() + (left_hour9 - 7.5) * 60 * 60 * 1000)// 思考者 对标9个小时
      const percent= Math.round(work_day/totol_day*100)
      console.log(percent)
      return{
        left_time9,
        left_time102,
        left_day,
        work_day,
        percent,
        timeDiff
      }
    }
  },
  methods: {
    format(percentage) {
      return `${this.calData.work_day}天`;
    },
    async getWordDay(){
      const {data}=await this.axios.get('https://api.apihubs.cn/holiday/get')
      console.log(data)
      let total_day=0
      data.data.list.forEach((day)=>{
        if(day.workday===1){
          total_day++
        }
      })
      console.log(total_day)
      this.total_day=total_day
    },
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
        this.data = data
      })
    },
    formatTime(time, format = "yyyy-MM-dd hh:mm:ss") {
      let date = new Date(time);
      let year = '0' + date.getFullYear();
      let month = '0' + (date.getMonth() + 1);
      let day = '0' + date.getDate();
      let hour = '0' + date.getHours();
      let minute = '0' + date.getMinutes();
      let second = '0' + date.getSeconds();
      if (format.includes('y')) {
        format = format.replace(/y+/, year.slice(-(format.match(/y+/)[0].length)));
      }
      if (format.includes('M')) {
        format = format.replace(/M+/, month.slice(-(format.match(/M+/)[0].length)));
      }
      if (format.includes('d')) {
        format = format.replace(/d+/, day.slice(-(format.match(/d+/)[0].length)));
      }
      if (format.includes('h')) {
        format = format.replace(/h+/, hour.slice(-(format.match(/h+/)[0].length)));
      }
      if (format.includes('m')) {
        format = format.replace(/m+/, minute.slice(-(format.match(/m+/)[0].length)));
      }
      if (format.includes('s')) {
        format = format.replace(/s+/, second.slice(-(format.match(/s+/)[0].length)));
      }
      return format;
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
    handleLogout() {
      this.data = {}
      localStorage.clear()
      this.form = {
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
  .card{
    padding: 8px 16px;
    background-color: #fff;
    border-radius: 4px;
  }

  .main {

    .header {
      display: flex;
      align-items: center;
    }

    .content {
      margin: 12px 0;
      padding: 12px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .bottom {
      display: flex;
      text-align: center;

      > div {
        width: 50%;
      }
    }

    .name {
      font-size: 18px;
      font-weight: 700;
    }


  }

  .holiday{

  }
}
.row{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.number {
  font-weight: 700;
  font-size: 24px;
}
</style>
