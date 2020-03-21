/*************** 上级通知-详情页面（职工和党员、工作台） *************/
<template>
  <div class="content-wrap">
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-if="jobName!='职工首页'&&jobName!='党员首页'" :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
          <el-breadcrumb-item v-if="jobName=='党员首页'" :to="{ name: 'PartyMemberHome' }">首页</el-breadcrumb-item> 
          <el-breadcrumb-item v-if="jobName=='职工首页'" :to="{ name: 'StaffAndWorkersHome' }">首页</el-breadcrumb-item> 
          <el-breadcrumb-item v-if="jobName!='职工首页'&&jobName!='党员首页'" :to="{ name: 'mainFunctionHome' }">我的上级通知</el-breadcrumb-item>  
          <el-breadcrumb-item v-if="jobName=='党员首页'" :to="{ name: 'PartyMemberHome' }">我的上级通知</el-breadcrumb-item> 
          <el-breadcrumb-item v-if="jobName=='职工首页'" :to="{ name: 'StaffAndWorkersHome' }">我的上级通知</el-breadcrumb-item>
          <el-breadcrumb-item>通知详情</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">
        <el-card>
          <div slot="header" class="clearfix marb15">
            <span :class="{'el-card-have-border-span':false}">通知详情</span>  
            <div class="el-card-head-btn"></div>
          </div> 
          <detail-com :nId="opreationDataNId"></detail-com> 
        </el-card>
      </div>
    </div>
  </div> 
</template>

<script>
  import DetailCom from "./SuperiorReminderDetailCom.vue"
  export default {
    data() {
      return {
        jobName:sessionStorage.getItem('jobName'),// 党员首页/职工首页/党委、党小组、党支部名称
        opreationDataNId:this.$route.query.nId,// 通知id
        token:this.$route.query.token,// token
      }
    },
    computed:{
      
    },
    components: { 
      DetailCom
    },
    watch: {
    },
    created () {
      
    },
    mounted() { 
     
    },
    methods: { 
     
      
    },
  }
</script>

<style scoped lang="less"> 
  
</style>
