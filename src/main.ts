import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import '@/assets/iconfonts/iconfont.css'
import axios from 'axios'

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
import { CreateElement } from 'vue/types/vue'
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

Vue.use(VueI18n)
Vue.use(kloading)
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
Vue.prototype.$localStore = localStore

new Vue({
  router,
  store,
  render: (h:CreateElement) => h(App)
}).$mount('#app')
