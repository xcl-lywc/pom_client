/*************** 上级任务（职工和党员、工作台） *************/

<template>
  <el-row>
    <div class="content-wrap  orgTask-class"> 
      <div class="content-wrap-box">
        <el-card class="content-title-card" shadow="never">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-if="jobName!='职工首页'&&jobName!='党员首页'" :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
            <el-breadcrumb-item v-if="jobName=='党员首页'" :to="{ name: 'PartyMemberHome' }">首页</el-breadcrumb-item> 
            <el-breadcrumb-item v-if="jobName=='职工首页'" :to="{ name: 'StaffAndWorkersHome' }">首页</el-breadcrumb-item>  
            <el-breadcrumb-item>任务管理</el-breadcrumb-item>
            <el-breadcrumb-item>上级任务</el-breadcrumb-item>
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
              <span :class="{'el-card-have-border-span':false}">上级任务列表</span>  
              <div class="el-card-head-btn"></div>
            </div>  
            <el-row>
              <el-table
                :data="tableData.rows"
                stripe
                border
                style="width: 100%">
                <el-table-column fixed label="序号" type="index" width="50" align='center'></el-table-column>
                <el-table-column prop="taskTypeName" label="任务类型" show-overflow-tooltip width=""  align='center'></el-table-column>
                <el-table-column prop="taskName" label="任务标题" show-overflow-tooltip width=""  align='center'></el-table-column>
                <el-table-column prop="createTime" label="发布时间" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{common._convertDate(scope.row.createTime, 'yyyy/MM/dd hh:mm')}}
                  </template>
                </el-table-column>
                <el-table-column prop="endTime" label="截止时间" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{common._convertDate(scope.row.endTime, 'yyyy/MM/dd hh:mm')}}
                  </template>
                </el-table-column>
                <el-table-column prop="read" label="阅读状态" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    <el-tag v-if="!scope.row.read">未读</el-tag>
                    <el-tag type="success" v-if="scope.row.read">已读</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="assigneeStatus" label="任务状态" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.assigneeStatus==1">进行中</el-tag>
                    <el-tag type="warning" v-if="scope.row.assigneeStatus==2">已完成</el-tag>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" :width="(jobName!='职工首页'&&jobName!='党员首页')?'240':'180'" align='center'>
                  <template slot-scope="scope">
                    <el-button type="" size="small" @click="taskId=scope.row.id;taskStatus=scope.row.assigneeStatus;dialogVisible=true;!scope.row.read?read(scope.row):''">查看</el-button>
                    <el-dropdown @command="distribution('dialogDistributionForm',$event,scope.row)" placement="top">
                      <div>
                        <el-button type="warning" size="small" class="marl10 marr10" v-if="jobName!='职工首页'&&jobName!='党员首页'">分发</el-button>
                        <span class="marl10 marr10" v-else></span>
                      </div>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="1">党员任务</el-dropdown-item>
                        <el-dropdown-item :command="2">组织任务</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                    <el-button type="primary" size="small" @click="deleteTask(scope.row)">删除</el-button>
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

    <!-- 查看与、评分、完成 -->
    <el-dialog title="任务详情" :visible.sync="dialogVisible" width="50vw">
      <detail-com :taskId="taskId" :taskStatus="taskStatus" @completeTask="completeTask" ref="mychild" type="dialog"></detail-com>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="$refs.mychild?$refs.mychild.taskComplete($refs.mychild.dialogForm):''" v-if="$refs.mychild?$refs.mychild.isShowCompleteBtn($refs.mychild.dialogForm):''">完 成</el-button>
      </div>
    </el-dialog> 

    <!-- 分发任务 -->
    <el-dialog title="分发任务" :visible.sync="dialogDistributionVisible" width="50vw">
      <el-form ref="dialogDistributionForm"  :model="dialogDistributionForm" label-width="120px" v-loading="dialogLoading">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="任务类型：" prop="taskType"
              :rules="[
                { required: true, message: '请选择任务类型', trigger: 'change' }
              ]">
              <el-select v-model="dialogDistributionForm.taskType" placeholder="任务类型" popper-class="peizhi-popper" filterable>
                <el-option
                  v-for="item in taskType"
                  :key="item.id"
                  :label="item.type"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="任务标题：" prop="taskName"
              :rules="[
                { required: true, message: '请输入任务标题', trigger: 'blur' }
              ]">
              <el-input :maxlength="20" :show-word-limit="false" v-model="dialogDistributionForm.taskName" placeholder="任务标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="截止日期：" prop="endTime"
              :rules="[
                {  type: 'date', required: false, message: '请选择任务截止日期', trigger: 'change' }
              ]">
              <el-date-picker
                popper-class="peizhi-popper"
                v-model="dialogDistributionForm.endTime"
                type="date"
                value-format="timestamp"
                placeholder="截止日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="任务内容：" prop="taskContent"
              :rules="[
                { required: false, message: '请输入内容', trigger: 'blur' }
              ]">
              <el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="dialogDistributionForm.taskContent" placeholder="内容..."></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="附件：" prop="privateFiles"
              :rules="[
                { validator: checkFiles, trigger: 'blur' }
              ]">
              <upload :buttonText="dialogDistributionForm.privateFiles&&dialogDistributionForm.privateFiles.length>0?'重新上传':'点击上传'" :url="'/file'" :fileTypes="[]" :data="myFileData" @uploadSuccess="(response) => {uploadFileSuccess(response, 'file')}"/>
              <!-- <span>只能上传jpg/png/gif文件，且不超过2M</span> -->
              <file-show :fileList="dialogDistributionForm.privateFiles?JSON.parse(dialogDistributionForm.privateFiles):[]" :closable="true" @handleClose="handleClose"></file-show>
            </el-form-item>
          </el-col>  

          <el-col :span="24">
            <el-form-item 
              label="配置表单：">
              <el-switch v-model="switchVal"></el-switch>
              <el-button type="text" v-if="switchVal" class="marl10 text-danger" @click="drawerFormVisible=true">前往配置表单 >>&nbsp;&nbsp;&nbsp;{{switchVal?'（已有自定义表单）':''}}</el-button>
            </el-form-item>
          </el-col>  

          <el-col :span="24" v-if="createTaskType==1">
            <el-form-item 
              label="接收人：" prop="assigneeList"
              class="is-required"
              :rules="[
                { type: 'array', required: false, message: '请至少选择一个', trigger: 'change' }
              ]">
              <range :type="1" @checkChange="checkChange" ref="child" :person='dialogDistributionForm.assigneeList' :dialogType="'add'"></range>
            </el-form-item>
          </el-col> 
          <el-col :span="24" v-if="createTaskType==2">
            <el-form-item 
              label="接收单位：" prop="candidateOrgList"
              class="is-required"
              :rules="[
                { type: 'array', required: false, message: '请至少选择一个', trigger: 'change' }
              ]">
              <range :type="2" @checkChange="checkChange" ref="child" :org='dialogDistributionForm.candidateOrgList' :dialogType="'add'"></range>
            </el-form-item>
          </el-col> 
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDistributionVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDistributionForm('dialogDistributionForm')" :loading="bottonLoding" :disabled="bottonLoding">保 存{{bottonLoding?' 中...':''}}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      top="5vh"
      title="配置表单"
      custom-class="peizhi"
      :visible.sync="drawerFormVisible"
      width="1200px">
      <CustomForm @saveCustomForm="handleSubmit" :dataDict="dataDict" :sortable_item="sortable_item" :type="'form'" :component_list="[]"></CustomForm>
      <span slot="footer" class="dialog-footer">
        <el-button @click="drawerFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="drawerFormVisible = false">确 定</el-button> -->
      </span>
    </el-dialog>
  </el-row>  
</template>

<script>
  import DetailCom from "./UpTaskDetailCom.vue"
  import upload from "../../../components/Upload.vue"
  import FileShow from "../../../components/FileShow.vue"
  import range from "../../../components/Range.vue"
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
        taskType:     [],

        dialogVisible:false,
        taskId:null,
        taskStatus:null,

        // 分发任务
        dialogDistributionVisible:false,
        createTaskType: 1,//1 表示分发党员任务、2表示分发组织任务（下级任务）
        dialogDistributionForm:   {
          creator:         Number(sessionStorage.getItem('Access-Key')),
          taskName:        null,
          taskType:        null,
          endTime:         null,
          createOrg:       Number(sessionStorage.getItem('Access-OrgId')),
          taskContent:     null,
          privateFiles:    null,
          candidateOrgList:[],
          assigneeList:    [], 
        },
        // 表单配置
        drawerFormVisible:false, // 表单配置弹框
        dataDict: [],// 配置表单的字典数据
        sortable_item: [], //最后需要保存的表单数据
        processFormDataInfo:[],// 配置的任务表单
        switchVal:false,// 是否配置表单
      }
    },
    computed:{
      myFileData(){
        return {type:'distributionTaskFile',userId:this.assessKey};
      },
    },
    components: { 
      DetailCom,
      upload,
      FileShow,
      range
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
       * 文件上传成功
       * @author chuanlin.Xiao
       * @date   2020-01-06T14:59:30+0800
       * @param  {[type]}                 response [description]
       * @param  {[type]}                 type     [description]
       * @return {[type]}                          [description]
       */
      uploadFileSuccess(response,type) {
        // console.log(response,type)
        this.dialogDistributionForm.privateFiles = JSON.stringify([response])
      },
      /**
       * 点击删除文件
       * @author chuanlin.Xiao
       * @date   2020-01-06T14:59:36+0800
       * @param  {[type]}                 tag [description]
       * @return {[type]}                     [description]
       */
      handleClose(tag) {
        this.dialogDistributionForm.privateFiles = null;
      },
      /**
       * 验证是否上传文件
       * @author chuanlin.Xiao
       * @date   2020-01-06T15:05:01+0800
       * @param  {[type]}                 rule     [description]
       * @param  {[type]}                 value    [description]
       * @param  {Function}               callback [description]
       * @return {[type]}                          [description]
       */
      checkFiles(rule, value, callback){
        if (value === []) {
          callback(new Error('请上传...'));
        } else {
          callback();
        }
      },
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
       * 完成任务，结束任务的广播事件
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      completeTask(response){
        this.$message.success(response.meta.message);
        this.query();
        this.dialogVisible = false;
      },
      /**
       * 选中时的广播事件
       * @author chuanlin.Xiao
       * @date   2020-01-09T14:29:56+0800
       * @param  {[type]}                 data [description]
       * @param  {[type]}                 type [description]
       * @return {[type]}                      [description]
       */
      checkChange(data,type){
        type=='org'?this.dialogDistributionForm.candidateOrgList = data:this.dialogDistributionForm.assigneeList = data;
      },
      /**
       * 保存配置表单内容
       * @param  {[type]} name [description]
       * @return {[type]}      [description]
       */
      handleSubmit(foromData) { 
        this.processFormDataInfo = foromData;
        this.drawerFormVisible = false;
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
        this.axios.post(this.jobName=='职工首页'||this.jobName=='党员首页'?`${this.common.basePath}/task/all`:`${this.common.basePath}/task/org/all`,form).then((response) => {
          this.tableData = response.data ? response.data : {rows:[],total:0}
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg);
        })  
      }, 
      /**
       * 获取任务类型
       * @author chuanlin.Xiao
       * @date   2020-01-07T10:24:07+0800
       * @return {[type]}                 [description]
       */
      query3() {  
        this.axios.get(`${this.common.basePath}/task/type/list`).then((response) => {
          this.taskType = response.data ? response.data : []
        }).catch((errorMsg) => {
          this.$message.error(errorMsg);
        })  
      },

      /**
       * 分发
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:50:07+0800
       * @param  {[type]}                 formName [description]
       * @param  {[type]}                 data     [description]
       */
      distribution(formName,type,data){
        this.$refs.child!=undefined?this.$refs.child.activeId = this.orgId:'';
        this.$refs.child!=undefined?this.$refs.child.org_ = []:'';
        this.$refs.child!=undefined?this.$refs.child.person_ = []:'';
        this.$refs.child!=undefined?this.$refs.child.checkAll = false:'';
        this.$refs.child!=undefined?this.$refs.child.isIndeterminate = true:'';

        this.dialogDistributionVisible = true;
        this.createTaskType = type;

        this.dialogLoading = true;
        this.axios.get(`${this.common.basePath}/task/${data.id}`).then((response) => {
          this.dialogDistributionForm = response.data;
          this.dialogDistributionForm.candidateOrgList = [];
          this.dialogDistributionForm.assigneeList = [];
          this.dialogDistributionForm.taskType = response.data.taskTypeId;

          if(response.data.instanceId){
            this.switchVal = true;// 是否配置表单
            this.axios.get(`${this.common.basePath}/workRecord/deployment?deploymentId=${response.data.instanceId}`).then((response) => {
              this.sortable_item = response.data.formData; //最后需要保存的表单数据
              this.processFormDataInfo = response.data.formData;// 配置的任务表单
            }).catch((errorMsg) => {
              this.$message.error(errorMsg);
            }) 
          } else{
            this.switchVal = false;// 是否配置表单
            this.sortable_item = []; //最后需要保存的表单数据
            this.processFormDataInfo = [];// 配置的任务表单
          }
          this.dialogLoading = false;
        }).catch((errorMsg) => {
          this.dialogLoading = false;
          this.$message.error(errorMsg);
        })  
      },
      /**
       * 提交分发表单
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:48:04+0800
       * @param  {[type]}                 formName [description]
       * @return {[type]}                          [description]
       */
      submitDistributionForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.bottonLoding = true;
            let form = {
              creator:         this.dialogDistributionForm.creator,
              createOrg:       this.dialogDistributionForm.createOrg,
              taskName:        this.dialogDistributionForm.taskName,
              taskType:        [this.dialogDistributionForm.taskType],
              taskContent:     this.dialogDistributionForm.taskContent,
              privateFiles:    this.dialogDistributionForm.privateFiles,
              candidateOrgList:this.dialogDistributionForm.candidateOrgList,
              assigneeList:    this.dialogDistributionForm.assigneeList,
              endTime:         this.dialogDistributionForm.endTime,
            }
            let flag = false;
            let length = this.processFormDataInfo.length;
            if(this.switchVal){
              if(length>0){
                flag = true;
                form.processFormDataInfo　=　{uuid:'',value:'',formData:this.processFormDataInfo}
              }else{
                this.$message.warning('您自定义的表单为空或者未保存！！！');
                flag = false;
                this.bottonLoding = false;
                return;
              }
            }else{
              flag = false; 
            }
            this.axios.post(flag ?　`${this.common.basePath}/task/form` : `${this.common.basePath}/task/add`,form).then((response) => {
              this.$message.success(response.meta.message);
              this.query();
              this.bottonLoding = false;
              this.dialogDistributionVisible = false;
            }).catch((errorMsg) => {
              this.bottonLoding = false;
              this.$message.error(errorMsg);
            })
          } else {
            return false;
          }
        });
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
       * 删除任务
       * @author chuanlin.Xiao
       * @date   2020-01-09T18:38:24+0800
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      deleteTask(data){
        console.log(data)
        this.$confirm('此操作将删除该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`${this.common.basePath}/task/delete?id=${data.id}`).then((response) => {
            this.$message.success(response.meta.message);
            this.query();
          }).catch((errorMsg) => {
            this.$message.error(errorMsg);
          }) 
        }).catch(() => {});
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
          this.axios.get(`${this.common.basePath}/task/read`,{params:{id:data.id,userId :this.assessKey}}).then((response) => {this.query();}).catch((errorMsg) => {
            this.$message.error(errorMsg);
          }) 
        }else{
          // 组织标记已读
          this.axios.get(`${this.common.basePath}/task/read/org`,{params:{id:data.id,partyOrgId:this.orgId,userId :this.assessKey}}).then((response) => {this.query();}).catch((errorMsg) => {
            this.$message.error(errorMsg);
          }) 
        }
      },
    },
  }
</script>

<style> 
 
</style>
