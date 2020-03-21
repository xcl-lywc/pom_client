/************ 基础信息 ***********/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{name: 'PartyMemberHome'}">首页</el-breadcrumb-item> 
          <el-breadcrumb-item>个人信息</el-breadcrumb-item> 
          <el-breadcrumb-item>基础信息</el-breadcrumb-item> 
        </el-breadcrumb>
      </el-card>
      <div class="theme-main"> 
        <basic-message-com></basic-message-com>
      </div>
    </div>
  </div> 
</template>

<script>
  import LeftMenu from '../components/LeftMenu'  
  import BasicMessageCom from '../../../components/myMessage/BasicsMessageCom' 
  let id = 0;
  export default {
    data() {
      let self = this;
      return {  
      }
    },
    components: { 
      LeftMenu,  
      BasicMessageCom
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
