/*************** 党费缴纳情况 *************/
<template>
  <el-row>
    <div class="content-wrap"> 
      <div class="content-wrap-box">
        <el-card class="content-title-card" shadow="never">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'mainFunctionHomes' }">首页</el-breadcrumb-item>  
            <el-breadcrumb-item>党费收缴</el-breadcrumb-item>
            <el-breadcrumb-item>党费缴纳情况</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
        <div class="theme-main"> 
          <el-card class="partyFeesPay-card">
            <el-tabs class="partyFeesPay-tabs" v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="党费缴纳明细" name="first">
                <detail style="margin-top:-60px"></detail>
              </el-tab-pane>
              <el-tab-pane label="党费缴纳统计" name="second">
                <total style="margin-top:-60px"></total>
              </el-tab-pane>
              <el-tab-pane label="党费缴纳报告单" name="three" v-if="partyNature=='2'">
                <report style="margin-top:-60px"></report>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </div>
      </div>
    </div>
  </el-row>  
</template>

<script>
  import Detail from '../components/partyFees/PayDetail.vue'
  import Total from '../components/partyFees/PayTotal.vue'
  import Report from '../components/partyFees/PayReport.vue'
  export default {
    data() {
      return { 
        partyNature:     this.$store.state.partyNature ? this.$store.state.partyNature : sessionStorage.getItem('partyNature'), //组织类型
        activeName:     'first',
      }
    },
    computed:{
     
    },
    components: { 
      Detail,
      Total,
      Report
    },
    watch: {
    },
    created () {
    },
    mounted() { 
      
    },
    methods: { 
      /**
       * 顶部切换
       * @author chuanlin.Xiao
       * @date   2020-01-17T17:37:41+0800
       * @param  {[type]}                 tab   [description]
       * @param  {[type]}                 event [description]
       * @return {[type]}                       [description]
       */
      handleClick(tab, event) {
        // this.searchForm = {
        //   pageNum:        this.common.elementPagination.pageNumDefault,
        //   pageSize:       this.common.elementPagination.pageSizeDefault,
        //   dateTime:       new Date().getTime(),
        //   curStatus:      null,
        //   userName:       null,
        //   partyOrgId:     Number(sessionStorage.getItem('Access-OrgId')),
        // };
        // this.query();
      },
      
    },
  }
</script>

<style lang="less"> 
  .partyFeesPay-tabs{
    .el-card__body{
      padding:0px !important;
    }
  }
</style>
