/*************** 缴纳党费 *************/
<template>
  <el-row>
    <div class="content-wrap"> 
      <div class="content-wrap-box">
        <el-card class="content-title-card" shadow="never">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'PartyMemberHome' }">首页</el-breadcrumb-item>  
            <el-breadcrumb-item>党员服务</el-breadcrumb-item>
            <el-breadcrumb-item>缴纳党费</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
        <div class="theme-main"> 
          <!-- 搜索条件 -->
          <el-card class="marb20">
            <el-form :inline="true" :model="searchForm" ref="searchForm" size="small">
              <el-form-item label="缴纳状态" prop="curStatus">
                <el-select v-model="searchForm.curStatus" placeholder="请选择缴纳状态">
                  <el-option label="未缴" :value="1"></el-option>
                  <el-option label="已缴" :value="2"></el-option>
                  <!-- <el-option label="确认已缴" :value="3"></el-option> -->
                  <!-- <el-option label="欠缴" :value="4"></el-option> -->
                  <!-- <el-option label="补缴" :value="5"></el-option> -->
                </el-select>
              </el-form-item>
              <el-form-item label="年份" prop="dateYear">
                <el-date-picker
                  v-model="searchForm.dateYear"
                  type="year"
                  value-format="timestamp"
                  placeholder="年份">
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
              <span class="el-card-have-border-span">党员党费缴纳明细</span>  
              <div class="el-card-head-btn">
                <!-- <el-button type="primary" size="small" @click="add('dialogForm',null)">创 建</el-button> -->
              </div>
            </div>  
            <el-row>
              <el-table
                :data="tableData.rows"
                stripe
                border
                style="width: 100%">
                <el-table-column fixed label="序号" type="index" width="50" align='center'></el-table-column>
                <el-table-column prop="planBeginTime" label="年份" show-overflow-tooltip width="120"  align='center'>
                  <template slot-scope="scope">
                    {{common._convertDate(scope.row.planBeginTime, 'yyyy年')}}
                  </template>
                </el-table-column>
                <el-table-column prop="partyOrgName" label="来源" show-overflow-tooltip width=""  align='center'></el-table-column>
                <el-table-column prop="planBeginTime" label="发起时间" show-overflow-tooltip width="180"  align='center'>
                  <template slot-scope="scope">
                    {{common._convertDate(scope.row.planBeginTime, 'yyyy/MM/dd hh:mm')}}
                  </template>
                </el-table-column>
                <el-table-column prop="planPay" label="金额/元" show-overflow-tooltip width="100"  align='center'></el-table-column>
                <el-table-column prop="curStatus" label="状态" show-overflow-tooltip width="120"  align='center'>
                  <template slot-scope="scope">
                    <span v-if="scope.row.curStatus==1">未缴</span>
                    <span v-if="scope.row.curStatus==2">已缴</span>
                    <span v-if="scope.row.curStatus==3">确认已缴</span>
                    <span v-if="scope.row.curStatus==4">欠缴</span>
                    <span v-if="scope.row.curStatus==5">补缴</span>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="90" align='center'>
                  <template slot-scope="scope">
                    <!-- <el-button @click="edit('dialogForm',scope.row)" type="primary" size="small">编辑</el-button> -->
                    <el-button @click="pay('dialogForm',scope.row)" type="primary" size="small" v-if="scope.row.curStatus" :disabled="scope.row.curStatus==2||scope.row.curStatus==3||scope.row.curStatus==5">缴 费</el-button>
                    <!-- <el-button type="primary" size="small" @click="deleteOperation(scope.row);">删除</el-button> -->
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
    <!-- 缴纳党费/编辑 -->
    <el-dialog :title="dialogType=='edit'?'编辑':'缴纳党费'" :visible.sync="dialogVisible" width="800px">
      <el-form ref="dialogForm"  :model="dialogForm" label-width="120px" v-loading="dialogLoading">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="党费：" prop="realPay"
              :rules="[
                { required: true, message: '请输入党费', trigger: 'blur' },{ type: 'number', message: '必须为数字值'},
              ]">
              <el-input v-model.number="dialogForm.realPay" placeholder="党费"><template slot="append">元</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="备注：" prop="description"
              :rules="[
                { required: true, message: '请输入内容', trigger: 'blur' }
              ]">
              <el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="dialogForm.description" placeholder="内容..."></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('dialogForm')" :loading="bottonLoding" :disabled="bottonLoding">保 存{{bottonLoding?' 中...':''}}</el-button>
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
          pageNum:        this.common.elementPagination.pageNumDefault,
          pageSize:       this.common.elementPagination.pageSizeDefault,
          dateYear:       null,
          curStatus:      null,
          userId:         Number(sessionStorage.getItem('Access-Key')),
        },

        tableData:    {rows:[],total:0},
        userList:     {rows:[],total:0},

        dialogVisible:false,
        dialogLoading:false,
        dialogType:'pay',
        dialogForm:   {
          description: null,
          partyOrgId: Number(sessionStorage.getItem('Access-OrgId')),
          planTime: null,
          realPay: null,
          userId: Number(sessionStorage.getItem('Access-Key')),
        },
      }
    },
    computed:{
      myFileData(){
        return {type:'feesVerificationFile',userId:this.assessKey};
      },
    },
    components: { 
      LeftMenu,
      upload,
      FileShow
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
       * 缴纳比例格式化
       * @author chuanlin.Xiao
       * @date   2020-01-15T16:25:12+0800
       * @param  {[type]}                 val [description]
       * @return {[type]}                     [description]
       */
      formatTooltip(val) {
        return val +'%';
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
        this.axios.post(`${this.common.basePath}/due-count/member`,form).then((response) => {
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
        this.dialogVisible = true;
        this.dialogType = 'add';
        this.$refs[formName]?this.$refs[formName].resetFields():'';
        // this.dialogForm = {};
      },
      /**
       * 缴纳党费
       * @author chuanlin.Xiao
       * @date   2020-01-17T14:44:21+0800
       * @param  {[type]}                 formName [description]
       * @param  {[type]}                 data     [description]
       * @return {[type]}                          [description]
       */
      pay(formName,data){
        console.log(data)
        this.dialogVisible = true;
        this.dialogType = 'pay';
        this.$refs[formName]?this.$refs[formName].resetFields():'';
        this.dialogForm = {
          description: null,
          partyOrgId: Number(sessionStorage.getItem('Access-OrgId')),
          planTime: data.planBeginTime,
          realPay: null,
          userId: Number(sessionStorage.getItem('Access-Key')),
        };
      },
      /**
       * 编辑
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:50:07+0800
       * @param  {[type]}                 formName [description]
       * @param  {[type]}                 data     [description]
       */
      edit(formName,data){
        console.log(data)
        this.dialogForm = data
        this.dialogForm.ratifiedYear = String(data.ratifiedYear)
        this.dialogType = 'edit';
        this.dialogVisible = true;
        // this.dialogLoading = true;
        // this.axios.get(`${this.common.basePath}/due/detail`,{params:{id:data.id}}).then((response) => {
        //   this.dialogForm = response.data;
        //   this.dialogForm.jobFiles = response.data.jobFiles?JSON.parse(response.data.jobFiles):[];
        //   this.createTaskType = response.data.jobCandidateUsers&&response.data.jobCandidateUsers.length>0?1:2;
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
            if(this.dialogType == 'pay'){
              let form = this.dialogForm;
              this.axios.post(`${this.common.basePath}/due-count/sure`,form).then((response) => {
                this.$message.success(response.meta.message);
                this.query();
                this.bottonLoding = false;
                this.dialogVisible = false;
              }).catch((errorMsg) => {
                this.bottonLoding = false;
                this.$message.error(errorMsg);
              })  
            }else{
              let form = this.dialogForm;
              form.id = this.dialogForm.id;
              this.axios.post(`${this.common.basePath}/due`,form).then((response) => {
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
       * 删除
       * @author chuanlin.Xiao
       * @date   2020-01-09T18:38:24+0800
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      deleteOperation(data){
        console.log(data);
        this.$message("暂未实现");
        // this.$confirm('此操作将删除该任务, 是否继续?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   this.axios.delete(`${this.common.basePath}/due?id=${data.id}`).then((response) => {
        //     this.$message.success(response.meta.message);
        //     this.query();
        //   }).catch((errorMsg) => {
        //     this.$message.error(errorMsg);
        //   }) 
        // }).catch(() => {});
      },
    },
  }
</script>

<style scoped lang="less"> 
  
</style>
