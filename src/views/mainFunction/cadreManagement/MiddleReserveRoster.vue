/*************** 干部管理（党委 中层后备干部名册） *************/
<template>
  <el-row>
    <div class="content-wrap"> 
      <div class="content-wrap-box">
        <el-card class="content-title-card" shadow="never">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
            <el-breadcrumb-item>干部管理</el-breadcrumb-item>
            <el-breadcrumb-item>中层后备干部名册</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
        <div class="theme-main"> 
          <!-- 搜索条件 -->
          <el-card class="marb20">
            <el-form :inline="true" :model="searchForm" ref="searchForm" size="small">
              <el-form-item label="姓名" prop="realName">
                <el-input v-model="searchForm.realName" placeholder="姓名"></el-input>
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
              <span class="el-card-have-border-span">中层后备干部名册</span>  
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
                <el-table-column prop="reservePosition" label="后备岗位" show-overflow-tooltip width=""  align='center'></el-table-column>
                <el-table-column prop="reservePositionOrg" label="部门" show-overflow-tooltip width=""  align='center'></el-table-column>
                <el-table-column prop="realName" label="后备干部" show-overflow-tooltip width=""  align='center'></el-table-column>
                <el-table-column prop="sex" label="性别" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{scope.row.sex== 0?'男':'女'}}
                  </template>
                </el-table-column>
                <el-table-column prop="birthday" label="出生年月" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{common._convertDate(scope.row.birthday, 'yyyy年MM月')}}
                  </template>
                </el-table-column>
                <el-table-column prop="technicalPosition" label="职称" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{common._controlTable(scope.row.technicalPosition)}}
                  </template>
                </el-table-column>
                
                <el-table-column prop="hireDate" label="参加工作时间" show-overflow-tooltip width=""  align='center'>
                  <template slot-scope="scope">
                    {{common._convertDate(scope.row.hireDate, 'yyyy年MM月dd日')}}
                  </template>
                </el-table-column>
                
                <el-table-column prop="description" label="备注" show-overflow-tooltip width=""  align='center'></el-table-column>
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
    <el-dialog title="详情" :visible.sync="dialogDetailVisible" width="50vw">
      <el-form v-if="dialogDetailForm" ref="dialogDetailForm"  :model="dialogDetailForm" label-width="120px" v-loading="dialogLoading">
        <el-row>
          <div class="overflow-hidden">
            <el-col :span="12">
              <el-form-item 
                label="" prop="realName">
                <p class="text-bold h1">{{dialogDetailForm.realName}}</p>
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
                  {{dialogDetailForm.highest_degree?common._controlTable(dialogDetailForm.highest_degree):'学历'}}
                </p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item 
                label="" prop="headImage">
                <el-avatar :size="50" :src="dialogDetailForm.headImage" @error="true">
                  <img v-if="dialogDetailForm.sex==2" src="../../../assets/img/female.png" height="50" width="50"/>
                  <img v-else src="../../../assets/img/male.png" height="50" width="50"/>
                </el-avatar>
              </el-form-item>
            </el-col>
          </div>
          <el-col :span="12">
            <el-form-item 
              label="后备岗位：" prop="reservePosition">
              {{dialogDetailForm.reservePosition}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="部门：" prop="reservePositionOrg">
              {{dialogDetailForm.reservePositionOrg}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="职称：" prop="technicalPosition">
              {{common._controlTable(dialogDetailForm.technicalPosition)}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="参加工作时间：" prop="hireDate">
              {{common._convertDate(dialogDetailForm.hireDate, 'yyyy年MM月dd日')}}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="学位学历：" prop="">
              <el-card shadow="never">
                <el-row v-if="dialogDetailForm"> 
                  <el-col :span="6">
                    <p class="mart10">初始学历：{{ common._controlTable(dialogDetailForm.userInfo.initial_degree) }}</p>
                    <p class="mart10">最高学历：{{ common._controlTable(dialogDetailForm.userInfo.highest_degree) }}</p>

                    <p class="mart10">最高学位：{{ common._controlTable(dialogDetailForm.userInfo.educational_background) }}</p>
                  </el-col> 
                  <el-col :span="9">
                    <p class="mart10">毕业学校：{{ dialogDetailForm.userInfo.initial_school || '' }}</p>
                    <p class="mart10">毕业学校：{{ dialogDetailForm.userInfo.highest_school || '' }}</p>

                    <p class="mart10">外语语种：{{ common._controlTable(dialogDetailForm.userInfo.fg_language) }}</p>
                  </el-col> 
                  <el-col :span="9">
                    <p class="mart10">毕业时间：{{ common._showDate(dialogDetailForm.userInfo.initial_time) }}</p>
                    <p class="mart10">毕业时间：{{ common._showDate(dialogDetailForm.userInfo.highest_time) }}</p>

                    <p class="mart10">语言等级：{{ common._controlTable(dialogDetailForm.userInfo.language_level) }}</p>
                  </el-col>
                </el-row>
              </el-card>
            </el-form-item>
          </el-col> 
          <el-col :span="24">
            <el-form-item 
              label="职位职务：" prop="">
              <el-card shadow="never">
                <el-row v-if="dialogDetailForm.userInfo"> 
                  <el-col :span="8">
                    <p class="mart10">进入二局时间：{{ common._showDate(dialogDetailForm.userInfo.join_partisan_date) }}</p>
                    <p class="mart10">党内职务：{{ dialogDetailForm.userInfo.party_job || '' }}</p> 
                  </el-col>  
                  <el-col :span="8">
                    <p class="mart10">进入公司时间：{{ common._showDate(dialogDetailForm.userInfo.join_date) }}</p>
                    <p class="mart10">行政职务：{{dialogDetailForm.userInfo.administration_job || '' }}</p> 
                  </el-col>
                  <el-col :span="8">
                    <p class="mart10">岗位性质：{{ dialogDetailForm.userInfo.post_nature || '' }}</p>
                    <p class="mart10">工作部门：{{ dialogDetailForm.userInfo.glodonDepartmentName }}</p> 
                  </el-col>
                </el-row>
              </el-card> 
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
    <!-- 添加/编辑 -->
    <el-dialog :title="dialogType=='edit'?'编辑后备干部信息':'添加后备干部'" :visible.sync="dialogVisible" width="50vw">
      <el-form ref="dialogForm"  :model="dialogForm" label-width="120px" v-loading="dialogLoading">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="后备干部：" prop="userId"
              :rules="[
                { required: true, message: '请选择后备干部', trigger: 'change' }
              ]">
              <el-select v-model="dialogForm.userId" placeholder="后备干部">
                <el-option
                  v-for="item in userList.rows"
                  :key="item.id"
                  :label="item.real_name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="后备岗位：" prop="positionId"
              :rules="[
                { required: true, message: '请选择后备岗位', trigger: 'change' }
              ]">
              <el-select v-model="dialogForm.positionId" placeholder="后备岗位">
                <el-option
                  v-for="item in positionList.rows"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
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
        <el-button type="primary" @click="submitForm('dialogForm')" :loading="bottonLoding" :disabled="bottonLoding">{{dialogType=='edit'?'保 存':'发 布'}}{{bottonLoding?' 中...':''}}</el-button>
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
        bottonLoding:    false,

        searchForm:{
          pageNum:    this.common.elementPagination.pageNumDefault,
          pageSize:   this.common.elementPagination.pageSizeDefault,
          realName:   null,
          orgId:      Number(sessionStorage.getItem('Access-OrgId')),
        },

        tableData:    {rows:[],total:0},
        userList:     {rows:[],total:0},
        positionList: {rows:[],total:0},

        dialogVisible:false,
        dialogLoading:false,
        dialogType:'add',
        dialogForm:   {
          userId:          null,
          orgId:           Number(sessionStorage.getItem('Access-OrgId')),
          creator:         Number(sessionStorage.getItem('Access-Key')),
          positionId:      null,
          description:     null,
        },

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
      this.query1();
      this.query2();
    },
    methods: { 
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
        this.axios.post(`${this.common.basePath}/reserve/list`,form).then((response) => {
          this.tableData = response.data ? response.data : {rows:[],total:0}
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg);
        })  
      }, 
      /**
       * 获取用户
       * @author chuanlin.Xiao
       * @date   2020-01-07T10:24:07+0800
       * @return {[type]}                 [description]
       */
      query1() {  
        this.axios.post(`${this.common.basePath}/user/user/list`,{orgId:null}).then((response) => {
          this.userList = response.data ? response.data : {rows:[],total:0}
        }).catch((errorMsg) => {
          this.$message.error(errorMsg);
        })  
      }, 
      /**
       * 获取职位
       * @author chuanlin.Xiao
       * @date   2020-01-07T10:24:07+0800
       * @return {[type]}                 [description]
       */
      query2() {  
        this.axios.post(`${this.common.basePath}/position/list`,{orgId:this.orgId}).then((response) => {
          this.positionList = response.data ? response.data : {rows:[],total:0}
        }).catch((errorMsg) => {
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
        this.axios.get(`${this.common.basePath}/reserve/detail/${data.id}`).then((response) => {
          this.dialogDetailForm = response.data;
          this.dialogLoading = false;
        }).catch((errorMsg) => {
          this.dialogLoading = false;
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
        this.dialogLoading = true;
        this.axios.get(`${this.common.basePath}/reserve/detail/${data.id}`).then((response) => {
          this.dialogForm = response.data;
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
                userId:            this.dialogForm.userId,
                orgId:             this.orgId,
                creator:           this.dialogForm.creator,
                positionId:        this.dialogForm.positionId,
                description:       this.dialogForm.description,
              }
              this.axios.post(`${this.common.basePath}/reserve/add`,form).then((response) => {
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
                userId:            this.dialogForm.userId,
                orgId:             this.dialogForm.creator,
                creator:           this.dialogForm.creator,
                positionId:        this.dialogForm.positionId,
                description:       this.dialogForm.description,
                id:                this.dialogForm.id, 
              }
              this.axios.post(`${this.common.basePath}/reserve/update/${this.dialogForm.id}`,form).then((response) => {
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
        this.$confirm('此操作将删除该后备干部, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post(`${this.common.basePath}/reserve/delete/${data.id}`).then((response) => {
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
