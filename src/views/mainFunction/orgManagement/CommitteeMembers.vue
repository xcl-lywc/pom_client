/*************** 组织管理（党委、党小组、党支部 委员会委员名册） *************/
<template>
  <el-row>
    <div class="content-wrap"> 
      <div class="content-wrap-box">
        <el-card class="content-title-card" shadow="never">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
            <el-breadcrumb-item>组织管理</el-breadcrumb-item>
            <el-breadcrumb-item>委员会委员名册</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
        <div class="theme-main"> 
          <!-- 搜索条件 -->
          <!-- <el-card class="marb20">
            <el-form :inline="true" :model="searchForm" ref="searchForm" size="small">
              <el-form-item label="日期" prop="value">
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
          </el-card> -->
          <!-- 表格数据 -->
          <el-card class="marb20" v-loading="isLoad">
            <div slot="header" class="clearfix marb15">
              <span :class="{'el-card-have-border-span':false}">委员会委员名册</span>  
              <div class="el-card-head-btn">
                <!-- <el-button type="primary" size="small" @click="add('dialogDetailForm',1)" icon="el-icon-plus">新增</el-button> -->
              </div>
            </div>  
            <el-row>
              <el-table
                :data="tableData.rows"
                stripe
                border
                style="width: 100%">
                <el-table-column fixed label="序号" type="index" width="50" align='center'></el-table-column>
                <el-table-column prop="user_name" label="姓名" show-overflow-tooltip width=""  align='center'></el-table-column>
                <el-table-column prop="position_name" label="党内职务" show-overflow-tooltip width=""  align='center'></el-table-column>
                <el-table-column prop="position_role" label="行政职务" show-overflow-tooltip width=""  align='center'></el-table-column>
                <el-table-column prop="technicalName" label="专业技术职称" show-overflow-tooltip width=""  align='center'></el-table-column>
                <el-table-column prop="sex" label="性别" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{scope.row.sex== 0?'男':'女'}}
                  </template>
                </el-table-column>
                <el-table-column prop="nation" label="民族" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{common._controlTable(scope.row.nation)}}
                  </template>
                </el-table-column>
                <el-table-column prop="nativePlace" label="籍贯" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{common._controlTable(scope.row.nativePlace)}}
                  </template>
                </el-table-column>
                <el-table-column prop="educationalBackground" label="文化程度" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{common._controlTable(scope.row.educationalBackground)}}
                  </template>
                </el-table-column>
                <el-table-column prop="birthday" label="出生年月" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{common._convertDate(scope.row.birthday, 'yyyy年MM月')}}
                  </template>
                </el-table-column>
                <el-table-column prop="hireDate" label="参加工作时间" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{common._convertDate(scope.row.hireDate, 'yyyy年MM月dd日')}}
                  </template>
                </el-table-column>
                <el-table-column prop="partyTime" label="入党时间" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{common._convertDate(scope.row.partyTime, 'yyyy年MM月dd日')}}
                  </template>
                </el-table-column>
                <el-table-column prop="appointmentTime" label="党员任职时间" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{common._convertDate(scope.row.appointmentTime, 'yyyy年MM月dd日')}}
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="备注" show-overflow-tooltip width=""  align='center'></el-table-column>
                <el-table-column fixed="right" label="操作" width="85" align='center'>
                  <template slot-scope="scope">
                    <el-button type="" size="small" @click="view('dialogDetailForm',scope.row)">查看</el-button>
                  </template>
                </el-table-column>
              </el-table> 
              <!-- 分页 -->
              <el-pagination
                background
                class="text-right mart10"
                small
                layout="total"
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
    <!-- 查看与完成 -->
    <el-dialog title="详情" :visible.sync="dialogDetailVisible" width="800px">
      <el-form v-if="dialogDetailForm" ref="dialogDetailForm"  :model="dialogDetailForm" label-width="120px" v-loading="dialogLoading">
        <el-row>
          <div class="overflow-hidden">
            <el-col :span="12">
              <el-form-item 
                label="" prop="user_name">
                <p class="text-bold h1">{{dialogDetailForm.user_name}}</p>
                <p>
                  <i class="el-icon-male text-primary" v-if="dialogDetailForm.sex==0||!dialogDetailForm.sex"></i>
                  <i class="el-icon-female text-danger" v-else></i>
                  <el-divider direction="vertical"></el-divider>
                  {{dialogDetailForm.nation?common._controlTable(dialogDetailForm.nation):'民族'}}
                  <el-divider direction="vertical"></el-divider>
                  {{dialogDetailForm.nativePlace?common._controlTable(dialogDetailForm.nativePlace):'籍贯'}}
                  <el-divider direction="vertical"></el-divider>
                  {{dialogDetailForm.birthday?common._convertDate(dialogDetailForm.birthday, 'yyyy年MM月'):'出生年月'}}
                  <el-divider direction="vertical"></el-divider>
                  {{dialogDetailForm.educationalBackground?common._controlTable(dialogDetailForm.educationalBackground):'文化程度'}}
                </p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item 
                label="" prop="headImage">
                <el-avatar :size="50" :src="dialogDetailForm.headImage" @error="true">
                  <img v-if="dialogDetailForm.sex==1" src="../../../assets/img/female.png" height="50" width="50"/>
                  <img v-else src="../../../assets/img/male.png" height="50" width="50"/>
                </el-avatar>
              </el-form-item>
            </el-col>
          </div>
          <el-col :span="12">
            <el-form-item 
              label="党内职务：" prop="position_name">
              {{dialogDetailForm.position_name}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="行政职务：" prop="position_role">
              {{dialogDetailForm.position_role}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="参加工作时间：" prop="hireDate">
              {{common._convertDate(dialogDetailForm.hireDate, 'yyyy年MM月dd日')}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="入党时间：" prop="partyTime">
              {{common._convertDate(dialogDetailForm.partyTime, 'yyyy年MM月dd日')}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="党员任职时间：" prop="appointmentTime">
              {{common._convertDate(dialogDetailForm.appointmentTime, 'yyyy年MM月dd日')}}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="备注：" prop="description">
              <!-- <el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="dialogDetailForm.description" disabled></el-input> -->
              <div class="desc-box">{{dialogDetailForm.description}}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import LeftMenu from '../components/LeftMenu'
  export default {
    data() {
      return { 
        orgId:           Number(sessionStorage.getItem('Access-OrgId')),
        assessKey:       Number(sessionStorage.getItem('Access-Key')),
        isLoad:          true,
        jobName:         sessionStorage.getItem('jobName'),// 党员首页/职工首页/党委、党小组、党支部名称
        partyNature:     this.$store.state.partyNature ? this.$store.state.partyNature : sessionStorage.getItem('partyNature'), //组织类型

        searchForm:{
          // pageNum:    this.common.elementPagination.pageNumDefault,
          // pageSize:   this.common.elementPagination.pageSizeDefault,
          value:      null,
          orgId:      Number(sessionStorage.getItem('Access-OrgId')),
        },

        tableData:    {rows:[],total:0},

        dialogLoading:false,
        dialogDetailVisible:false,
        dialogDetailForm:   null,
      }
    },
    computed:{
      
    },
    components: { 
      LeftMenu
    },
    watch: {
    },
    created () {
    },
    mounted() { 
      this.query();
      // 字典
      // this.getDTypeLIst();
    },
    methods: { 
      /**
       * 字典转化
       * @return {[type]} [description]
       */
      dictionaryConversion(){

      },
      /**
       * 对照表查询
       * @return {[type]} [description]
       */
      getDTypeLIst(){ 
        this.isLoad = true;
        let config = {
          method: "get",
          url: `${this.common.basePath}/dType/list`,
          params: { 
          },
        }
        this.axios(config).then((response) => { 
          let {data} = response, obj = {};
          // console.log(data)
          data.map((_temp) => {
            // console.log(_temp)
            this.axios.post(`${this.common.basePath}/dictionary/type`,{typeId:_temp.id}).then((response) => {
              _temp.dictionaryList = response.data?response.data.rows:[];
              obj[_temp.id] = _temp;
              sessionStorage.setItem('controlTable',JSON.stringify(obj)); 
            }).catch((errorMsg) => {
              this.$message.error(errorMsg);
            }) 
          }) 
          // sessionStorage.setItem('controlTable',JSON.stringify(obj)); 
          this.isLoad = false;
        }).catch((errorMsg) => {
          this.isLoad = false;
          this.$message.error(errorMsg)
        }) 
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
        form.value? form.beginTime = form.value[0] : delete form.beginTime;
        form.value? form.endTime   = form.value[1] : delete form.endTime;
        // delete form.value
        this.axios.post(`${this.common.basePath}/leader/list`,form).then((response) => {
          this.tableData.rows = response.data ? response.data : []
          this.tableData.total = response.data ? response.data.length : 0
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
      
    },
  }
</script>

<style scoped lang="less"> 
  
</style>
