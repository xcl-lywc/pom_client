<template>
    <div class="login-wrap" v-loading="isLoad">
        <div class="browser-warning" style="display: none">为保证最佳使用效果，建议您使用Chrome或者FireFox浏览器</div>
        <div class="login-form-wrap"> 
            <h2>“先锋党建”管理系统</h2>
            <form class="form login-form">
                <div class="form-group login-from-group-print">
                    <label><img src="../assets/img/user_icon.png"/></label>
                    <input v-model="form.username" placeholder="请输入用户名" class="form-control js-username" type="text">
                </div>
                <div class="form-group login-from-group-print">
                    <label><img src="../assets/img/password_icon.png"/></label>
                    <input :type="isPassword ? 'text' : 'password' " 
                            v-model="form.password" 
                            placeholder="请输入密码" 
                            class="form-control js-password" >

                    <i @click="viewClick" class="el-icon-view_login el-icon-view"></i>
                </div>
                <div class="form-group login-form-group-remember">
                    <label class="remember-login" @click="rememberClick">
                        <img v-if="!isRemember" src="../assets/img/remark_de.png" />
                        <img v-if="isRemember" src="../assets/img/remark_ac.png" />
                        记住密码
                    </label>
                    <label class="forget-password">忘记密码</label>
                </div>
                <button class="btn-block js-login" @click="loginClick" type="button">登&nbsp;&nbsp;&nbsp;&nbsp;录</button>
            </form>
        </div>
    </div>
</template>
<script>  
    import qs from 'qs'
    export default {
        data() {
            return{
                isLoad:     false,
                isRemember: false,
                isPassword: false, 
                form: {
                    password: '',
                    username: '',
                }, 
            }
        },
        created(){ 
            // --------- 键盘时间的监听
            window.addEventListener('keypress', this.pressEnter); 
        },
        mounted(){
            this._remember();

        },
        methods: {
            viewClick(){
                this.isPassword = !this.isPassword;
            },
            /*
            * 点击登录按钮进行登录
            */
            loginClick: function(argument) {
                this.login();
            },
            /*
            * 登录
            */
            login() { 
                this.isLoad = true; 
                this.axios.post(this.common.basePath + '/login/in', qs.stringify(this.form)).then( (response) => {
                  if(response.data){ 
                    this.isLoad = false;
                    sessionStorage.setItem('Access-Token',JSON.stringify(`Bearer ${response.data.loginUser.accessToken}`));
                    sessionStorage.setItem('Access-Key',JSON.stringify(response.data.loginUser.userId)); 
                    sessionStorage.setItem('orgAndJob', JSON.stringify(response.data.loginUser.orgAndJob));
                    sessionStorage.setItem('isParty',response.data.loginUser.party);  
                    sessionStorage.setItem('Access-OrgId',JSON.stringify(response.data.loginUser.party_orgs_id));
                    sessionStorage.setItem('jobName', response.data.loginUser.party ? '党员首页' : '职工首页'); 
                    this.getUserBaseInfo(response.data.loginUser.party_orgs_id);
                    this.getDTypeLIst();
                  } 
                }).catch( (error) => {
                    this.isLoad = false;
                    this.$message.error('登录失败!!!'); 
                });
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
                  
                this.$message.success({message: '登录成功...正在跳转!!!',duration: 1000});
                window.removeEventListener('keypress', self.pressEnter);

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
                    _temp.dictionaryList = [];
                    obj[_temp.id] = _temp;
                }) 
                sessionStorage.setItem('controlTable',JSON.stringify(obj)); 
                this.isLoad = false;
              }).catch((errorMsg) => {
                this.isLoad = false;
                this.$message.error(errorMsg)
              }) 
            }, 
            /**
             * 全局绑定的键盘事件
             * @return {[type]} [description]
             */
            pressEnter (event) {
                if(this.$route.path && this.$route.path == "/login") { //仅在登录页调用此事件
                  if(event.key == "Enter") {
                    this.login()
                  }
                }
            }, 
            /*
            * 点击按钮记住账号密码
            */
            rememberClick: function() {
                this.isRemember = !this.isRemember;
                this.isRemember? localStorage.setItem("always",'true') : localStorage.setItem("always",'false')

                localStorage.setItem("username", this.form.username);
                localStorage.setItem("password", this.form.password);
            },
            /*
            * 记住账号密码
            */
            _remember: function() {
                let self = this;
                if(localStorage.getItem("always") === "true") { //是否已经记忆了密码
                    if(localStorage.getItem("username") && localStorage.getItem("password")) {
                        self.form.username = localStorage.getItem("username");
                        self.form.password = localStorage.getItem("password");
                        self.isRemember = true;
                    }
                }
             },   
        }
    }
</script>
<style scoped lang="less">
.login-wrap{
    background: url('../assets/img/login_bg.png');
    height: 100vh;
    width: 100vw;
    padding-top: calc(50vh - 259px);
}
.login-form-wrap{
    width: 530px;
    margin: 0 auto;
    border: 15px solid #ca2521;
    padding: 30px 25px 50px;
    border-radius: 10px;
    background: #fff;
    box-sizing: border-box; 
}
.login-form-wrap h2{
    text-align: center;
    padding: 0 0 20px;
    font-size: 24px;
}
.login-form{
    border-radius: 10px;
}
.login-form .login-from-group-print{
    position: relative;
    margin-top: 30px;
}
.login-form .login-from-group-print input{
    width: 450px;
    border-radius: 0;
    border: 1px solid #d8d8d8;
    line-height: 46px;
    height: 46px;
    padding-left: 65px;
    box-sizing: border-box;
    font-size: 14px;
}
.el-icon-view_login{
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 15px;
    font-size: 20px;
}
.login-form .login-from-group-print label{
    position: absolute;
    width: 50px;
    height: 44px;
    background: #e8e8e8;
    left: 1px;
    top: 1px;
    line-height: 51px;
    text-align: center;   
}
.login-form .btn-block{
    width: 100%;
    background: #c92120;
    border-radius: 0;
    line-height: 50px;
    border: none;
    font-size: 20px;
    color: #fff;
    cursor: pointer;
}
.login-form-group-remember{
    margin: 20px 0 80px;
}
.login-form-group-remember label{
    font-weight: 100;
}
.login-form .remember-login{
    cursor: pointer;
    margin-bottom: 80px;
}
.login-form .remember-login img{
    padding-right: 3px;
    position: relative;
    top: 2px;
}
.login-form-group-remember .forget-password{
    float: right;
    color: #c92120;
}
</style>