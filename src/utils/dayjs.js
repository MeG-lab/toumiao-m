// 初始化dayjs的相关配置
// https://dayjs.gitee.io/zh-CN/
import Vue from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
// 配置使用相对时间
dayjs.extend(relativeTime)
// 使用中文语言包
dayjs.locale('zh-cn') // 全局使用
// 把处理相对时间的代买包装为全局过滤器，相当于创建了一个可以在模板中调用的函数
// 在模板中使用过滤器：{{ xxx | relativeTime }}
// 管道符前面的内容会作为参数传递给过滤器函数
// 过滤器的返回值会渲染到使用过滤器的模板中
// console.log(dayjs().format('YYYY-MM-DD HH:mm:ss'));
Vue.filter('relativeTime', value => {
    return dayjs(value).from(dayjs())
})
Vue.filter('datatime', (value, format = 'YYYY-MM-DD HH:mm') => {
    return dayjs(value).format(format)
})
