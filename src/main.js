import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ECharts from 'vue-echarts'
import { use } from "echarts/core";
// 手动引入 ECharts 各模块来减小打包体积
import {
    CanvasRenderer
} from 'echarts/renderers'
import {
    BarChart
} from 'echarts/charts'
import {
    GridComponent,
    TooltipComponent
} from 'echarts/components'

const app=createApp(App)

app.use(VueAxios, axios)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
use([
    CanvasRenderer,
    BarChart,
    GridComponent,
    TooltipComponent
]);
// 全局注册组件（也可以使用局部注册）
app.component('v-chart', ECharts)

app.use(router).mount('#app')
