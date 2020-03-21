/************ 党员、职工首页---上级任务、上级通知、待处理事项 ***********/

<template>
  <el-row v-loading="isLoad">
    <!-- 主页面 -->
    <div>
      <el-card class="mart20" v-if="false">
        <div slot="header" class="clearfix">
          <span>预设动作</span> 
          <!-- <el-button class="el-card-head-btn" type="text">更多</el-button> -->
        </div>
        <el-table
          :data="presetTableData.rows">
          <el-table-column
            prop="jobName"
            show-overflow-tooltip
            label="任务名称">
          </el-table-column>
          <el-table-column prop="jobCycleType" label="预设类型" show-overflow-tooltip width=""  align='center'>
            <template slot-scope="scope">
              {{scope.row.jobCycleType==1?'通知':'任务'}}
            </template>
          </el-table-column>
          <el-table-column prop="jobType" show-overflow-tooltip width="" label="任务类型"  align='center'>
            <template slot-scope="scope">
              {{scope.row.jobType==1?'通知':''}}
              {{scope.row.jobType==2?'任务':''}}
              {{scope.row.jobType==3?'组织任期':''}}
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            show-overflow-tooltip
            label="发起时间">
            <template slot-scope="scope">
              {{common._convertDate(scope.row.createTime, 'yyyy/MM/dd hh:mm')}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100" align='center'>
            <template slot-scope="scope">
              <el-button type="warning" size="small" @click="disabled(scope.row)" :disabled="scope.row.curStatus==2">禁用</el-button>
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
          :page-sizes="common.elementPagination.pageSizes_small"
          :page-size="common.elementPagination.pageSizeDefault_small"
          :total="noticeTableData.total"
          @size-change="pageSizeChange($event,'preset')"
          @current-change="pageCurrentChange($event,'preset')">
        </el-pagination>
      </el-card>
      <!-- 上级通知 -->
      <el-card class="mart20">
        <div slot="header" class="clearfix">
          <span>我的上级通知</span> 
          <!-- <el-button class="el-card-head-btn" type="text">更多</el-button> -->
        </div>
        <el-form :inline="true" :model="queryNoticeForm" ref="queryNoticeForm" size="small">
          <el-form-item label="标题" prop="keyWords">
            <el-input v-model="queryNoticeForm.keyWords" placeholder="输入与标题相关的关键字"></el-input>
          </el-form-item>
          <el-form-item label="阅读状态" prop="read">
            <el-select v-model="queryNoticeForm.read" placeholder="阅读状态">
              <el-option :key="0" label="全部" value=""></el-option>
              <el-option :key="1" label="已读" :value="true"></el-option>
              <el-option :key="2" label="未读" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryNoticeForm.pageNum=1;queryNotice();" size="small">查询</el-button>
            <el-button type="" @click="rest('queryNoticeForm');" size="small">置空</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="noticeTableData.rows">
          <el-table-column
            prop="taskName"
            show-overflow-tooltip
            label="任务名称">
          </el-table-column>
          <el-table-column
            prop="createOrgName"
            label="来源"
            show-overflow-tooltip
            width="">
          </el-table-column>
          <el-table-column
            prop="createTime"
            show-overflow-tooltip
            label="发起时间">
            <template slot-scope="scope">
              {{common._convertDate(scope.row.createTime, 'yyyy/MM/dd hh:mm')}}
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="endTime"
            show-overflow-tooltip
            label="截止时间">
            <template slot-scope="scope">
              {{common._convertDate(scope.row.endTime, 'yyyy/MM/dd hh:mm')}}
            </template>
          </el-table-column> -->
          <el-table-column
            prop="assigneeOrgName"
            show-overflow-tooltip
            label="所属组织"
            width="">
          </el-table-column>
          <el-table-column
            prop="read"
            show-overflow-tooltip
            label="阅读状态">
            <template slot-scope="scope">
              <el-tag v-if="!scope.row.read">未读</el-tag>
              <el-tag type="success" v-if="scope.row.read">已读</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100" align='center'>
            <template slot-scope="scope">
              <el-button type="" size="small" @click='viewDetail(scope.row);!scope.row.read?read(scope.row):""'>查看</el-button>
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
          :page-sizes="common.elementPagination.pageSizes_small"
          :page-size="common.elementPagination.pageSizeDefault_small"
          :total="noticeTableData.total"
          @size-change="pageSizeChange($event,'notice')"
          @current-change="pageCurrentChange($event,'notice')">
        </el-pagination>
      </el-card>
      <!-- 上级任务 -->
      <el-card class="mart20">
        <div slot="header" class="clearfix">
          <span>我的上级任务</span> 
          <!-- <el-button class="el-card-head-btn" type="text">更多</el-button> -->
        </div>
        <el-form :inline="true" :model="queryTaskForm" ref="queryTaskForm" size="small">
          <el-form-item label="标题" prop="keyWords">
            <el-input v-model="queryTaskForm.keyWords" placeholder="输入与标题相关的关键字"></el-input>
          </el-form-item>
          <el-form-item label="任务状态" prop="assigneeStatus">
            <el-select v-model="queryTaskForm.assigneeStatus" placeholder="任务状态">
              <el-option :key="0" label="全部" value=""></el-option>
              <el-option :key="1" label="未完成" :value="1"></el-option>
              <el-option :key="2" label="已完成" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryTaskForm.pageNum=1;queryTask();" size="small">查询</el-button>
            <el-button type="" @click="rest('queryTaskForm');" size="small">置空</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="taskTableData.rows">
          <el-table-column
            prop="taskName"
            show-overflow-tooltip
            label="任务名称">
          </el-table-column>
          <el-table-column
            prop="createOrgName"
            show-overflow-tooltip
            label="来源"
            width="">
          </el-table-column>
          <el-table-column
            prop="createTime"
            show-overflow-tooltip
            label="发起时间">
            <template slot-scope="scope">
              {{common._convertDate(scope.row.createTime, 'yyyy/MM/dd hh:mm')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="endTime"
            show-overflow-tooltip
            label="截止时间">
            <template slot-scope="scope">
              {{common._convertDate(scope.row.endTime, 'yyyy/MM/dd hh:mm')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="assigneeOrgName"
            show-overflow-tooltip
            label="所属组织"
            width="">
          </el-table-column>
          <el-table-column prop="read" label="阅读状态" show-overflow-tooltip width=""  align='center'>
            <template slot-scope="scope">
              <el-tag v-if="!scope.row.read">未读</el-tag>
              <el-tag type="success" v-if="scope.row.read">已读</el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="assigneeStatus"
            show-overflow-tooltip
            label="任务状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.assigneeStatus==20">删除</el-tag>
              <el-tag type="success" v-if="scope.row.assigneeStatus==1">进行中</el-tag>
              <el-tag type="warning" v-if="scope.row.assigneeStatus==2">已完成</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column fixed="right" label="操作" width="100" align='center'>
            <template slot-scope="scope">
              <el-button type="" size="small" @click="view(scope.row);!scope.row.read?readUpTask(scope.row):''">查看</el-button>
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
          :page-sizes="common.elementPagination.pageSizes_small"
          :page-size="common.elementPagination.pageSizeDefault_small"
          :total="taskTableData.total"
          @size-change="pageSizeChange($event,'task')"
          @current-change="pageCurrentChange($event,'task')">
        </el-pagination>
      </el-card>
      <!-- 待处理事项 -->
      <el-card class="mart20">
        <div slot="header" class="clearfix">
          <span>我的待处理任务</span> 
          <!-- <el-button class="el-card-head-btn" type="text">更多</el-button> -->
        </div>
        <el-form :inline="true" :model="queryToDoForm" ref="queryToDoForm" size="small">
          <el-form-item label="工作记录" prop="processDefKey">
            <el-select v-model="queryToDoForm.processDefKey" placeholder="工作记录">
              <el-option
                v-for="item in typeArr"
                :key="item.id"
                :label="item.option_name"
                :value="item.processDefKey">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryToDoForm.pageNum=1;queryToDo();" size="small">查询</el-button>
            <el-button type="" @click="rest('queryToDoForm');" size="small">置空</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="toDoTableData.rows">
          <el-table-column
            prop="processDefName"
            show-overflow-tooltip
            label="记录名称">
          </el-table-column>
          <el-table-column prop="taskName" label="事项" show-overflow-tooltip width=""  align='center'></el-table-column>
          <el-table-column
            prop="processVariables.createUserName"
            label="发起人"
            show-overflow-tooltip
            width="">
          </el-table-column>
          <el-table-column
            prop="processVariables.createOrgName"
            label="发起组织"
            show-overflow-tooltip
            width="">
          </el-table-column>
          <el-table-column
            prop="beginTime"
            show-overflow-tooltip
            label="发起时间">
            <template slot-scope="scope">
              {{common._convertDate(scope.row.beginTime, 'yyyy/MM/dd hh:mm')}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100" align='center'>
            <template slot-scope="scope">
              <el-button type="success" size="small" @click='completeTask(scope.row)'>完成</el-button>
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
          :page-sizes="common.elementPagination.pageSizes_small"
          :page-size="common.elementPagination.pageSizeDefault_small"
          :total="toDoTableData.total"
          @size-change="pageSizeChange($event,'todo')"
          @current-change="pageCurrentChange($event,'todo')">
        </el-pagination>
      </el-card>
    </div>
  </el-row>  
</template>

<script>
  import FileShow from "../../../components/FileShow.vue"
  import approver from "../../../components/Approver.vue"
  import FormInfo from "../../../components/CostomFormInfo.vue"
  export default {
    data() {
      return {
        isLoad:           true,
        dialogLoading:    false,
        orgId:            Number(sessionStorage.getItem('Access-OrgId')),
        assessKey:        Number(sessionStorage.getItem('Access-Key')),
        jobName:         sessionStorage.getItem('jobName'),// 党员首页/职工首页/党委、党小组、党支部名称
        bottonLoding:    false,

        // 职工首页-预设动作
        queryPresetForm:{
          pageNum:    this.common.elementPagination.pageNumDefault_small,
          pageSize:   this.common.elementPagination.pageSizeDefault_small,
          userId:     Number(sessionStorage.getItem('Access-Key')),
        },
        presetTableData:   {rows: [], total: 0}, 

        // 上级通知
        queryNoticeForm:{
          pageNum:    this.common.elementPagination.pageNumDefault_small,
          pageSize:   this.common.elementPagination.pageSizeDefault_small,
          userId:     Number(sessionStorage.getItem('Access-Key')),
          read: false,
          keyWords: null,
        },
        noticeTableData:   {rows: [], total: 0}, 

        // 上级任务
        queryTaskForm:{
          pageNum:    this.common.elementPagination.pageNumDefault_small,
          pageSize:   this.common.elementPagination.pageSizeDefault_small,
          userId:     Number(sessionStorage.getItem('Access-Key')),
          assigneeStatus: 1,
          keyWords: null,
        },
        taskTableData:{rows: [], total: 0}, 

        // 待处理事项
        queryToDoForm:{
          assignee:       sessionStorage.getItem('Access-Key'),
          currentAccount: sessionStorage.getItem('Access-Key'),         
          pageNum:        this.common.elementPagination.pageNumDefault_small,
          pageSize:       this.common.elementPagination.pageSizeDefault_small,
          processDefKey:  null,
          includeProcessVariable:true
        },
        toDoTableData:   {rows: [], total: 0}, 
        typeArr:[],
      }
    },
    components: { 
      FileShow,
      approver,
      FormInfo
    },
    watch: {
    },
    created () {
      this.query3();
    },
    mounted() {
      this.queryPresetTask();
      this.queryNotice();
      this.queryTask();
      this.queryToDo();
    },
    methods: {

      /**
       * 重置
       * @author chuanlin.Xiao
       * @date   2020-01-06T15:16:53+0800
       * @param  {[type]}                 formName [description]
       * @return {[type]}                          [description]
       */
      rest(formName){
        this.$refs[formName]?this.$refs[formName].resetFields():'';
      },
      /**
       * 分页
       * @author chuanlin.Xiao
       * @date   2020-01-06T10:13:24+0800
       * @param  {[type]}                 val [description]
       * @return {[type]}                     [description]
       */
      pageSizeChange(val,type) {
        if(type=='notice'){
          this.queryNoticeForm.pageSize = val
          this.queryNotice()
        }else if(type=='task'){
          this.queryTaskForm.pageSize = val
          this.queryTask()
        }else if(type=='todo'){
          this.queryToDoForm.pageSize = val
          this.queryToDo()
        }else if(type=='preset'){
          this.queryToDoForm.pageSize = val
          this.queryPresetTask()
        }
      },
      pageCurrentChange(val,type) {
        if(type=='notice'){
          this.queryNoticeForm.pageNum = val
          this.queryNotice()
        }else if(type=='task'){
          this.queryTaskForm.pageNum = val
          this.queryTask()
        }else if(type=='todo'){
          this.queryToDoForm.pageNum = val
          this.queryToDo()
        }else if(type=='preset'){
          this.queryToDoForm.pageSize = val
          this.queryPresetTask()
        }
        
      },

      /**
       * 查询职工首页的预设动作
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:18:28+0800
       * @return {[type]}                 [description]
       */
      queryPresetTask() {  
        this.axios.post(`${this.common.basePath}/job/list`,this.queryPresetForm).then((response) => {
          this.presetTableData = response.data ? response.data : {rows:[],total:0}
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg);
        })  
      }, 
      /**
       * 禁用职工首页的预设动作
       * @author chuanlin.Xiao
       * @date   2020-01-06T17:48:30+0800
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      disabled(data){
        this.$confirm('此操作将禁用该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post(`${this.common.basePath}/job/forbidden?id=${data.id}`).then((response) => {
            this.$message.success(response.meta.message);
            this.queryPresetTask();
          }).catch((errorMsg) => {
            this.$message.error(errorMsg);
          }) 
        }).catch(() => {});
      },

      /**
       * 查询上级通知
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:18:28+0800
       * @return {[type]}                 [description]
       */
      queryNotice() {  
        this.axios.post(`${this.common.basePath}/notice/user/all`,this.queryNoticeForm).then((response) => {
          this.noticeTableData = response.data ? response.data : {rows:[],total:0}
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg);
        })  
      }, 
      /**
       * 查看上级通知详情
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      viewDetail(data){
        this.$router.push({path: '/links/superiorreminder_detail',query:{ nId:data.id,token:JSON.parse(sessionStorage.getItem('Access-Token'))}})
      },
      /**
       * 标记已读
       * @author chuanlin.Xiao
       * @date   2020-01-07T17:52:42+0800
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      read(data){
        if(!data.assigneeOrg){
          // 用户标记已读
          this.axios.get(`${this.common.basePath}/notice/read`,{params:{id:data.id,userId :this.assessKey}}).then((response) => {this.queryNotice();}).catch((errorMsg) => {
            this.$message.error(errorMsg);
          }) 
        }else{
          // 组织标记已读
          this.axios.get(`${this.common.basePath}/notice/read/org`,{params:{id:data.id,partyOrgId:data.assigneeOrg,userId :this.assessKey}}).then((response) => {this.queryNotice();}).catch((errorMsg) => {
            this.$message.error(errorMsg);
          }) 
        }
      },

      /**
       * 查询上级任务
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:18:28+0800
       * @return {[type]}                 [description]
       */
      queryTask() {  
        this.axios.post(`${this.common.basePath}/task/user/all`,this.queryTaskForm).then((response) => {
          this.taskTableData = response.data ? response.data : {rows:[],total:0}
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg);
        })  
      }, 
      /**
       * 查看与完成上级任务
       * @param  {[type]}                 data     [description]
       */
      view(data){
        this.$router.push({path: '/links/uptask_detail',query:{ assigneeOrg:data.assigneeOrg,taskId:data.id,token:JSON.parse(sessionStorage.getItem('Access-Token'))}})
      },
      /**
       * 标记已读
       * @author chuanlin.Xiao
       * @date   2020-01-07T17:52:42+0800
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      readUpTask(data){
        if(!data.assigneeOrg){
          // 用户标记已读
          this.axios.get(`${this.common.basePath}/task/read`,{params:{id:data.id,userId :this.assessKey}}).then((response) => {this.queryTask();}).catch((errorMsg) => {
            this.$message.error(errorMsg);
          }) 
        }else{
          // 组织标记已读
          this.axios.get(`${this.common.basePath}/task/read/org`,{params:{id:data.id,partyOrgId:data.assigneeOrg,userId :this.assessKey}}).then((response) => {this.queryTask();}).catch((errorMsg) => {
            this.$message.error(errorMsg);
          }) 
        }
      },

      /**
       * 查询待处理事项
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:18:28+0800
       * @return {[type]}                 [description]
       */
      queryToDo() {  
        this.axios.post(`${this.common.basePath}/workflow/todo/list`,this.queryToDoForm).then((response) => {
          this.toDoTableData = response.data ? response.data : {rows:[],total:0}
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg);
        })  
      }, 
      /**
       * 获取记录类型
       * @author chuanlin.Xiao
       * @date   2020-01-07T15:56:07+0800
       * @return {[type]}                 [description]
       */
      query3(taskType) {  
        this.axios.post(`${this.common.basePath}/workflow/option/find_list`).then((response) => {
          this.typeArr = response.data ? response.data : '';
        }).catch((errorMsg) => {
          this.$message.error(errorMsg);
        })  
      },
      /**
       * 完成待处理任务
       * @author chuanlin.Xiao
       * @date   2020-03-17T16:36:22+0800
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      completeTask(data){
        this.$router.push({path: '/links/todolist_complete',query:{ taskId:data.taskId,token:JSON.parse(sessionStorage.getItem('Access-Token'))}})
      },


    },
  }
</script>

<style scoped lang="less"> 
  .el-menu{
    border-right: none!important;
    width: 250px;
  }
</style>
