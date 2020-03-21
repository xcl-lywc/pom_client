/*************** 党费缴纳情况--党费缴纳统计 *************/
<template>
  <el-row>
    <div class="theme-main"> 
      <div>
        <!-- 搜索条件 -->
        <el-card class="marb20">
          <el-form :inline="true" :model="searchForm" ref="searchForm" size="small">
            <el-form-item label="缴纳人" prop="userName">
              <el-input v-model="searchForm.userName" placeholder="缴纳人姓名"></el-input>
            </el-form-item>
            <el-form-item label="缴纳状态" prop="curStatus" v-if="activeName=='first'">
              <el-select v-model="searchForm.curStatus" placeholder="请选择缴纳状态">
                <el-option label="未缴" :value="1"></el-option>
                <el-option label="已缴" :value="2"></el-option>
                <el-option label="确认已缴" :value="3"></el-option>
                <el-option label="欠缴" :value="4"></el-option>
                <el-option label="补缴" :value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="activeName=='first'?'月份':'年份'" prop="dateTime">
              <el-date-picker
                v-model="searchForm.dateTime"
                :type="activeName=='first'?'month':'year'"
                value-format="timestamp"
                :picker-options="pickerOptions"
                :clearable="activeName=='first'"
                @change="searchForm.dateTime=$event;searchForm.pageNum=1;query();"
                :placeholder="activeName=='first'?'月份':'年份'">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchForm.pageNum=1;query();" size="small">查询</el-button>
              <el-button type="" @click="rest('searchForm');" size="small">置空</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <!-- 表格数据 -->
        <el-card class="mart20" v-loading="isLoad">
          <div slot="header" class="clearfix marb15">
            <span :class="{'el-card-have-border-span':false}">党费缴纳明细</span>  
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
              <div v-if="activeName=='second'&&tableData.total>0">
                <el-table-column prop="userName" label="缴纳人" show-overflow-tooltip width="180"  align='center'></el-table-column>
                <el-table-column prop="monthList" :label="common._convertDate(searchForm.dateTime, 'yyyy年')" show-overflow-tooltip width=""  align='center'>
                  <el-table-column v-for="(item,index) in tableData.rows[0].monthList" prop="money" :label="((index+1)<10?'0'+(index+1):(index+1))+'月'" show-overflow-tooltip width=""  align='center'>
                    <template slot-scope="scope">
                      <div v-for="(itemC,indexC) in tableData.rows[scope.$index].monthList">
                        <span v-if="Number(scope.column.label.split('月')[0])==(indexC+1)">{{itemC.money?itemC.money+'元':''}}</span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                
              </div>
              <el-table-column fixed="right" label="操作" width="100" align='center' v-if="activeName=='first'">
                <template slot-scope="scope">
                  <el-button @click="view('dialogForm',scope.row)" type="primary" size="small">查 看</el-button>
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
    <!-- 缴费信息（确认与拒绝） -->
    <el-dialog title="缴费信息" :visible.sync="dialogVisible" width="800px">
      <el-form v-if="dialogForm" ref="dialogForm"  :model="dialogForm" label-width="120px" v-loading="dialogLoading">
        <el-row>
          <el-col :span="12">
            <el-form-item label="缴纳人：">
              {{dialogForm.userName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源：">
              {{dialogForm.partyOrgName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="缴费基数：">
             {{dialogForm.payNumber}}元
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="缴费比例：">
             {{dialogForm.payRatio}}%
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="缴费金额：">
             {{dialogForm.planPay}}元
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发起时间：">
              {{common._convertDate(dialogForm.planBeginTime, 'yyyy年MM月日')}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实缴金额：">
             {{dialogForm.realPay}}元
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="缴费时间：">
              {{common._convertDate(dialogForm.realTime, 'yyyy年MM月日')}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="缴纳状态：">
              <span v-if="dialogForm.curStatus==1">未缴</span>
              <span v-if="dialogForm.curStatus==2">已缴</span>
              <span v-if="dialogForm.curStatus==3">确认已缴</span>
              <span v-if="dialogForm.curStatus==4">欠缴</span>
              <span v-if="dialogForm.curStatus==5">补缴</span>
            </el-form-item>
          </el-col>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：">
              <!-- <el-input type="textarea" disabled :rows="5" :maxlength="128" :show-word-limit="true" v-model="dialogForm.description"></el-input> -->
              <div class="desc-box">{{dialogForm.description}}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button @click="submit('refuse',dialogForm)" type="primary" size="small" v-if="dialogForm.curStatus":loading="bottonLoding" :disabled="dialogForm.curStatus==1||dialogForm.curStatus==3||dialogForm.curStatus==4||bottonLoding">拒 绝{{bottonLoding?' 中...':''}}</el-button>
        <el-button @click="submit('confirm',dialogForm)" type="primary" size="small" v-if="dialogForm.curStatus" :loading="bottonLoding01" :disabled="dialogForm.curStatus==1||dialogForm.curStatus==3||dialogForm.curStatus==4||bottonLoding01">确 认{{bottonLoding01?' 中...':''}}</el-button>
      </div>
    </el-dialog>
  </el-row>  
</template>

<script>
  import LeftMenu from '../LeftMenu'
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
        bottonLoding01:  false,
        pickerOptions: {
          disabledDate: (time) => {
           let nowData = new Date()
           nowData = new Date(nowData.setDate(nowData.getDate() - 1))
           return time > nowData
          }
        },

        activeName:     'second',

        searchForm:{
          pageNum:        this.common.elementPagination.pageNumDefault,
          pageSize:       this.common.elementPagination.pageSizeDefault,
          dateTime:       new Date().getTime(),
          curStatus:      null,
          userName:       null,
          partyOrgId:     Number(sessionStorage.getItem('Access-OrgId')),
        },

        tableData:    {rows:[],total:0},
        userList:     {rows:[],total:0},
        tableDatas: [
          {name1: '党员总数',amount1: '0',name2: '已交人数',amount2: '0',name3: '欠交人数',amount3: '0'}, 
          {name1: '应收党费（元）',amount1: '0',name2: '实收党费（元）',amount2: '0',name3: '欠交党费（元）',amount3: '0'}, 
          {name1: '备注',amount1: '',}, 
        ],

        dialogVisible:false,
        dialogLoading:false,
        dialogType:'add',
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
       * 合并单元格
       * @param  {[type]} options.row         [description]
       * @param  {[type]} options.column      [description]
       * @param  {[type]} options.rowIndex    [description]
       * @param  {[type]} options.columnIndex [description]
       * @return {[type]}                     [description]
       */
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (rowIndex  === 2) {
          if (columnIndex == 0) {
            return [1, 1];
          } else if(columnIndex == 1){
            return [1, 5];
          }
        }
      },
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
       * 顶部切换
       * @author chuanlin.Xiao
       * @date   2020-01-17T17:37:41+0800
       * @param  {[type]}                 tab   [description]
       * @param  {[type]}                 event [description]
       * @return {[type]}                       [description]
       */
      handleClick(tab, event) {
        this.searchForm = {
          pageNum:        this.common.elementPagination.pageNumDefault,
          pageSize:       this.common.elementPagination.pageSizeDefault,
          dateTime:       new Date().getTime(),
          curStatus:      null,
          userName:       null,
          partyOrgId:     Number(sessionStorage.getItem('Access-OrgId')),
        };
        this.query();
      },

      /**
       * 查询
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:18:28+0800
       * @return {[type]}                 [description]
       */
      query() {  
        let form = this.searchForm;
        this.isLoad =  true;
        if(this.activeName=='first'){
          this.axios.post(`${this.common.basePath}/due-count/org/count/month`,form).then((response) => {
            this.tableData = response.data ? response.data : {rows:[],total:0}
            this.isLoad =  false;
          }).catch((errorMsg) => {
            this.isLoad =  false; 
            this.$message.error(errorMsg);
          }) 
        }else if (this.activeName=='second') {
          this.axios.post(`${this.common.basePath}/due-count/org/count/year`,form).then((response) => {
            this.tableData = response.data ? response.data : {rows:[],total:0}
            this.isLoad =  false;
          }).catch((errorMsg) => {
            this.isLoad =  false; 
            this.$message.error(errorMsg);
          }) 
        }else if (this.activeName=='three') {
          this.axios.post(`${this.common.basePath}/due-count/org/count/sum`,form).then((response) => {
            if(response.data){
              this.tableDatas[0].amount1 = response.data.memberCount
              this.tableDatas[0].amount2 = response.data.memberPaidCount
              this.tableDatas[0].amount3 = response.data.memberUnPaidCount

              this.tableDatas[1].amount1 = response.data.receivableCount
              this.tableDatas[1].amount2 = response.data.netReceiptsCount
              this.tableDatas[1].amount3 = response.data.unPaidCount

              this.tableDatas[2].amount1 = response.data.description
            }
            this.isLoad =  false;
          }).catch((errorMsg) => {
            this.isLoad =  false; 
            this.$message.error(errorMsg);
          }) 
        }
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
            if(this.dialogType == 'add'){
              let form = this.dialogForm;
              this.axios.post(`${this.common.basePath}/due-count/sure`,form).then((response) => {
                this.$message.success(response.meta.message);
                this.query();
                this.dialogVisible = false;
              }).catch((errorMsg) => {
                this.$message.error(errorMsg);
              })  
            }else{
              let form = this.dialogForm;
              form.id = this.dialogForm.id;
              this.axios.post(`${this.common.basePath}/due`,form).then((response) => {
                this.$message.success(response.meta.message);
                this.query();
                this.dialogVisible = false;
              }).catch((errorMsg) => {
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

      /**
       * 查看
       * @author chuanlin.Xiao
       * @date   2020-01-17T14:44:21+0800
       * @param  {[type]}                 formName [description]
       * @param  {[type]}                 data     [description]
       * @return {[type]}                          [description]
       */
      view(formName,data){
        this.dialogVisible = true;
        this.$refs[formName]?this.$refs[formName].resetFields():'';
        this.dialogForm = data;
      },
      /**
       * 拒绝与确认缴费
       * @author chuanlin.Xiao
       * @date   2020-01-17T17:10:56+0800
       * @param  {[type]}                 type [description]
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      submit(type,data){
        let form = {
          description: data.description,
          partyOrgId: data.partyOrgId,
          planTime: data.planBeginTime,
          realPay: data.realPay,
          userId: data.userId
        }
        type=='confirm'?this.bottonLoding01 = true:this.bottonLoding = true;
        this.axios.post(type=='confirm'?`${this.common.basePath}/due-count/org/sure`:`${this.common.basePath}/due-count/org/reject`,form).then((response) => {
          this.$message.success(response.meta.message);
          this.query();
          type=='confirm'?this.bottonLoding01 = false:this.bottonLoding = false;
          this.dialogVisible = false;
        }).catch((errorMsg) => {
          type=='confirm'?this.bottonLoding01 = false:this.bottonLoding = false;
          this.$message.error(errorMsg);
        }) 
      },

    },
  }
</script>

<style lang="less"> 
  
</style>
