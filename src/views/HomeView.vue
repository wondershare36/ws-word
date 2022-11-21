<template>
  <div class="home">
    <div class="main card login" v-if="!data.name">
      <div class="header">
        <span class="name" @dblclick="showCmsPassWord=!showCmsPassWord" style="user-select: none">万兴人，您好！</span>
      </div>
      <div class="" style="border-bottom: none;margin-top: 20px;">
        <el-form style="width: 100%;" ref="myform" :rules="rules" :model="form">
          <el-form-item prop="wsId">
            <el-input v-model="form.wsId" placeholder="工号"></el-input>
          </el-form-item>
          <el-form-item v-show="!showCmsPassWord" prop="password">
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
          <el-form-item prop="wsId" v-show="showCmsPassWord">
            <el-input type="password" placeholder="管理密码" @change="handleCmsPasswordChange"
                      v-model="form.cmsPassword"></el-input>
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
    <div class="main card" v-if="data.name">
      <div class="header">
        <span class="name" v-if="!devMode">{{ data.name[0] }}同学，您好！</span>
        <span class="name" v-if="devMode">{{ data.name }}</span>
        <el-button type="text" style="margin-left: auto;" @click="handleLogout">注销</el-button>
      </div>
      <div class="content"
           style="border-top: 1px solid rgba(0, 0, 0, 0.1);text-align:center;justify-content: space-around;">
        <div>
          <div style="font-size: 16px;font-weight: 700;">平均时长</div>
          <div style="margin-top: 0px;"><span class="number" style="font-weight: 700;">{{ data.avgHours }}</span> 小时
          </div>
        </div>
        <div>
          <div style="font-size: 16px;font-weight: 700;">总时长</div>
          <div style="margin-top: 0px;"><span class="number" style="font-weight: 700;">{{ data.attend }}</span> 小时
          </div>
        </div>
      </div>
      <div class="content">
        <div class="bottom-left">
          <div class="bottom-title">
            追求奋斗者
            <el-tooltip
              class="box-item"
              effect="dark"
              raw-content
              placement="top-start"
            >
              <template #content>
                <div style="width:200px;">奋斗者需要 10.2 小时平均时长，<br/>
                  按 9:00 上班算，需要在剩下工作日保持每日时长
                  <strong class="blue">{{ calData.left_hour102 }}</strong> 小时，<br/>
                  按 18:40 下班算，需要在剩下工作日保持每日熬到
                  <strong class="blue">{{ formatTime(calData.left_time102, "hh:mm") }}</strong> 下班
                </div>
              </template>
              <el-icon :color="'#a8a8a8'" :size="15">
                <QuestionFilled/>
              </el-icon>
            </el-tooltip>
          </div>
          <div class="bottom-tips">
            <span>需保持每日时长 <strong style="font-weight: 700;">{{ calData.left_hour102 }}</strong> 小时</span>
          </div>
        </div>
        <div class="bottom-right">
          <div class="bottom-time"><span class="number">{{ formatTime(calData.left_time102, 'hh:mm') }}</span>下班</div>
        </div>
      </div>
      <div class="content">
        <div class="bottom-left">
          <div class="bottom-title">
            追求实践者
            <el-tooltip
              class="box-item"
              effect="dark"
              placement="top-start"
            >
              <template #content>
                <div style="width:200px;">实践者需要 9 小时平均时长，<br/>
                  按 9:00 上班算，需要在剩下工作日保持每日时长
                  <strong class="blue">{{ calData.left_hour9 }}</strong> 小时，<br/>
                  按 18:40 下班算，需要在剩下工作日保持每日熬到
                  <strong class="blue">{{ formatTime(calData.left_time9, 'hh:mm') }}</strong> 下班
                </div>
              </template>
              <el-icon :color="'#a8a8a8'" :size="15">
                <QuestionFilled/>
              </el-icon>
            </el-tooltip>
          </div>
          <div class="bottom-tips">
            需保持每日时长 <strong style="font-weight: 700;">{{ calData.left_hour9 }}</strong> 小时
          </div>
        </div>
        <div class="bottom-right">
          <div class="bottom-time"><span class="number">{{ formatTime(calData.left_time9, 'hh:mm') }}</span>下班</div>
        </div>
      </div>
    </div>
    <div class="card" v-if="data.name && !devMode" style="margin-top: 20px;">
      <div class="content" style="text-align:center;padding: 0;margin-top: 0;">
        <div>
          <div style="font-size: 16px;">本月共有{{ total_day }}工作日</div>
        </div>
      </div>
      <el-slider v-model="calData.percent" :format-tooltip="formatTooltip" :step="calData.step" show-stops></el-slider>
      <div class="content" style="padding: 0;margin-bottom: 0;">
        <div>
          <div>已经熬过{{ calData.work_day }}工作日</div>
        </div>
        <div>
          <div>还剩{{ calData.left_day }}工作日</div>
        </div>
      </div>
    </div>
    <div class="card" v-if="data.name && !devMode" style="margin-top: 20px;">
      <div class="row">
        <div>
          <div class="bottom-title">已入职</div>
          <div>{{ data.joinDate }}</div>
        </div>
        <div><span class="number">{{ calData.timeDiff }}</span>天</div>
      </div>
    </div>
    <div class="holiday card" v-if="data.name" style="margin-top: 20px;">
      <div class="row">
        <div class="">
          <div class="bottom-title">春节倒计时</div>
          <div>2023-01-22</div>
        </div>
        <div><span class="number">{{ calHoliday }}</span>天</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'HomeView',
  data() {
    return {
      devMode: false,
      showCmsPassWord: false,
      form: {
        wsId: "",
        password: "",
        cmsPassword: "",
      },
      total_day: 0,
      data: {},
      today: this.formatTime(new Date('2022-11-22'), 'yyyy-MM-dd'),
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
    // this.open()
    if (this.data.name) this.getWordDay()
    this.form = {
      wsId: localStorage.getItem('wsId'),
      password: localStorage.getItem('password'),
    }
    this.devMode = !!localStorage.getItem('devMode') || false
    if (!this.form.wsId || !this.form.password) return
    this.getData()
  },
  computed: {
    calHoliday() {
      const timeDiff = Math.round((new Date('2023-01-22').getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24)
      return timeDiff
    },
    calData() {
      const data = this.data
      if (!data.name) return {}
      const lastName = `${data.name[data.name.length - 1]}`
      const name = `小${lastName}${lastName}宝贝`
      const timeDiff = Math.round((new Date().getTime() - new Date(data.joinDate).getTime()) / 1000 / 60 / 60 / 24)
      const work_day = Math.floor(data.needAttend / 7.5)
      const totol_day = this.total_day
      const left_day = Math.max(totol_day - work_day, 0)
      const now = new Date()
      const yestoday = new Date(now.getTime() - 1000 * 24 * 60 * 60)
      const left_time75 = new Date('2022-10-01 18:40:00') // 下班时间，随便举某天的下班18:40点 为7.5个小时
      const left_hour102 = ((totol_day * 10.2 - work_day * data.avgHours) / left_day).toFixed(2)// 奋斗者 对标10.2个小时
      const left_time102 = new Date(left_time75.getTime() + (left_hour102 - 7.5) * 60 * 60 * 1000)// 奋斗者 对标10.2个小时
      const left_hour9 = ((totol_day * 9 - work_day * data.avgHours) / left_day).toFixed(2)// 实践者 对标9个小时
      const left_time9 = new Date(left_time75.getTime() + (left_hour9 - 7.5) * 60 * 60 * 1000)// 实践者 对标9个小时
      const percent = Math.round(work_day / totol_day * 100)
      const step = 1 / totol_day * 100
      console.log(percent)
      return {
        step,
        left_time9,
        left_time102,
        left_hour9,
        left_hour102,
        left_day,
        work_day,
        percent,
        timeDiff
      }
    }

  },
  watch: {
    devMode(val) {
      if (!val) return
      this.$message.success('开发者模式')
      localStorage.setItem('devMode', '1')
      this.rules.password = {}
    },
    'data.name'(value) {
      if (!value) return
      this.getWordDay()
    },
  },
  methods: {
    // 公告
    open() {

      this.$alert('日活太高，接口已经不返回时长字段信息了，请等待新版本', '维护通知 2022-11-18', {
        confirmButtonText: '忍痛等待',
        callback: action => {
          this.$message({
            type: 'info',
            message: `爱你哟`
          });
        }
      });
    },
    formatTooltip(val) {
      return `${this.calData.work_day} / ${this.total_day}`;
    },
    handleCmsPasswordChange() {
      if (this.form.cmsPassword !== 'wsl5201314') return
      this.devMode = true;

    },
    format(percentage) {
      return `${this.calData.work_day}天`;
    },
    async getWordDay() {
      const now = new Date()
      const month_total_day = now.getMonth() + 1
      let total_day = localStorage.getItem(`month_total_day_${month_total_day}`)
      if (total_day) return this.total_day = total_day

      const {data} = await this.axios.get('https://api.apihubs.cn/holiday/get')
      console.log(data)
      total_day = 0
      data.data.list.forEach((day) => {
        if (day.workday === 1) {
          total_day++
        }
      })
      console.log(total_day)
      this.total_day = total_day
      localStorage.setItem(`month_total_day_${month_total_day}`, total_day.toString())
    },
    async getData(url, config) {
      const now = new Date()
      const month_total_day = now.getMonth() + 1
      let total_day = localStorage.getItem(`month_total_day_${month_total_day}`)
      let data = JSON.parse(localStorage.getItem(`data_${this.today}`))
      if (!data) {
        await this.getData2()
        await this.getData1()
      } else {
        this.data = data
      }


      // if (this.devMode)
      //    if (this.devMode) return await this.getData1()
      //  await this.getData2()
    },
    async getData1() {
      const response = await this.axios.get('https://res.wondershare.cn/analytics/attend', {
        params: {
          wsId: this.form.wsId
        },
        headers: {
          authorization: "Basic " + window.btoa(this.form.wsId + ':' + this.form.password)
        }
      })
      // const {data: data2} = await this.axios.get(`https://gw.300624.cn/ihr/v1.0/tmp-employee-info/detail/${this.form.wsId}`, {
      //   params: this.form,
      //   headers: {
      //     authorization: "Basic MjExMTE1MTM6YTI4ZTdhZTM3NDk2NTFhOGQ1ODQyN2E3MmI2ODIwNTQ="
      //   }
      // })
      // console.log(JSON.parse(data2.data.basicInfo))
      // console.log(response)
      // if (response.data.data.status >= 200) {
      //   localStorage.clear()
      //   return this.$message.error(response.data.msg)
      // }
      // localStorage.setItem('wsId', this.form.wsId)
      // localStorage.setItem('password', this.form.password)
      this.data = {
        // name: JSON.parse(data2.data.basicInfo).name,
        ...this.data,
        ...response.data.data
      }
      localStorage.setItem(`data_${this.today}`, JSON.stringify(this.data))
    },
    async getData2() {
      const response = await this.axios.post('https://gw.300624.cn/users/authentication',
        this.form)
      console.log(response)
      if (response.data.status > 200) {
        localStorage.clear()
        return this.$message.error(response.data.message)
      }
      localStorage.setItem('wsId', this.form.wsId)
      localStorage.setItem('password', this.form.password)
      this.data = response.data.data
    },
    formatTime(time, format = "yyyy-MM-dd hh:mm:ss") {
      let date = new Date(time);
      if (date.toString() === 'Invalid Date') return '00:00'
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
  position: relative;
  padding: 20px;
  font-size: 12px;

  .login {
    margin-top: 50%;
  }

  .card {
    padding: 8px 16px;
    background-color: #fff;
    border-radius: 4px;
  }

  .content {
    padding: 8px 0;
    display: flex;
    justify-content: space-between;
  }

  .content + .content {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  .main {

    .header {
      display: flex;
      align-items: center;
      padding-bottom: 5px;
    }


    .bottom-tips {
    }

    .name {
      font-size: 18px;
      font-weight: 700;
    }


  }

  .holiday {

  }
}

.blue {
  color: #006dff;
  font-weight: 700;
}

.bottom-title {
  font-size: 16px;

}

.bottom-tips {
  display: flex;
  align-items: center;
}

/deep/ .el-slider__button {
  width: 13px;
  height: 13px;
  margin-top: 5px;
  margin-left: -2px;
  border-color: #006DFF;
}

/deep/ .el-slider__bar {
  height: 12px;
  background-color: #006DFF;
  border-radius: 10px 0 0 10px;
}

/deep/ .el-slider__runway {
  border-radius: 10px;
  height: 12px;
}

/deep/ .el-slider__stop {
  margin-top: 3px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.number {
  font-size: 24px;
}
</style>
