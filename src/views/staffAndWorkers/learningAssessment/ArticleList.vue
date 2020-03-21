/*************** 政策法规-文章列表 *************/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'StaffAndWorkersHome' }">首页</el-breadcrumb-item> 
          <el-breadcrumb-item>学习考核</el-breadcrumb-item> 
          <el-breadcrumb-item :to="{ name: 'SAWTypeArticleList', params:{ key_type: typeKey } }">{{typeName}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{subTypeName}}</el-breadcrumb-item> 
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">
        <article-list-com></article-list-com>
      </div>
    </div>
  </div> 
</template>

<script> 
  import ArticleListCom from '../../../components/article/ArticleListCom'
  export default {
    data() {
      return {  
        typeName:         sessionStorage.getItem('articleTypeName'),
        subTypeName:      sessionStorage.getItem('articleSubTypeName'),
        typeKey:          sessionStorage.getItem('articleTypeKey'), 
      }
    },
    components: {  
      ArticleListCom
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
