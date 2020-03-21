/*************** 录入申请 *************/
<template>
  <el-row>
    <div class="content-wrap"> 
      <div class="content-wrap-box">
        <el-card class="content-title-card" shadow="never">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
            <el-breadcrumb-item>组织架构</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'PartyRoster'}">党员花名册</el-breadcrumb-item>
            <el-breadcrumb-item>录入申请</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
        <div class="theme-main"> 
          <!-- 查询条件 -->
          <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline search-box marb20"> 
            <el-form-item label="姓名：" prop="user_name">
              <el-input v-model="searchForm.user_name" placeholder="" style="width: 400px"></el-input>
            </el-form-item> 
            <el-form-item label="状态:" class="no-border" prop="party_orgs_id">
              <el-select v-model="searchForm.approval_status">
                <!-- <el-option label="全部"   :value=""></el-option> -->
                <el-option label="已处理" :value="3"></el-option>
                <el-option label="待处理" :value="1"></el-option>
                <el-option label="已同意" :value="0"></el-option>
              </el-select>
          </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryPartyList" size="small">搜索</el-button>
              <el-button type="primary" @click="$refs.searchForm ? $refs.searchForm.resetFields() : '';" size="small">置空</el-button>
            </el-form-item>
          </el-form> 

          <el-card class="pad20">
            <el-row> 
              <el-col :span="24">
                <!-- 部门简介 -->
                <el-card class="padb20" v-loading="isLoad"> 
                  <div slot="header" class="clearfix ">
                    <span>申请列表</span>  
                  </div>
                  <el-table 
                    :row-key="getRowKeys"
                    v-loading="isLoad" 
                    border
                    class="mart20"
                    :data="tableData.rows"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                      :reserve-selection="true"
                      type="selection"
                      width="55">
                    </el-table-column>
                    <el-table-column prop="owner_name" label="申请人"></el-table-column>
                    <el-table-column prop="workBirthFormat" label="申请时间" width="130" show-overflow-tooltip>
                      <template slot-scope="scope"> {{ common._convertDate(scope.row.create_time, 'yyyy年MM月dd日') }}</template>
                    </el-table-column> 
                    <el-table-column prop="glodonDepartmentName" label="所属部门" width="150" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="phone_num" label="移动电话" width="150" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="call_num" label="工作电话" width="150" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="approval_status" label="状态" width="130" show-overflow-tooltip>
                      <template slot-scope="scope"> 
                        {{ statusConvert(scope.row.approval_status) }}
                      </template>
                    </el-table-column> 
                    <el-table-column
                      label="操作"
                      fixed="right"
                      width="160">
                      <template slot-scope="scope">
                        <el-button @click=" updateStatus([scope.row.id], '0') " type="primary" size="mini">确认</el-button>
                        <el-button @click=" updateStatus([scope.row.id], '3') " type="primary" size="mini">拒绝</el-button>
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
                <p class="mart20">
                  <el-button type="primary"  @click=" updateStatus(selectIdsList, '0') " :disabled="!selectIdsList">确认</el-button>
                  <el-button type="primary"  @click=" updateStatus(selectIdsList, '3') " :disabled="!selectIdsList">拒绝</el-button>
                </p>
                </el-card>  
              </el-col>
            </el-row> 
          </el-card> 
        </div>
      </div>
    </div>
  </el-row>  
</template>

<script>
  import LeftMenu from '../components/LeftMenu'
  import DateSelect from '../../../components/Date'
  export default {
    data() {
      return { 
        isLoad:       true,
        orgId:        sessionStorage.getItem('Access-OrgId'),
        assessKey:    sessionStorage.getItem('Access-Key'),
        tableData:    {total: 0, rows: []},
        searchForm: {         
          user_name:       null, 
          party_orgs_id:   Number(sessionStorage.getItem('Access-OrgId')),
          pageNum:         this.common.elementPagination.pageNumDefault,
          pageSize:        this.common.elementPagination.pageSizeDefault,
          approval_status:          1, // 未审批
          status:                   4,// 录入申请
        },     
        selectIdsList:    null,
      }
    },
    components: { 
      LeftMenu,
      'date-select': DateSelect
    },
    watch: {
    },
    created () {
    },
    mounted() {  
      this.queryPartyList(); 
    },
    methods: { 
      statusConvert(cur_status){
        switch(cur_status){
          case 1: 
            return '待处理';
            break;
          case 0: 
            return '已同意';
            break;
          case 3: 
            return '已处理';
            break;
        } 
      },
      queryPartyList(){
        this.isLoad = true; 
        this.axios.post(`${this.common.basePath}/party/list`, this.searchForm).then((response) => {
          this.tableData = response.data;
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.tableData = {total: 0, rows: []};
          this.$message.error(errorMsg)
        })  
      }, 
      /*
       * 改变当前页码触发此事件
       * @param {number} val 当前页码
       * @param {string} type studentList为学生列表类型，memberList为所有成员列表 
       */
      handleCurrentChange(val, type){  
        this.searchForm.pageNum = val;
        this.queryPartyList();  
       },
      /*
       * 改变每页条数触发此事件
       * @param {number} val 当前数据
       */
      handleSizeChange(val, type){  
        this.searchForm.pageSize = val;
        this.queryPartyList();  
       },  
      /**
       * 修改申请状态
       * @param  {[type]} ids     [需要被修改的申请Id]
       * @param  {[type]} status [指定状态]
       * @return {[type]}        [description]
       */
      updateStatus(ids, status){
        // this.axios.post(`${this.common.basePath}/party/update`, {ids: id, approval_status: status}).then((response) => {
        //   this.$message.success(response.meta.message);
        //   this.queryPartyList();
        // }).catch((errorMsg) => {
        //   this.$message.error(errorMsg)
        // })  
        if(status=='3'){// 拒绝
          this.axios.post(`${this.common.basePath}/party/input/reject`, ids).then((response) => {
            this.$message.success(response.meta.message);
            this.queryPartyList();
          }).catch((errorMsg) => {
            this.$message.error(errorMsg)
          })  
        }else if(status=='0'){// 同意
          this.axios.post(`${this.common.basePath}/party/input/sure`, ids).then((response) => {
            this.$message.success(response.meta.message);
            this.queryPartyList();
          }).catch((errorMsg) => {
            this.$message.error(errorMsg)
          }) 
        }
      },  
      /**
       * [getRowKeys description]
       * @return {[type]} [description]
       */
      getRowKeys(row){  
        return row.id;
      }, 
      handleSelectionChange(val){  
        this.selectIdsList = val.map((item) => {return item.id});
      }, 
    },
  }
</script>

<style scoped lang="less"> 
</style>
