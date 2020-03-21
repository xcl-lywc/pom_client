/*************** 下级通知/组织通知（工作台） *************/

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
            <el-breadcrumb-item>组织通知</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
        <div class="theme-main"> 
          <!-- 搜索条件 -->
          <el-card class="marb20">
            <el-form :inline="true" :model="searchForm" ref="searchForm" size="small">
              <el-form-item label="标题" prop="keyWords">
                <el-input v-model="searchForm.keyWords" placeholder="标题"></el-input>
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
              <span :class="{'el-card-have-border-span':jobName!='职工首页'&&jobName!='党员首页'}">组织通知列表</span>  
              <div class="el-card-head-btn">
                <el-button type="primary" size="small" @click="add('dialogForm',1)" v-if="jobName!='职工首页'&&jobName!='党员首页'" icon="el-icon-plus">党员通知</el-button>
                <el-button type="primary" size="small marl10" @click="add('dialogForm',2)" v-if="jobName!='职工首页'&&jobName!='党员首页'" icon="el-icon-plus">组织通知</el-button>
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
                <!-- <el-table-column prop="read" label="状态" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    <el-tag v-if="!scope.row.read">未读</el-tag>
                    <el-tag type="success" v-if="scope.row.read">已读</el-tag>
                  </template>
                </el-table-column> -->
                <el-table-column fixed="right" label="操作" width="100" align='center'>
                  <template slot-scope="scope">
                    <!-- <el-button type="" size="small" @click='dialogDetailVisible=true;view(scope.row);!scope.row.read?read(scope.row):""'>查看</el-button> -->
                    <el-button type="" size="small" @click='dialogDetailVisible=true;view(scope.row);'>查看</el-button>
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

    <!-- 创建/编辑 -->
    <el-dialog :title="dialogType=='edit'?'编辑通知':'创建通知'" :visible.sync="dialogVisible" width="50vw">
      <el-form ref="dialogForm"  :model="dialogForm" label-width="120px" v-loading="dialogLoading">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="通知标题：" prop="taskName"
              :rules="[
                { required: true, message: '请输入任务标题', trigger: 'blur' }
              ]">
              <el-input :maxlength="20" :show-word-limit="false" v-model="dialogForm.taskName" placeholder="任务标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="关键字：" prop="keyWords"
              :rules="[
                { required: false, message: '请输入关键字', trigger: 'blur' }
              ]">
              <el-input :maxlength="20" :show-word-limit="false" v-model="dialogForm.keyWords" placeholder="关键字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="通知内容：" prop="taskContent"
              :rules="[
                { required: false, message: '请输入内容', trigger: 'blur' }
              ]">
              <el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="dialogForm.taskContent" placeholder="内容..."></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="附件：" prop="privateFiles"
              :rules="[
                { validator: checkFiles, trigger: 'blur' }
              ]">
              <upload :buttonText="dialogForm.privateFiles&&dialogForm.privateFiles.length>0?'重新上传':'点击上传'" :url="'/file'" :fileTypes="[]" :data="myFileData" @uploadSuccess="(response) => {uploadFileSuccess(response, 'file')}"/>
              <!-- <span>只能上传jpg/png/gif文件，且不超过2M</span> -->
              <file-show :fileList="dialogForm.privateFiles?JSON.parse(dialogForm.privateFiles):[]" :closable="true" @handleClose="handleClose"></file-show>
            </el-form-item>
          </el-col>  

          <el-col :span="24" v-if="createTaskType==1">
            <el-form-item 
              label="接收人：" prop="assigneeList"
              :rules="[
                { type: 'array', required: true, message: '请至少选择一个', trigger: 'change' }
              ]">
              <range :type="1" @checkChange="checkChange" ref="child" :person='dialogForm.assigneeList' :dialogType="dialogType"></range>
            </el-form-item>
          </el-col> 
          <el-col :span="24" v-if="createTaskType==2">
            <el-form-item 
              label="接收组织：" prop="candidateOrgList"
              :rules="[
                { type: 'array', required: true, message: '请至少选择一个', trigger: 'change' }
              ]">
              <range :type="2" @checkChange="checkChange" ref="child" :org='dialogForm.candidateOrgList' :dialogType="dialogType"></range>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('dialogForm')" :loading="bottonLoding" :disabled="bottonLoding">{{dialogType=='edit'?'保 存':'发 布'}}{{bottonLoding?' 中...':''}}</el-button>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog title="通知详情" :visible.sync="dialogDetailVisible" width="50vw">
      <el-form v-if="dialogDetailForm" label-width="120px" v-loading="dialogLoading">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="创建单位：" prop="createOrgName">
              {{dialogDetailForm.createOrgName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="提醒类型：" prop="taskTypeName">
              {{dialogDetailForm.taskTypeName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="通知标题：" prop="taskName">
              {{dialogDetailForm.taskName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="发布时间：" prop="createTime">
              {{common._convertDate(dialogDetailForm.createTime, 'yyyy/MM/dd hh:mm')}}
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item 
              label="截止时间：" prop="endTime">
              {{common._convertDate(dialogDetailForm.endTime, 'yyyy/MM/dd hh:mm')}}
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item 
              label="关键字：" prop="keyWords">
              {{dialogDetailForm.keyWords}}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              :label="toNoticeLabel(dialogDetailForm.assigneeVos)+'：'" prop="assigneeVos">
              <el-table
                :show-header = 'false'
                :row-class-name="setClassName"
                :data="dialogDetailForm.assigneeVos?dialogDetailForm.assigneeVos:[]"
                style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-card class="box-card-expand">
                      <div slot="header">
                        <span>班子成员</span>
                      </div>
                      <el-table
                        :data="scope.row.orgAssigneeDetail?scope.row.orgAssigneeDetail:[]"
                        :show-header = 'false'
                        style="width: 100%">
                        <el-table-column prop="assigneeName" label="名称" width=""></el-table-column>
                        <el-table-column prop="read" label="状态" width="">
                          <template slot-scope="scopes">
                            <el-tag v-if="!scopes.row.read">未读</el-tag>
                            <el-tag v-if="scopes.row.read" type="success">已读</el-tag>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-card>
                  </template>
                </el-table-column>
                <el-table-column prop="assigneeName" label="名称" width=""></el-table-column>
                <el-table-column prop="read" label="状态" width="">
                  <template slot-scope="scope" v-if="scope.row.assigneeType==1">
                    <el-tag v-if="!scope.row.read">未读</el-tag>
                    <el-tag v-if="scope.row.read" type="success">已读</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="通知内容：" prop="taskContent">
              <!-- <el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="dialogDetailForm.taskContent" disabled></el-input> -->
              <div class="desc-box">{{dialogDetailForm.taskContent}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="附件：" prop="privateFiles">
              <file-show :fileList="dialogDetailForm.privateFiles?JSON.parse(dialogDetailForm.privateFiles):[]" :closable="false"></file-show>
            </el-form-item>
          </el-col>   
        </el-row>
      </el-form>
    </el-dialog>
  </el-row>  
</template>

<script>
  import LeftMenu from '../components/LeftMenu'
  import upload from "../../../components/Upload.vue"
  import FileShow from "../../../components/FileShow.vue"
  import range from "../../../components/Range.vue"
  export default {
    data() {
      return { 
        positionUserRelationId:Number(sessionStorage.getItem('Access-PositionUserRelationId')),
        orgId:                 Number(sessionStorage.getItem('Access-OrgId')),
        assessKey:             Number(sessionStorage.getItem('Access-Key')),
        isLoad:                true,
        // pageTyppe:             this.$route.fullPath.split('/')[1],//'staffandworkers'职工  'partymember'党员 ‘mainFunction’党委、党小组、党支部
        jobName:               sessionStorage.getItem('jobName'),// 党员首页/职工首页/党委、党小组、党支部名称
        partyNature:           this.$store.state.partyNature ? this.$store.state.partyNature : sessionStorage.getItem('partyNature'), //组织类型
        bottonLoding:          false,

        searchForm:{
          pageNum:    this.common.elementPagination.pageNumDefault,
          pageSize:   this.common.elementPagination.pageSizeDefault,
          value:      null,
          keyWords:   null,
          partyOrgId: Number(sessionStorage.getItem('Access-OrgId')),
        },

        tableData:    {rows:[],total:0},

        dialogVisible:false,
        dialogLoading:false,
        dialogType:'add',
        createTaskType: 1,//1 表示创建党员通知、2表示创建组织通知（下级任务）
        dialogForm:   {
          creator:         Number(sessionStorage.getItem('Access-Key')),
          taskName:        null,
          keyWords:        null,
          createOrg:       Number(sessionStorage.getItem('Access-OrgId')),
          taskContent:     null,
          privateFiles:    null,
          candidateOrgList:[],
          assigneeList:    [], 

          checkAll:        false,
          isIndeterminate: true,
        },

        dialogDetailVisible:false,
        dialogDetailForm:   {
          
        },

        activeId:null,// 被激活的组织
      }
    },
    computed:{
      myFileData(){
        return {type:'superiorreminderTaskFile',userId:this.assessKey};
      },
    },
    components: { 
      LeftMenu,
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
    },
    methods: { 
      toNoticeLabel(data){
        let result = '通知单位';
        if(data&&data.length>0){
          data[0].assigneeType==1?result = '通知人':'';
        }
        return result;
      },
      /**
       * 解决Vue的表格中，expand只有某些行需要展开的问题。
       */
      setClassName({row, index}){
        // 通过自己的逻辑返回一个class或者空
        return row.assigneeType==1 ? 'custom-expand' : '';
      },
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
        this.dialogForm.privateFiles = JSON.stringify([response])
      },
      /**
       * 点击删除文件
       * @author chuanlin.Xiao
       * @date   2020-01-06T14:59:36+0800
       * @param  {[type]}                 tag [description]
       * @return {[type]}                     [description]
       */
      handleClose(tag) {
        this.dialogForm.privateFiles = null;
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
       * 选中时的广播事件
       * @author chuanlin.Xiao
       * @date   2020-01-09T14:29:56+0800
       * @param  {[type]}                 data [description]
       * @param  {[type]}                 type [description]
       * @return {[type]}                      [description]
       */
      checkChange(data,type){
        console.log(data,type)
        type=='org'?this.dialogForm.candidateOrgList = data:this.dialogForm.assigneeList = data;
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
        this.axios.post(this.jobName=='职工首页'||this.jobName=='党员首页'?`${this.common.basePath}/notice/all`:`${this.common.basePath}/notice/org`,form).then((response) => {
          this.tableData = response.data ? response.data : {rows:[],total:0}
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg);
        })  
      }, 

      /**
       * 创建/添加
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:50:07+0800
       * @param  {[type]}                 formName [description]
       * @param  {[type]}                 data     [description]
       */
      add(formName,data){
        this.$refs.child!=undefined?this.$refs.child.activeId = this.orgId:'';
        this.$refs.child!=undefined?this.$refs.child.org_ = []:'';
        this.$refs.child!=undefined?this.$refs.child.person_ = []:'';
        this.$refs.child!=undefined?this.$refs.child.checkAll = false:'';
        this.$refs.child!=undefined?this.$refs.child.isIndeterminate = true:'';
        // this.activeId = null;
        this.createTaskType = data;
        this.dialogVisible = true;
        this.dialogType = 'add';
        this.$refs[formName]?this.$refs[formName].resetFields():'';
        this.dialogForm.checkAll         = false;
        this.dialogForm.isIndeterminate  = true;
      },
      /**
       * 编辑
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:50:07+0800
       * @param  {[type]}                 formName [description]
       * @param  {[type]}                 data     [description]
       */
      edit(formName,data){
        this.$refs.child!=undefined?this.$refs.child.activeId = this.orgId:'';
        // this.activeId = null;
        this.dialogType = 'edit';
        this.dialogVisible = true;
        this.dialogLoading = true;
        this.axios.get(`${this.common.basePath}/job/detail`,{params:{id:data.id}}).then((response) => {
          this.dialogForm = response.data;
          this.dialogLoading = false;
        }).catch((errorMsg) => {
          this.dialogLoading = false;
          this.$message.error(errorMsg);
        })  
        // this.$refs[formName]?this.$refs[formName].resetFields():'';
        // this.dialogForm.checkAll         = false;
        // this.dialogForm.isIndeterminate  = true;
      },
      /**
       * 提交表单
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:48:04+0800
       * @param  {[type]}                 formName [description]
       * @return {[type]}                          [description]
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.bottonLoding = true;
            // this.dialogVisible = false;
            if(this.dialogType == 'add'){
              let form = {
                creator:         this.dialogForm.creator,
                createOrg:       this.dialogForm.createOrg,
                taskName:        this.dialogForm.taskName,
                keyWords:        this.dialogForm.keyWords,
                taskContent:     this.dialogForm.taskContent,
                privateFiles:    this.dialogForm.privateFiles,
                candidateOrgList:this.dialogForm.candidateOrgList,
                assigneeList:    this.dialogForm.assigneeList,
              }
              this.axios.post(`${this.common.basePath}/notice`,form).then((response) => {
                this.$message.success(response.meta.message);
                this.query();
                this.bottonLoding = false;
                this.dialogVisible = false;
              }).catch((errorMsg) => {
                this.bottonLoding = false;
                this.$message.error(errorMsg);
              })  
            }else{
              let form = {
                creator:       this.dialogForm.creator,
                creatorOrg:    this.dialogForm.creatorOrg,
                jobType:       this.dialogForm.jobType,
                cycleMonth:    this.dialogForm.cycleMonth,
                cycleType:     this.dialogForm.cycleType,
                beginTime:     this.dialogForm.beginTime,
                jobCycleType:  this.dialogForm.jobCycleType,
                jobName:       this.dialogForm.jobName,
                keyWords:      this.dialogForm.keyWords,
                jobContent:    this.dialogForm.jobContent,
                jobFiles:      this.dialogForm.jobFiles,
                candidateOrgList:  this.dialogForm.candidateOrgList,
                assigneeList: this.dialogForm.assigneeList, 
                id:            this.dialogForm.id, 
              }
              this.axios.put(`${this.common.basePath}/job`,form).then((response) => {
                this.$message.success(response.meta.message);
                this.query();
                this.bottonLoding = false;
                this.dialogVisible = false;
              }).catch((errorMsg) => {
                this.bottonLoding = false;
                this.$message.error(errorMsg);
              }) 
            }
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
       * 查看详情
       * @author chuanlin.Xiao
       * @date   2020-01-07T17:36:13+0800
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      view(data){
        this.dialogLoading = true;
        this.axios.get(`${this.common.basePath}/notice/${data.id}`).then((response) => {
          this.dialogDetailForm = response.data;
          this.dialogLoading = false;
        }).catch((errorMsg) => {
          this.dialogLoading = false;
          this.$message.error(errorMsg);
        }) 
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
  .custom-expand .el-table__expand-column .cell {
    display: none;
  }
  .box-card-expand .el-card__header{
    padding: 0px 20px;
  }
</style>
