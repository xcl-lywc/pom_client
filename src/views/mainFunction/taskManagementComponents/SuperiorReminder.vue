/*************** 上级通知（职工和党员、工作台） *************/

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
            <el-breadcrumb-item>上级通知</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
        <div class="theme-main"> 
          <!-- 搜索条件 -->
          <el-card class="marb20">
            <el-form :inline="true" :model="searchForm" ref="searchForm" size="small">
              <el-form-item label="标题" prop="keyWords">
                <el-input v-model="searchForm.keyWords" placeholder="输入与标题相关的关键字"></el-input>
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
              <span :class="{'el-card-have-border-span':false}">上级通知列表</span>  
              <div class="el-card-head-btn">
              </div>
            </div>  
            <el-row>
              <el-table
                :data="tableData.rows"
                stripe
                border
                style="width: 100%">
                <el-table-column fixed label="序号" type="index" width="50" align='center'></el-table-column>
                <el-table-column prop="taskTypeName" label="提醒类型" show-overflow-tooltip width=""  align='center'></el-table-column>
                <el-table-column prop="taskName" label="任务标题" show-overflow-tooltip width=""  align='center'></el-table-column>
                <el-table-column prop="createTime" label="发布时间" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{common._convertDate(scope.row.createTime, 'yyyy/MM/dd hh:mm')}}
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="endTime" label="截止时间" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{common._convertDate(scope.row.endTime, 'yyyy/MM/dd hh:mm')}}
                  </template>
                </el-table-column> -->
                <el-table-column prop="read" label="状态" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    <el-tag v-if="!scope.row.read">未读</el-tag>
                    <el-tag type="success" v-if="scope.row.read">已读</el-tag>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100" align='center'>
                  <template slot-scope="scope">
                    <el-button type="" size="small" @click='nId=scope.row.id;dialogDetailVisible=true;!scope.row.read?read(scope.row):""'>查看</el-button>
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

    <!-- 详情 -->
    <el-dialog title="通知详情" :visible.sync="dialogDetailVisible" width="50vw">
      <detail-com :nId="nId"></detail-com>
    </el-dialog>
  </el-row>  
</template>

<script>
  import DetailCom from "./SuperiorReminderDetailCom.vue"
  export default {
    data() {
      return { 
        orgId:                 Number(sessionStorage.getItem('Access-OrgId')),
        assessKey:             Number(sessionStorage.getItem('Access-Key')),
        jobName:               sessionStorage.getItem('jobName'),// 党员首页/职工首页/党委、党小组、党支部名称
        isLoad:                true,
        bottonLoding:          false,
        dialogLoading:         false,
        
        searchForm:{
          pageNum:    this.common.elementPagination.pageNumDefault,
          pageSize:   this.common.elementPagination.pageSizeDefault,
          value:      null,
          keyWords:   null,
          partyOrgId: Number(sessionStorage.getItem('Access-OrgId')),
          userId:     Number(sessionStorage.getItem('Access-Key')),
        },

        tableData:    {rows:[],total:0},
        
        dialogDetailVisible:false,
        nId:null,
      }
    },
    computed:{
      
    },
    components: { 
      DetailCom
    },
    watch: {
    },
    created () {
    },
    mounted() {
      this.query();
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
       * 查询
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:18:28+0800
       * @return {[type]}                 [description]
       */
      query() {  
        console.log(this.jobName)
        let form = this.searchForm;
        form.value? form.beginTime = form.value[0] : delete form.beginTime;
        form.value? form.endTime   = form.value[1] : delete form.endTime;
        // delete form.value
        if(this.jobName=='职工首页'||this.jobName=='党员首页'){delete form.partyOrgId; form.userId=this.assessKey}
        this.axios.post(this.jobName=='职工首页'||this.jobName=='党员首页'?`${this.common.basePath}/notice/all`:`${this.common.basePath}/notice/org/all`,form).then((response) => {
          this.tableData = response.data ? response.data : {rows:[],total:0}
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
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
      /**
       * 标记已读
       * @author chuanlin.Xiao
       * @date   2020-01-07T17:52:42+0800
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      read(data){
        if(this.jobName=='职工首页'||this.jobName=='党员首页'){
          // 用户标记已读
          this.axios.get(`${this.common.basePath}/notice/read`,{params:{id:data.id,userId :this.assessKey}}).then((response) => {this.query();}).catch((errorMsg) => {
            this.$message.error(errorMsg);
          }) 
        }else{
          // 组织标记已读
          this.axios.get(`${this.common.basePath}/notice/read/org`,{params:{id:data.id,partyOrgId:this.orgId,userId :this.assessKey}}).then((response) => {this.query();}).catch((errorMsg) => {
            this.$message.error(errorMsg);
          }) 
        }
      }
    },
  }
</script>

<style> 
  
</style>
