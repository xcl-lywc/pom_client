/************ 党员首页 ***********/
<template>  
  <div class="content-wrap" v-loading="isLoad"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>首页</el-breadcrumb-item> 
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">
        <el-row :gutter="20">
          <el-col :span="24">
            <!-- 党员信息 -->
            <el-card>
              <div slot="header" class="clearfix">
                <span>党员信息</span> 
              </div>
              <el-row v-if="partyMemeberInfo"> 
                <el-col :span="4">   
                  <el-avatar shape="square" :size="100" :src="`${common.imgPath}${partyMemeberInfo.picture}`" class="marr5 fl"> 
                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                  </el-avatar>
                </el-col>
                <el-col :span="10">
                  <p class="mart10">姓名：{{partyMemeberInfo.owner_name ? partyMemeberInfo.owner_name : '无'}}</p>
                  <p class="mart10">民族：{{common._controlTable(partyMemeberInfo.nation)}}</p>
                  <p class="mart10">生日：{{common._convertDate(partyMemeberInfo.birthday, 'yyyy年MM月dd日')}}</p>
                  <p class="mart10">党委：{{partyMemeberInfo.party_committee_name ? partyMemeberInfo.party_committee_name : '无'}}</p>
                  <p class="mart10">手机：{{partyMemeberInfo.phone_num ? partyMemeberInfo.phone_num : '无'}}</p>
                  <p class="mart10">身份证号：{{partyMemeberInfo.id_card ? partyMemeberInfo.id_card : '无'}}</p>
                </el-col>
                <el-col :span="10">
                  <p class="mart10">性别：{{common.transferGender(partyMemeberInfo.sex)}}</p>
                  <p class="mart10">籍贯：{{common._controlTable(partyMemeberInfo.native_place)}}</p>
                  <p class="mart10">婚姻状况：{{common._controlTable(partyMemeberInfo.marital_status)}}</p> 
                  <p class="mart10">入党时间：{{common._showDate(partyMemeberInfo.join_partisan_date)}}</p>
                  <p class="mart10">邮箱：{{partyMemeberInfo.email ? partyMemeberInfo.email : '无'}}</p>
                  <!-- <p class="mart10">通讯地址：{{partyMemeberInfo.address ? partyMemeberInfo.address : '无'}}</p> -->
                  <p class="mart10">通讯地址：
                    {{`
                      ${common._countyDataByIdConvert(partyMemeberInfo.province) }
                      ${common._countyDataByIdConvert(partyMemeberInfo.city)}
                      ${common._countyDataByIdConvert(partyMemeberInfo.county)}
                      ${partyMemeberInfo.address}
                    `}}
                  </p>
                </el-col>

              </el-row>
            </el-card>
          </el-col>
        </el-row>
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
  import LeftMenu from './components/LeftMenu'
  import HomeTask from "../.../../mainFunction/taskManagementComponents/HomeTaskComponent.vue"
  import Bar from '../../components/echarts/Bar' // 柱状图
  export default {
    data() {
      return {
        isLoad:           true,
        orgId:            sessionStorage.getItem('Access-OrgId'),
        partyMemeberInfo: null, //党员信息
        showDataIntegral:  [],
        xAxisDataIntegral: [],
      }
    },
    components: { 
      LeftMenu,
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
        // debugger
        this.isLoad = true;
        this.axios.post(`${this.common.basePath}/party/oneByUserId?id=${sessionStorage.getItem('Access-Key')}`, '').then( (response) => {
          this.isLoad = false; 
          if(response.data){ 
            this.partyMemeberInfo = response.data;
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
        // debugger
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
