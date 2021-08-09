import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
// import './registerServiceWorker'
// import 'ant-design-vue/dist/antd.css'
import '@/assets/iconfonts/iconfont.css'
/* import Antd from 'ant-design-vue' */
import axios from 'axios'
import { CreateElement } from 'vue/types/vue'
import {
  Icon, Menu, Input, Select, Table, Tabs,
  Radio, Layout, Button,
  Tag, Divider, Tree, Dropdown, Form, Modal,
  Col, Row, AutoComplete, Tooltip, Spin, Badge, Card,
  Collapse, Checkbox, message
} from 'ant-design-vue'

// @ts-ignore
import kloading from '@/components/loading/index.js'
import VueI18n from 'vue-i18n'
/***
 * 注册全局组件
 */
import Main from '@/views/index/Main.vue'
/***
 * 自定义图标
 */
// @ts-ignore
import iconFront from '@/assets/iconfonts/iconfont.js'
/***
 * 请求方法
 */
import MethodType from '@/components/common/MethodApi.vue'
/***
 * api详情展示组件
 */
import ApiInfo from '@/views/api/index.vue'
import Authorize from '@/views/settings/Authorize.vue'
import SwaggerModels from '@/views/settings/SwaggerModels.vue'
import GlobalParameters from '@/views/settings/GlobalParameters.vue'
import Settings from '@/views/settings/Settings.vue'
import OfficelineDocument from '@/views/settings/OfficelineDocument.vue'
import OtherMarkdown from '@/views/othermarkdown/index.vue'
/***
 * 本地存储解决方案
 */
import localStore from './store/local'
// 本地缓存models
import knife4jModel from '@/store/knife4jModels'

/**
 * 日志组件
 */
// @ts-ignore
import logger from '@/core/logger'

// @ts-ignore
import i18nZH from '@/assets/common/lang/zh.js'
// @ts-ignore
import i18nEN from '@/assets/common/lang/en.js'

Vue.prototype.$message = message

Vue.use(Card)
Vue.use(Badge)
Vue.use(Modal)
Vue.use(Form)
Vue.use(Collapse)
Vue.use(Checkbox)
Vue.use(Tooltip)
Vue.use(Spin)
Vue.use(AutoComplete)
Vue.use(Col)
Vue.use(Row)
Vue.use(Icon)
Vue.use(Menu)
Vue.use(Input)
Vue.use(Select)
Vue.use(Table)
Vue.use(Tabs)
Vue.use(Radio)
Vue.use(Layout)
Vue.use(Button)
Vue.use(Tag)
Vue.use(Divider)
Vue.use(Tree)
Vue.use(Dropdown)
Vue.use(kloading)
Vue.use(VueI18n)
Vue.component('Main', Main)

const myicon = Icon.createFromIconfontCN({
  scriptUrl: iconFront
})
Vue.component('my-icon', myicon)
Vue.component('MethodType', MethodType)
Vue.component('ApiInfo', ApiInfo)
Vue.component('Authorize', Authorize)
Vue.component('SwaggerModels', SwaggerModels)
Vue.component('GlobalParameters', GlobalParameters)
Vue.component('Settings', Settings)
Vue.component('OfficelineDocument', OfficelineDocument)
Vue.component('OtherMarkdown', OtherMarkdown)

Vue.config.productionTip = false
// 响应数据拦截器
axios.interceptors.response.use(function (response) {
  const data = response.data
  return data
}, function (error) {
  return Promise.reject(error)
})
Vue.prototype.$axios = axios
Vue.prototype.$localStore = localStore

Vue.prototype.$Knife4jModels = knife4jModel

// @ts-ignore
String.prototype.gblen = function () {
  let len = 0
  for (let i = 0; i < this.length; i++) {
    if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
      len += 2
    } else {
      len++
    }
  }
  return len
}
Vue.prototype.$logger = logger

// @ts-ignore
String.prototype.startWith = function (str:string) {
  const reg = new RegExp('^' + str)
  // @ts-ignore
  return reg.test(this)
}

// i18n
const i18n = new VueI18n({
  locale: 'zh-CN',
  messages: {
    'zh-CN': i18nZH,
    'en-US': i18nEN
  }
})

new Vue({
  router,
  store,
  render: (h:CreateElement) => h(App)
}).$mount('#app')
