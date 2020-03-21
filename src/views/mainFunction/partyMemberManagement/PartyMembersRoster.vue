/*************** 党员管理（党委、党小组、党支部 党员花名册） *************/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
          <el-breadcrumb-item>党员管理</el-breadcrumb-item>
          <el-breadcrumb-item>党员花名册</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
      <div class="theme-main"> 
        <PartyMembersRoster :orgId='orgId' :partyNature="partyNature" type="management"></PartyMembersRoster>
      </div>
    </div>
  </div> 
</template>

<script> 
  import PartyMembersRoster from './PartyMembersRosterCom.vue'
  export default {
    data() {
      return { 
        orgId:        sessionStorage.getItem('Access-OrgId'),
        partyNature:  sessionStorage.getItem('partyNature'),
      }
    },
    components: {  
      PartyMembersRoster
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
</style>
