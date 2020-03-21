/************ 职工首页 ***********/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>首页</el-breadcrumb-item> 
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">
        <!-- 用户信息 -->
        <el-card>
          <div slot="header" class="clearfix">
            <span>用户信息</span> 
          </div>
          <el-row>
            <el-col :span="5">
              <el-avatar shape="square" :size="150" :src="common.filePath + memeberInfo.photo" class="marr5 fl">
                <img v-if="memeberInfo.sex==0" src="../../assets/img/male.png"/>
                <img v-else-if="memeberInfo.sex==1" src="../../assets/img/female.png"/>
                <img v-else src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
              </el-avatar>
            </el-col>
            <el-col :span="9">
              <p class="mart10">姓名：{{memeberInfo.real_name ? memeberInfo.real_name : '无'}}</p>
              <p class="mart10">手机：{{memeberInfo.phone ? memeberInfo.phone : '无'}}</p>
              <p class="mart10">邮箱：{{memeberInfo.email ? memeberInfo.email : '无'}}</p>
              <!-- <p class="mart10">入党时间：{{common._showDate(memeberInfo.join_party_date)}}</p> -->
              <!-- <p class="mart10">通讯地址：{{memeberInfo.address ? memeberInfo.address : '无'}}</p> -->
              <p class="mart10">通讯地址：
                {{`
                  ${common._countyDataByIdConvert(memeberInfo.province) }
                  ${common._countyDataByIdConvert(memeberInfo.city)}
                  ${common._countyDataByIdConvert(memeberInfo.county)}
                  ${memeberInfo.address}
                `}}
              </p>
            </el-col>
            <el-col :span="10">
              <p class="mart10">性别：{{memeberInfo.sex == 0 ? '男' : '女'}}</p>
              <p class="mart10">生日：{{common._convertDate(memeberInfo.birthday, 'yyyy年MM月dd日')}}</p>
              <p class="mart10">身份证号：{{memeberInfo.id_card ? memeberInfo.id_card : '无'}}</p>
              <!-- <p class="mart10">党委：{{memeberInfo.party_orgs_name ? memeberInfo.party_orgs_name : '无'}}</p> -->
            </el-col>
          </el-row>
        </el-card>
        
        <!-- 上级任务、上级通知、待处理事项 -->
        <home-task></home-task>
        
        <el-card class="mart20">
          <div slot="header" class="clearfix">
            <span>积分获得</span>  
          </div>
          <bar :seriesData="showDataIntegral" :xAxisData="xAxisDataIntegral" chartWidth="100%" chartHeight="300px"></bar>
        </el-card>
      </div>
    </div>
  </div>  
</template>

<script> 
  import HomeTask from "../.../../mainFunction/taskManagementComponents/HomeTaskComponent.vue"
  import Bar from '../../components/echarts/Bar' // 柱状图
  export default {
    data() {
      return {
        isLoad:            true,
        orgId:             sessionStorage.getItem('Access-OrgId'),
        memeberInfo:       {}, //党员信息
        showDataIntegral:  [],
        xAxisDataIntegral: [],
      }
    },
    components: {  
      HomeTask,
      Bar
    },
    watch: {
    },
    created () {
    },
    mounted() {
      this.getPartyOne();
      this.queryIntegralBar();
    },
    methods: {
      /**
       * 获取当前用户的党员信息
       * @return {[type]} [description]
       */
      getPartyOne(){
        this.isLoad = true;
        this.axios.get(`${this.common.basePath}/user/findUser?id=${sessionStorage.getItem('Access-Key')}`, '').then( (response) => {
          this.isLoad = false; 
          if(response.data){ 
            this.memeberInfo = response.data;
          } 
        }).catch( (error) => {
            this.isLoad = false;
            this.$message.error('登录失败!!!'); 
        });
      },
      /**
       * 查询党员积分分布图
       * @return {[type]} [description]
       */
      queryIntegralBar(){
        this.isLoad =  true; 
        this.axios.post(`${this.common.basePath}/integralU/censusType`,{user_id: sessionStorage.getItem('Access-Key')}).then((response) => {
          this.isLoad =  false; 
          this.showDataIntegral = response.data.map( ({ type, sum }) => { return {name: type, value: sum}});
          this.xAxisDataIntegral = response.data.map( ( {type} ) => { return type });
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg);
        })
      }, 
    },
  }
</script>

<style scoped lang="less"> 
  .el-menu{
    border-right: none!important;
    width: 250px;
  }
</style>
