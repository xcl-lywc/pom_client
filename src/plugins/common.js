import vue from 'vue';
import { MessageBox } from 'element-ui';
import router from '.././router'
import store from '.././store'
import qs from "qs"
const Vue = new vue({router, store}); //注册router, 实例中调用

export default {
  basePath:       `${window.location.origin}/api`,  
  filePath:       `${window.location.origin}/file`,
  uEApiPath:      `${window.location.origin}/UEApi`,  
  imgPath:        `${window.location.origin}/file`,
  webSocketSever: `${window.location.host}/api/websocket`,
  filePreviewUrl: 'http://192.168.31.12:8012/fileOnline',
  

  welcomeBaseRouter:'/web/welcome',
  welcomeBaseType: 1,// 1表示中铁院，2表示本公司
  welcomeBasePath: 'http://login.cregc.com.cn:5169/connect/authorize', 
  welcomerediRectUrl:'http://47.92.125.1:10021',
  // welcomeBasePath: 'http://192.168.31.10:1983/oauth/authorize', 
  // welcomerediRectUrl:'http://192.168.31.9:10020', 
  
  ws:              {}, //webSocket对象
  noticeNum:       null, //提醒消息个数 
  elementPagination: {     //elementUi中的分页所需数据
    pageSizes: [10, 20, 30],
    pageSizeDefault: 10,   //初始条数
    pageNumDefault:1,      //初始页码

    pageSizes_small: [5, 10, 15],
    pageSizeDefault_small: 5,   //初始条数
    pageNumDefault_small:1,      //初始页码
  },
  startInterval: false, //是否开始重复查询
  emailReg:      /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
  mobileReg:     /^1[34578]\d{9}$/, 
  pageJson:{
    'PropagandaCulture':{id:'1',name:'宣传文化',index:'PropagandaCulture'},
    'PartyFeesManagement':{id:'2',name:'党费管理',index:'PartyFeesManagement'},
    'OrgManagement':{id:'5',name:'组织管理',index:'OrgManagement'},
    'CadreManagement':{id:'6',name:'干部管理',index:'CadreManagement'},
    'LearningEducation':{id:'7',name:'学习教育',index:'LearningEducation'},
    'OrgLife':{id:'8',name:'组织生活',index:'OrgLife'},
    'PartyMemberManagement':{id:'9',name:'党员管理',index:'PartyMemberManagement'},
    'CleanHonestGovernment':{id:'10',name:'党风廉政',index:'CleanHonestGovernment'},
    'MassWork':{id:'11',name:'群团工作',index:'MassWork'},
    'HeartTalk':{id:'12',name:'谈心谈话记录',index:'HeartTalk'},
    'StriveExcellence':{id:'13',name:'创先争优',index:'StriveExcellence'},
    'ComprehensiveAffairs':{id:'20',name:'综合事务',index:'ComprehensiveAffairs'},
  },
  /**
  * 将时间戳转换为某年某月某日 00：00：00
  * @params {string/number} timeSetback 时间戳
  * @params {string} format 时间格式
  */
  _convertDate(timeSetback, format){
    return timeSetback ? new Date(timeSetback).Format(format) : '';
  }, 
  /*
   * 根据附件地址下载附件
   */
  downloadFileByUrl(fileUrl){
    window.open(fileUrl);
  }, 
  /**
   * 通用方法用于返回之前浏览的页面, 当path丢失时返回首页
   * @return {[type]} [description]
   */
  backForward () {
    let path = sessionStorage.getItem("historyPath") || "/"
    Vue.$router.push({path: path})
  },
  /*
   * 性别
   */
  transferGender(sex){
    return sex == 0 ? '男' : '女'
  },
  resultWeek(time){
    let week = new Date(time).getDay();
    return week;
  }, 
  /**
   * 根据日期字符串获取星期几
   * @param dateString 日期字符串（如：2016-12-29），为空时为用户电脑当前日期
   * @returns {String}
   */
  getWeek(dateString){  
    var date; 
    date = new Date(dateString)  
    return "星期" + "日一二三四五六".charAt(date.getDay());
  },
  /**
   * 根据参数名称获取值
   * @author chuanlin.Xiao
   * @date   2020-01-19T10:40:55+0800
   * @param  {[type]}                 name [description]
   * @return {[type]}                      [description]
   */
  getParamsByName(name){  
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
  },
  /*
   * 文本验证字符
   * @params {object} rule 文本详细信息
   * @params {string} value 文本的值
   * @params {object} callback 回调函数
   * @params {string} type  文本类型 single为单行(20)，textarea为多行(128)
   */
  wordNumberValid(rule, value, callback, type){  
    if(value){
      if(type == 'single'){
        if(value.length > 20){
          return callback(new Error('最大字数不能超过20个字'));
        }
        return callback();
      }else{
        if(value.length > 128){
          return callback(new Error('最大字数不能超过128个字'));
        }
        return callback();
      } 
    }
    return callback();
  },
  returnConfig () {
    let config = {
      'Authorization': null,
      'Access-Key': null,
      'nonce': null,
      'Time-Stamp': null,
      'secret': null,
      'type': null,
    }
    try {
      if(sessionStorage.getItem("Access-Token")) {
        config['Authorization'] = JSON.parse(sessionStorage.getItem("Access-Token") || null);
      }
      if(sessionStorage.getItem("Access-Key")) {
        config['Access-Key'] = JSON.parse(sessionStorage.getItem("Access-Key") || null);
      }
    } catch(e) {
      this.$message.error("获取Authorization 或 Access-Key 有误, 上传文件失败!")
      return false
    }
    config['nonce']      = Math.floor(Math.random()*10000000000000000) // 随机数0-10000000000000000
    config['Time-Stamp'] = (new Date()).valueOf() // 当前时间戳
    config['secret']     = "pom-product-client" // 口令
    config['type']       = "PC"      // 口令

    let object = {
      'nonce':      config.nonce,
      'Time-Stamp': config['Time-Stamp'],
      'secret':     config.secret,
      'Access-Key': config['Access-Key'],
    }

    let array = []
    for ( let k in object ) {
      array.push(k)
    }

    array.sort()
    let FinalArray = [] //组合完成并排序后的数组
    array.forEach( (item, index) => {
      FinalArray.push(object[item])
    })
    config['sign'] = window.md5Js(FinalArray.join(""))// 写入sign
    
    return config
  },
  /**
   * 返回activiti的form_list
   * @param  {[type]}                 form_list [description]
   * @return {[type]}                           [description]
   */
  returnActivitiFormList(form_list){
    // let that = this;
    form_list.forEach( function(element, index) {
      if(element.ele == "datePicker"){
        element.obj.format == element.obj.format.replace(/年/, "-").replace(/月/, "-").replace(/日/, "-")
        element.obj.require = false
        // element.obj.name = ''
      }else if(element.ele == "inputNumber"){
        element.obj.require = false
        // element.obj.name = ''
      }else if(element.ele == "timePicker"){
        element.obj.require = false
        // element.obj.name = ''
      }else if(element.ele == "slider"){
        element.obj.require = false
        // element.obj.name = ''
      }else if(element.ele == "uploads"){
        element.obj.action = Vue.common.basePath +　element.obj.action
      }
    });
    return form_list;    
  },
  /**
   * 列表结构数据重装为树结构
   * @author chuanlin.Xiao
   * @date   2020-03-13T12:39:24+0800
   * @param  {[type]}                 list [description]
   * @return {[type]}                      [description]
   */
  transformTree(list){
    var tree=[];
    for(var i=0;i<list.length;i++){
      for(var j=i;j<list.length;j++){
        if(list[j].parentId===list[i].id){
          if(list[i].children==undefined){
            list[i].children=[];
          }
          list[i].children.push(list[j]);
        }
        else if(list[j].id===list[i].parentId){
          if(list[j].children==undefined){
            list[j].children=[];
          }
          list[j].children.push(list[i]);
        }
      }
      if(list[i].parentId===null){
        tree.push(list[i]);
      }
    }
    tree = this._deleteChildren(tree)
    return tree;
  },
  /**
   * children为[],则删除children键
   * @author chuanlin.Xiao
   * @date   2020-03-13T12:40:43+0800
   * @param  {[type]}                 tree [description]
   * @return {[type]}                      [description]
   */
  _deleteChildren(tree) {
    let childs = tree
    for (let i = childs.length; i--; i > 0) {
      if (childs[i].children) {
        if (childs[i].children.length) {
          this._deleteChildren(childs[i].children)
        } else {
          delete childs[i].children
        }
      }
    }
    return tree
  },
  /**
   * 下载附件
   * @param  {[type]} fileId [description]
   * @return {[type]}        [description]
   */
  downloadFile(fileId){ 
    Vue.axios.post(`${this.basePath}/file/download?fileId=${fileId}`, '',{responseType: 'blob'}).then( (response) => {      
        this._fileBold(response);
    }).catch( (error) => {  
      Vue.$message.error(error)
    });
  },
  /*
   * blod 下载附件
   */
  _fileBold(response) { 
    let fileName = decodeURI(response.headers['content-disposition'].substring(20, response.headers['content-disposition'].length));
    let url = window.URL.createObjectURL(new Blob([response.data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
  },
  /**
   * 去掉文件后缀名
   * @return {[type]} [description]
   */
  _removeFileSuffix(fileName){ 
    if(fileName){ 
      const temp = fileName.split('.');
      return temp[0];
    }

  },
  /**
   * 拼接参数为字符串
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  splicingParams(params){
    
    if(!params) return '';

    let temp = '';
    Object.keys(params).map((key)=>{
        temp += key + '=' + params[key] +'&';  
    })
    temp = temp.substring(temp.length-1,1);

    return temp; 
  }, 
  /**
   * 根据规定好的时间格式显示时间
   * @return {[type]} [description]
   */
  _showDate (date) {
    if(!date) {
      return ""
    } else {
      let dateString = ""
      switch(date.type){
        case 1:
          dateString = this._convertDate(date.date_time, 'yyyy年');
          break;
        case 2:
          dateString = this._convertDate(date.date_time, 'yyyy年MM月');
          break;
        case 3:
          dateString = this._convertDate(date.date_time, 'yyyy年MM月dd日');
          break;
        case 4:
          dateString = this._convertDate(date.date_time, 'yyyy年MM月dd日 hh:mm:ss');
          break;
        default:
          dateString = "";
          break;
      }
      return dateString
    }
  },
  /*
   * 根据Id来显示对应的中文（对照表）
   */
  _controlTable(id){
    let data = JSON.parse(sessionStorage.getItem('controlTable')), name ;
    if(!data)
      return false;   
    for(let i in data){
      data[i].dictionaryList.map( (dicItem) => {
        if(id == dicItem.id){ 
          name = dicItem.name
        } 
      }) 
    } 
    return name ? name : '';
   },
   /**
    * 通过code转中文
    * @return {[type]} [description]
    */
   _countyDataByIdConvert(code){
      let array = JSON.parse(sessionStorage.getItem('countyData')), name = '';

      if(array instanceof Array){
        // for(let {currentId, currentName} of array) {
        //   return currentId == code ? currentName : '11';
        // } 
        array.forEach( function(element, index) {
          return element.currentId == code ? name = element.currentName : '';
        });
      } 
      return name;
   },
  /**
   * 分页索引
   * @param  {[type]} index [description]
   * @return {[type]}       [description]
   */
  pageIndexFun(index, pageNum){
    return pageNum*(index+1);
  },
  /**
   * 退出登录，并去掉之前记录的信息
   * @return {[type]} [description]
   */
  goOut(){ 
    sessionStorage.removeItem("Access-Account")
    sessionStorage.removeItem("Access-Key")
    sessionStorage.removeItem("Access-Token") 
    sessionStorage.removeItem("Access-OrgId"); 
    sessionStorage.removeItem("userBaseInfo");  
    sessionStorage.removeItem("orgAndJob");
    sessionStorage.removeItem("partyNature");
    sessionStorage.removeItem("isParty"); 
    // sessionStorage.removeItem("controlTable"); 
    sessionStorage.removeItem("jobName");  
    sessionStorage.removeItem("Access-PositionUserRelationId"); 

    // 清除JS创建的cookies
    Vue.$cookies.keys().forEach( function(element, index) {
      Vue.$cookies.remove(element);
    });
    // 清除JSESSIONID的cookies
    Vue.$cookies.remove('JSESSIONID','/','localhost');

    
    //无需账号密码就可以进入平台
    let url = ''
    this.welcomeBaseType == 1 ? 
        url = this.welcomeBasePath+'?response_type=code&client_id=qydjxt&state=pom&redirect_uri='+this.welcomerediRectUrl+this.welcomeBaseRouter+'&scope=openid profile offline_access' : 
        url = this.welcomeBasePath+'?client_id=client1&response_type=code&redirect_url='+this.welcomerediRectUrl+this.welcomeBaseRouter;
    //window.location.href = 'http://192.168.31.10:1983/login/form';
debugger
    
    //需要账号密码 企业党建系统登录地址     
    // 中铁院本地
    // window.location.href = 'http://login.cregc.com.cn:5169/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fresponse_type%3Dcode%26client_id%3Dqydjxt%26state%3Dpom%26redirect_uri%3Dhttp%253A%252F%252Flocalhost%253A8080%252Fweb%252Fwelcome%26scope%3Dopenid%2520profile%2520offline_access'
    // 中铁院线上
    //window.location.href = 'http://login.cregc.com.cn:5169/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fresponse_type%3Dcode%26client_id%3Dqydjxt%26state%3Dpom%26redirect_uri%3Dhttp%253A%252F%252F47.92.125.1%253A10021%252Fweb%252Fwelcome%26scope%3Dopenid%2520profile%2520offline_access'
    // 公司本地
    // window.location.href = 'http://192.168.31.10:1983/oauth/authorize?client_id=client1&response_type=code&redirect_url=http://localhost:8080/web/welcome'
    window.location.href = url;
  }, 
}

/*
*   格式化日期格式
*/
Date.prototype.Format = function (fmt) {
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}