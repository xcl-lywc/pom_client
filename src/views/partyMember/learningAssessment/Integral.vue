/*************** 学习考核 - 我的积分 *************/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'PartyMemberHome' }">首页</el-breadcrumb-item> 
          <el-breadcrumb-item>学习考核</el-breadcrumb-item>  
          <el-breadcrumb-item>我的积分</el-breadcrumb-item>  
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">
        <integral-com></integral-com>
      </div>
    </div>
  </div>
</template>

<script>
  import LeftMenu from '../components/LeftMenu'
  import IntegralCom from '../../../components/learningAssessment/IntegralCom'
  export default {
    data() {
      return {  
      }
    },
    components: { 
      LeftMenu,
      IntegralCom
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
  .article-box{
    .title{
      display: inline-block;
      width: calc(100% - 100px);
      padding-right: 40px;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .date{
      display: inline-block;
      color: #ccc;
      position: relative;
      top: -4px;
    }
  }
</style>
