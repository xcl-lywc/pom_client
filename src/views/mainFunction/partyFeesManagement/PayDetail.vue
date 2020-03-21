/*************** 党费缴纳明细 *************/
<template>
  <el-row>
    <div class="content-wrap"> 
      <div class="content-wrap-box">
        <el-card class="content-title-card" shadow="never">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'mainFunctionHomes' }">首页</el-breadcrumb-item>  
            <el-breadcrumb-item>党费管理</el-breadcrumb-item>
            <el-breadcrumb-item>党支部党费收缴情况</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
        <Pay></Pay>
      </div>
    </div>
  </el-row>  
</template>

<script>
  import Pay from "../components/partyFees/PayDetail.vue"
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
