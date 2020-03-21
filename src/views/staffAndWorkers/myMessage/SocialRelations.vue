/************ 社会关系 ***********/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{name: 'StaffAndWorkersHome'}">首页</el-breadcrumb-item> 
          <el-breadcrumb-item>个人信息</el-breadcrumb-item> 
          <el-breadcrumb-item>社会关系</el-breadcrumb-item> 
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">
        <social-relations-com></social-relations-com>
      </div>
    </div>
  </div>  
</template>

<script> 
  import SocialRelationsCom from '../../../components/myMessage/SocialRelationsCom' 
  export default {
    data() {
      return {
        
      }
    },
    components: {  
      SocialRelationsCom
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
