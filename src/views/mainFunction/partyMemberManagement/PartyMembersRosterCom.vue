/*************** 党员花名册组件 *************/
<template>
  <div> 
    <div> 
      <!-- 搜索条件 -->
      <el-card :class="{'marb20':type=='management'}" :body-style="{ padding: type=='management'?'20px':'20px 20px 0' }">
        <el-form ref="searchForm" :inline="true" :model="searchForm" size="small">
          <el-form-item label="账号：" prop="account">
            <el-input v-model="searchForm.account" placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="user_name">
            <el-input v-model="searchForm.user_name" placeholder="姓名"></el-input>
          </el-form-item> 
          <!-- ("下属机构类型。1.是党委2.是支部3.是党小组") partyNature -->
          <el-form-item v-if="partyNature != 3 " :label="partyNature == 1 ? '支部' : '小组' " class="no-border" prop="party_orgs_id">
            <el-select v-model="searchForm.party_orgs_id" :placeholder="partyNature == 1 ? '支部' : '小组' ">
              <el-option :value="orgId" label="全部"></el-option>
              <el-option v-for="(item, index) in orgChildren" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchForm.pageNum=1;queryPartyList();">搜索</el-button>
            <el-button type="" @click="rest('searchForm');">置空</el-button>
          </el-form-item>
        </el-form> 
      </el-card>
      <!-- 表格数据 -->
      <el-card :class="{'marb20':type=='management'}" v-loading="isLoad" :body-style="{ padding: type=='management'?'20px':'0px 20px 0' }"> 
        <div slot="header" class="clearfix marb15" v-if="type=='management'">
          <span class="">党员列表</span> 
        </div>
        <el-table 
          v-loading="isLoad"
          stripe
          border
          class="mart20"
          :data="tableData.rows">
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column> 
          <el-table-column prop="account" label="账号" sortable width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="owner_name" label="姓名"></el-table-column>
          <el-table-column prop="sex" label="性别">
            <template slot-scope="scope">
              {{scope.row.sex == 0 ? '男' : '女' }}
            </template>
          </el-table-column>
          <el-table-column prop="nation" label="民族">
            <template slot-scope="scope">
              {{ common._controlTable(scope.row.nation) }}
            </template>
          </el-table-column>
          <el-table-column prop="native_place" label="籍贯" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ common._controlTable(scope.row.native_place) }}
            </template>
          </el-table-column>
          <el-table-column prop="birthday" label="出生年月" width="130" show-overflow-tooltip>
            <template slot-scope="scope"> {{ common._convertDate(scope.row.birthday, 'yyyy年MM月dd日') }}</template>
          </el-table-column>
          <el-table-column prop="highest_degree" label="最高学位">
            <template slot-scope="scope">
              {{ common._controlTable(scope.row.highest_degree) }}
            </template>
          </el-table-column>
          <el-table-column prop="party_job" label="党内职务" show-overflow-tooltip>
            <template slot-scope="scope"> 
              {{ scope.row.party_job || "无" }}
            </template>
          </el-table-column>
          <el-table-column prop="administration_job" label="行政职务" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.administration_job || "无" }}
            </template>
          </el-table-column>
          <el-table-column prop="technical_position" label="技术职称" width="120">
            <template slot-scope="scope">
              {{common._controlTable(scope.row.technical_position)}}
            </template>
          </el-table-column>
          <el-table-column prop="party_committee_name" label="所属党委" width="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="party_branch_name" label="所属支部" width="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="party_group_name" label="所属党小组" width="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="hire_date" label="参加工作时间" width="130" show-overflow-tooltip>
            <template slot-scope="scope"> {{ common._showDate(scope.row.hire_date) }}</template>
          </el-table-column>
          <el-table-column prop="join_partisan_date" label="入党时间" width="130" show-overflow-tooltip>
            <template slot-scope="scope"> {{ common._showDate(scope.row.join_partisan_date)}}</template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="85">
            <template slot-scope="scope">
              <el-button @click="view('dialogDetailForm',scope.row)" type="primary" size="mini">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination   
         class="fr mart20"
         background
         @size-change="(val) => handleSizeChange(val,'searchForm')"
         @current-change="(val) => handleCurrentChange(val,'searchForm')"
         :current-page="common.elementPagination.pageNum"
         :page-sizes="common.elementPagination.pageSizes"
         :page-size="common.elementPagination.pageSizeDefault"
         layout="total, sizes, prev, pager, next"
         :total="tableData.total">
        </el-pagination>  
      </el-card>
    </div>
    <!-- 查看 -->
    <el-dialog title="详情" :visible.sync="dialogDetailVisible" width="800px">
      <el-form v-if="dialogDetailForm" ref="dialogDetailForm"  :model="dialogDetailForm" label-width="120px" v-loading="dialogLoading">
        <el-row>
          <div class="overflow-hidden">
            <el-col :span="12">
              <el-form-item 
                label="" prop="owner_name">
                <p class="text-bold h1">{{dialogDetailForm.owner_name}}<el-divider direction="vertical"></el-divider>{{dialogDetailForm.account}}</p>
                <p>
                  <i class="el-icon-male text-primary" v-if="dialogDetailForm.sex==0||!dialogDetailForm.sex"></i>
                  <i class="el-icon-female text-danger" v-else></i>
                  <el-divider direction="vertical"></el-divider>
                  {{dialogDetailForm.nation?common._controlTable(dialogDetailForm.nation):'民族'}}
                  <el-divider direction="vertical"></el-divider>
                  {{dialogDetailForm.native_place?common._controlTable(dialogDetailForm.native_place):'籍贯'}}
                  <el-divider direction="vertical"></el-divider>
                  {{dialogDetailForm.birthday?common._convertDate(dialogDetailForm.birthday, 'yyyy年MM月'):'出生年月'}}
                  <el-divider direction="vertical"></el-divider>
                  {{dialogDetailForm.highest_degree?common._controlTable(dialogDetailForm.highest_degree):'最高学位'}}
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
              label="党内职务：" prop="party_job">
              {{dialogDetailForm.party_job}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="行政职务：" prop="administration_job">
              {{dialogDetailForm.administration_job}}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="技术职称：" prop="technical_position">
              {{common._controlTable(dialogDetailForm.technical_position)}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="所属党委：" prop="party_committee_name">
              {{dialogDetailForm.party_committee_name}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="所属支部：" prop="party_branch_name">
              {{dialogDetailForm.party_branch_name}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="所属党小组：" prop="party_group_name">
              {{dialogDetailForm.party_group_name}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="参加工作时间：" prop="hire_date">
              {{common._showDate(dialogDetailForm.hire_date)}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="入党时间：" prop="join_partisan_date">
              {{common._showDate(dialogDetailForm.join_partisan_date)}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="邮箱：" prop="email">
              {{dialogDetailForm.email}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="联系电话：" prop="phone_num">
              {{dialogDetailForm.phone_num}}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="地址：" prop="address">
              {{`
                ${common._countyDataByIdConvert(dialogDetailForm.province) }
                ${common._countyDataByIdConvert(dialogDetailForm.city)}
                ${common._countyDataByIdConvert(dialogDetailForm.county)}
                ${dialogDetailForm.address}
              `}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div> 
</template>

<script> 
  export default {
    data() {
      return { 
        isLoad:       true,

        tableData:    {total: 0, rows: []},
        searchForm: {
          account:         null,          
          user_name:       null, 
          pageNum:         this.common.elementPagination.pageNumDefault,
          pageSize:        this.common.elementPagination.pageSizeDefault,
          party_orgs_id:   this.orgId,
        },
  
        orgChildren: [],

        dialogLoading:false,
        dialogDetailVisible:false,
        dialogDetailForm:   null,
      }
    },
    props:{
      orgId:null,
      partyNature:null,
      type:null,// home党员首页 、management党员管理
    },
    components: {  
      
    },
    watch: {
      orgId(newValue,oldValue){
        if(newValue){
          this.searchForm.party_orgs_id = newValue;
          this.orgId = newValue;

          this.queryPartyList();
          this.queryOrgChildren();
        }
      },
      partyNature(newValue,oldValue){
        if(newValue){
          this.partyNature = newValue;

          this.queryPartyList();
          this.queryOrgChildren();
        }
      },
    },
    created () {
      
    },
    mounted() {  
      this.queryPartyList();
      this.queryOrgChildren();
    },
    methods: { 
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
      /*
       * 改变当前页码触发此事件
       * @param {number} val 当前页码
       * @param {string} type studentList为学生列表类型，memberList为所有成员列表 
       */
      handleCurrentChange(val, type){  
        this[type].pageNum = val;
        if (type == 'searchForm') {
          this.queryPartyList(); 
        }else{}
       },
      /*
       * 改变每页条数触发此事件
       * @param {number} val 当前数据
       */
      handleSizeChange(val, type){  
        this[type].pageSize = val;
        if (type == 'searchForm') {
          this.queryPartyList(); 
        }else{}
       }, 


      /**
       * 查询党员列表
       * @author chuanlin.Xiao
       * @date   2020-03-04T16:14:48+0800
       * @return {[type]}                 [description]
       */
      queryPartyList(){
        this.isLoad = true; 
        let party_orgs_id = this.searchForm.party_orgs_id;
        let form = {
          account:         this.searchForm.account==''?'':this.searchForm.account,          
          user_name:       this.searchForm.user_name==''?'':this.searchForm.user_name, 
          pageNum:         this.searchForm.pageNum,
          pageSize:        this.searchForm.pageSize,
          party_orgs_id:   party_orgs_id,
        }
        this.axios.post(`${this.common.basePath}/party/list`, form).then((response) => {
          this.tableData = response.data;
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg)
        })  
      },
      /**
       * 
       * 查询支部列表
       * orgType 组织类别 1.机构 2.部门
       * partyNature 下属机构类型。1.是党委 2.是支部 3.是党小组
       * @return {[type]} [description]
       */
      queryOrgChildren() {  
        let tempPartyNature = this.partyNature == 1 ? 2 : 3;
        this.axios.post(`${this.common.basePath}/org/children`, {orgId: this.orgId ,orgType: 1, partyNature: tempPartyNature}).then((response) => {
          this.orgChildren = response.data.rows ? response.data.rows : [];
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
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
