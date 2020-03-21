/*************** 组织架构 *************/
<template> 
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'PartyMemberHome' }">首页</el-breadcrumb-item>  
          <el-breadcrumb-item>组织架构</el-breadcrumb-item> 
        </el-breadcrumb>
      </el-card>
      <div class="theme-main"> 
        <el-tabs type="border-card">
          <el-tab-pane v-for="(item, index) in orgList" :key="index" :label="item.name">
            <org-str-com :orgId="item.id" :partyNature="item.partyNature"></org-str-com>
          </el-tab-pane> 
        </el-tabs>  
      </div>
    </div>
  </div>
</template>

<script>
  import LeftMenu from './components/LeftMenu'
  import OrgStrCom from './components/OrgStrCom'
  export default {
    data() {
      return {  
        orgList:          [],
        orgId:            null,
      }
    },
    components: { 
      LeftMenu,
      OrgStrCom
    },
    watch: {
    },
    created () {
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
          data.party_committee_id ? this.orgList.push({id: data.party_committee_id, name: data.party_committee_name, partyNature: 1}) : '';
          data.party_branch_id ? this.orgList.push({id: data.party_branch_id, name: data.party_branch_name, partyNature: 2}) : '';
          data.party_group_id ? this.orgList.push({id: data.party_group_id, name: data.party_group_name, partyNature: 3}) : '';

          this.orgId = this.orgList[0].id;
        }).catch((errorMsg) => { 
          this.$message.error(errorMsg)
        })   
      }, 
    },
  }
</script> 