/*************** 党员管理（党委 “三联”名册记录） *************/
<template>
  <el-row>
    <div class="content-wrap"> 
      <div class="content-wrap-box">
        <el-card class="content-title-card" shadow="never">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
            <el-breadcrumb-item>党员管理</el-breadcrumb-item>
            <el-breadcrumb-item>“三联”名册记录</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
        <div class="theme-main"> 
          <!-- 搜索条件 -->
          <el-card class="marb20">
            <el-form :inline="true" :model="searchForm" ref="searchForm" size="small">
              <el-form-item label="联系人" prop="contactName">
                <el-input v-model="searchForm.contactName" placeholder="联系人"></el-input>
              </el-form-item>
              <el-form-item label="被联系人" prop="contactedName">
                <el-input v-model="searchForm.contactedName" placeholder="被联系人"></el-input>
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
              <span class="el-card-have-border-span">党委委员联系党代表、党代表联系党员、党员联系员工群众名册</span>  
              <div class="el-card-head-btn">
                <el-button type="primary" size="small" @click="add('dialogForm',1)">添 加</el-button>
              </div>
            </div>  
            <el-row>
              <!-- <el-table
                :data="tableData.rows"
                header-row-class-name="table-header-class-newsrecord"
                stripe
                border
                style="width: 100%">
                <el-table-column fixed label="序号" type="index" width="50" align='center'></el-table-column>
                <el-table-column label="联系人（党委委员、党代表或党员）" align='center'>
                  <el-table-column prop="contactName" label="姓名" show-overflow-tooltip width="120"  align='center'></el-table-column>
                  <el-table-column prop="contactPosition" label="党内外职务" show-overflow-tooltip width="120"  align='center'></el-table-column>
                </el-table-column>
                <el-table-column label="被联系的党代表/党员" align='center'>
                  <el-table-column prop="contactedName" label="姓名" show-overflow-tooltip width="120"  align='center'></el-table-column>
                  <el-table-column prop="contactedSex" label="性别" show-overflow-tooltip width="120"  align='center'></el-table-column>
                  <el-table-column prop="contactedType" label="所在单位、职务（工种）" show-overflow-tooltip width="120"  align='center'>
                    <template slot-scope="scope">
                      {{scope.row.contactedType==2?'员工群众':'党代表/党员'}}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="被联系的员工群众" align='center'>
                  <el-table-column prop="contactedName" label="姓名" show-overflow-tooltip width="120"  align='center'></el-table-column>
                  <el-table-column prop="contactedSex" label="性别" show-overflow-tooltip width="120"  align='center'></el-table-column>
                  <el-table-column prop="contactedType" label="所在单位、职务（工种）" show-overflow-tooltip width="120"  align='center'>
                    <template slot-scope="scope">
                      {{scope.row.contactedType==2?'员工群众':'党代表/党员'}}
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="160" align='center'>
                  <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="edit('dialogForm',scope.row)">编辑</el-button>
                    <el-button type="primary" size="small" @click="deleteT(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table> --> 
              <el-table
                :data="tableData.rows"
                header-row-class-name="table-header-class-newsrecord"
                stripe
                border
                style="width: 100%">
                <el-table-column fixed label="序号" type="index" width="50" align='center'></el-table-column>
                <el-table-column label="联系人（党委委员、党代表或党员）" align='center'>
                  <el-table-column prop="contactName" label="姓名" show-overflow-tooltip width="120"  align='center'></el-table-column>
                  <el-table-column prop="contactPosition" label="党内外职务" show-overflow-tooltip width="120"  align='center'></el-table-column>
                </el-table-column>
                <el-table-column label="被联系的党代表/党员" align='center'>
                  <template slot-scope="scope">
                    <el-table
                      :data="differ(scope.row.contactedInfos,1)"
                      header-row-class-name="table-header-class-newsrecord"
                      stripe
                      border
                      style="width: 100%">
                      <!-- <el-table-column fixed label="序号" type="index" width="50" align='center'></el-table-column> -->
                      <el-table-column prop="contactedName" label="姓名" show-overflow-tooltip width=""  align='center'></el-table-column>
                      <el-table-column prop="contactedSex" label="性别" show-overflow-tooltip width=""  align='center'></el-table-column>
                      <el-table-column prop="contactedType" label="所在单位、职务（工种）" show-overflow-tooltip width=""  align='center'>
                        <template slot-scope="scope">
                          {{scope.row.contactedType==2?'员工群众':'党代表/党员'}}
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column label="被联系的员工群众" align='center'>
                  <template slot-scope="scope">
                    <el-table
                      :data="differ(scope.row.contactedInfos,2)"
                      header-row-class-name="table-header-class-newsrecord"
                      stripe
                      border
                      style="width: 100%">
                      <!-- <el-table-column fixed label="序号" type="index" width="50" align='center'></el-table-column> -->
                      <el-table-column prop="contactedName" label="姓名" show-overflow-tooltip width=""  align='center'></el-table-column>
                      <el-table-column prop="contactedSex" label="性别" show-overflow-tooltip width=""  align='center'></el-table-column>
                      <el-table-column prop="contactedType" label="所在单位、职务（工种）" show-overflow-tooltip width=""  align='center'>
                        <template slot-scope="scope">
                          {{scope.row.contactedType==2?'员工群众':'党代表/党员'}}
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="160" align='center'>
                  <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="edit('dialogForm',scope.row)">编辑</el-button>
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

    <!-- 添加/编辑 -->
    <el-dialog :title="dialogType=='edit'?'编辑记录':'添加记录'" :visible.sync="dialogVisible" width="800px">
      <el-form ref="dialogForm"  :model="dialogForm" label-width="120px" v-loading="dialogLoading">
        <el-row>
          <el-card shadow="" class="marb20">
            <div slot="header" class="clearfix">
              <span>联系人</span>
            </div>
            <div>
              <el-col :span="12">
                <el-form-item 
                  label="姓名：" prop="contactName"
                  :rules="[
                    { required: true, message: '请输入联系人姓名', trigger: 'blur' }
                  ]">
                  <el-input :maxlength="20" :show-word-limit="false" v-model="dialogForm.contactName" placeholder="联系人姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item 
                  label="职位：" prop="contactPosition"
                  :rules="[
                    { required: true, message: '请输入联系人职位', trigger: 'blur' }
                  ]">
                  <el-input :maxlength="20" :show-word-limit="false" v-model="dialogForm.contactPosition" placeholder="联系人职位"></el-input>
                </el-form-item>
              </el-col>
            </div>
          </el-card>

          <el-card shadow="">
            <div slot="header" class="clearfix">
              <span>被联系人</span>
            </div>
            <el-card shadow="never" class="marb10" v-for="(item,index) in dialogForm.contactedInfos" style="position:relative;">
              <i class="el-icon-delete text-danger" style="position:absolute;" @click="dialogForm.contactedInfos.splice(index,1);"></i>
              <el-col :span="12">
                <el-form-item 
                  label="姓名：" 
                  :rules="[
                    { required: true, message: '请输入被联系人姓名', trigger: 'blur' }
                  ]">
                  <el-input :maxlength="20" :show-word-limit="false" v-model="item.contactedName" placeholder="被联系人姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item 
                  label="性别：" 
                  :rules="[
                    { required: true, message: '请选择被联系人性别', trigger: 'change' }
                  ]">
                  <el-select v-model="item.contactedSex" placeholder="请选择被联系人性别">
                    <el-option label="男" :value="'男'"></el-option>
                    <el-option label="女" :value="'女'"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item 
                  label="职位：" 
                  :rules="[
                    { required: true, message: '请输入被联系人职位', trigger: 'blur' }
                  ]">
                  <el-input :maxlength="20" :show-word-limit="false" v-model="item.contactedPosition" placeholder="被联系人职位"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item 
                  label="类型：" 
                  :rules="[
                    { required: true, message: '请选择被联系人类型', trigger: 'change' }
                  ]">
                  <el-select v-model="item.contactedType" placeholder="请选择被联系人类型">
                    <el-option label="党代表/党员" :value="1"></el-option>
                    <el-option label="员工群众" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-card>
            <el-col class="marb20">
              <el-button type="primary" size="small" icon="el-icon-plus" @click="dialogForm.contactedInfos.push({
                contactedName: null,
                contactedPosition: null,
                contactedSex: null,
                contactedType: null
              })">添 加</el-button>
            </el-col>
          </el-card>

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
          contactName:        null,
          contactedName:      null,
          pageNum:    this.common.elementPagination.pageNumDefault,
          pageSize:   this.common.elementPagination.pageSizeDefault,
          orgId:      Number(sessionStorage.getItem('Access-OrgId')),
        },

        tableData:    {rows:[],total:0},

        dialogVisible:false,
        dialogLoading:false,
        dialogType:'add',
        dialogForm:   {
          contactName: null,
          contactPosition: null,
          contactedInfos: [
            {
              contactedName: null,
              contactedPosition: null,
              contactedSex: null,
              contactedType: null
            }
          ],
          createOrg: Number(sessionStorage.getItem('Access-OrgId')),
          creator:   Number(sessionStorage.getItem('Access-Key')),
        },

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
       * 区分不同类型的被联系人
       * @param  {[type]} data [description]
       * @param  {[type]} type [description]
       * @return {[type]}      [description]
       */
      differ(data,type){
        let arr = [];
        data.forEach( function(element, index) {
          if(type==element.contactedType){
            arr.push(element)
          }
        });
        return arr;
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
        this.dialogForm.contributionFiles = [response]
      },
      /**
       * 点击删除文件
       * @author chuanlin.Xiao
       * @date   2020-01-06T14:59:36+0800
       * @param  {[type]}                 tag [description]
       * @return {[type]}                     [description]
       */
      handleClose(tag) {
        this.dialogForm.contributionFiles = [];
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

        form.dateVal ? form.sTime = form.dateVal[0] : delete form.sTime;
        form.dateVal ? form.eTime = form.dateVal[1] : delete form.eTime;
        // delete form.dateVal

        this.axios.post(`${this.common.basePath}/triad/list`,form).then((response) => {
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
        this.dialogForm =  {
          contactName: null,
          contactPosition: null,
          contactedInfos: [
            {
              contactedName: null,
              contactedPosition: null,
              contactedSex: null,
              contactedType: null
            }
          ],
          createOrg: Number(sessionStorage.getItem('Access-OrgId')),
          creator:   Number(sessionStorage.getItem('Access-Key')),
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
        this.dialogType = 'edit';
        this.dialogVisible = true;
        this.dialogForm = JSON.parse(JSON.stringify(data))
        // this.dialogLoading = true;
        // this.axios.get(`${this.common.basePath}/triad/detail/${data.id}`).then((response) => {
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
              let form = this.dialogForm;
              this.axios.post(`${this.common.basePath}/triad/add`,form).then((response) => {
                this.$message.success(response.meta.message);
                this.query();
                this.bottonLoding = false;
                this.dialogVisible = false;
              }).catch((errorMsg) => {
                this.bottonLoding = false;
                this.$message.error(errorMsg);
              })  
            }else{
              let form = this.dialogForm
              form.uuid = this.dialogForm.uuid;
              form.createOrg = Number(sessionStorage.getItem('Access-OrgId'));
              form.creator = Number(sessionStorage.getItem('Access-Key'));
              this.axios.post(`${this.common.basePath}/triad/update`,form).then((response) => {
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
          this.axios.post(`${this.common.basePath}/triad/delete?uId=${data.uuid}`,{uId:data.uuid}).then((response) => {
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

<style lang="less"> 
  .table-header-class-newsrecord{
    height:80px;
    .cell{
      white-space: normal;
    }
  }
</style>
