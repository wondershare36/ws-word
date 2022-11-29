<template>
  <div class="home">
    <div class="main card login" v-if="!data.avgHours">
      <div class="header">
        <span class="name" style="user-select: none">万兴人，您好！</span>
      </div>
      <div class="" style="border-bottom: none;margin-top: 10px;">
        <el-form style="width: 100%;" ref="myform" :rules="rules" :model="form">
          <el-form-item prop="wsId">
            <el-input v-model="form.wsId" placeholder="工号"></el-input>
          </el-form-item>
          <el-form-item v-show="!showCmsPassWord" prop="passwordStr">
            <el-input type="password" placeholder="密码" v-model="form.passwordStr"></el-input>
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
    <div>
      <el-form-item prop="wsId" v-show="showCmsPassWord&&!devMode">
        <el-input type="password" placeholder="密码" @keyup.enter="handleCmsPasswordChange"
                  v-model="cmsPassword"></el-input>
      </el-form-item>
      <el-form-item prop="wsId" v-show="data.avgHours&&devMode">
        <el-input type="number" placeholder="工号" @keyup.enter="getPersonByWsid"
                  v-model="wsId"></el-input>
      </el-form-item>
    </div>
    <div class="main card" v-if="data.avgHours">
      <div class="header">
        <span class="name" @dblclick="showCmsPassWord=!showCmsPassWord" v-if="!devMode&&data.name">{{
            data.name[0]
          }}同学，您好！</span>
        <span class="name" v-if="devMode" @dblclick="showCmsPassWord=false;devMode=false">{{ data.name }}</span>
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
            <span v-if="calData.left_hour102>0">需保持每日时长 <strong style="font-weight: 700;">{{ calData.left_hour102 }}</strong> 小时</span>
            <span v-else>已超额完成，不需要时长了</span>
          </div>
        </div>
        <div class="bottom-right">
          <div v-if="calData.left_time102>0" class="bottom-time"><span class="number">{{ formatTime(calData.left_time102, 'hh:mm') }}</span>下班</div>
          <div v-else><span class="number">18:00</span>下班</div>
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
          <div class="bottom-tips" >
            <span v-if="calData.left_hour9>0">需保持每日时长 <strong style="font-weight: 700;">{{ calData.left_hour9 }}</strong> 小时</span>
            <span v-else>已超额完成，不需要时长了</span>
          </div>
        </div>
        <div class="bottom-right">
          <div v-if="calData.left_hour9>0" class="bottom-time" ><span class="number">{{ formatTime(calData.left_time9, 'hh:mm') }}</span>下班</div>
          <div v-else><span class="number">18:00</span>下班</div>
        </div>
      </div>
    </div>
    <div class="card" v-if="data.avgHours && !devMode" style="margin-top: 10px;">
      <div class="content" style="text-align:center;padding: 0;margin-top: 0;">
        <div>
          <div style="font-size: 16px;">
            本月共有 {{ total_day }}
            <el-tooltip
              class="box-item"
              effect="dark"
              raw-content
              placement="top-start"
            >
              <template #content>
                <div style="">
                  法定工作日
                </div>
              </template>
              工作日
            </el-tooltip>
          </div>
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
    <div class="card" v-if="data.avgHours && !devMode" style="margin-top: 10px;">
      <div class="row">
        <div>
          <div class="bottom-title">已入职</div>
          <div>{{ data.joinDate }}</div>
        </div>
        <div><span class="number">{{ calData.timeDiff }}</span>天</div>
      </div>
    </div>
    <div class="holiday card" v-if="false&&data.avgHours" style="margin-top: 10px;">
      <div class="row">
        <div class="">
          <div class="bottom-title">春节倒计时</div>
          <div>2023-01-22</div>
        </div>
        <div><span class="number">{{ calHoliday }}</span>天</div>
      </div>
    </div>
    <div class="card" v-if="data.avgHours" style="margin-top: 10px;">
      <div class="row">
        <div class="">
          <div class="bottom-title">平均时长折线图</div>
        </div>
        <!--        <div><span class="number">{{ option.series[0].data.length }}</span>天</div>-->
      </div>
      <v-chart class="chart" :option="option"/>
    </div>
  </div>
</template>

<script>
import Md5 from 'crypto-js/md5';
import {use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {LineChart} from "echarts/charts";
import {
  TooltipComponent,
  MarkLineComponent,
  VisualMapComponent
} from "echarts/components";
import VChart, {THEME_KEY} from "vue-echarts";
import shence from '../js/shence.min'


use([
  CanvasRenderer,
  VisualMapComponent,
  TooltipComponent,
  MarkLineComponent,
  LineChart,
]);

function formatData(arr) {    //自己构造一个用来映射data到均匀数轴上的方法
  const step = 2
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= 6 && arr[i] < 7.5) {
      let percent1 = (arr[i] - 6) / 1.5;
      arr[i] = percent1 * step + 6;
    } else if (arr[i] >= 7.5 && arr[i] < 9) {
      let percent2 = (arr[i] - 7.5) / 1.5;
      arr[i] = percent2 * step + 8;
    } else if (arr[i] >= 9 && arr[i] < 10.2) {
      let percent2 = (arr[i] - 9) / 1.2;
      arr[i] = percent2 * step + 10;
    } else if (arr[i] >= 10.2) {
      let percent2 = (arr[i] - 10.2) / 2;
      arr[i] = percent2 * step + 12;
    }
    arr[i] = Number(arr[i]).toFixed(2)
  }
  return arr;
}

export default {
  name: 'HomeView',
  components: {
    VChart
  },
  data() {
    return {

      option: {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['22', '23', '24', '25', '26', '27', '28']
        },
        yAxis: {
          min: 6,// 起始
          splitNumber: 4,//坐标轴的分割段数，
          step: 2,
          type: 'value',
          axisLabel: {
            align: 'center',
            formatter: function (value) {
              let item = '';
              // 利用formatter将y轴上本来为6 8,10,12的点强制改为6 7.5 9 10.2
              if (value == 6) {
                item = ''
              } else if (value === 8) {
                item = '思考者'
              } else if (value === 10) {
                item = '实践者'
              } else if (value === 12) {
                item = '奋斗者'
              }
              return item
            }
          }
        },
        series: [
          {
            data: formatData([7.5, 10.2, 8.2, 7.8, 10.9, 11, 7.6]),
            step: 'middle',
            type: 'line',
            areaStyle: {},

          }
        ],
        tooltip: {
          trigger: 'axis',
          valueFormatter: function (val) {  //由于在tooltip里需要展示原始的数据，所以要把映射后的数据反计算回去
            const step = 2
            console.log(val)
            if (val >= 6 && val < 8) {
              let percent1 = (val - 6) / step;
              val = percent1 * 2 + 6;
            } else if (val >= 8 && val < 10) {
              let percent2 = (val - 8) / step;
              val = percent2 * 1.5 + 7.5;
            } else if (val >= 10 && val < 12) {
              let percent2 = (val - 10) / step;
              val = percent2 * 1.2 + 9;
            } else if (val >= 12) {
              let percent2 = (val - 12) / step;
              val = percent2 * 2 + 10.2;
            }
            console.log(val)
            val = Number(val).toFixed(2)
            return val;
          }
        },
        visualMap: {
          show: false,
          pieces: [
            {
              gt: 0,
              lte: 8,
              color: '#fe466c'
            },
            {
              gt: 8,
              lte: 10,
              color: '#f5cc00'
            },
            {
              gt: 10,
              lte: 12,
              color: '#866afb'
            },
          ],
          outOfRange: {
            color: '#05caac'
          }
        },
      },
      devMode: false,
      showCmsPassWord: false,
      cmsPassword: "",
      wsId: "",
      form: {
        wsId: "",
        passwordStr: '',
        password: "",
      },
      total_day: 0,
      data: {},
      today: this.formatTime(new Date(), 'yyyy-MM-dd'),
      rules: {
        wsId: [
          {required: true, message: '请输入工号', trigger: 'blur'},
          {min: 8, max: 8, message: '长度为 8 位字符', trigger: 'blur'}
        ],
        passwordStr: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
      },
      prefix:'ws_work'
    }
  },
  mounted() {
    // this.open()
    this.initTrigger()
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
    initTrigger() {
      if (!window["sensorsDataAnalytic201505"]) return;
      this.sensors = window["sensorsDataAnalytic201505"];
      this.sensors.init({
        server_url: "https://analytics.wondershare.cc:8106/sa?project=EdrawMax_PC",
        is_track_single_page: true, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
        use_client_time: true,
        send_type: "beacon",
        show_log: process.env.NODE_ENV === 'development',
        heatmap: {
          //是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
          clickmap: "not_collect",
          //是否开启触达注意力图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启
          scroll_notice_map: "not_collect",
          // 通过 collect_tags 配置是否开启 div 的全埋点采集，默认不采集。
        },
      });
      this.sensors.track(this.prefix+'_uv')
    },
    // 获取最近7天的时长
    get7DaysData() {
      const _this = this
      const days = [dateBefore(6), dateBefore(5), dateBefore(4), dateBefore(3), dateBefore(2), dateBefore(1), dateBefore(0)]
      const datas = []
      for (let i = 0; i < days.length; i++) {
        const dataItem = JSON.parse(localStorage.getItem('data_' + days[i]))
        const avgHours = dataItem ? dataItem.avgHours : 0
        datas.push(avgHours)
      }
      console.log(days)
      console.log(datas)
      this.option.series[0].data = formatData(datas)
      this.option.xAxis.data = days.map(item => this.formatTime(new Date(item), 'dd'))

      function dateBefore(day = 0) {
        const now = new Date()
        const oneDay = 1000 * 60 * 60 * 24
        return _this.formatTime(new Date(now.getTime() - oneDay * day), 'yyyy-MM-dd')
      }
    },
    async getPersonByWsid() {
      if (!this.devMode || !this.wsId || this.wsId.length !== 8) return this.$message.warning('请输入正确的工号')
      localStorage.removeItem(`data_${this.today}`)
      await this.getData(this.wsId)
    },
    // 公告
    open() {
      if (localStorage.getItem('isCheck') === '1') return
      this.$alert(`<p>1. 可以使用员工之家密码直接登录，不再需要抓包获取32位加密密码</p>
        <p>2. 缓存每天时长记录，当日只会发送一次请求，防止日活太高</p>
        <p>3. 根据缓存的时长记录生成最近7日平均时长折线图</p>`, '更新 2022-11-23', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        callback: action => {
          localStorage.setItem('isCheck', '1')
        }
      });
    },
    formatTooltip(val) {
      return `${this.calData.work_day} / ${this.total_day}`;
    },
    handleCmsPasswordChange() {
      if (this.cmsPassword !== 'Wsl1197718367.') return this.$message.warning('密码不正确')
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
      this.total_day = total_day
      localStorage.setItem(`month_total_day_${month_total_day}`, total_day.toString())
    },
    async getData(wsId) {
      const now = new Date()
      const month_total_day = now.getMonth() + 1
      let total_day = localStorage.getItem(`month_total_day_${month_total_day}`)
      let data = JSON.parse(localStorage.getItem(`data_${this.today}`))
      if (!data) {
        if (this.devMode) {
          await this.getData3(wsId)
          await this.getData2(wsId)
        } else {
          await this.getData1()
          await this.getData2()
        }
      } else {
        console.log('缓存', wsId)
        this.data = data
        if (wsId) console.log(localStorage.getItem('basicInfo_' + wsId))
      }
      // const send={depCName,jobCName,joinDate,name,wsId,avgHours,attend,needAttend,workPlaceName}=this.data
      delete this.data['@type']
      this.sensors.track(this.prefix+'_data',{
        ...this.data
      })
      this.get7DaysData()
    },
    // 需要账号和密码，只能查自己的，有姓名
    async getData1() {
      const response = await this.axios.post('https://gw.300624.cn/users/authentication', {
        wsId: this.form.wsId,
        password: this.form.password,
      })
      console.log(response)
      if (response.data.status > 200) {
        localStorage.clear()
        return this.$message.error(response.data.message)
      }
      localStorage.setItem('wsId', this.form.wsId)
      localStorage.setItem('password', this.form.password)
      this.data = response.data.data
    },
    // 需要账号和密码，但是wsId可以查别人的，没有姓名
    async getData2(wsId) {
      const response = await this.axios.get('https://res.wondershare.cn/analytics/attend', {
        params: {
          wsId: wsId || this.form.wsId
        },
        headers: {
          authorization: "Basic " + window.btoa(this.form.wsId + ':' + this.form.password)
        }
      })
      this.data = {
        // name: JSON.parse(data2.data.basicInfo).name,
        ...this.data,
        ...response.data.data
      }
      localStorage.setItem(`data_${this.today}`, JSON.stringify(this.data))

    },
    // 查个人信息，需要账号和密码，wsId可以查别人的
    async getData3(wsId) {
      let basicInfo = JSON.parse(localStorage.getItem('basicInfo_' + this.wsId || this.form.wsId));
      if (!basicInfo) {
        const {data: data2} = await this.axios.get(`https://gw.300624.cn/ihr/v1.0/tmp-employee-info/detail/${wsId || this.form.wsId}`, {
          headers: {
            authorization: "Basic " + window.btoa(this.form.wsId + ':' + this.form.password)
          }
        })
        basicInfo = JSON.parse(data2.data.basicInfo)
        console.log('查个人信息', basicInfo)
        localStorage.setItem('basicInfo_' + basicInfo.badge, JSON.stringify(basicInfo))
      }
      this.data.name = basicInfo.name
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
          this.form.password = Md5(this.form.passwordStr).toString()
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
.chart {
  margin-top: -50px;
  margin-bottom: -40px;
  height: 240px;
}

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
