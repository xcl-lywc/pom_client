/*************** 职能部门 *************/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
          <el-breadcrumb-item>组织架构</el-breadcrumb-item>
          <el-breadcrumb-item>党员花名册</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
      <div class="theme-main"> 
        <!-- 查询条件 -->
        <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline search-box marb20">
          <el-form-item label="账号：" prop="account">
            <el-input v-model="searchForm.account" placeholder="" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="user_name">
            <el-input v-model="searchForm.user_name" placeholder="" style="width: 400px"></el-input>
          </el-form-item> 
          <!-- ("下属机构类型。1.是党委2.是支部3.是党小组") partyNature -->
          <el-form-item v-if="partyNature != 3 " :label="partyNature == 1 ? '支部' : '小组' " class="no-border" prop="party_orgs_id">
            <el-select v-model="searchForm.party_orgs_id">
              <el-option :value="orgId" label="全部"></el-option>
              <el-option v-for="(item, index) in orgChildren" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryPartyList" size="small">搜索</el-button>
            <el-button type="primary" @click="$refs.searchForm ? $refs.searchForm.resetFields() : '';" size="small">置空</el-button>
          </el-form-item>
        </el-form> 

        <el-row class="">
          <el-row> 
            <el-col :span="24">
              <!-- 部门简介 -->
              <el-card class="padb20" v-loading="isLoad"> 
                <div slot="header" class="clearfix marb15">
                  <span class="el-card-have-border-span">党员列表</span> 
                  <div class="el-card-head-btn">
                    <el-button type="primary" size="small" @click=" dialogAddPartyVisible = true ">添加党员</el-button>
                    <el-button type="primary" size="small" @click=" $router.push({name: 'EntryApplication'}) ">党员录入申请</el-button>
                  </div>
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
                     align="center"
                    width="50">
                  </el-table-column> 
                  <el-table-column prop="account" label="账号" sortable width="150" show-overflow-tooltip  align="center"></el-table-column>
                  <el-table-column prop="owner_name" label="姓名"  align="center"></el-table-column>
                  <el-table-column prop="sex" label="性别"  align="center">
                    <template slot-scope="scope">
                      {{scope.row.sex == 0 ? '男' : '女' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="nation" label="民族"  align="center">
                    <template slot-scope="scope">
                      {{ common._controlTable(scope.row.nation) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="native_place" label="籍贯" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                      {{ common._controlTable(scope.row.native_place) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="birthday" label="出生年月" width="130" show-overflow-tooltip align="center">
                    <template slot-scope="scope"> {{ common._convertDate(scope.row.birthday, 'yyyy年MM月dd日') }}</template>
                  </el-table-column>
                  <el-table-column prop="highest_degree" label="最高学位" align="center">
                    <template slot-scope="scope">
                      {{ common._controlTable(scope.row.highest_degree) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="party_job" label="党内职务" show-overflow-tooltip align="center">
                    <template slot-scope="scope"> 
                      {{ scope.row.party_job }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="administration_job" label="行政职务" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                      {{ scope.row.administration_job }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="technical_position" label="技术职称" width="120" align="center">
                    <template slot-scope="scope">
                      {{common._controlTable(scope.row.technical_position)}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="party_committee_name" label="所属党委" width="150" show-overflow-tooltip align="center">
                  </el-table-column>
                  <el-table-column prop="party_branch_name" label="所属支部" width="150" show-overflow-tooltip align="center">
                  </el-table-column>
                  <el-table-column prop="party_group_name" label="所属党小组" width="150" show-overflow-tooltip align="center">
                  </el-table-column>
                  <el-table-column prop="hire_date" label="参加工作时间" width="130" show-overflow-tooltip align="center">
                    <template slot-scope="scope"> {{ common._showDate(scope.row.hire_date) }}</template>
                  </el-table-column>
                  <el-table-column prop="join_partisan_date" label="入党时间" width="130" show-overflow-tooltip align="center">
                    <template slot-scope="scope"> {{ common._showDate(scope.row.join_partisan_date)}}</template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    fixed="right"
                     align="center"
                    width="160">
                    <template slot-scope="scope">
                      <el-button @click="view('dialogDetailForm',scope.row)" type="primary" size="mini">查看</el-button>
                      <el-button @click="delClick(scope.row.id)" type="danger" size="mini">删除</el-button>
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
            </el-col>
          </el-row> 
        </el-row>

      </div>
    </div>
    <!-- 添加党员 -->
    <el-dialog v-loading="isLoad" title="添加党员" :visible.sync="dialogAddPartyVisible" width="50vw">
      <el-form :inline="true" ref="searchPartyForm"  :model="searchPartyForm" label-width="80px" size="small">
        <el-form-item 
          label="姓名：" prop="userName" >
          <el-input v-model="searchPartyForm.userName"></el-input>
        </el-form-item> 
        <el-form-item 
          label="性别：" prop="sex" >
          <el-select v-model="searchPartyForm.sex">
            <el-option label="全部" value=""></el-option>
            <el-option label="男" value="0"></el-option>
            <el-option label="女" value="1"></el-option>
          </el-select> 
        </el-form-item> 
        <el-form-item 
          label="行政组织：" prop="partyOrganId" label-width="100px">
          <el-cascader :props="props" filterable clearable v-model="searchPartyForm.partyOrganId" :show-all-levels="false" class="w400"></el-cascader>
        </el-form-item> 
        <el-form-item 
          label="" prop="" label-width="0">
          <el-button type="primary" size="small" @click=" searchPartyForm.pageNum = 1;queryUserList() ">搜索</el-button>
        </el-form-item>
         
        <el-card shadow="never" header="您选择的是：">
          <el-tag type="info" class="marl10 marb10 text-primary" v-for="(item, index) in selectUserList" :key="index">{{`${item.f_NAME},`}}</el-tag>
        </el-card>
        <el-card class="mart10" shadow="never">
          <el-table 
            :row-key="getRowKeys"  
            border
            class="mart20"
            :data="userList.rows"
            @selection-change="handleSelectionChange">
            <el-table-column
              :reserve-selection="true"
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>  
            <el-table-column prop="f_NAME" label="姓名"></el-table-column>
            <el-table-column prop="f_CODE" label="账号"></el-table-column>
            <el-table-column prop="f_SEX" label="性别">
              <template slot-scope="scope">
                {{scope.row.f_SEX == 0 ? '男' : '女' }}
              </template>
            </el-table-column> 
            <el-table-column prop="f_DEPT_NAME" label="所属部门" width="150" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="f_ENTERPRISE_EMAIL" label="邮箱" width="250" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="f_MOBILE_PHONE" label="手机" width="150" show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <el-pagination   
           class="fr mart20 marb20"
           background
           @size-change="(val) => handleSizeChange(val,'searchPartyForm')"
           @current-change="(val) => handleCurrentChange(val,'searchPartyForm')"
           :current-page="common.elementPagination.pageNum"
           :page-sizes="common.elementPagination.pageSizes"
           :page-size="common.elementPagination.pageSizeDefault"
           layout="total, sizes, prev, pager, next"
           :total="userList.total">
        </el-pagination>  
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddPartyVisible = false" size="small">取消</el-button>
        <el-button type="primary" @click=" submitParty " size="small">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看 -->
    <el-dialog title="详情" :visible.sync="dialogDetailVisible" width="50vw">
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
  import DateSelect from '../../../components/Date'
  const that = this;
  export default {
    data() {
      let that=this;
      return { 
        isLoad:       true,
        orgId:        sessionStorage.getItem('Access-OrgId'),
        assessKey:    sessionStorage.getItem('Access-Key'),
        partyNature:    sessionStorage.getItem('partyNature'),
        tableData:    {total: 0, rows: []},
        searchForm: {
          account:         null,          
          user_name:       null, 
          party_orgs_id:   sessionStorage.getItem('Access-OrgId'),
          pageNum:         this.common.elementPagination.pageNumDefault,
          pageSize:        this.common.elementPagination.pageSizeDefault,
        },
        dialogAddPartyVisible:  false, 
        searchPartyForm:   { 
          userName:       null,
          sex:            null,
          pageNum:         this.common.elementPagination.pageNumDefault,
          pageSize:        this.common.elementPagination.pageSizeDefault,
          partyOrganId:   [],
        },  
        props:{
          checkStrictly : true,
          lazy:true,
          lazyLoad(node,resolve){
            that.lazyLoad(node,resolve)
          }
        },
        selectUserList:   [], //被选中的人员Id列表
        orgChildren: [],
        userList:       {rows: [], total: 0},

        dialogLoading:false,
        dialogDetailVisible:false,
        dialogDetailForm:   null,
      }
    },
    components: {  
      'date-select': DateSelect
    },
    watch: {
    },
    created () {
    },
    mounted() {  
      this.queryPartyList();
      this.queryOrgChildren();
      this.queryUserList();
    },
    methods: { 
      lazyLoad(node, resolve) {
        // return;
        if (node.level === 0) {
          this.axios({method: "get",url: `${this.common.basePath}/orgsO/list`, params: {id: null}}).then(res => {
            const data = res.data.map((value, i) => ({
              value: value.f_ID,
              label: value.f_FULL_DEPT_NAME,
              leaf: value.f_IS_LEAF
            }));
            // console.log(data)
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(data);
          }).catch(err => { this.$message.error(err); });
        } else if(node.level > 0) {
          this.axios({ method: "get", url: `${this.common.basePath}/orgsO/list`, params: { id: node.value } }) .then(res => {
            const data = res.data.map((value, i) => ({
              value: value.f_ID,
              label: value.f_FULL_DEPT_NAME,
              leaf: value.f_IS_LEAF
            }));
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(data);
          }).catch(err => { this.$message.error(err); });
        } else {
          return resolve([]);
        }
      },
      queryPartyList(){
        this.isLoad = true; 
        let form = this.searchForm;
        form.account == ''? form.account=null:'';
        form.user_name == ''? form.user_name=null:'';
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
      /*
       * 改变当前页码触发此事件
       * @param {number} val 当前页码
       * @param {string} type studentList为学生列表类型，memberList为所有成员列表 
       */
      handleCurrentChange(val, type){  
        this[type].pageNum = val;
        if (type == 'searchForm') {
          this.queryPartyList(); 
        }else{
          this.queryUserList();
        }
       },
      /*
       * 改变每页条数触发此事件
       * @param {number} val 当前数据
       */
      handleSizeChange(val, type){  
        this[type].pageSize = val;
        if (type == 'searchForm') {
          this.queryPartyList(); 
        }else{
          this.queryUserList();
        }
       }, 

      showDetailDialog(item){
        this.mathRandom++;
        this.userId = item.userId;
        this.detailDialogVisible = true;
      },
      delClick(id){
        this.axios.post(`${this.common.basePath}/party/delete`, {ids: [id]}).then((response) => {
          this.$message.success(response.meta.message);
          this.queryPartyList();
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        }) 
        
      },
      /**
       * 查找人员列表
       * @return {[type]} [description]
       */
      queryUserList(){
        let params = {
          pageNum:this.searchPartyForm.pageNum,
          pageSize:this.searchPartyForm.pageSize,
          f_SEX:this.searchPartyForm.sex?this.searchPartyForm.sex:null,
          f_NAME:this.searchPartyForm.userName?this.searchPartyForm.userName:null,
          F_DEPT_ID:this.searchPartyForm.partyOrganId.length>0?this.searchPartyForm.partyOrganId[this.searchPartyForm.partyOrganId.length-1]:null
        }
        this.axios.get(`${this.common.basePath}/userO/list`, {params:params}).then((response) => {
          this.userList = response.data;
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })  
      },
      /**
       * [getRowKeys description]
       * @return {[type]} [description]
       */
      getRowKeys(row){  
        return row.f_ID;
      },
      handleSelectionChange(val){ 
        this.selectUserList = val;
      }, 
      /**
       * 添加党员
       */
      submitParty(){  
        let ids = this.selectUserList.map((item) => {return item.f_ID});
        this.isLoad = true;
        this.axios.post(`${this.common.basePath}/party/add/batch`, {fUserIds: ids, partyOrgId: this.orgId}).then((response) => {
          this.queryPartyList();
          this.$message.success(response.meta.message);
          this.isLoad = false;
          this.dialogAddPartyVisible = false;
        }).catch((errorMsg) => {
          this.isLoad = false;
          this.dialogAddPartyVisible = false;
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
