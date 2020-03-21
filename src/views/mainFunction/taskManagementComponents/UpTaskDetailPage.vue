/*************** 上级任务-查看、评分、完成页面（职工和党员、工作台） *************/
<template>
  <div class="content-wrap">
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-if="jobName!='职工首页'&&jobName!='党员首页'" :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
          <el-breadcrumb-item v-if="jobName=='党员首页'" :to="{ name: 'PartyMemberHome' }">首页</el-breadcrumb-item> 
          <el-breadcrumb-item v-if="jobName=='职工首页'" :to="{ name: 'StaffAndWorkersHome' }">首页</el-breadcrumb-item> 
          <el-breadcrumb-item v-if="jobName!='职工首页'&&jobName!='党员首页'" :to="{ name: 'mainFunctionHome' }">我的上级任务</el-breadcrumb-item>  
          <el-breadcrumb-item v-if="jobName=='党员首页'" :to="{ name: 'PartyMemberHome' }">我的上级任务</el-breadcrumb-item> 
          <el-breadcrumb-item v-if="jobName=='职工首页'" :to="{ name: 'StaffAndWorkersHome' }">我的上级任务</el-breadcrumb-item> 
          <el-breadcrumb-item>查看与完成任务</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">
        <el-card>
          <div slot="header" class="clearfix marb15">
            <span :class="{'el-card-have-border-span':false}">查看与完成任务</span>  
            <div class="el-card-head-btn"></div>
          </div> 
          <detail-com :taskId="opreationDataTaskId" @completeTask="completeTask" type="page" :assigneeOrg="assigneeOrg"></detail-com> 
        </el-card>
      </div>
    </div>
  </div> 
</template>

<script>
  import DetailCom from "./UpTaskDetailCom.vue"
  export default {
    data() {
      return {
        jobName:sessionStorage.getItem('jobName'),// 党员首页/职工首页/党委、党小组、党支部名称
        opreationDataTaskId:this.$route.query.taskId,// 任务id
        token:this.$route.query.token,// token

        assigneeOrg:this.$route.query.assigneeOrg,// 党员首页或职工首页的执行组织
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
      /**
       * 完成任务的广播事件
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      completeTask(response){
        this.$message.success(response.meta.message);
        if(this.jobName=='党员首页'){
          this.$router.push({name: "PartyMemberHome", params: {}})
        }else if(this.jobName=='职工首页'){
          this.$router.push({name: "StaffAndWorkersHome", params: {}})
        }else if(this.jobName!='职工首页'&&this.jobName!='党员首页'){
          this.$router.push({name: "mainFunctionHome", params: {}})
        }
      },
      
    },
  }
</script>

<style scoped lang="less"> 
  
</style>
