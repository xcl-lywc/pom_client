/*************** 党费核定 *************/
<template>
  <el-row>
    <div class="theme-main"> 
      <!-- 搜索条件 -->
      <el-card class="marb20">
        <el-form :inline="true" :model="searchForm" ref="searchForm" size="small">
          <el-form-item label="姓名" prop="userName">
            <el-input v-model="searchForm.userName" placeholder="核定人姓名"></el-input>
          </el-form-item>
          <el-form-item label="核定年份" prop="ratifiedYear">
            <el-date-picker
              v-model="searchForm.ratifiedYear"
              type="year"
              value-format="yyyy"
              placeholder="核定年份">
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
          <span class="el-card-have-border-span">党费核定信息</span>  
          <div class="el-card-head-btn">
            <el-button type="primary" size="small" @click="add('dialogForm',null)">创 建</el-button>
          </div>
        </div>  
        <el-row>
          <el-table
            :data="tableData.rows"
            stripe
            border
            style="width: 100%">
            <el-table-column fixed label="序号" type="index" width="50" align='center'></el-table-column>
            <el-table-column prop="userName" label="姓名" show-overflow-tooltip width="120"  align='center'></el-table-column>
            <el-table-column prop="ratifiedYear" label="核定年份" show-overflow-tooltip width="80"  align='center'></el-table-column>
            <el-table-column prop="postWage" label="岗位工资" show-overflow-tooltip width="100"  align='center'></el-table-column>
            <el-table-column prop="guaranteeWage" label="保障工资" show-overflow-tooltip width="100"  align='center'></el-table-column>
            <el-table-column prop="endowmentInsurance" label="养老保险" show-overflow-tooltip width="100"  align='center'></el-table-column>
            <el-table-column prop="medicalInsurance" label="医疗保险" show-overflow-tooltip width="100"  align='center'></el-table-column>
            <el-table-column prop="unemploymentInsurance" label="失业保险" show-overflow-tooltip width="100"  align='center'></el-table-column>
            <el-table-column prop="housingProvidentFund" label="住房公积金" show-overflow-tooltip width="100"  align='center'></el-table-column>
            <el-table-column prop="subsidies" label="补贴" show-overflow-tooltip width="100"  align='center'></el-table-column>
            <el-table-column prop="annualBonus" label="年终奖" show-overflow-tooltip width="100"  align='center'></el-table-column>
            <el-table-column prop="individualIncomeTax" label="个人所得税" show-overflow-tooltip width="100"  align='center'></el-table-column>
            <el-table-column prop="payNumber" label="缴纳基数" show-overflow-tooltip width="100"  align='center'></el-table-column>
            <el-table-column prop="payRatio" label="缴纳比例" show-overflow-tooltip width="100"  align='center'>
              <template slot-scope="scope">
                {{scope.row.payRatio}}%
              </template>
            </el-table-column>
            <el-table-column prop="payMoney" label="缴纳金额" show-overflow-tooltip width="100"  align='center'></el-table-column>
            <el-table-column prop="description" label="备注" show-overflow-tooltip width=""  align='center'></el-table-column>
            <el-table-column fixed="right" label="操作" width="180" align='center'>
              <template slot-scope="scope">
                <el-button @click="edit('dialogForm',scope.row)" type="primary" size="small">编辑</el-button>
                <el-button @click="$message('暂未实现')" type="primary" size="small">删除</el-button>
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
    <!-- 创建/编辑 -->
    <el-dialog :title="dialogType=='edit'?'编辑':'创建'" :visible.sync="dialogVisible" width="50vw">
      <el-form ref="dialogForm"  :model="dialogForm" label-width="120px" v-loading="dialogLoading">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="姓名：" prop="userId"
              :rules="[
                { required: true, message: '请选择姓名', trigger: 'change' }
              ]">
              <!-- <el-input :maxlength="20" :show-word-limit="false" v-model="dialogForm.jobName" placeholder="姓名"></el-input> -->
              <el-select v-model="dialogForm.userId" placeholder="姓名" filterable>
                <el-option v-for="item in userList.rows" :label="item.owner_name" :value="item.owner" :key="item.owner"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="核定年份：" prop="ratifiedYear"
              :rules="[
                { required: true, message: '请选择核定年份', trigger: 'change' }
              ]">
              <el-date-picker
                v-model="dialogForm.ratifiedYear"
                type="year"
                value-format="yyyy"
                placeholder="核定年份">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="缴纳金额：" prop="payMoney"
              :rules="[
                { required: true, message: '请输入缴纳金额', trigger: 'blur' }
              ]">
              <el-input-number class="w100" v-model="dialogForm.payMoney" placeholder="缴纳金额" :step="100" :min="0" :controls="false"></el-input-number><span class="append-unit">元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="缴纳比例：" prop="payRatio"
              :rules="[
                { required: true, message: '请输入缴纳比例', trigger: 'blur' }
              ]">
              <el-input-number class="w100" v-model="dialogForm.payRatio" placeholder="缴纳比例" :step="1" :min="0" :controls="false"></el-input-number><span class="append-unit">%</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="岗位工资：" prop="postWage"
              :rules="[
                { required: false, message: '请输入岗位工资', trigger: 'blur' }
              ]">
              <el-input-number class="w100" v-model="dialogForm.postWage" placeholder="岗位工资" :step="100" :min="0" :controls="false"></el-input-number><span class="append-unit">元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="保障工资：" prop="guaranteeWage"
              :rules="[
                { required: false, message: '请输入保障工资', trigger: 'blur' }
              ]">
              <el-input-number class="w100" v-model="dialogForm.guaranteeWage" placeholder="保障工资" :step="100" :min="0" :controls="false"></el-input-number><span class="append-unit">元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="养老保险：" prop="endowmentInsurance"
              :rules="[
                { required: false, message: '请输入养老保险', trigger: 'blur' }
              ]">
              <el-input-number class="w100" v-model="dialogForm.endowmentInsurance" placeholder="养老保险" :step="100" :min="0" :controls="false"></el-input-number><span class="append-unit">元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="医疗保险：" prop="medicalInsurance"
              :rules="[
                { required: false, message: '请输入医疗保险', trigger: 'blur' }
              ]">
              <el-input-number class="w100" v-model="dialogForm.medicalInsurance" placeholder="医疗保险" :step="100" :min="0" :controls="false"></el-input-number><span class="append-unit">元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="失业保险：" prop="unemploymentInsurance"
              :rules="[
                { required: false, message: '请输入失业保险', trigger: 'blur' }
              ]">
              <el-input-number class="w100" v-model="dialogForm.unemploymentInsurance" placeholder="失业保险" :step="100" :min="0" :controls="false"></el-input-number><span class="append-unit">元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="住房公积金：" prop="housingProvidentFund"
              :rules="[
                { required: false, message: '请输入住房公积金', trigger: 'blur' }
              ]">
              <el-input-number class="w100" v-model="dialogForm.housingProvidentFund" placeholder="住房公积金" :step="100" :min="0" :controls="false"></el-input-number><span class="append-unit">元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="补贴：" prop="subsidies"
              :rules="[
                { required: false, message: '请输入补贴', trigger: 'blur' }
              ]">
              <el-input-number class="w100" v-model="dialogForm.subsidies" placeholder="补贴" :step="100" :min="0" :controls="false"></el-input-number><span class="append-unit">元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="年终奖：" prop="annualBonus"
              :rules="[
                { required: false, message: '请输入年终奖', trigger: 'blur' }
              ]">
              <el-input-number class="w100" v-model="dialogForm.annualBonus" placeholder="年终奖" :step="100" :min="0" :controls="false"></el-input-number><span class="append-unit">元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="个人所得税：" prop="individualIncomeTax"
              :rules="[
                { required: false, message: '请输入个人所得税', trigger: 'blur' }
              ]">
              <el-input-number class="w100" v-model="dialogForm.individualIncomeTax" placeholder="个人所得税" :step="100" :min="0" :controls="false"></el-input-number><span class="append-unit">元</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="缴纳基数：" prop="payNumber"
              :rules="[
                { required: false, message: '请输入缴纳基数', trigger: 'blur' }
              ]">
              <el-input-number class="w100" v-model="dialogForm.payNumber" placeholder="缴纳基数" :step="100" :min="0" :controls="false"></el-input-number><span class="append-unit">元</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="备注：" prop="description"
              :rules="[
                { required: false, message: '请输入内容', trigger: 'blur' }
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
  import LeftMenu from '../LeftMenu.vue'
  import upload from "../../../../components/Upload.vue"
  import FileShow from "../../../../components/FileShow.vue"
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
          ratifiedYear:   null,
          userName:       null,
          partyOrgId:     Number(sessionStorage.getItem('Access-OrgId')),
        },

        tableData:    {rows:[],total:0},
        userList:     {rows:[],total:0},

        dialogVisible:false,
        dialogLoading:false,
        dialogType:'add',
        dialogForm:   {
          creator: Number(sessionStorage.getItem('Access-Key')),// 创建者id
          userId: null,// 关联用户id
          ratifiedYear: null,// 核定年份
          postWage: null,// 岗位工资
          guaranteeWage: null,// 保障工资
          endowmentInsurance: null,// 养老保险
          medicalInsurance: null,// 医疗保险
          unemploymentInsurance: null,// 失业保险
          housingProvidentFund: null,// 住房公积金
          subsidies: null,// 补贴
          annualBonus: null,// 年终奖
          individualIncomeTax: null,// 个人所得税
          payNumber: null,// 缴纳基数
          payMoney: null,// 缴纳金额
          payRatio: 0,// 缴纳比例
          description: null,// 备注
          
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
      this.query01();
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
        // form.ratifiedYear = Number(this.searchForm.ratifiedYear)
        this.axios.post(`${this.common.basePath}/due/list`,form).then((response) => {
          this.tableData = response.data ? response.data : {rows:[],total:0}
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg);
        })  
      }, 
      /**
       * 获取党员列表（核定人）
       * @author chuanlin.Xiao
       * @date   2020-01-15T16:03:43+0800
       * @return {[type]}                 [description]
       */
      query01() {
        this.axios.post(`${this.common.basePath}/party/list`,{party_orgs_id:this.orgId}).then((response) => {
          this.userList = response.data ? response.data : {rows:[],total:0}
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
            if(this.dialogType == 'add'){
              let form = this.dialogForm;
              // form.ratifiedYear = Number(this.dialogForm.ratifiedYear)
              this.axios.post(`${this.common.basePath}/due`,form).then((response) => {
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
              // form.ratifiedYear = Number(this.dialogForm.ratifiedYear)
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
