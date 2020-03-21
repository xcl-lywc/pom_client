/*************** 待处理任务（职工和党员） *************/

<template>
  <el-row>
    <div class="content-wrap"> 
      <div class="content-wrap-box">
        <el-card class="content-title-card" shadow="never">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-if="jobName!='职工首页'&&jobName!='党员首页'" :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
            <el-breadcrumb-item v-if="jobName=='党员首页'" :to="{ name: 'PartyMemberHome' }">首页</el-breadcrumb-item> 
            <el-breadcrumb-item v-if="jobName=='职工首页'" :to="{ name: 'StaffAndWorkersHome' }">首页</el-breadcrumb-item>  
            <el-breadcrumb-item>任务管理</el-breadcrumb-item>
            <el-breadcrumb-item>待处理任务</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
        <div class="theme-main"> 
          <!-- 搜索条件 -->
          <el-card class="marb20">
            <el-form :inline="true" :model="searchForm" ref="searchForm" size="small">
              <el-form-item label="工作记录" prop="processDefKey">
                <el-select v-model="searchForm.processDefKey" placeholder="工作记录" filterable>
                  <el-option
                    v-for="item in typeArr"
                    :key="item.id"
                    :label="item.option_name"
                    :value="item.processDefKey">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发布日期" prop="value">
                <el-date-picker
                  v-model="searchForm.value"
                  type="daterange"
                  value-format="timestamp"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchForm.pageNum=1;query();" size="small">查询</el-button>
                <el-button type="" @click="rest('searchForm');" size="small">置空</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <!-- 表格数据 -->
          <el-card class="marb20" v-loading="isLoad">
            <div slot="header" class="clearfix marb15">
              <span :class="{'el-card-have-border-span':false}">待处理任务列表</span>  
              <div class="el-card-head-btn"></div>
            </div>  
            <el-row>
              <el-table
                :data="tableData.rows"
                stripe
                border
                style="width: 100%">
                <el-table-column fixed label="序号" type="index" width="50" align='center'></el-table-column>
                <el-table-column prop="beginTime" label="创建时间" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{common._convertDate(scope.row.beginTime, 'yyyy/MM/dd hh:mm')}}
                  </template>
                </el-table-column>
                <el-table-column prop="processDefName" label="记录名称" show-overflow-tooltip width=""  align='center'></el-table-column>
                <el-table-column prop="taskName" label="事项" show-overflow-tooltip width=""  align='center'></el-table-column>
                <el-table-column
                  prop="processVariables.createUserName"
                  label="发起人"
                  show-overflow-tooltip
                  width=""
                  align='center'>
                </el-table-column>
                <el-table-column
                  prop="processVariables.createOrgName"
                  label="发起组织"
                  show-overflow-tooltip
                  width=""
                  align='center'>
                </el-table-column>
                
                <!-- <el-table-column prop="endTime" label="到达时间" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{common._convertDate(scope.row.endTime, 'yyyy/MM/dd hh:mm')}}
                  </template>
                </el-table-column> -->
                <el-table-column fixed="right" label="操作" width="100" align='center'>
                  <template slot-scope="scope">
                    <el-button type="success" size="small" @click='dialogCompleteVisible = true;opreationDataTaskId = scope.row.taskId;'>完成</el-button>
                    <!-- <el-button type="primary" size="small" @click='$message("暂未实现")'>指派</el-button> -->
                    <!-- <el-button type="warning" size="small" @click='$message("暂未实现")'>抄送</el-button> -->
                  </template>
                </el-table-column>
              </el-table> 
              <!-- 分页 -->
              <el-pagination
                background
                class="text-right mart10"
                small
                layout="total, sizes, prev, pager, next"
                :current-page="common.elementPagination.pageNum"
                :page-sizes="common.elementPagination.pageSizes"
                :page-size="common.elementPagination.pageSizeDefault"
                :total="tableData.total"
                @size-change="pageSizeChange"
                @current-change="pageCurrentChange">
              </el-pagination>
            </el-row>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 完成任务时，填写表单 -->
    <el-dialog title="填写表单" :visible.sync="dialogCompleteVisible" width="50vw" :show-close="true">
      <complete-com :taskId="opreationDataTaskId" @completeTask="completeTask"></complete-com>
    </el-dialog>
  </el-row>  
</template>

<script>
  import CompleteCom from "./ToDoListCompleteCom.vue"
  export default {
    data() {
      return { 
        orgId:           Number(sessionStorage.getItem('Access-OrgId')),
        assessKey:       Number(sessionStorage.getItem('Access-Key')),
        jobName:         sessionStorage.getItem('jobName'),// 党员首页/职工首页/党委、党小组、党支部名称
        isLoad:          true,
        bottonLoding:    false,
        dialogLoading:   false,

        searchForm:{
          assignee:       sessionStorage.getItem('Access-Key'),
          currentAccount: sessionStorage.getItem('Access-Key'),         
          pageNum:        this.common.elementPagination.pageNumDefault,
          pageSize:       this.common.elementPagination.pageSizeDefault,
          value:          null,
          processDefKey:  null,
          includeProcessVariable: true
        },
        typeArr:      [],

        tableData:    {rows:[],total:0},

        dialogCompleteVisible:false,
        opreationDataTaskId:null,
      }
    },
    computed:{
      
    },
    components: { 
      CompleteCom
    },
    watch: {
    },
    created () {
    },
    mounted() { 
      this.query();
      this.query3();
    },
    methods: { 
      /**
       * 分页
       * @author chuanlin.Xiao
       * @date   2020-01-06T10:13:24+0800
       * @param  {[type]}                 val [description]
       * @return {[type]}                     [description]
       */
      pageSizeChange(val) {
        this.searchForm.pageSize = val
        this.query()
      },
      pageCurrentChange(val) {
        this.searchForm.pageNum = val
        this.query()
      },
      /**
       * 重置
       * @author chuanlin.Xiao
       * @date   2020-01-06T15:16:53+0800
       * @param  {[type]}                 formName [description]
       * @return {[type]}                          [description]
       */
      rest(formName){
        this.$refs[formName]?this.$refs[formName].resetFields():'';
        this.searchForm.pageSize = 10;
        this.searchForm.pageNum = 1;
      },
      /**
       * 完成任务的广播事件
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      completeTask(response){
        this.$message.success(response.meta.message);
        this.query();
        this.dialogCompleteVisible = false;
      },

      /**
       * 查询
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:18:28+0800
       * @return {[type]}                 [description]
       */
      query() {  
        let form = this.searchForm;
        form.value? form.beginTime = form.value[0] : delete form.beginTime;
        form.value? form.endTime   = form.value[1] : delete form.endTime;
        // delete form.value
        this.axios.post(`${this.common.basePath}/workflow/todo/list`,form).then((response) => {
          this.tableData = response.data ? response.data : {rows:[],total:0}
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg);
        })  
      },  
      /**
       * 获取待处理事项类型
       * @author chuanlin.Xiao
       * @date   2020-01-07T15:56:07+0800
       * @return {[type]}                 [description]
       */
      query3() {  
        this.axios.post(`${this.common.basePath}/workflow/option/find_list`).then((response) => {
          this.typeArr = response.data ? response.data : '';
        }).catch((errorMsg) => {
          this.$message.error(errorMsg);
        })  
      }, 

      /**
       * 重置表单
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:47:46+0800
       * @param  {[type]}                 formName [description]
       * @return {[type]}                          [description]
       */
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      
    },
  }
</script>

<style scoped lang="less"> 
  
</style>
