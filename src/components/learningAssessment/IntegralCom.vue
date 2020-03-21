/*************** 学习考核 - 我的积分 *************/
<template>
  <div> 
    <!-- 积分列表 -->
    <el-card class="padb20">
      <div slot="header" class="clearfix">
        <span>积分列表</span>  
      </div> 
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          v-for="(item, index) in columnList"
          :key="index"
          :prop="`sum${index +1}`"
          :label="item.type">
        </el-table-column>
        <el-table-column  
          prop="totalSum"
          label="总分">
        </el-table-column> 
      </el-table>
    </el-card>
    <!-- 积分历史 -->
    <el-card class="mart20 padb20">
      <div slot="header" class="clearfix">
        <span>积分历史</span>  
      </div> 
      <div>
        <p v-for="(item, index) in historyList.rows" class="mart20">
          {{common._convertDate(item.createTime, 'yyyy年MM月dd日 hh:mm')}} “{{item.type}}” {{item.reason}} “{{item.fraction}}”分
        </p>
      </div>
      <el-pagination   
         class="fr mart20"
         background
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="common.elementPagination.pageNum"
         :page-sizes="common.elementPagination.pageSizes"
         :page-size="common.elementPagination.pageSizeDefault"
         layout="total, sizes, prev, pager, next"
         :total="historyList.total">
      </el-pagination> 
    </el-card>
  </div> 
</template>

<script> 
  export default { 
    data() {
      return {   
        tableData:   [], //积分数据
        columnList:  [], //积分栏目
        historyList: { rows: [], total: 0},
        searchHistoryForm: { 
          pageNum:         this.common.elementPagination.pageNumDefault,
          pageSize:        this.common.elementPagination.pageSizeDefault, 
          userId:          sessionStorage.getItem('Access-Key'),
        },
      }
    }, 
    watch: {
    },
    created () {
    },
    mounted() {
      this.getQueryList();
      this.getQueryHistoryList();
    },
    methods: {  
      /**
       * 查询积分列表
       * @return {[type]} [description]
       */
      getQueryList(){   
        this.axios.post(`${this.common.basePath}/integralU/censusType`, {user_id: sessionStorage.getItem('Access-Key')}).then((response) => {
          this.columnList = response.data;
          this._columnConvert(response.data);
        }).catch((errorMsg) => { 
          this.$message.error(errorMsg)
        })  
      },
      _columnConvert(data){
        let typeObject = {}, totalSum = 0;
        data.forEach(( item, index) => {
          typeObject = {
            ...typeObject,
            [`sum${index + 1}`]: item.sum
          }
          totalSum+=item.sum;
        })
        typeObject = {
          ...typeObject,
          totalSum: totalSum,
        }
        this.tableData = [typeObject];
      },
      /**
       * 查询积分历史列表
       * @return {[type]} [description]
       */
      getQueryHistoryList(){   
        this.axios.post(`${this.common.basePath}/integralU/history`, this.searchHistoryForm).then((response) => {
          this.historyList = response.data;
        }).catch((errorMsg) => { 
          this.$message.error(errorMsg)
        })  
      },
      /*
       * 改变当前页码触发此事件
       * @param {number} val 当前页码
       * @param {string} type studentList为学生列表类型，memberList为所有成员列表 
       */
      handleCurrentChange(val, type){  
        this.searchHistoryForm.pageNum = val;
        this.getQueryHistoryList(); 
       },
      /*
       * 改变每页条数触发此事件
       * @param {number} val 当前数据
       */
      handleSizeChange(val, type){ 
        this.searchHistoryForm.pageSize = val;
        this.getQueryHistoryList(); 
       },
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
