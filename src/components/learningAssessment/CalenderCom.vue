/*************** 学习考核 - 签到日历 *************/
<template>
  <div>  
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline search-box marb20">
      <el-form-item label="查看年月：" prop="searchDateRange" class="marl20">
        <el-date-picker
          v-model="searchForm.time"
          type="month" >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click=" getQueryList ">查询</el-button> 
      </el-form-item>
    </el-form>
    <!-- 签到日历 -->
    <el-card class="mart20 padb20" v-loading="isLoad">
      <div slot="header" class="clearfix">
        <span>签到日历</span>  
      </div>  
      <el-calendar v-model="searchForm.time">
        <template
          slot="dateCell"
          slot-scope="{date, data}">
          <p :class="data.isSelected ? 'is-selected' : ''"> 
            {{data.day.split('-').slice(1).join('-')}} {{ singnInfo(data) ? '✔️' : '' }}
          </p>
        </template>
      </el-calendar>
    </el-card>
  </div> 
</template>

<script> 
  export default { 
    data() {
      return {     
        isLoad:         true,
        signInHistory: [],
        searchForm: { 
          time:        new Date().getTime(), 
          userId:          sessionStorage.getItem('Access-Key'),
          type:        1,
        },
      }
    }, 
    watch: {
      'searchForm.time'(val){
        this.getQueryList();
      }
    },
    created () {
    },
    mounted() {
      this.getQueryList(); 
    },
    methods: {  
      /**
       * 查询积分列表
       * @return {[type]} [description]
       */
      getQueryList(){   
        this.isLoad = true;
        this.axios.post(`${this.common.basePath}/siginU/history`, this.searchForm).then((response) => {
          this.signInHistory = response.data.rows ? response.data.rows : []; 
          this.isLoad = false;
        }).catch((errorMsg) => { 
          this.isLoad = false;
          this.$message.error(errorMsg);
        })  
      },
      singnInfo(data){
        let isSelected = false;
        this.signInHistory.forEach( (item, index) => {
          if(this.common._convertDate(item.createTime, 'yyyy-MM-dd') == data.day ){
            isSelected = true;
          }
        })
        return isSelected; 
      }
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
