/*************** 下级支部 *************/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
          <el-breadcrumb-item>组织架构</el-breadcrumb-item>
          <el-breadcrumb-item>下级支部</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
      <div class="theme-main"> 
        <org-manage menuRequestUrll="org/children" orgType='1' partyNature='2' memberRequestUrll="org/partyBranchLeader"></org-manage>
      </div>
    </div>
  </div>  
</template>

<script> 
  import OrgManage from './components/OrgManage'
  export default {
    data() {
      return {  
      }
    },
    components: {  
      OrgManage
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
