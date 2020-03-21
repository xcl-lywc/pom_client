/*************** 书记信箱 *************/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
          <el-breadcrumb-item>组织架构</el-breadcrumb-item> 
          <el-breadcrumb-item>书记信箱</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
      <div class="theme-main"> 
        <secrerary-mailbox-com :orgId="orgId" type="recipient" orgName="" :showStatus="2"></secrerary-mailbox-com>
      </div>
    </div>
  </div>  
</template>

<script>
  import LeftMenu from '../../components/LeftMenu'
  import SecreraryMailboxCom from '../../../partyMember/components/SecreraryMailboxCom.vue'
  export default {
    data() {
      return { 
        orgId:        sessionStorage.getItem('Access-OrgId'),
      }
    },
    components: { 
      LeftMenu,
      SecreraryMailboxCom
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
