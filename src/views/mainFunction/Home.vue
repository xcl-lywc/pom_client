/************ 党员首页 ***********/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>首页</el-breadcrumb-item> 
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">
        <!-- 党员信息 -->
        <el-card>
          <div v-if="partyInfo" slot="header" class="clearfix" v-loading="isLoad">
            <span>组织概况</span> 
          </div>
          <el-row> 
            <el-col :span="12">
              <p class="mart10">名称：{{partyInfo.name}}</p>
              <p class="mart10">{{['','书记','书记','组长'][partyInfo.party_nature]}}：{{partyInfo.secretaryOfPartyCommittee}}</p> 
            </el-col>
            <el-col :span="12">
              <!-- <p class="mart10">地址：{{partyInfo.address}}</p> -->
              <p class="mart10">地址：
                {{`
                  ${common._countyDataByIdConvert(partyInfo.province) }
                  ${common._countyDataByIdConvert(partyInfo.city)}
                  ${common._countyDataByIdConvert(partyInfo.county)}
                  ${partyInfo.address}
                `}}
              </p>
              <p class="mart10">换届时间：{{common._convertDate(partyInfo.office_stop?partyInfo.office_stop.date_time:null, 'yyyy/MM/dd')}}</p> 
            </el-col>
            <el-col :span="24">
              <p class="mart10 desc-box pad5">简介：{{partyInfo.description}}</p> 
            </el-col>
          </el-row>
        </el-card>
        <!-- 代办任务 -->
        <el-card class="mart20">
          <div slot="header" class="clearfix">
            <span>党建工作</span> 
            <el-button class="el-card-head-btn" type="text">更多</el-button>
          </div>
          <el-table
            :data="commissionTask.rows">
            <el-table-column
              prop="name"
              label="任务名称">
            </el-table-column>
            <el-table-column
              prop="name"
              label="来源"
              width="180">
            </el-table-column>
            <el-table-column
              prop="start_time"
              label="发起时间">
            </el-table-column>
            <el-table-column
              prop="address"
              label="截止时间">
            </el-table-column>
            <el-table-column
              prop="address"
              label="状态">
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作">
            </el-table-column>
          </el-table>
        </el-card>
        <!-- 党员年龄分布、党建地图 -->
        <el-row  v-if="partyNature == 1" :gutter="20">
          <el-col :span=12>
            <el-card class="mart20">
              <div slot="header" class="clearfix">
                <span>党员年龄分布</span>  
              </div>
              <pie :seriesData="dataAge" chartWidth="100%" chartHeight="400px"></pie>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="mart20">
              <div slot="header" class="clearfix">
                <span>党建地图</span>  
              </div>
              <china-map :mapData="mapLocationList" chartWidth="100%" chartHeight="400px"></china-map>
            </el-card>
          </el-col>
        </el-row> 
        <!-- 工作记录概况 -->
        <el-row :gutter="20">
          <el-col :span='24'>
            <el-card class="mart20">
              <div slot="header" class="clearfix">
                <span>工作记录概况</span>  
              </div>
              <el-table
                :data="workRecordData"
                border
                stripe
                style="width: 100%">
                <el-table-column type="index" fixed label="" :index="indexMethod" width="100" align='center'></el-table-column>
                <el-table-column prop="label1" label="综合事务" width="" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="label2" label="组织管理" width="" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="label3" label="干部管理" width="" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="label4" label="学习教育" width="" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="label5" label="组织生活" width="" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="label6" label="党员管理" width="" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="label7" label="党费管理" width="" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="label8" label="党风廉政" width="" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="label9" label="宣传文化" width="" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="label10" label="群团工作" width="" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="label11" label="谈心谈话" width="" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="label12" label="争先创优" width="" align='center' show-overflow-tooltip></el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row> 
        <!-- 评分分布图、党员积分情况 -->
        <el-row :gutter="20">
          <el-col :span='24'>
            <el-card class="mart20">
              <div slot="header" class="clearfix">
                <span>评分分布图</span>  
                <el-date-picker
                  class="el-card-head-btn"
                  v-model="daterangeVal"
                  type="daterange"
                  size="small"
                  @change="queryTaskScoreSpreadEcharts();"
                  @clear="daterangeVal=null"
                  value-format="timestamp"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </div>
              <bar chartWidth="100%" chartHeight="300px" :xAxisData="xAxisData" :seriesData="seriesData"></bar>
            </el-card>
          </el-col>
          <el-col :span="24">
            <el-card class="mart20">
              <div slot="header" class="clearfix">
                <span>党员积分情况</span>  
              </div>
              <bar :seriesData="showDataIntegral" :xAxisData="xAxisDataIntegral" chartWidth="100%" chartHeight="300px"></bar>
            </el-card>
          </el-col>
        </el-row> 
      </div>
    </div>
  </div>  
</template>

<script> 
  import LeftMenu from './components/LeftMenu'
  import ChinaMap from '../../components/echarts/ChinaMap' // 引入中国地图
  import Bar from '../../components/echarts/Bar' // 柱状图
  import Pie from '../../components/echarts/Pie' // 饼图
  export default {
    data() {
      return {
        isLoad:         true,
        orgId:          sessionStorage.getItem('Access-OrgId'),
        partyInfo: {},    //党委信息
        commissionTask:   {rows: [], total: 0}, // 代办任务
        dataAge:          [],
        showDataIntegral: [],
        xAxisDataIntegral: [], //积分的横轴
        // 任务评分分布图
        daterangeVal:null,
        xAxisData:[],
        seriesData:[],
        mapLocationList:   [],
        // 工作记录概况
        workRecordData:[],
        partyNature: sessionStorage.getItem('partyNature'),
      }
    },
    components: { 
      LeftMenu,
      ChinaMap,
      Bar,
      Pie
    },
    watch: {
    },
    created () {  
      
    },
    mounted() { 
      this.queryPartInfo(); 
      this.queryWorkRecordOverview();
      this.queryTaskScoreSpreadEcharts();
      this.queryAgeBar();
      this.queryIntegralBar();
      this.queryMapLocation();
    },
    methods: {  
      /**
       * 查询党委信息
       * @return {[type]} [description]
       * partyNature 1.党委 2. 党支部 3.党小组
       */
      queryPartInfo() {  
        //待修改接口名字 2，3
        let typeName;
        if(sessionStorage.getItem('partyNature') == 1){
          typeName = 'partyCommittee';
        }else if(sessionStorage.getItem('partyNature') == 2){
          typeName = 'findPartBranch';
        }else if(sessionStorage.getItem('partyNature') == 3){
          typeName = 'findPartGroup';
        }else{
          return;
        }
        this.axios.get(`${this.common.basePath}/org/${typeName}?id=${this.orgId}`,).then((response) => {
          this.partyInfo = response.data;
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg);
        })  
      },  

      /**
       * 查询任务评分分布图（组织）
       * @return {[type]} [description]
       */
      queryTaskScoreSpreadEcharts() {  
        let form = {
          partyOrgId:Number(this.orgId),
          beginTime:null,
          endTime:null,
        };
        this.daterangeVal? form.beginTime = this.daterangeVal[0] : delete form.beginTime
        this.daterangeVal? form.endTime = this.daterangeVal[1] : delete form.endTime

        this.axios.post(`${this.common.basePath}/task/score/count`,form).then((response) => {
          let xAxisData = []; let seriesData = [];
          if(response.data&&response.data.length>0){
            response.data.forEach( function(element, index) {
              xAxisData.push(element.taskType)
              seriesData.push(element.taskScore)
            });
          }
          this.xAxisData = xAxisData;this.seriesData = seriesData;
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg);
        }) 
      },

      /**
       * 工作记录概况-行标题
       * @return {[index]} [description]
       */
      indexMethod(index) {
        switch (index) {
          case 0:
            return '任务数'
            break;
          case 1:
            return '进行中'
            break;
          case 2:
            return '积分'
            break;
          default:
            return false
            break;
        }
      },
      /**
       * 查询工作记录概况
       * @return {[type]} [description]
       */
      queryWorkRecordOverview() {  
        let params = {
          params:{partyOrgId:Number(this.orgId),}
        };
        this.axios.get(`${this.common.basePath}/workflow/instance/count`,params).then((response) => {
          this.workRecordData = response.data?response.data:[];
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg);
        }) 
      },

      /**
       * 查询年龄分布图
       * @return {[type]} [description]
       */
      queryAgeBar(){ 
        let ageSectionList = [
          {start: 20, end: 35},
          {start: 36, end: 50},
          {start: 51, end: 65},
          {start: 66, end: 80},
          {start: 81, end: 100},
        ]
        this.isLoad =  true; 
        this.axios.post(`${this.common.basePath}/party/ageMap`,{ party_orgs_id: this.orgId, ageSectionList: ageSectionList }).then((response) => {
          this.isLoad =  false; 
          this.dataAge = response.data;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg);
        })
      },
      /**
       * 查询党员积分分布图
       * @return {[type]} [description]
       */
      queryIntegralBar(){
        this.isLoad =  true; 
        this.axios.get(`${this.common.basePath}/party/integralMap?orgId=${this.orgId}`,{}).then((response) => {
          this.isLoad =  false; 
          this.showDataIntegral = response.data;
          this._xAxisDataIntegral_(response.data);
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg);
        });
      },
      _xAxisDataIntegral_(data){
        if(data){
          data.forEach( (item) => {
            this.xAxisDataIntegral.push(item.name);
          });
        }
      },
      /**
       * 全国地图数据
       * @return {[type]} [description]
       */
      queryMapLocation(){
        this.axios.get(`${this.common.basePath}/org/mapSize`, {}).then( (response) => {
          this.mapLocationList = response.data instanceof Array ? response.data : [];
        }).catch( (error) => {
          this.$message.error(error);
        });
      }
    },
  }
</script>

<style scoped lang="less"> 
  .el-menu{
    border-right: none!important;
    width: 250px;
  }
</style>
