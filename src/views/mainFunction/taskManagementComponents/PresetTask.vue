/*************** 预设动作（职工和党员、工作台） *************/

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
            <el-breadcrumb-item>预设动作</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
        <div class="theme-main"> 
          <!-- 搜索条件 -->
          <el-card class="marb20">
            <el-form :inline="true" :model="searchForm" ref="searchForm" size="small">
              <el-form-item label="关键字" prop="keyWords">
                <el-input v-model="searchForm.keyWords" placeholder="关键字"></el-input>
              </el-form-item>
              <el-form-item label="预设类型" prop="jobCycleType">
                <el-select v-model="searchForm.jobCycleType" placeholder="类型">
                  <el-option label="临时" :value="1"></el-option>
                  <el-option label="循环" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="任务类型" prop="jobType">
                <el-select v-model="searchForm.jobType" placeholder="类型">
                  
                  <el-option label="通知" :value="1"></el-option>
                  <el-option label="任务" :value="2"></el-option>
                  <el-option label="组织任期" :value="3"></el-option>
                </el-select>
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
              <span :class="{'el-card-have-border-span':jobName!='职工首页'&&jobName!='党员首页'}">预设任务列表</span>  
              <div class="el-card-head-btn">
                <el-button type="primary" size="small" @click="add('dialogForm',1)" v-if="jobName!='职工首页'&&jobName!='党员首页'" icon="el-icon-plus">党员预设</el-button>
                <el-button type="primary" size="small marl10" @click="add('dialogForm',2)" v-if="jobName!='职工首页'&&jobName!='党员首页'" icon="el-icon-plus">组织预设</el-button>
              </div>
            </div>  
            <el-row>
              <el-table
                :data="tableData.rows"
                stripe
                border
                style="width: 100%">
                <el-table-column fixed label="序号" type="index" width="50" align='center'></el-table-column>
                <el-table-column prop="jobType" label="任务类型" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{scope.row.jobType==1?'通知':''}}
                    {{scope.row.jobType==2?'任务':''}}
                    {{scope.row.jobType==3?'组织任期':''}}
                  </template>
                </el-table-column>
                <el-table-column prop="jobName" label="任务标题" show-overflow-tooltip width=""  align='center'></el-table-column>
                <el-table-column prop="jobCycleType" show-overflow-tooltip width="" label="预设类型"  align='center'>
                  <template slot-scope="scope">
                    {{scope.row.jobCycleType==1?'临时':'循环'}}
                  </template>
                </el-table-column>
                <el-table-column prop="nextTime" label="下一次执行时间" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{common._convertDate(scope.row.nextTime, 'yyyy/MM/dd hh:mm')}}
                  </template>
                </el-table-column>
                <el-table-column prop="cycleMonth" label="执行周期" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    <span v-if="scope.row.jobCycleType==2">{{scope.row.cycleMonth}}{{scope.row.cycleType==1?'月':'天'}}</span>
                    <span v-else>无周期</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="keyWords" label="关键字" show-overflow-tooltip width=""  align='center'></el-table-column> -->
                <el-table-column fixed="right" label="操作" width="240" align='center'>
                  <template slot-scope="scope">
                    <el-button @click="edit('dialogForm',scope.row)" type="primary" size="small">编辑</el-button>
                    <el-button type="warning" size="small" @click="disabled(scope.row)">{{scope.row.curStatus==2?'启用':'禁用'}}</el-button>
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
    <!-- 创建/编辑 -->
    <el-dialog :title="dialogType=='edit'?'编辑预设任务':'创建预设任务'" :visible.sync="dialogVisible" width="50vw">
      <el-form ref="dialogForm"  :model="dialogForm" label-width="120px" v-loading="dialogLoading">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="动作类型：" prop="jobCycleType"
              :rules="[
                { required: true, message: '请选择动作类型', trigger: 'change' }
              ]">
              <el-select v-model="dialogForm.jobCycleType" placeholder="动作类型">
                <el-option label="临时" :value="1"></el-option>
                <el-option label="循环" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="周期：" prop="cycleMonth"
              :rules="[
                { required: dialogForm.jobCycleType==2, message: '请输入周期', trigger: 'blur' }
              ]">
              <div v-if="dialogForm.jobCycleType==1">
                无周期
              </div>
              <div v-else>
                <el-input-number v-model="dialogForm.cycleMonth" controls-position="right" :min="0" :disabled="dialogForm.jobCycleType==1"></el-input-number>
                <el-select v-model="dialogForm.cycleType" placeholder="请选择" style="width:60px" :disabled="dialogForm.jobCycleType==1">
                  <el-option label="月" :value="1"></el-option>
                  <el-option label="天" :value="2"></el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="预设类型：" prop="jobType"
              :rules="[
                { required: true, message: '请选择预设类型', trigger: 'change' }
              ]">
              <el-select v-model="dialogForm.jobType" placeholder="预设类型">
                
                <el-option label="通知" :value="1"></el-option>
                <el-option label="任务" :value="2"></el-option>
                <el-option label="组织任期" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="首次创建：" prop="beginTime"
              :rules="[
                { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
              ]">
              <el-date-picker type="date" placeholder="选择日期" v-model="dialogForm.beginTime" value-format="timestamp"></el-date-picker>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item 
              label="标题：" prop="jobName"
              :rules="[
                { required: true, message: '请输入标题', trigger: 'blur' }
              ]">
              <el-input :maxlength="20" :show-word-limit="false" v-model="dialogForm.jobName" placeholder="标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="关键词：" prop="keyWords"
              :rules="[
                { required: false, message: '请输入关键词', trigger: 'blur' }
              ]">
              <el-input :maxlength="20" :show-word-limit="false" v-model="dialogForm.keyWords" placeholder="关键词"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="内容：" prop="jobContent"
              :rules="[
                { required: false, message: '请输入内容', trigger: 'blur' }
              ]">
              <el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="dialogForm.jobContent" placeholder="内容..."></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="附件：" prop="jobFiles"
              :rules="[
                { validator: checkFiles, trigger: 'blur' }
              ]">
              <upload :buttonText="dialogForm.jobFiles&&dialogForm.jobFiles.length>0?'重新上传':'点击上传'" :url="'/file'" :fileTypes="[]" :data="myFileData" @uploadSuccess="(response) => {uploadFileSuccess(response,'file')}"/>
              <!-- <span>只能上传jpg/png/gif文件，且不超过2M</span> -->
              <file-show :fileList="dialogForm.jobFiles?JSON.parse(dialogForm.jobFiles):[]" :closable="true" @handleClose="handleClose"></file-show>
            </el-form-item>
          </el-col> 
          <div v-if="jobName!='职工首页'&&jobName!='党员首页'">
            <el-col :span="24" v-if="createTaskType==1">
              <el-form-item 
                label="通知范围：" prop="candidateUser"
                :rules="[
                  { type: 'array', required: true, message: '请至少选择一个', trigger: 'change' }
                ]">
                <range :type="1" @checkChange="checkChange" ref="child" :person='dialogForm.candidateUser' :dialogType="dialogType"></range>
              </el-form-item>
            </el-col> 
            <el-col :span="24" v-if="createTaskType==2">
              <el-form-item 
                label="通知范围：" prop="candidateOrg"
                :rules="[
                  { type: 'array', required: true, message: '请至少选择一个', trigger: 'change' }
                ]">
                <range 
                  :type="2" 
                  @checkChange="checkChange" 
                  ref="child" 
                  :org='dialogForm.candidateOrg' 
                  :dialogType="dialogType"></range>
              </el-form-item>
            </el-col> 
          </div>
            
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('dialogForm')" :loading="bottonLoding" :disabled="bottonLoding">{{dialogType=='edit'?'保 存':'发 布'}}{{bottonLoding?' 中...':''}}</el-button>
      </div>
    </el-dialog>
  </el-row>  
</template>

<script>
  import upload from "../../../components/Upload.vue"
  import FileShow from "../../../components/FileShow.vue"
  import range from "../../../components/Range.vue"
  export default {
    data() {
      return { 
        orgId:           Number(sessionStorage.getItem('Access-OrgId')),
        assessKey:       Number(sessionStorage.getItem('Access-Key')),
        isLoad:          true,
        jobName:         sessionStorage.getItem('jobName'),// 党员首页/职工首页/党委、党小组、党支部名称
        bottonLoding:    false,

        searchForm:{
          pageNum:     this.common.elementPagination.pageNumDefault,
          pageSize:    this.common.elementPagination.pageSizeDefault,
          jobType:     null,
          jobCycleType:null,
          keyWords:    null,
          orgId:       Number(sessionStorage.getItem('Access-OrgId')),
        },

        tableData:    {rows:[],total:0},

        dialogVisible:false,
        dialogLoading:false,
        dialogType:'add',
        createTaskType: 1,//1 表示创建党员预设、2表示创建组织预设（下级预设）
        dialogForm:   {
          creator:        Number(sessionStorage.getItem('Access-Key')),
          creatorOrg:     Number(sessionStorage.getItem('Access-OrgId')),
          jobType:        null,
          cycleMonth:     0,
          cycleType:      1,
          beginTime:      null,
          jobCycleType:   null,
          jobName:        null,
          keyWords:       null,
          jobContent:     null,
          jobFiles:       null,
          candidateOrg:   [],
          candidateUser:  [], 
        },
      }
    },
    computed:{
      myFileData(){
        return {type:'presetTaskFile',userId:this.assessKey};
      },
    },
    components: { 
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
        this.dialogForm.jobFiles = JSON.stringify([response])
      },
      /**
       * 点击删除文件
       * @author chuanlin.Xiao
       * @date   2020-01-06T14:59:36+0800
       * @param  {[type]}                 tag [description]
       * @return {[type]}                     [description]
       */
      handleClose(tag) {
        this.dialogForm.jobFiles = null;
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
        type=='org'?this.dialogForm.candidateOrg = data:this.dialogForm.candidateUser = data;
      },

      /**
       * 查询
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:18:28+0800
       * @return {[type]}                 [description]
       */
      query() {  
        let form = this.searchForm;
        if(this.jobName=='职工首页'||this.jobName=='党员首页'){delete form.orgId; form.userId=this.assessKey}
        this.axios.post(`${this.common.basePath}/job/list`,form).then((response) => {
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
       
        this.createTaskType = data;
        this.dialogVisible = true;
        this.dialogType = 'add';
        this.$refs[formName]?this.$refs[formName].resetFields():'';
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
      
        this.dialogType = 'edit';
        this.dialogVisible = true;
        this.dialogLoading = true;
        this.axios.get(`${this.common.basePath}/job/detail`,{params:{id:data.id}}).then((response) => {
          this.dialogForm = response.data;
          this.createTaskType = response.data.candidateUser?1:2;
          this.dialogLoading = false;
        }).catch((errorMsg) => {
          this.dialogLoading = false;
          this.$message.error(errorMsg);
        })  
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
            if(this.dialogType == 'add'){
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
              }
              if(this.createTaskType==1){form.candidateUser=this.dialogForm.candidateUser}else{form.candidateOrg=this.dialogForm.candidateOrg}
              
              this.axios.post(`${this.common.basePath}/job`,form).then((response) => {
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
                id:            this.dialogForm.id, 
              }
              if(this.createTaskType==1){form.candidateUser=this.dialogForm.candidateUser}else{form.candidateOrg=this.dialogForm.candidateOrg}
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
       * 禁用
       * @author chuanlin.Xiao
       * @date   2020-01-06T17:48:30+0800
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      disabled(data){
        this.$confirm('此操作将'+(data.curStatus==1?'禁用':'启用')+'该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post(`${this.common.basePath}/job/forbidden?id=${data.id}`).then((response) => {
            this.$message.success(response.meta.message);
            this.query();
          }).catch((errorMsg) => {
            this.$message.error(errorMsg);
          }) 
        }).catch(() => {});
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
          this.axios.delete(`${this.common.basePath}/job?id=${data.id}`).then((response) => {
            this.$message.success(response.meta.message);
            this.query();
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
