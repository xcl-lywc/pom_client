/*************** 党费核定 *************/
<template>
  <el-row>
    <div class="content-wrap"> 
      <div class="content-wrap-box">
        <el-card class="content-title-card" shadow="never">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'mainFunctionHomes' }">首页</el-breadcrumb-item>  
            <el-breadcrumb-item>党费收缴</el-breadcrumb-item>
            <el-breadcrumb-item>党费核定</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
        <Pay></Pay>
      </div>
    </div>
  </el-row>  
</template>

<script>
  import Pay from "../components/partyFees/PayVerification.vue"
  export default {
    data() {
      return { 
      
      }
    },
    computed:{
      
    },
    components: { 
      Pay
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
