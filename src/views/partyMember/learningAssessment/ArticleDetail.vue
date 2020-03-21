/*************** 文章详情 *************/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'PartyMemberHome' }">首页</el-breadcrumb-item> 
          <el-breadcrumb-item >我的党委</el-breadcrumb-item> 
          <el-breadcrumb-item :to="{ name: typeArticleListName, params:{ key_type: typeKey } }">{{typeName}}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: articleListName, params:{ article_id: articleId, type_id: typeId} }">{{subtypeName}}</el-breadcrumb-item>
          <el-breadcrumb-item>文件详情</el-breadcrumb-item> 
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">  
        <article-detail-com></article-detail-com>
      </div>
    </div>
  </div> 
</template>

<script>
  import LeftMenu from '../components/LeftMenu'
  import ArticleDetailCom from '../../../components/article/ArticleDetailCom'
  export default {
    data() {
      return {    
        orgId:        sessionStorage.getItem('Access-OrgId'),
        accessKey:    sessionStorage.getItem('Access-Key'),
        typeName:     sessionStorage.getItem('articleTypeName'),
        subtypeName:     sessionStorage.getItem('articleSubTypeName'),
        typeKey:      sessionStorage.getItem('articleTypeKey'),
        typeId:       this.$route.params.type_id, 
        articleId:    this.$route.params.article_id,
      }
    },
    components: { 
      LeftMenu,
      ArticleDetailCom
    },
    computed: {
      typeArticleListName(){ 
        return `${this.$route.name.split('ArticleDetail')[0]}TypeArticleList`
      },
      articleListName(){ 
        return `${this.$route.name.split('ArticleDetail')[0]}ArticleList`
      }
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
    .font-icon-flex{
      i{
        font-size: 23px;
      }
    }
  }
</style>
