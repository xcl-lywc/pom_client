import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    partyNature:          null, //组织类型
    orgId:                null, //组织Id
    jobName:              null, //工作名称
    noticeNum:            null, //页面右上角提示信息数量 
    dialogQRcodeVisible:  false,
    QRcodeValue:          "默认二维码内容...", 
    authority:            null, //默认为未匹配到的状态, 匹配到则会有值
  },
  mutations: {
    /**
     * 在vuex中保存权限
     * @param {[type]} state [description]
     * @param {[type]} data  [description]
     */
    setAuthority(state, data) {
      state.authority = data
    },
    exchangeShowStatus(state, data) {// 触发改变事件
      if(data) {
        state.dialogQRcodeVisible = true
        state.QRcodeValue = data.qr_code
      } else {
        state.dialogQRcodeVisible = false
      }
    },
    /**
     * 更新提醒消息数量
     * @param  {[type]} state [description]
     * @param  {number} data  荷载的参数 个数
     * @return {[type]}       [description]
     */
    change (state, data) {
      state.noticeNum = data
    }, 
  },
  actions: {

  }
})
