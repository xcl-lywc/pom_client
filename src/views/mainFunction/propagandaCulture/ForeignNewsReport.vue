/*************** 宣传文化（党委、党支部、党小组 对外新闻宣传报道记录表） *************/
<template>
  <el-row>
    <div class="content-wrap"> 
      <div class="content-wrap-box">
        <el-card class="content-title-card" shadow="never">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
            <el-breadcrumb-item>宣传文化</el-breadcrumb-item>
            <el-breadcrumb-item>对外新闻宣传报道记录表</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
        <div class="theme-main"> 
          <!-- 搜索条件 -->
          <el-card class="marb20">
            <el-form :inline="true" :model="searchForm" ref="searchForm" size="small">
              <el-form-item label="关键字" prop="keyWords">
                <el-input v-model="searchForm.keyWords" placeholder="输入与投稿人与内容相关的关键字" class="w400"></el-input>
              </el-form-item>
              <el-form-item label="日期" prop="dateVal">
                <el-date-picker
                  v-model="searchForm.dateVal"
                  type="datetimerange"
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
              <span class="el-card-have-border-span">对外新闻报道情况记载表</span>  
              <div class="el-card-head-btn">
                <el-button type="primary" size="small" @click="add('dialogForm',1)">添 加</el-button>
              </div>
            </div>  
            <el-row>
              <el-table
                :data="tableData.rows"
                stripe
                border
                style="width: 100%">
                <el-table-column fixed label="序号" type="index" width="50" align='center'></el-table-column>
                <el-table-column prop="contributorTime" label="投稿时间" show-overflow-tooltip width="120"  align='center'>
                  <template slot-scope="scope">
                    {{common._convertDate(scope.row.contributorTime, 'yyyy年MM月dd日')}}
                  </template>
                </el-table-column>
                <el-table-column prop="drafter" label="拟稿人" show-overflow-tooltip width="120"  align='center'></el-table-column>
                <el-table-column prop="contributionContent" label="稿件内容" show-overflow-tooltip width=""  align='center'></el-table-column>
                <el-table-column prop="contributionFiles" label="投稿刊物" show-overflow-tooltip width="200"  align='center'>
                  <template slot-scope="scope">
                    <file-show :fileList="scope.row.contributionFiles?JSON.parse(scope.row.contributionFiles):[]" :closable="false"></file-show>
                  </template>
                </el-table-column>
                <el-table-column prop="situation" label="刊用情况" show-overflow-tooltip width=""  align='center'></el-table-column>
                <el-table-column fixed="right" label="操作" width="240" align='center'>
                  <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="edit('dialogForm',scope.row)">编辑</el-button>
                    <el-button type="" size="small" @click="view('dialogDetailForm',scope.row)">查看</el-button>
                    <el-button type="primary" size="small" @click="deleteT(scope.row)">删除</el-button>
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
    
    <!-- 查看 -->
    <el-dialog title="详情" :visible.sync="dialogDetailVisible" width="800px">
      <el-form v-if="dialogDetailForm" ref="dialogDetailForm"  :model="dialogDetailForm" label-width="120px" v-loading="dialogLoading">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="投稿时间：" prop="contributorTime">
              {{common._convertDate(dialogDetailForm.contributorTime, 'yyyy年MM月dd日')}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="拟稿人：" prop="drafter">
              {{dialogDetailForm.drafter}}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="稿件内容：" prop="contributionContent">
              <!-- <el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="dialogDetailForm.contributionContent" disabled></el-input> -->
              <div class="desc-box">{{dialogDetailForm.contributionContent}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="投稿刊物：" prop="contributionFiles">
              <file-show :fileList="dialogDetailForm.contributionFiles?JSON.parse(dialogDetailForm.contributionFiles):[]" :closable="false"></file-show>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="刊用情况：" prop="situation">
              <!-- <el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="dialogDetailForm.situation" disabled></el-input> -->
              <div class="desc-box">{{dialogDetailForm.situation}}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 添加/编辑 -->
    <el-dialog :title="dialogType=='edit'?'编辑记录':'添加记录'" :visible.sync="dialogVisible" width="800px">
      <el-form ref="dialogForm"  :model="dialogForm" label-width="120px" v-loading="dialogLoading">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="投稿时间：" prop="contributorTime"
              :rules="[
                { required: true, message: '请选择投稿时间', trigger: 'change' }
              ]">
              <el-date-picker
                v-model="dialogForm.contributorTime"
                type="date"
                value-format="timestamp"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="拟稿人：" prop="drafter"
              :rules="[
                { required: true, message: '请输入任务标题', trigger: 'blur' }
              ]">
              <el-input :maxlength="20" :show-word-limit="false" v-model="dialogForm.drafter" placeholder="拟稿人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="稿件内容：" prop="contributionContent"
              :rules="[
                { required: true, message: '请输入内容', trigger: 'blur' }
              ]">
              <el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="dialogForm.contributionContent" placeholder="内容..."></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="投稿刊物：" prop="contributionFiles"
              class="is-required"
              :rules="[
                { validator: checkFiles, trigger: 'blur' }
              ]">
              <upload :buttonText="dialogForm.contributionFiles&&dialogForm.contributionFiles.length>0?'重新上传':'点击上传'" :url="'/file'" :fileTypes="[]" :data="myFileData" @uploadSuccess="(response) => {uploadFileSuccess(response, 'file')}"/>
              <!-- <span>只能上传jpg/png/gif文件，且不超过2M</span> -->
              <file-show :fileList="dialogForm.contributionFiles?JSON.parse(dialogForm.contributionFiles):[]" :closable="true" @handleClose="handleClose"></file-show>
            </el-form-item>
          </el-col>  
          <el-col :span="24">
            <el-form-item 
              label="刊用情况：" prop="situation"
              :rules="[
                { required: true, message: '请输入内容', trigger: 'blur' }
              ]">
              <el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="dialogForm.situation" placeholder="内容..."></el-input>
            </el-form-item>
          </el-col>
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
  import LeftMenu from '../components/LeftMenu'
  import upload from "../../../components/Upload.vue"
  import FileShow from "../../../components/FileShow.vue"
  export default {
    data() {
      return { 
        orgId:           Number(sessionStorage.getItem('Access-OrgId')),
        assessKey:       Number(sessionStorage.getItem('Access-Key')),
        isLoad:          true,
        jobName:         sessionStorage.getItem('jobName'),// 党员首页/职工首页/党委、党小组、党支部名称
        partyNature:     this.$store.state.partyNature ? this.$store.state.partyNature : sessionStorage.getItem('partyNature'), //组织类型
        bottonLoding:    false,

        searchForm:{
          dateVal:        null,
          pageNum:    this.common.elementPagination.pageNumDefault,
          pageSize:   this.common.elementPagination.pageSizeDefault,
          keyWords:   null,
          orgId:      Number(sessionStorage.getItem('Access-OrgId')),
        },

        tableData:    {rows:[],total:0},

        dialogVisible:false,
        dialogLoading:false,
        dialogType:'add',
        dialogForm:   {
          createOrg:           Number(sessionStorage.getItem('Access-OrgId')),
          creator:             Number(sessionStorage.getItem('Access-Key')),
          contributorTime:     null,
          drafter:             null,
          contributionContent: null,
          contributionFiles:   null,
          situation:           null
        },

        dialogDetailVisible:false,
        dialogDetailForm:   null,

      }
    },
    computed:{
      myFileData(){
        return {type:'foreignNewsReportFile',userId:this.assessKey};
      },
    },
    components: { 
      LeftMenu,
      upload,
      FileShow,
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
        this.dialogForm.contributionFiles = JSON.stringify([response])
      },
      /**
       * 点击删除文件
       * @author chuanlin.Xiao
       * @date   2020-01-06T14:59:36+0800
       * @param  {[type]}                 tag [description]
       * @return {[type]}                     [description]
       */
      handleClose(tag) {
        this.dialogForm.contributionFiles = null;
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
       * 查询
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:18:28+0800
       * @return {[type]}                 [description]
       */
      query() {  
        let form = this.searchForm;

        form.dateVal ? form.beginTime = form.dateVal[0] : delete form.beginTime;
        form.dateVal ? form.endTime = form.dateVal[1] : delete form.endTime;
        // delete form.dateVal

        this.axios.post(`${this.common.basePath}/nrecord/list`,form).then((response) => {
          this.tableData = response.data ? response.data : {rows:[],total:0}
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg);
        })  
      },

      /**
       * 查看
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:50:07+0800
       * @param  {[type]}                 formName [description]
       * @param  {[type]}                 data     [description]
       */
      view(formName,data){
        this.dialogDetailVisible = true;
        this.dialogLoading = true;
        this.dialogDetailForm = data;
        this.dialogLoading = false;
      },

      /**
       * 创建/添加
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:50:07+0800
       * @param  {[type]}                 formName [description]
       * @param  {[type]}                 data     [description]
       */
      add(formName,data){
        this.dialogVisible = true;
        this.dialogType = 'add';
        this.$refs[formName]?this.$refs[formName].resetFields():'';
        this.dialogForm = {
          createOrg:           Number(sessionStorage.getItem('Access-OrgId')),
          creator:             Number(sessionStorage.getItem('Access-Key')),
          contributorTime:     null,
          drafter:             null,
          contributionContent: null,
          contributionFiles:   null,
          situation:           null
        }
      },
      /**
       * 编辑
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:50:07+0800
       * @param  {[type]}                 formName [description]
       * @param  {[type]}                 data     [description]
       */
      edit(formName,data){
        this.dialogType = 'edit';
        this.dialogVisible = true;
        // this.dialogLoading = true;
        this.dialogForm = JSON.parse(JSON.stringify(data))
        // this.axios.get(`${this.common.basePath}/nrecord/detail/${data.id}`).then((response) => {
        //   this.dialogForm = response.data;
        //   this.dialogLoading = false;
        // }).catch((errorMsg) => {
        //   this.dialogLoading = false;
        //   this.$message.error(errorMsg);
        // }) 
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
                createOrg:           this.dialogForm.createOrg,
                creator:             this.dialogForm.creator,
                contributorTime:     this.dialogForm.contributorTime,
                drafter:             this.dialogForm.drafter,
                contributionContent: this.dialogForm.contributionContent,
                contributionFiles:   this.dialogForm.contributionFiles,
                situation:           this.dialogForm.situation,
              }
              this.axios.post(`${this.common.basePath}/nrecord/add`,form).then((response) => {
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
                createOrg:           this.dialogForm.createOrg,
                creator:             this.dialogForm.creator,
                contributorTime:     this.dialogForm.contributorTime,
                drafter:             this.dialogForm.drafter,
                contributionContent: this.dialogForm.contributionContent,
                contributionFiles:   this.dialogForm.contributionFiles,
                situation:           this.dialogForm.situation,
                id:                  this.dialogForm.id, 
              }
              this.axios.post(`${this.common.basePath}/nrecord/update/${this.dialogForm.id}`,form).then((response) => {
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
       * 删除
       * @author chuanlin.Xiao
       * @date   2020-01-09T18:38:24+0800
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      deleteT(data){
        console.log(data)
        this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post(`${this.common.basePath}/nrecord/delete/${data.id}`).then((response) => {
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
