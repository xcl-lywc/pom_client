/*************** 他山之石 stone*************/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
          <el-breadcrumb-item>系统设置</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: `StoneArticle` }">他山之石</el-breadcrumb-item>
          <el-breadcrumb-item>文件详情</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">
        <detail requestUrlType="stone"></detail>
      </div>
    </div>
  </div> 
</template>

<script>
  import Detail from './components/Detail' 
  export default { 
    data() {
      return { 
      }
    },
    components: {  
      Detail
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