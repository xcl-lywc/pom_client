/*************** 我的收藏 - 文章资讯 *************/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'StaffAndWorkersHome' }">首页</el-breadcrumb-item> 
          <el-breadcrumb-item>我的收藏</el-breadcrumb-item>  
          <el-breadcrumb-item>文章资讯</el-breadcrumb-item>  
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">
        <article-collection detailPageRouterName="SAWCollectionArticleDetail"></article-collection>
      </div>
    </div>
  </div> 
</template>

<script> 
  import ArticleCollection from '../../../components/myCollection/Article'
  export default {
    data() {
      return {  
      }
    },
    components: {  
      ArticleCollection
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
