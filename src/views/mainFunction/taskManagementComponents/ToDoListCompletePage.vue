/*************** 待处理任务-完成任务，填写表单页面（职工和党员） *************/
<template>
  <div class="content-wrap">
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-if="jobName!='职工首页'&&jobName!='党员首页'" :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
          <el-breadcrumb-item v-if="jobName=='党员首页'" :to="{ name: 'PartyMemberHome' }">首页</el-breadcrumb-item> 
          <el-breadcrumb-item v-if="jobName=='职工首页'" :to="{ name: 'StaffAndWorkersHome' }">首页</el-breadcrumb-item> 
          <el-breadcrumb-item v-if="jobName=='党员首页'" :to="{ name: 'PartyMemberToDoList' }">待处理任务</el-breadcrumb-item>
          <el-breadcrumb-item v-if="jobName=='职工首页'" :to="{ name: 'StaffAndWorkersToDoList' }">待处理任务</el-breadcrumb-item>
          <el-breadcrumb-item>完成任务</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">
        <el-card>
          <div slot="header" class="clearfix marb15">
            <span :class="{'el-card-have-border-span':false}">完成任务</span>  
            <div class="el-card-head-btn"></div>
          </div> 
          <complete-com :taskId="opreationDataTaskId" @completeTask="completeTask"></complete-com>  
        </el-card>
      </div>
    </div>
  </div> 
</template>

<script>
  import CompleteCom from "./ToDoListCompleteCom.vue"
  export default {
    data() {
      return {
        jobName:sessionStorage.getItem('jobName'),// 党员首页/职工首页/党委、党小组、党支部名称
        opreationDataTaskId:this.$route.query.taskId,// 任务id
        token:this.$route.query.token,// token
      }
    },
    computed:{
      
    },
    components: { 
      CompleteCom
    },
    watch: {
    },
    created () {
      
    },
    mounted() { 
     
    },
    methods: { 
      /**
       * 完成任务的广播事件
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      completeTask(response){
        this.$message.success(response.meta.message);
        this.jobName=='党员首页'?this.$router.push({name: "PartyMemberToDoList", params: {}}):this.$router.push({name: "StaffAndWorkersToDoList", params: {}});
      },
      
    },
  }
</script>

<style scoped lang="less"> 
  
</style>
