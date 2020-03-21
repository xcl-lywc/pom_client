<template>
  <el-container v-if="userBaseInfo">  
    <el-header class="pad0 header-manage"> 
      <el-row class="padl20 padr20">
        <el-col class="header-manage-left" :span="8">
          <strong class="big-title">先锋党建</strong>
          <span class="marl20">{{jobName}}</span>
        </el-col>

        <el-col :span="16" class="header-manage-right text-right">
          <div>
            <span>{{glodonOrgName != 'null' ? glodonOrgName : ''}}</span>
            <el-dropdown class="el-icon-button marl20" @command="goToJob">
              <span class="el-dropdown-link"> 
                <span class="header-login-name">{{userBaseInfo.real_name}}</span> 
                <el-avatar :size="40" :src="`${common.imgPath}${userBaseInfo.picture}`" class="marr5"> 
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                </el-avatar>  
              </span> 
              <el-dropdown-menu slot="dropdown" class="info-menu"> 
                <el-dropdown-item command="base_info">
                  <el-row class="marb10">
                    <el-col :span="6" style="width: 130px;">
                       <crop-avatar :fileTypes="['png', 'jpg']" @uploadSuccess="uploadAvatarSuccess" :size="'mini'" :avatar="userBaseInfo.picture"></crop-avatar> 
                    </el-col>
                    <el-col :span="18" style="width: calc(100% - 130px)">
                      <p>{{userBaseInfo.real_name}}</p>
                      <p>{{common._convertDate(userBaseInfo.birthday, 'yyyy年MM月dd日')}}</p>
                    </el-col>
                  </el-row>
                </el-dropdown-item>
                <el-dropdown-item command="personal">
                  <el-row>
                    <el-col :span="16" class="single-line-overflow"><strong >{{isParty == 'true' ? '党员首页' : '职工首页'}}</strong></el-col> 
                  </el-row> 
                </el-dropdown-item> 
                <el-dropdown-item :command="item" v-for="(item, index) in orgAndJob" :key="index">
                  <el-row>
                    <el-col :span="16" class="single-line-overflow"><strong >{{item.orgName}}</strong></el-col>
                    <el-col :span="8" class="text-right single-line-overflow"><span class="">{{item.positionName}}</span></el-col>
                  </el-row> 
                </el-dropdown-item> 
                <el-dropdown-item command="setUp" class="mart20" >
                  <el-row>
                    <el-col :span="12" class="text-center">
                      <!-- 为fail表示已经被签到 -->
                      <el-button v-if="isSignIn == 'success'" @click.navtive="signIn" type="primary" size="small">签到</el-button>
                      <el-button v-else type="" disabled size="small">已签到</el-button>
                    </el-col>
                    <el-col :span="12" class="text-center">
                      <el-button @click.navtive="  common.goOut() " type="" size="small">退出登录</el-button>
                    </el-col>
                  </el-row>  
                </el-dropdown-item> 
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>  
    </el-header>
    <el-main class="mar0 pad0 el-main-con">
      <el-row :gutter="20">
        <el-col :span="4" class="left-menu-box">
          <navigation-bar :activeNav = 'activeNav' :partyNature="partyNature"></navigation-bar>
        </el-col>
        <el-col :span="20" class="content-vertical">
          <router-view v-if="isRouterAlive"></router-view>
        </el-col>
      </el-row>   
    </el-main>   
  </el-container> 
</template>

<script>
  import NavigationBar from '../components/NavigationBar'
  import CropAvatar from '../components/CropAvatar'
  export default {
    data() { 
      return { 
        isRouterAlive: true, 
        isSignIn:      null,
        jobName:       sessionStorage.getItem('jobName'), 
        userBaseInfo:  JSON.parse(sessionStorage.getItem('userBaseInfo')),
        orgAndJob:     JSON.parse(sessionStorage.getItem('orgAndJob')),
        isParty:       sessionStorage.getItem('isParty'),
        glodonOrgName: sessionStorage.getItem('glodonOrgName'),
        personForm: {   //修改密码表单
          oldPassword:      null,
          newPassword:      null,
          newPasswordAgain: null,
        },
        personDialogVisible: false, 
        administrActiveArray: [],

        activeNav:`${this.$route.name}${this.$route.params.key_type ? '/' + this.$route.params.key_type : ''}` || '',
        partyNature:this.$store.state.partyNature ? this.$store.state.partyNature : (sessionStorage.getItem('partyNature')?Number(sessionStorage.getItem('partyNature')):null), //组织类型,
      }
    },
    components: {
      NavigationBar, 
      CropAvatar
    },
    watch: {
      $route(newValue,oldValue){ 
        this.reload();
        this.activeNav = `${newValue.name}${newValue.params.key_type ? '/' + newValue.params.key_type : ''}`;
      },
      '$store.state.orgId'(){
        this.reload();
      },
    },
    created () {  
      // this.queryAdministrActive();
      // this.getDTypeLIst();   
      // this.userUpdata();// sessionStorage能获取token并且在路径问号后面没有token或者code时，刷新页面，更新用户缓存数据
    },
    mounted() { 
      this.judge();  
    },
    methods: {
      /*
      * 刷新页面
      */
      reload () {
        this.isRouterAlive = false  
        this.$nextTick(() => (this.isRouterAlive = true))
      }, 
      /**
       * 用户信息变更时，刷新页面调取该函数，更新缓存数据
       * @author chuanlin.Xiao
       * @date   2020-03-16T10:55:42+0800
       * @return {[type]}                 [description]
       */
      userUpdata(){  
        if(sessionStorage.getItem('Access-Token')){
          let config = {
            // headers: {'Authorization': 'Bearer '+token},
            headers: {'Authorization': null},
            method: "get",
            url: `${this.common.basePath}/user/connect/token`,
            params: {'Authorization': JSON.parse(sessionStorage.getItem('Access-Token'))} 
          }
          this.axios(config).then((response) => {
            if(response.data){ 
              this._updataLogin(response);
            } 
            this.isLoad = false;
          }).catch((error) => {
            this.isLoad = false;
            this.$message.error(error)
          }) 
        }     
      }, 
      _updataLogin(response){ 
        sessionStorage.setItem('Access-Token',JSON.stringify(`Bearer ${response.data.access_token}`));
        sessionStorage.setItem('Access-Key',JSON.stringify(response.data.loginUser.userId)); 
        sessionStorage.setItem('orgAndJob', JSON.stringify(response.data.loginUser.orgAndJob));
        sessionStorage.setItem('isParty',response.data.loginUser.party);  
        sessionStorage.setItem('Access-OrgId',JSON.stringify(response.data.loginUser.party_orgs_id));
        sessionStorage.setItem('jobName', response.data.loginUser.party ? '党员首页' : '职工首页'); 
        sessionStorage.setItem('glodonOrgName', response.data.loginUser.glodonOrgName); 
        
        this.glodonOrgName = response.data.loginUser.glodonOrgName;
        this.jobName = sessionStorage.getItem('jobName');
        this.orgAndJob = JSON.parse(sessionStorage.getItem('orgAndJob'));
        this.isParty = sessionStorage.getItem('isParty'); 
        this.getUserBaseInfo(response.data.loginUser.party_orgs_id,2);
        // this.getDTypeLIst(); 
        // this.queryAdministrActive();
      },
      /**
       * 登录判断
       * @author chuanlin.Xiao
       * @date   2020-03-16T11:02:55+0800
       * @return {[type]}                 [description]
       */
      judge(){  
        // 如果已经获取到了Token等信息，那么就不必在向后台索取
        if(sessionStorage.getItem('Access-Token')){
          this.querySignInHistory();
          return false;
        }else{
          let code = this.getParamsByName('code')
          let token = this.getParamsByName('token');
          // 有验证码code时，去换token和用户相关信息
          if(code){
            // 获取完整当前域名,与/web/welcome组成重定向地址
            // let redirect_uri = window.location.protocol+"//"+window.location.host+'/web/welcome'; // 返回https://mp.csdn.net/web/welcome
            let redirect_uri = this.common.welcomerediRectUrl+this.common.welcomeBaseRouter;// 重定向地址
            let params = {
              code:code,
              redirect_uri:redirect_uri
            }
            let config = {
              headers: {'Authorization': null},
              method: "get",
              url: `${this.common.basePath}/user/connect/code`,
              params: params
            }
            // delete config.headers.common['Authorization']
            this.isLoad = true; 
            this.axios(config).then( (response) => {
              if(response.data){ 
                this._login(response);
              } 
              this.isLoad = false;
            }).catch( (error) => {
              this.isLoad = false;
              this.$message.error(error); 
            });
          }else{
            // 无验证码code、有token时，去换用户相关信息
            if(token){
              let config = {
                // headers: {'Authorization': 'Bearer '+token},
                headers: {'Authorization': null},
                method: "get",
                url: `${this.common.basePath}/user/connect/token`,
                params: {'Authorization': 'Bearer '+token} 
              }
              this.axios(config).then((response) => {
                if(response.data){ 
                  this._login(response);
                } 
                this.isLoad = false;
              }).catch((error) => {
                this.isLoad = false;
                this.$message.error(error)
              })
            }
            // 无验证码code和、、无token时，跳转页面
            else{   
              let url = ''
              this.common.welcomeBaseType == 1 ? 
                  url = this.common.welcomeBasePath+'?response_type=code&client_id=qydjxt&state=pom&redirect_uri='+this.common.welcomerediRectUrl+this.common.welcomeBaseRouter+'&scope=openid profile offline_access' : 
                  url = this.common.welcomeBasePath+'?client_id=client2&response_type=code&scop=app&redirect_url='+this.common.welcomerediRectUrl+this.common.welcomeBaseRouter;
              // console.log(url)
              window.location.href = url;// 在当前页面打开URL页面
              // window.open(url);// 在一个新窗口中打开URL页面。
            }
          }
        }         
      }, 
      _login(response){ 
        sessionStorage.setItem('Access-Token',JSON.stringify(`Bearer ${response.data.access_token}`));
        sessionStorage.setItem('Access-Key',JSON.stringify(response.data.loginUser.userId)); 
        sessionStorage.setItem('orgAndJob', JSON.stringify(response.data.loginUser.orgAndJob));
        sessionStorage.setItem('isParty',response.data.loginUser.party);  
        sessionStorage.setItem('Access-OrgId',JSON.stringify(response.data.loginUser.party_orgs_id));
        sessionStorage.setItem('jobName', response.data.loginUser.party ? '党员首页' : '职工首页'); 
        sessionStorage.setItem('glodonOrgName', response.data.loginUser.glodonOrgName); 
        
        this.glodonOrgName = response.data.loginUser.glodonOrgName;
        this.jobName = sessionStorage.getItem('jobName');
        this.orgAndJob = JSON.parse(sessionStorage.getItem('orgAndJob'));
        this.isParty = sessionStorage.getItem('isParty'); 
        this.getUserBaseInfo(response.data.loginUser.party_orgs_id,1);
        this.getDTypeLIst(); 
        this.querySignInHistory();
        this.queryAdministrActive();
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

      /**
       * 查询更多的用户信息
       * @author chuanlin.Xiao
       * @date   2020-03-16T11:13:58+0800
       * @param  {[type]}                 party_orgs_id [description]
       * @param  {[type]}                 type          1 登录 2 更新用户
       * @return {[type]}                               [description]
       */
      getUserBaseInfo(party_orgs_id,type){ 
        this.isLoad = true;
        let config = {
          method: "get",
          url: `${this.common.basePath}/user/findUser`,
          params: {
            id: sessionStorage.getItem('Access-Key'),
          },
        }
        this.axios(config).then((response) => { 
          this.isLoad = false;
          this.userBaseInfo = response.data;   
          //-----------  先将当前登录用户的orgId存起来 ，用来后面切换工作台用 -------------
          this.userBaseInfo.orgId = party_orgs_id;
          
          sessionStorage.setItem('Access-Account',JSON.stringify(this.userBaseInfo.account)); 
          sessionStorage.setItem('userBaseInfo', JSON.stringify(this.userBaseInfo));

          this.userBaseInfo =  JSON.parse(sessionStorage.getItem('userBaseInfo'));
          type==1?this.$message.success({message: '初始化用户数据成功！',duration: 1000}):this.$message.success({message: '用户信息更新成功！',duration: 1000});
          // window.removeEventListener('keypress', self.pressEnter);
          if(type==2){return;}
          setTimeout( () => { 
              // 如果只党员就跳转党员工作平台，否则就跳转到职工工作平台
              sessionStorage.getItem('isParty') == 'true' ? 
                  this.$router.push({name: 'PartyMemberHome'}) : 
                  this.$router.push({name: 'StaffAndWorkersHome'});
              

          },1010); 
        }).catch((errorMsg) => {
          this.isLoad = false;
          this.$message.error(errorMsg)
        }) 
      },
      /**
       * 对照表查询
       * @return {[type]} [description]
       */
      getDTypeLIst(){ 
        this.isLoad = true;
        let config = {
          method: "get",
          url: `${this.common.basePath}/dType/list`,
          params: { 
          },
        }
        this.axios(config).then((response) => { 
          let {data} = response, obj = {};
          data.map((_temp) => {
            this.axios.post(`${this.common.basePath}/dictionary/type`,{typeId:_temp.id}).then((response) => {
              _temp.dictionaryList = response.data?response.data.rows:[];
              obj[_temp.id] = _temp;
              sessionStorage.setItem('controlTable',JSON.stringify(obj)); 
            }).catch((errorMsg) => {
              this.$message.error(errorMsg);
            }) 
          }) 
          // sessionStorage.setItem('controlTable',JSON.stringify(obj)); 
          this.isLoad = false;
        }).catch((errorMsg) => {
          this.isLoad = false;
          this.$message.error(errorMsg)
        }) 
      },
      /**
       * 查询区县树
       * @return {[type]} [description]
       */
      queryAdministrActive(){   
        this.axios.post(`${this.common.basePath}/administrative/select`, '',{}).then( (response) => { 
          sessionStorage.setItem('countyData', JSON.stringify(this._adminsreActive_(response.data))); 
        }).catch( (error) => {  
          this.$message.error(error)
        }); 
      }, 
      _adminsreActive_(dataJSON){ 
        var r = [];
        if (Array.isArray(dataJSON)) {
          for (let item of dataJSON) {
            r.push(item); // 取每项数据放入一个新数组
            if (Array.isArray(item.sons) && item.sons.length>0)
              // 若存在children则递归调用，把数据拼接到新数组中，并且删除该children
              r = r.concat(this._adminsreActive_(item.sons));
              delete item.sons
          }
        }  
        return r;  
      },
      /**
       * 根据不同职位跳转不同的功能页
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       * partyNature 1.党委 2. 党支部 3.党小组
       */
      goToJob(item){   
        
        if(item == 'setUp' || item == 'base_info'){  

        }else if(item == 'personal'){
          this.activeNav = null; 
          this.jobName = sessionStorage.getItem('isParty') == 'true' ? '党员首页' : '职工首页'; 
          
          sessionStorage.setItem('jobName', sessionStorage.getItem('isParty') == 'true' ? '党员首页' : '职工首页');
          sessionStorage.setItem('Access-OrgId', this.userBaseInfo.orgId);
          // 如果只党员就跳转党员工作平台，否则就跳转到职工工作平台
          sessionStorage.getItem('isParty') == 'true' ? 
              this.$router.push({name: 'PartyMemberHome'}) : 
              this.$router.push({name: 'StaffAndWorkersHome'})  
        }else {   
          this.activeNav = null;
          this.jobName = `${item.orgName}工作台`;

          sessionStorage.setItem('Access-OrgId', item.orgId);
          sessionStorage.setItem('jobName', `${item.orgName}工作台`);
          sessionStorage.setItem('partyNature', item.partyNature); 
          this.partyNature = item.partyNature;

          // this.$store.state.jobName = `${item.orgName}工作台`;
          this.$store.state.orgId = item.orgId;  //使用store存储，页面就能实时刷新响应
          this.$store.state.partyNature = item.partyNature; // 组织使用store存储起来类型
          
          this.$router.push({name: 'mainFunctionHome'});

          sessionStorage.setItem('Access-PositionUserRelationId',JSON.stringify(item.positionUserRelationId));// 任务管理中上级任务与上级通知查询时能用到！！
        }
      },  
      /**
       * 签到
       * @return {[type]} [description]
       */
      signIn(){
        this.axios.get(`${this.common.basePath}/siginU/signIn?userId=${sessionStorage.getItem('Access-Key')}`, {}).then( (response) => {
          this.$message.success('签到成功!!!');
          this.querySignInHistory();
        }).catch( (error) => { 
          this.$message.error(error); 
        });
      },
      /**
       * 验证是否已经被签到过
       * @return {[type]} [description]
       */
      querySignInHistory(){
        this.axios.get(`${this.common.basePath}/siginU/status?userId=${sessionStorage.getItem('Access-Key')}`, {}).then( (response) => {
           this.isSignIn = response.data;
        }).catch( (error) => { 
          this.$message.error(error); 
        });
        
      },
      uploadAvatarSuccess(file){
        this.$message.success('上传成功');
        // this.showPicture(file.fileId);
        this.userBaseInfo.picture = file.path; 
        sessionStorage.setItem('userBaseInfo', JSON.stringify(this.userBaseInfo));
        this.submituserForm();
      }, 
      /**
       * 下载附件
       * @param  {[type]} fileId [description]
       * @return {[type]}        [description]
       */
      showPicture(fileId){ 
        this.axios.post(`${this.common.basePath}/file/download?fileId=${fileId}`, '',{responseType: 'blob'}).then( (response) => {      
            this._fileBold(response);
        }).catch( (error) => {  
          this.$message.error(error)
        });
      },
      /*
       * blod 获取blob地址
       */
      _fileBold(response) { 
        let fileName = decodeURI(response.headers['content-disposition'].substring(20, response.headers['content-disposition'].length));
        let url = window.URL.createObjectURL(new Blob([response.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        console.log(url)
        this.userBaseInfo.picture = url; 
        sessionStorage.setItem('userBaseInfo', JSON.stringify(this.userBaseInfo));
        this.submituserForm();
      },
      /**
       * 保存头像
       * @return {[type]} [description]
       */
      submituserForm(){ 
        this.isLoad = true;  
        this.axios.post(`${this.common.basePath}/user/user/update`,{picture: this.userBaseInfo.picture, id: sessionStorage.getItem('Access-Key')}).then((response) => { 
        }).catch((errorMsg) => { 
          this.$message.error(errorMsg)
        });
      },
    },
  }
</script>

<style scoped lang="less">
  .header-manage{
    height: 60px;
    background: #de1201;
    width: 100%;
    line-height: 60px;  
    color: #fff;
    .header-manage-left{
    }
    .big-title{
      font-size: 16px;
    }
  }
  .el-icon-button{
    top: 11px;
  }
  .info-menu{
    width: 300px;
  }
  .el-main-con{
    overflow: hidden;
  }
  .header-login-name{
    position: relative;
    top: -11px;
    color: #fff;
    margin-right: 10px;
  }
</style>
