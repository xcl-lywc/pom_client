/************ 经历记录 ***********/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{name: 'StaffAndWorkersHome'}">首页</el-breadcrumb-item> 
          <el-breadcrumb-item>个人信息</el-breadcrumb-item> 
          <el-breadcrumb-item>经历记录</el-breadcrumb-item> 
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">
        <experence-record-com></experence-record-com>
      </div>
    </div>
  </div>   
</template>

<script> 
  import ExperenceRecordCom from '../../../components/myMessage/ExperenceRecordCom' 
  export default {
    data() {
      return { 
      }
    },
    components: {  
      ExperenceRecordCom
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
  .el-menu{
    border-right: none!important;
    width: 250px;
  }
</style>
