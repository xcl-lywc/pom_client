/*************** 上级任务-查看、评分、完成组件（职工和党员、工作台） *************/
<template>
  <div>
    <el-form v-if="dialogForm" ref="dialogForm"  :model="dialogForm" label-width="120px" v-loading="dialogLoading">
      <el-row>
        <el-col :span="12">
          <el-form-item  label="任务类型："> {{dialogForm.taskTypeName}} </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发布单位："> {{dialogForm.createOrgName}} </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务名称：">{{dialogForm.taskName}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务状态：">
            <el-tag type="success" v-if="isShowCompleteBtn(dialogForm)">进行中</el-tag>
            <el-tag type="warning" v-if="!isShowCompleteBtn(dialogForm)">已完成</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发布时间：">{{common._convertDate(dialogForm.createTime, 'yyyy/MM/dd hh:mm')}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="截止时间：">{{common._convertDate(dialogForm.endTime, 'yyyy/MM/dd hh:mm')}}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item  label="任务内容：">
            <div class="desc-box">{{dialogForm.taskContent}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item 
            label="附件：" prop="privateFiles">
            <file-show :fileList="dialogForm.privateFiles" :closable="false"></file-show>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item 
            label="完成情况：" prop="assigneeVos">
            <el-card shadow="never"> 
              <el-row v-if="dialogForm">
                <el-collapse accordion @change="collapseChange" v-model="collapseActiveName">
                  <div v-if="dialogForm.assigneeVos&&dialogForm.assigneeVos.length>0">
                    <el-collapse-item v-for='(item,index) in dialogForm.assigneeVos' :name="(index+1)+'-'+item.assignee+'-'+item.assigneeType" v-if="judge_collapse(item)">
                      <template slot="title">
                        <div>
                          {{item.assigneeName}}
                        </div>
                        <div style="position: absolute;right: 50px;">
                          <span v-if="item.curStatus==2">已完成</span>
                          <span v-if="item.curStatus==1">未完成</span>
                          <el-button type="text" class="marl20">{{item.tasScore}}分</el-button>
                        </div>
                      </template>
                      <el-table
                        :data="tableData_collapse.rows"
                        stripe
                        border
                        style="width: 100%">
                        <el-table-column fixed label="序号" type="index" width="50" align='center'></el-table-column>
                        <el-table-column prop="processDefinitionName" label="工作记录名称" show-overflow-tooltip width=""  align='center'></el-table-column>
                        <el-table-column prop="beginTime" label="开始时间" show-overflow-tooltip width=""  align='center'>
                          <template slot-scope="scope">
                            {{common._convertDate(scope.row.beginTime, 'yyyy/MM/dd hh:mm')}}
                          </template>
                        </el-table-column>
                        <el-table-column prop="endTime" label="结束时间" show-overflow-tooltip width=""  align='center'>
                          <template slot-scope="scope">
                            {{common._convertDate(scope.row.endTime, 'yyyy/MM/dd hh:mm')}}
                          </template>
                        </el-table-column>
                        <el-table-column prop="curStatus" label="状态" show-overflow-tooltip width=""  align='center'>
                          <template slot-scope="scope">
                            <el-tag v-if="scope.row.curStatus==1" type="success ">进行中</el-tag>
                            <el-tag type="warning" v-if="scope.row.curStatus==2">已结束</el-tag>
                          </template>
                        </el-table-column>
                        <el-table-column prop="taskScoreAvg" label="积分" show-overflow-tooltip width=""  align='center'></el-table-column>
                        <el-table-column fixed="right" label="工作记录" width="85" align='center'>
                          <template slot-scope="scope">
                            <el-button type="" size="small" @click='dialogFormVisible = true;opreationFormData = scope.row;'>查看</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                      <el-pagination
                        background
                        class="text-right mart10"
                        small
                        layout="total, sizes, prev, pager, next"
                        :current-page="common.elementPagination.pageNum"
                        :page-sizes="common.elementPagination.pageSizes"
                        :page-size="common.elementPagination.pageSizeDefault"
                        :total="tableData_collapse.total"
                        @size-change="pageSizeChange_collapse($event,(index+1)+'-'+item.assignee+'-'+item.assigneeType)"
                        @current-change="pageCurrentChange_collapse($event,(index+1)+'-'+item.assignee+'-'+item.assigneeType)">
                      </el-pagination> 
                    </el-collapse-item>
                  </div>
                  <div v-else class="no-data">
                    暂无数据
                  </div>
                </el-collapse>
              </el-row>
            </el-card>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item 
            label="完成记录：" prop="finsh"
            :rules="[
              { required: true, message: '请选择完成记录', trigger: 'change' }
            ]">
            <el-select filterable v-model="dialogForm.finsh" placeholder="完成记录" @change="opreationData.processDefKey=$event" v-if="!dialogForm.instanceId">
              <el-option
                v-for="item in typeArr"
                :key="item.processDefKey"
                :label="item.option_name"
                :value="item.processDefKey">
              </el-option>
            </el-select>
            <el-button v-if="!dialogForm.instanceId" type="primary" size="" @click="dialogCompleteVisible = true;query5(opreationData.processDefKey);$refs.dialogCompleteForm?$refs.dialogCompleteForm.resetFields():'';queryRepotrOrg();" class='marl10' :disabled="opreationData.processDefKey==null||opreationData.businessTask==null">添加工作记录</el-button>
            <el-button v-if="dialogForm.instanceId" type="primary" size="" @click="dialogCompleteVisible = true;query5_instanceId(dialogForm.instanceId);$refs.dialogCompleteForm?$refs.dialogCompleteForm.resetFields():'';opreationData.processDefKey='customFormTask';queryRepotrOrg();" class='marl10'>添加工作记录</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mart20" v-if="type=='page'">
          <el-form-item label-width="0">
            <div class="text-right">
              <el-button @click="back">返回</el-button>
              <el-button type="primary" @click="taskComplete(dialogForm)" v-if="isShowCompleteBtn(dialogForm)">完 成</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 表单详情-工作记录 -->
    <el-dialog title="详情" :visible.sync="dialogFormVisible" width="50vw" :show-close="true">
      <el-row v-loading="dialogLoading" :gutter="20">
        <el-col :span="24">
          <form-info :data='opreationFormData' :type='2'></form-info>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 去完成任务时，添加工作记录 -->
    <el-dialog title="添加工作记录" :visible.sync="dialogCompleteVisible" width="50vw" :show-close="true" append-to-body>
      <el-form ref="dialogCompleteForm"  :model="dialogCompleteForm" label-width="120px" v-loading="dialogLoading">
        <el-row>
          <el-col :span="24">
            <el-form-item 
              label="填写内容：" prop="finsh"
              :rules="[
                { required: false, message: '填写内容', trigger: 'blur' }
              ]">
              <el-row >
                <write-form @saveCustomForm="handleSubmit" ref='mychild' :form_list="form_list" class="costom-form-reset-style"></write-form>
              </el-row>
            </el-form-item>
          </el-col>

          <el-col :span="24" v-if="jobName=='职工首页'||jobName=='党员首页'">
            <el-form-item 
              label="汇报组织：" prop="createOrg"
              :rules="[
                { required: true, message: '请选择汇报组织', trigger: 'change' }
              ]">
              <el-radio-group v-model="dialogCompleteForm.createOrg">
                <el-radio :label="item.id" v-for="(item,index) in myReportOrg.rows" :key="index">{{item.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="审批人：" prop="multiAssignees"
              :rules="[
                { required: true, message: '请至少选择一个审批人', trigger: 'change' }
              ]">
              <approver v-if="jobName!='职工首页'&&jobName!='党员首页'" @checkChangeApprover="checkChangeApprover" ref="approverChild" :approver='dialogCompleteForm.multiAssignees'></approver>
              <approver v-if="jobName=='职工首页'||jobName=='党员首页'" @checkChangeApprover="checkChangeApprover" ref="approverChild" :approver='dialogCompleteForm.multiAssignees' :orgId="dialogCompleteForm.createOrg"></approver>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="上级审批人：" prop="superAssignees"
              :rules="[
                { required: false, message: '请至少选择一个上级审批人', trigger: 'change' }
              ]">
              <approver-sup v-if="jobName!='职工首页'&&jobName!='党员首页'" @checkChangeApproverSup="checkChangeApproverSup" ref="supApproverChild" :approver='dialogCompleteForm.superAssignees'></approver-sup>
              <approver-sup v-if="jobName=='职工首页'||jobName=='党员首页'" @checkChangeApproverSup="checkChangeApproverSup" ref="supApproverChild" :approver='dialogCompleteForm.superAssignees' :orgId="dialogCompleteForm.createOrg"></approver-sup>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCompleteVisible = false">取消</el-button>
        <el-button type="primary" @click="saveForm('dialogCompleteForm')" :loading="bottonLoding" :disabled="bottonLoding">保 存{{bottonLoding?' 中...':''}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
	import FormInfo from "../../../components/CostomFormInfo.vue"
  import FileShow from "../../../components/FileShow.vue"
  import approver from "../../../components/Approver.vue"
  import ApproverSup from "../../../components/ApproverSup.vue"
  export default {
    data() {
      return { 
        orgId:           Number(sessionStorage.getItem('Access-OrgId')),
        assessKey:       Number(sessionStorage.getItem('Access-Key')),
        jobName:         sessionStorage.getItem('jobName'),// 党员首页/职工首页/党委、党小组、党支部名称
        dialogLoading:   false,
        bottonLoding:    false,

        // 详情
        dialogForm:   {
          creator:        Number(sessionStorage.getItem('Access-Key')),
          taskName:       null,
          taskType:       [],
          createOrg:      Number(sessionStorage.getItem('Access-OrgId')),
          taskContent:    null,
          privateFiles:   [],
        },

        // 完成情况
        collapseActiveName:null,
        tableData_collapse:     {rows:[],total:0},
        searchForm_collapse:{
          pageNum:         this.common.elementPagination.pageNumDefault,
          pageSize:        this.common.elementPagination.pageSizeDefault,
        },
        opreationFormData: null,// 表单详情-工作记录
        dialogFormVisible:false,// 表单详情 -工作记录弹框

        // 完成记录
        opreationData: {// 被操作的某一个完成记录数据
          processDefKey:null,
          businessTask:null,
        },
        typeArr:      [], // 工作记录表
        dialogCompleteVisible:false,
        dialogCompleteForm:{
          multiAssignees:[],
          createOrg:   null,
          superAssignees:[],
        },
        myReportOrg:     {rows:[],total:0},
        form_list: [], //最后需要保存的表单数据
      }
    },
    components: { 
      FileShow,
      approver,
      FormInfo,
      ApproverSup
    },
    props: {
      taskId:null,
      taskStatus:null,
      type:{
        type: String,
        default: 'dialog', //dialog；page
      },
      assigneeOrg:null,
    },
    computed:{
      
    },
    watch: {
      'taskId'(newValue,oldValue){
        if(newValue){
          this.collapseActiveName=null;
          this.tableData_collapse={rows:[],total:0};
          this.view(newValue);
        }
      },
      'taskStatus'(newValue,oldValue){
        if(newValue){
          this.collapseActiveName=null;
          this.tableData_collapse={rows:[],total:0};
          this.view(this.taskId);
        }
      }
    },
    created () {
      // this.query3();
    },
    mounted() { 
      this.collapseActiveName=null;
      this.tableData_collapse={rows:[],total:0};
      this.view(this.taskId);
    },
    methods: { 
      back(){
        if(this.jobName=='党员首页'){
          this.$router.push({name: "PartyMemberHome", params: {}})
        }else if(this.jobName=='职工首页'){
          this.$router.push({name: "StaffAndWorkersHome", params: {}})
        }else if(this.jobName!='职工首页'&&this.jobName!='党员首页'){
          this.$router.push({name: "mainFunctionHome", params: {}})
        }
      },
      /**
       * 判断是否显示完成按钮以及上级任务状态
       * @param  {[type]}                 data [description]
       * @return {Boolean}                     [description]
       */
      isShowCompleteBtn(data){
        let that = this;
        let assignee = (this.jobName!='职工首页'&&this.jobName!='党员首页') ? that.orgId :　that.assessKey
        let result = false;
        if(data.assigneeVos&&data.assigneeVos.length>0){
          data.assigneeVos.forEach( function(element, index) {
            if(assignee==element.assignee){
              element.curStatus==1?result = true:result = false;
            }
          });
        }
        return result;
      },
      /**
       * 提交情况 折叠面板的change事件
       * @author chuanlin.Xiao
       * @date   2020-01-10T15:47:51+0800
       * @param  {[type]}                 val [description]
       * @return {[type]}                     [description]
       */
      collapseChange(val){

        let index = Number(val.split('-')[0]);// 序号
        let id    = Number(val.split('-')[1]);// 组织或用户id
        let type  = Number(val.split('-')[2]);// 类型,1用户，2组织

        this.searchForm_collapse.pageNum = 1;
        this.searchForm_collapse.pageSize = 10;

        val==''?'':this.query11(id,type);
      },
      /**
       * 判断只显示当前组织或用户
       * @return {[type]} [description]
       */
      judge_collapse(item){
        let result = true
        if(this.jobName=='职工首页'||this.jobName=='党员首页'){
          if(this.assigneeOrg){
            this.assigneeOrg==item.assignee?result = true:result = false
          }else{
            this.assessKey==item.assignee?result = true:result = false
          }
        }else{
          this.orgId==item.assignee?result = true:result = false
        }
        return result;
      },
      /**
       * 分页
       * @author chuanlin.Xiao
       * @date   2020-01-06T10:13:24+0800
       * @param  {[type]}                 val [description]
       * @return {[type]}                     [description]
       */
      pageSizeChange_collapse(val,data) {
        let index = Number(data.split('-')[0]);// 序号
        let id    = Number(data.split('-')[1]);// 组织或用户id
        let type  = Number(data.split('-')[2]);// 类型,1用户，2组织

        this.searchForm_collapse.pageSize = val
        this.query11(id,type)
      },
      pageCurrentChange_collapse(val,data) {
        let index = Number(data.split('-')[0]);// 序号
        let id    = Number(data.split('-')[1]);// 组织或用户id
        let type  = Number(data.split('-')[2]);// 类型,1用户，2组织

        this.searchForm_collapse.pageNum = val
        this.query11(id,type)
      },
      /**
       * 选中时的广播事件
       * @param  {[type]}                 data [description]
       * @param  {[type]}                 type [description]
       * @return {[type]}                      [description]
       */
      checkChangeApprover(data){
        this.dialogCompleteForm.multiAssignees = data
      },
      checkChangeApproverSup(data){
        this.dialogCompleteForm.superAssignees = data
      },

      /**
       * 查看详情
       * @author chuanlin.Xiao
       * @date   2020-03-18T09:23:50+0800
       * @param  {[type]}                 id [description]
       * @return {[type]}                    [description]
       */
      view(id){
        this.dialogLoading = true;
        this.axios.get(`${this.common.basePath}/task/${id}`).then((response) => {
          this.dialogForm = response.data;
          this.dialogForm.privateFiles = JSON.parse(response.data.privateFiles);
          this.opreationData.businessTask = response.data.id;
          this.query3(response.data.taskTypeId)
          this.dialogLoading = false;
        }).catch((errorMsg) => {
          this.dialogLoading = false;
          this.$message.error(errorMsg);
        }) 
      },
      /**
       * 获取历史的实例 - 提交情况
       * @author chuanlin.Xiao
       * @date   2020-01-10T15:19:18+0800
       * @param  {[type]}                 id,type [description]
       * @return {[type]}                          [description]
       */
      query11(id,type) {  
        let form = {processVariables:{businessTask:this.dialogForm.id,createOrg:id,createUser:id},pageNum:this.searchForm_collapse.pageNum,pageSize:this.searchForm_collapse.pageSize}
        type==1? form.processVariables.createOrg = null : delete form.processVariables.createUser
        this.axios.post(`${this.common.basePath}/workflow/instance/history`,form).then((response) => {
          this.tableData_collapse = response.data ? response.data : {rows:[],total:0};
        }).catch((errorMsg) => {
          this.$message.error(errorMsg);
        }) 
      }, 
      /**
       * 获取完成记录类型
       * @author chuanlin.Xiao
       * @date   2020-01-07T15:56:07+0800
       * @return {[type]}                 [description]
       */
      query3(taskType) {  
        this.axios.post(`${this.common.basePath}/workflow/option/find_list?menuId=${taskType}`,{menuId:taskType}).then((response) => {
          this.typeArr = response.data ? response.data : '';
        }).catch((errorMsg) => {
          this.$message.error(errorMsg);
        })  
      },
      /**
       * 通过processDefKey，获取工作记录流程创建表单
       * @author chuanlin.Xiao
       * @date   2020-01-07T16:49:34+0800
       * @param  {[type]}                 id [description]
       * @return {[type]}                    [description]
       */
      query5(processDefKey) { 
        this.dialogLoading = false;
        let that = this;
        this.axios.get(`${this.common.basePath}/workRecord/first/form?processDefKey=${processDefKey}`).then((response) => {
          
          // this.form_list = response.data.formData
          let form_list = response.data.formData
          this.form_list = this.common.returnActivitiFormList(form_list);

          this.dialogLoading =  false;
        }).catch((errorMsg) => {
          this.dialogLoading =  false; 
          this.$message.error(errorMsg);
        })  
      },
      /**
       * 通过instanceId，获取工作记录流程创建表单
       * @author chuanlin.Xiao
       * @date   2020-01-07T16:49:34+0800
       * @param  {[type]}                 id [description]
       * @return {[type]}                    [description]
       */
      query5_instanceId(instanceId) { 
        this.dialogLoading = false;
        let that = this;
        this.axios.get(`${this.common.basePath}/workRecord/deployment?deploymentId=${instanceId}`).then((response) => {
          
          // this.form_list = response.data.formData
          let form_list = response.data.formData
          this.form_list = this.common.returnActivitiFormList(form_list);

          this.dialogLoading =  false;
        }).catch((errorMsg) => {
          this.dialogLoading =  false; 
          this.$message.error(errorMsg);
        })  
      },
      /**
       * 获取我的汇报组织
       * @return {[type]} [description]
       */
      queryRepotrOrg() {  
        this.myReportOrg = {rows:[],total:0}
        this.axios.post(`${this.common.basePath}/party/oneByUserId?id=${sessionStorage.getItem('Access-Key')}`, '').then((response) => {
          const { data } = response;
          data.party_committee_id ? this.myReportOrg.rows.push({id: data.party_committee_id, name: data.party_committee_name, partyNature: 1}) : '';
          data.party_branch_id ? this.myReportOrg.rows.push({id: data.party_branch_id, name: data.party_branch_name, partyNature: 2}) : '';
          data.party_group_id ? this.myReportOrg.rows.push({id: data.party_group_id, name: data.party_group_name, partyNature: 3}) : '';

          this.dialogCompleteForm.createOrg = this.myReportOrg.rows.length>0 ? this.myReportOrg.rows[0].id : null;
        }).catch((errorMsg) => { 
          this.$message.error(errorMsg)
        })
      },

      /**
       * 保存表单，添加工作记录
       * @author chuanlin.Xiao
       * @date   2020-01-14T10:34:50+0800
       * @return {[type]}                 [description]
       */
      saveForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.bottonLoding = true;
            this.$refs.mychild.handleSubmit();  
          } else {
            return false;
          }
        });
      },
      /**
       * 提交工作记录流程创建表单，点击保存按钮；去完成任务，创建工作记录
       * @param  {[type]} name [description]
       * @return {[type]}      [description]
       */
      handleSubmit(foromData) { 
        let obj = {}
        foromData.forEach( function(element, index) {
          obj[element.obj.name] = element.obj.value;
        });
        let data = this.opreationData;

        this.$refs.dialogCompleteForm.validate((valid) => {
          if (valid) {
            // 去完成任务，创建工作记录
            let form = obj;
            form.multiAssignees = this.dialogCompleteForm.multiAssignees
            form.superAssignees = this.dialogCompleteForm.superAssignees
            form.businessTask = data.businessTask;
            form.processDefKey = data.processDefKey;
            if(this.jobName=='职工首页'||this.jobName=='党员首页'){
              if(this.assigneeOrg){
                form.createOrg = this.assigneeOrg
              }else{
                form.createOrg = null
              }
            }else{
              form.createOrg = Number(sessionStorage.getItem('Access-OrgId'))
            }
            form.createUser = Number(sessionStorage.getItem('Access-Key'));
            this.axios.post(`${this.common.basePath}/workRecord/add`,form).then((response) => {
              this.$message.success(response.meta.message);
              this.view(this.taskId);
              this.bottonLoding = false;
              this.dialogCompleteVisible = false;
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
       * 完成任务，结束任务
       * @author chuanlin.Xiao
       * @date   2020-01-10T18:53:12+0800
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      taskComplete(data){
        this.$confirm('此操作将完成该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            partyOrgId:this.orgId,userId:this.assessKey,id:data.id
          }
          if(this.jobName=='职工首页'||this.jobName=='党员首页'){delete params.partyOrgId;}
          this.axios.get(this.jobName=='职工首页'||this.jobName=='党员首页'?`${this.common.basePath}/task/complete`:`${this.common.basePath}/task/complete/org`,{params:params}).then((response) => {
            this.$emit("completeTask", response)
          }).catch((errorMsg) => {
            this.$message.error(errorMsg);
          }) 
        }).catch(() => {});
      },

    },
  }
</script>

<style scoped lang="less"> 
  
</style>
