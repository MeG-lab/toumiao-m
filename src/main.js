import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store/'

// 导入Vant组件
import Vant from 'vant'

// 引入Vant组件的样式
import 'vant/lib/index.css'

// 这里先导入Vant组件再导入全局样式，层叠样式表的特性，后者会覆盖前者
// 加载全局样式（放到最后，方便覆盖第三方样式）
import './styles/index.less'

// 自动设置REM基准值
import 'amfe-flexible'

import './utils/dayjs'

// 全局注册Vant
Vue.use(Vant)

Vue.config.productionTip = false

// 创建Vue根实例
// 把APP跟组件渲染到 #app 节点
Vue.config.productionTip = false



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
