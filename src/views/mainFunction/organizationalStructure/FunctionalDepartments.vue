/*************** 职能部门 *************/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
          <el-breadcrumb-item>组织架构</el-breadcrumb-item>
          <el-breadcrumb-item>职能部门</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
      <div class="theme-main"> 
        <org-manage menuRequestUrll="org/partyDepartment" orgType="2" :partyNature='partyNature' memberRequestUrll="leader/list"></org-manage>
      </div>
    </div>
  </div>  
</template>

<script> 
  import OrgManage from './components/OrgManage'
  export default {
    data() {
      return {  
        partyNature:null,
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
