/*************** (类型不同显示的名字不同) *************/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'PartyMemberHome' }">首页</el-breadcrumb-item> 
          <el-breadcrumb-item :to="{ name: 'PartyMemberHome' }">我的党委</el-breadcrumb-item> 
          <el-breadcrumb-item>{{convertType}}</el-breadcrumb-item> 
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">
        <type-article-list-com :orgId="orgId" listPageRouterName="PMArticleList" detailPageRouterName="PMArticleDetail"></type-article-list-com>
      </div>
    </div>
  </div> 
</template>

<script>
  import LeftMenu from '../components/LeftMenu'
  import TypeArticleListCom from '../../../components/article/TypeArticleListCom'
  export default {
    data() {
      return {   
        orgId: sessionStorage.getItem('Access-OrgId'),
      }
    },
    components: { 
      LeftMenu,
      TypeArticleListCom
    },
    computed: {
      /**
       * 根据当前地址传入的参数名字来做相应的操作
       * @return {[type]} [description]
       */
      convertType(){
        switch(this.$route.params.key_type){
          case 'centre':
            sessionStorage.setItem('articleTypeName','中央精神');
            sessionStorage.setItem('articleTypeKey','centre');
            return '中央精神';
            break;
          case 'policies':
            sessionStorage.setItem('articleTypeName','政策法规');
            sessionStorage.setItem('articleTypeKey','policies');
            return '政策法规';
            break;
          case 'leader':
            sessionStorage.setItem('articleTypeName','领导讲话');
            sessionStorage.setItem('articleTypeKey','leader');
            return '领导讲话';
            break;
          case 'superior':
            sessionStorage.setItem('articleTypeName','上级文件');
            sessionStorage.setItem('articleTypeKey','superior');
            return '上级文件';
            break;
          case 'institution':
            sessionStorage.setItem('articleTypeName','党建制度');
            sessionStorage.setItem('articleTypeKey','institution');
            return '党建制度';
            break;
          case 'road':
            sessionStorage.setItem('articleTypeName','学习路上');
            sessionStorage.setItem('articleTypeKey','road');
            return '学习路上';
            break;
          case 'corruption':
            sessionStorage.setItem('articleTypeName','反腐倡廉');
            sessionStorage.setItem('articleTypeKey','corruption');
            return '反腐倡廉';
            break;
          case 'stone':
            sessionStorage.setItem('articleTypeName','他山之石');
            sessionStorage.setItem('articleTypeKey','stone');
            return '他山之石';
            break;
        }
      },
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
