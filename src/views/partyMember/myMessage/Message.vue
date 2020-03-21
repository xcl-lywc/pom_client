/************ 党员首页 ***********/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{name: 'PartyMemberHome'}">首页</el-breadcrumb-item> 
          <el-breadcrumb-item>个人信息</el-breadcrumb-item> 
          <el-breadcrumb-item>党员信息</el-breadcrumb-item> 
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">  
        <party-member-message-com></party-member-message-com>
      </div>
    </div>
  </div> 
</template>

<script>
  import LeftMenu from '../components/LeftMenu'  
  import PartyMemberMessageCom from '../../../components/myMessage/PartyMemberMessageCom' 
  export default {
    data() {
      return { 
      }
    },
    components: { 
      LeftMenu, 
      PartyMemberMessageCom
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
</style>
