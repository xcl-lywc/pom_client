/*************** 通知公告 *************/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'PartyMemberHome' }">首页</el-breadcrumb-item> 
          <el-breadcrumb-item>通知公告</el-breadcrumb-item> 
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">
        <el-tabs type="border-card">
          <el-tab-pane v-for="(item, index) in orgList" :key="index" :label="item.name">
            <article-list-com :typeComId="item.id"></article-list-com>
          </el-tab-pane> 
        </el-tabs>
      </div>
    </div>
  </div>  
</template>

<script>
  import LeftMenu from '../components/LeftMenu'
  import ArticleListCom from '../../../components/article/ArticleListCom'
  export default {
    data() {
      return {    
        orgList:          [],
        orgId:            null,
      }
    },
    components: { 
      LeftMenu,
      ArticleListCom
    },
    computed: { 
    },
    watch: {
    },
    created () { 
      sessionStorage.setItem('articleTypeName','通知公告');
      sessionStorage.setItem('articleTypeKey','announce');
    },
    mounted() { 
      this.queryOrgList();
    },
    methods: {
      /**
       * 查询不同组织的类别
       * @return {[type]} [description]
       */
      queryOrgList() {
        this.axios.post(`${this.common.basePath}/party/oneByUserId?id=${sessionStorage.getItem('Access-Key')}`, '').then((response) => { 
          const { data } = response;
          data.party_committee_id ? this.orgList.push({id: data.party_committee_id, name: data.party_committee_name}) : '';
          data.party_branch_id ? this.orgList.push({id: data.party_branch_id, name: data.party_branch_name}) : '';
          data.party_group_id ? this.orgList.push({id: data.party_group_id, name: data.party_group_name}) : ''; 

          this.orgId = this.orgList[0].id;
        }).catch((errorMsg) => { 
          this.$message.error(errorMsg)
        })   
      },  
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
