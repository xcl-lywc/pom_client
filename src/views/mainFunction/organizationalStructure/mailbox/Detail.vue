/************ 党员首页 ***********/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
          <el-breadcrumb-item>组织架构</el-breadcrumb-item> 
          <el-breadcrumb-item :to="{ name: 'SecretaryMailbox'}">书记信箱</el-breadcrumb-item>
          <el-breadcrumb-item>详情</el-breadcrumb-item> 
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">
        <detail-com></detail-com>
      </div>
    </div>
  </div> 
</template>

<script>
  import LeftMenu from '../../components/LeftMenu'
  import DetailCom from '../../../../components/mailbox/DetailCom' 
  export default {
    data() {
      return {
      }
    },
    components: { 
      LeftMenu, 
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
  .el-menu{
    border-right: none!important;
    width: 250px;
  }
</style>
