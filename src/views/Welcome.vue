/************ 欢迎光临 ***********/
<template> 
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>首页</el-breadcrumb-item> 
        </el-breadcrumb>
      </el-card>
      <div class="theme-main" v-loading="isLoad">
        <!-- 欢迎光临 -->
        <el-card class="welcome-box">
          <h1 class="title cursor-pointer" @click="$router.push({path: '/welcome',query:{}});judge();">欢 迎 光 临</h1> 
        </el-card>
        
      </div>
    </div> 
  </div>     
</template>

<script> 
  import qs from 'qs'
  export default {
    data() {
      return {
        isLoad:           false,
        code:'',
        token:''

        // code:'123456',
        // token:"eyJhbGciOiJSUzI1NiIsImtpZCI6ImNhNDJlNGNiMDIzODNjYWY0NjY3YTBjOTNiOWU2MWMxIiwidHlwIjoiSldUIn0.eyJuYmYiOjE1Nzk0MzE3NDMsImV4cCI6MTU3OTQ2Nzc0MywiaXNzIjoiaHR0cDovL2xvZ2luLmNyZWdjLmNvbS5jbjo1MTY5IiwiYXVkIjoiaHR0cDovL2xvZ2luLmNyZWdjLmNvbS5jbjo1MTY5L3Jlc291cmNlcyIsImNsaWVudF9pZCI6InF5ZGp4dCIsInN1YiI6IjIwODYiLCJhdXRoX3RpbWUiOjE1Nzk0MjIyMjMsImlkcCI6ImxvY2FsIiwibW9iaWxlcGhvbmUiOiIxNTc3MTc3MDUwNyIsInVzZXJuYW1lIjoi5rWL6K-V5biQ5Y-3Iiwic3ViamVjdGlkIjoiMjA4NiIsImVtYWlsIjoiVEVTVEBtYWlsLmNyZWdjLmNvbS5jbiIsImNvZGUiOiJURVNUIiwid29ya2luZ2xvY2F0aW9uIjoi5LqM5bGAIiwid29ya3Bob25lIjoiIiwic2V4IjoiMCIsImRlcHRpZCI6IjI4MjA0IiwiZGVwdG5hbWUiOiLkvpvlupTnq5kiLCJlbXBsb3llZWNvZGUiOiIiLCJwbGF0Zm9ybWtleWlkIjoiIiwiYWxpYXMiOiJudWxsIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsIm9mZmxpbmVfYWNjZXNzIl0sImFtciI6WyJwd2QiXX0.aiopHL91HT5gSEAAYI5gVntyHnPzd7YT9V1MKsO1kE4m1XemnBQmvrkcpZfybZ2mqQwwKkN3No3GnSDpFjK1I_k4DEK9iI7m9OwtD1Bdgmlc3qyHgETp-k7cKgjhwv3Talfd9zqsx9k3yJDXSQWXIGf71oMZ32_xDnS8kwXdM4dz2oZ-KJ37rvT_ZgU7l945it5CeC0j2j3wk8CpyU8SEor9EmPUgRhsQNYYNYnCdv87-dykM7HpIF8rkewM4hG6bQZyhEROMWN3jEx4YkUcLhDP8KgWLKaTLhHF9ll4-7ZNLOmhUdjtCJvMgdAeG8UZ5u2Z-gz71YbKGacqyB3_0w",
      }
    },
    components: {  
    },
    watch: {
    },
    created () {
    },
    mounted() {
      this.judge()
    },
    methods: {
      judge(){
        // debugger
        let code = this.getParamsByName('code')
        let token = this.getParamsByName('token')
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
              sessionStorage.setItem('Access-Token',JSON.stringify(`Bearer ${response.data.access_token}`));
              sessionStorage.setItem('Access-Key',JSON.stringify(response.data.loginUser.userId)); 
              sessionStorage.setItem('orgAndJob', JSON.stringify(response.data.loginUser.orgAndJob));
              sessionStorage.setItem('isParty',response.data.loginUser.party);  
              sessionStorage.setItem('Access-OrgId',JSON.stringify(response.data.loginUser.party_orgs_id));
              sessionStorage.setItem('jobName', response.data.loginUser.party ? '党员首页' : '职工首页'); 
              this.getUserBaseInfo(response.data.loginUser.party_orgs_id);
              this.getDTypeLIst();
              this.queryAdministrActive();
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
                sessionStorage.setItem('Access-Token',JSON.stringify(`Bearer ${response.data.access_token}`));
                sessionStorage.setItem('Access-Key',JSON.stringify(response.data.loginUser.userId)); 
                sessionStorage.setItem('orgAndJob', JSON.stringify(response.data.loginUser.orgAndJob));
                sessionStorage.setItem('isParty',response.data.loginUser.party);  
                sessionStorage.setItem('Access-OrgId',JSON.stringify(response.data.loginUser.party_orgs_id));
                sessionStorage.setItem('jobName', response.data.loginUser.party ? '党员首页' : '职工首页'); 
                this.getUserBaseInfo(response.data.loginUser.party_orgs_id);
                this.getDTypeLIst();
                this.queryAdministrActive();
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
            console.log(url)
            window.location.href = url;// 在当前页面打开URL页面
            // window.open(url);// 在一个新窗口中打开URL页面。
          }
        }
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
       * @return {[type]} [description]
       */
      getUserBaseInfo(party_orgs_id){ 
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
            
          this.$message.success({message: '登录成功，跳转中...',duration: 1000});
          // window.removeEventListener('keypress', self.pressEnter);

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
    .header-manage-right{

    }
  }
  .el-main-con{
    overflow: hidden;
    .welcome-box{
      height:calc(100vh - 180px);
      .title{
        line-height:calc(100vh - 360px);
        text-align:center;
        font-size:36px;
      }
      .footer{
        height:180px;
      }
    }
  }
</style>
