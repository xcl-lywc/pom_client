import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

import './assets/style/common.less'
import 'font-awesome/css/font-awesome.css'

import 'customform/src/components/index.js'
import 'customform/lib/customform.common.js'

Vue.use(require('vue-cookies'))

Vue.config.productionTip = false

//引用公用js
import commonJS from "./plugins/common.js"
Vue.prototype.common = commonJS;

// 全局引入axios 并配置
import axios from 'axios'
import qs from 'qs'

//引入js-md5
import md5 from 'js-md5';
window.md5Js = md5
Vue.prototype.md5 = md5; 

axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
Vue.prototype.axios = axios;

/******************axios拦截器****************/
//request 拦截 在非登录或文章相关接口调用时 获取session中的认证数据
Vue.prototype.axios.interceptors.request.use(
  (config, Vue) => {  
    try {
      if(sessionStorage.getItem("Access-Token")) {
        config.headers.common['Authorization'] = JSON.parse(sessionStorage.getItem("Access-Token") || null);
      } 
      if(sessionStorage.getItem("Access-Key")) {
        config.headers.common['Access-Key'] = JSON.parse(sessionStorage.getItem("Access-Key") || null);
      }
    } catch(e) {
      console.log("获取Authorization 或 Access-Key 有误!")
    }
    config.headers.common['nonce']      = Math.floor(Math.random()*10000000000000000) // 随机数0-10000000000000000
    config.headers.common['Time-Stamp'] = (new Date()).valueOf() // 当前时间戳
    config.headers.common['secret']     = "pom-product-client" // 口令
    config.headers.common['type']       = "PC"      // 口令 

    let object = {
      'nonce':      config.headers.common.nonce,
      'Time-Stamp': config.headers.common['Time-Stamp'],
      'secret':     config.headers.common.secret,
      'Access-Key': config.headers.common['Access-Key'],
    } 
    let ObjectCombine = object; //组合完成的数组

    // -------- get请求 --------- //
    if(config.method == 'get') { 
      ObjectCombine = Object.assign(object, config.params) //合并原有的四个header参数 & get请求附带的参数
    }

    let array = []
    for ( let k in ObjectCombine ) {
      array.push(k)
    }
    array.sort()
    let FinalArray = [] //组合完成并排序后的数组
    array.forEach( (item, index) => {
      FinalArray.push(ObjectCombine[item])
    })
    config.headers.common['sign'] = window.md5Js(FinalArray.join(""))// 写入sign

    return config
  }, 
  error => {
    return Promise.reject(error)
  }
)

//response 拦截
Vue.prototype.axios.interceptors.response.use(
  response => {   
    // 当meta信息为空时，表示后台回传的文件流
    if(!response.data.meta) return response;

    if (response.data.meta.code != 0) { 

      if(response.data.meta.code == 401 || response.data.meta.code == 405) {
        setTimeout(() => {
          Vue.prototype.common.goOut();
        }, 1500)
        return Promise.reject("登录验证失效, 将重登录");
      } else if (response.data.meta.code == 403) {
        setTimeout(() => {
          Vue.prototype.common.goOut();
        }, 1500)
        return Promise.reject("您的权限已被修改, 请重新登录");
      } else {
        return Promise.reject(response.data.meta.message)
      }
    } else { 
      return response.data;
    }
  }, 
  error => {
    if (error.response.data.message) {
      return Promise.reject(error.response.data.message)
    } else { //请求没有返回体, 请求失败
      return Promise.reject("网络错误, 请联系管理员");
    }
  }
);


new Vue({
  router,
  store,
  render: function (createElement) {
    let routeMeta = this.$route.meta
    let props = {}
    // 控制是否显示 带导航的布局 || 空白布局 
    if (routeMeta && routeMeta.showNav) {
      props.layout = 'nav-layout'
    } else {
      props.layout = 'blank-layout'
    }
    return createElement(App, {props})
  }
}).$mount('#app')
