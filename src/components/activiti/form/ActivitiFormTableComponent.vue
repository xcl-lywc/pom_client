/***************  流程自定义表单配置表通用组件 *************/

<template>
  <el-row>
    <div class="content-wrap"> 
      <div class="content-wrap-box">
        <el-card class="content-title-card" shadow="never">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-if="jobName!='职工首页'&&jobName!='党员首页'" :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
            <el-breadcrumb-item v-if="jobName=='党员首页'" :to="{ name: 'PartyMemberHome' }">首页</el-breadcrumb-item> 
            <el-breadcrumb-item v-if="jobName=='职工首页'" :to="{ name: 'StaffAndWorkersHome' }">首页</el-breadcrumb-item>  
            <el-breadcrumb-item>{{routeMeta.superior}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{routeMeta.navName}}</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
        <div class="theme-main"> 
          <!-- 搜索条件 -->
          <el-card class="marb20">
            <el-form :inline="true" :model="searchForm" ref="searchForm" size="small">
              <el-form-item label="类型" prop="type" v-if="routeMeta.type==2||routeMeta.type==4">
                <el-select v-model="searchForm.type" placeholder="类型" @change="query();query1();">
                  <el-option :key="'all'" :label="'全部'" :value="'all'"></el-option>
                  <el-option
                    v-for="item in routeMeta.activitiKeyList"
                    :key="item.key"
                    :label="item.name"
                    :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="创建时间" prop="value">
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
                <el-button type="primary" @click="searchForm.pageNum=1;query();(routeMeta.type==2||routeMeta.type==4)?query1():'';" size="small">查询</el-button>
                <el-button type="" @click="rest('searchForm');" size="small">置空</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <!-- 表格数据 -->
          <el-card class="marb20" v-loading="isLoad">
            <div slot="header" class="clearfix marb15">
              <span :class="{'el-card-have-border-span':routeMeta.type!=4}">{{(routeMeta.type==2||routeMeta.type==4)?toType(searchForm.type):''}}{{routeMeta.navName}}表</span>  
              <div class="el-card-head-btn" v-if="routeMeta.type!=4&&routeMeta.type!=2">

                <el-button type="primary" v-if="jobName!='职工首页'&&jobName!='党员首页'" size="small" @click="$router.push({name: 'MFActivitiFormCreate', params: { key: routeMeta.type==2?searchForm.type:routeMeta.activitiKey, type:routeMeta.type}});storageData();">{{routeMeta&&routeMeta.type==3?'申 请':'创 建'}}</el-button>
                
                <!-- 
                  {{partyStatus}}
                  用户状态 4入党申请 3积极分子 2预备党员 1正式党员 20删除党籍

                  积极分子 == 只能创建转预备
                  预备党员 == 只能创建转正
                  正式党员 == 都不能创建
                -->
                <div v-if="jobName=='党员首页'">
                  <div v-if="routeMeta&&routeMeta.type==3&&partyStatus">
                    <el-button v-if="routeMeta.navName=='入党申请'&&false" type="primary" size="small" @click="$router.push({name: 'PMActivitiFormCreate', params: { key: routeMeta.type==2?searchForm.type:routeMeta.activitiKey, type:routeMeta.type}});storageData();">申 请</el-button>
                    <el-button v-if="routeMeta.navName=='转正申请'&&partyStatus==2" type="primary" size="small" @click="$router.push({name: 'PMActivitiFormCreate', params: { key: routeMeta.type==2?searchForm.type:routeMeta.activitiKey, type:routeMeta.type}});storageData();">申 请</el-button>
                    <el-button v-if="routeMeta.navName=='转预备申请'&&partyStatus==3" type="primary" size="small" @click="$router.push({name: 'PMActivitiFormCreate', params: { key: routeMeta.type==2?searchForm.type:routeMeta.activitiKey, type:routeMeta.type}});storageData();">申 请</el-button>
                  </div>
                  <div v-else>
                    <el-button type="primary" size="small" @click="$router.push({name: 'PMActivitiFormCreate', params: { key: routeMeta.type==2?searchForm.type:routeMeta.activitiKey, type:routeMeta.type}});storageData();">创 建</el-button>
                  </div>
                </div>

                <el-button type="primary" v-if="jobName=='职工首页'" size="small" @click="$router.push({name: 'SAWActivitiFormCreate', params: { key: routeMeta.type==2?searchForm.type:routeMeta.activitiKey, type:routeMeta.type}});storageData();">{{routeMeta&&routeMeta.type==3?'申 请':'创 建'}}</el-button>
              </div>
              <div class="el-card-head-btn" v-if="routeMeta.type==2">
                <el-dropdown @command="handleCommand" placement="top">
                  <div>
                    <el-button type="primary" size="small">{{routeMeta&&routeMeta.type==3?'申 请':'创 建'}}</el-button>
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="item in routeMeta.activitiKeyList" :command="item.key">{{item.name}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div> 
            </div> 
            <el-row>
              <el-table
                :data="tableData.rows"
                stripe
                border
                style="width: 100%">
                <el-table-column fixed label="序号" type="index" width="50" align='center'></el-table-column>
                <el-table-column prop="endTime" label="创建时间" show-overflow-tooltip width="150"  align='center'>
                  <template slot-scope="scope">
                    {{common._convertDate(scope.row.beginTime, 'yyyy-MM-dd')}}
                  </template>
                </el-table-column>
                <el-table-column prop="curStatus" label="状态" show-overflow-tooltip width="100"  align='center'>
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.curStatus==1" type="success ">进行中</el-tag>
                    <el-tag type="warning" v-if="scope.row.curStatus==2">已结束</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="工作记录表" align='center'>
                  <div v-for="(item,index) in form_list"> 
                    <el-table-column prop="processVariables" :label="item.obj.label" show-overflow-tooltip width=""  align='center' v-if="item.obj.type!='uploads'">
                      <template slot-scope="scope">
                        <div v-if="item.obj.type=='slider'">{{scope.row.processVariables[item.obj.name]}}%</div>
                        <div v-else-if="item.obj.fotmatType=='daterange'">{{scope.row.processVariables[item.obj.name][0]}} 至 {{scope.row.processVariables[item.obj.name][1]}}</div>
                        <div v-else-if="item.obj.type=='uploads'">
                          <file-show :fileList="scope.row.processVariables[item.obj.name]?scope.row.processVariables[item.obj.name]:[]" :closable="false"></file-show>
                        </div>
                        <div v-else>{{scope.row.processVariables[item.obj.name]}}</div>
                      </template>
                    </el-table-column>
                  </div>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100" align='center'>
                  <template slot-scope="scope">
                    <!-- <el-button type="primary" size="small" @click="">编辑</el-button> -->
                    <el-button type="" size="small" @click="view('dialogForm',scope.row)">查看</el-button>
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
    <!-- 详情 -->
    <el-dialog title="详情" :visible.sync="dialogVisible" width="800px">
      <el-form v-if="dialogForm" ref="dialogForm"  :model="dialogForm" label-width="100px" v-loading="dialogLoading">
        <el-row>
          <el-col :span="24">
            <el-form-item 
              label="名称：">
              {{dialogForm.processDefinitionName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="开始时间：">
              {{common._convertDate(dialogForm.beginTime, 'yyyy/MM/dd')}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="截止时间：">
              {{common._convertDate(dialogForm.endTime, 'yyyy/MM/dd')}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="状态：">
              <el-tag v-if="dialogForm.curStatus==1" type="success ">进行中</el-tag>
              <el-tag type="warning" v-if="dialogForm.curStatus==2">已结束</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="工作记录：">
              <form-info :data='dialogForm' :type='2'></form-info>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </el-row>  
</template>

<script>
  import approver from "../../Approver.vue"
  import FormInfo from "../../CostomFormInfo.vue"
  import FileShow from "../../FileShow.vue"
  export default {
    data() {
      return { 
        jobName:          sessionStorage.getItem('jobName'),// 党员首页/职工首页/党委工作台
        routeData:        this.$route,
        routeMeta:        this.$route.meta,
        partyNature:      this.$store.state.partyNature ? this.$store.state.partyNature : sessionStorage.getItem('partyNature'), //组织类型
        orgId:            Number(sessionStorage.getItem('Access-OrgId')),
        assessKey:        Number(sessionStorage.getItem('Access-Key')),
        userBaseInfo:     JSON.parse(sessionStorage.getItem('userBaseInfo')),
        assessToken:      JSON.parse(sessionStorage.getItem('Access-Token')),
        isLoad:           true,
        bottonLoding:     false,
        partyStatus:      null,

        // 查询
        searchForm:{
          pageNum:         this.common.elementPagination.pageNumDefault,
          pageSize:        this.common.elementPagination.pageSizeDefault,
          value:           null,
          type:            'all'
        },

        tableData:    {rows:[],total:0},// 表格
        form_list: [], // 工作记录
        
        // 详情
        dialogVisible:false,
        dialogLoading:false,
        dialogForm:   null,
      }
    },
    components: { 
      approver,
      FormInfo,
      FileShow
    },
    watch: {
    },
    created () {
      this.routeMeta.type==3?this.partyStatusFunction():'';
    },
    mounted() { 
      this.query();
      this.query1();
    },
    methods: { 
      partyStatusFunction(){
        let config = {
          method: "post",
          url: `${this.common.basePath}/party/oneByUserId`,
          params: {id: this.assessKey}
        }
        this.axios(config).then((response) => {
          this.partyStatus = response.data.cur_status
        }).catch((error) => {
          this.isLoad = false;
          this.$message.error(error)
        })
      },
      /**
       * 月度季度年度其他--党员义务
       * @author chuanlin.Xiao
       * @date   2020-03-03T12:00:20+0800
       * @param  {[type]}                 command [description]
       * @return {[type]}                         [description]
       */
      handleCommand(command) {
        if(this.jobName!='职工首页'&&this.jobName!='党员首页'){
          this.$router.push({name: 'MFActivitiFormCreate', params: { key: this.routeMeta.type==2?command:this.routeMeta.activitiKey, type:this.routeMeta.type}});
        }
        if(this.jobName=='党员首页'){
          this.$router.push({name: 'PMActivitiFormCreate', params: { key: this.routeMeta.type==2?command:this.routeMeta.activitiKey, type:this.routeMeta.type}});
        }
        if(this.jobName=='职工首页'){
          this.$router.push({name: 'SAWActivitiFormCreate', params: { key: this.routeMeta.type==2?command:this.routeMeta.activitiKey, type:this.routeMeta.type}});
        }
        this.storageData();
      },
      /**
       * 月度、季度、年度、其他转化
       * @param  {[type]} type [description]
       * @return {[type]}      [description]
       */
      toType(type){
        let result = '';
        this.routeMeta.activitiKeyList.forEach( function(element, index) {
          if(element.key == type){
            result = element.name;
            return;
          }
        });
        return result;
      },
      /**
       * 存储 创建activiti表单的上级路由信息
       * @return {[type]} [description]
       */
      storageData(){
        let obj = {
          name:this.routeData.name,
          meta:{
            sup: this.routeData.meta.superior,
            sub: this.routeData.meta.navName,
          }
        }
        sessionStorage.setItem('CreateActivitiForm-SuperiorRouteData', JSON.stringify(obj))
      },
      /**
       * 转化成file-show能展示的数据
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      toFileList(data){
        let fileList = []
        data.forEach( function(element, index) {
          if(element.response&&element.response.meta.code===0){
            let result = {
              name:   element.response.data[0].fileName,
              path:   element.response.data[0].path,
              id: element.response.data[0].fileId
            }
            fileList.push(result)
          }
        });
        return fileList;
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
       * 重置搜索表单
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
       * @date   2020-01-10T16:07:33+0800
       * @return {[type]}                 [description]
       */
      query() { 
        let url =  null;
        let form = {
          pageNum:         this.searchForm.pageNum,
          pageSize:        this.searchForm.pageSize,
          value:           this.searchForm.value,
        }
        form.value? form.beginTime = form.value[0] : delete form.beginTime;
        form.value? form.endTime   = form.value[1] : delete form.beginTime;
        // delete form.value

        if(this.routeMeta&&this.routeMeta.type==1){// 工作台的工作记录查询
          url = `${this.common.basePath}/workflow/instance/history`
          form.keyList =          [this.routeMeta.activitiKey];
          form.processVariables = {
            createOrg:Number(sessionStorage.getItem('Access-OrgId')),
          };
        }

        if(this.routeMeta&&this.routeMeta.type==2){// 职工或党员的工作记录查询（党员义务）
          url = `${this.common.basePath}/workflow/instance/history/user`
          form.keyList =          this.searchForm.type!='all'?[this.searchForm.type]:[];
          form.processVariables = {
            createUser:Number(sessionStorage.getItem('Access-Key'))
          };
          if(this.searchForm.type=='all'){
            this.routeMeta.activitiKeyList.forEach( function(element, index) {
              form.keyList.push(element.key);
            });
          }
        }

        if(this.routeMeta&&this.routeMeta.type==3){// 申请入党、转正、转预备的工作记录查询
          url = `${this.common.basePath}/workflow/instance/history/user`
          form.keyList =          [this.routeMeta.activitiKey];
          form.processVariables = {
            createUser:Number(sessionStorage.getItem('Access-Key'))
          };
        }

        if(this.routeMeta&&this.routeMeta.type==4){// 工作台党员义务的工作记录查询
          url = `${this.common.basePath}/workflow/instance/history`
          form.keyList =          this.searchForm.type!='all'?[this.searchForm.type]:[];
          form.processVariables = {
            submitOrg:     Number(sessionStorage.getItem('Access-OrgId')),
          };
          if(this.searchForm.type=='all'){
            this.routeMeta.activitiKeyList.forEach( function(element, index) {
              form.keyList.push(element.key);
            });
          }
        }

        this.axios.post(url,form).then((response) => {
          this.tableData = response.data ? response.data : {rows:[],total:0};
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg);
        })  
      }, 
      /**
       * 通过processDefKey，获取创建表的流程表单
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:18:28+0800
       * @return {[type]}                 [description]
       */
      query1() {  
        let that = this;
        let query = ''
        if(this.routeMeta&&(this.routeMeta.type==1||this.routeMeta.type==3)){
          query = this.routeMeta.activitiKey;
        }
        if(this.routeMeta&&(this.routeMeta.type==2||this.routeMeta&&this.routeMeta.type==4)){
          if(this.searchForm.type=='all'){query=this.routeMeta.activitiKeyList[0].key;}else{query=this.searchForm.type;} 
        }
        this.axios.get(`${this.common.basePath}/workRecord/first/form?processDefKey=${query}`).then((response) => { 
          this.form_list = response.data.formData
          // let form_list = response.data.formData
          // this.form_list = this.common.returnActivitiFormList(form_list);
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.form_list = []
          this.$message.error(errorMsg);
        }) 
      }, 

      /**
       * 查看详情
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:50:07+0800
       * @param  {[type]}                 formName [description]
       * @param  {[type]}                 data     [description]
       */
      view(formName,data){
        // console.log(data)
        this.dialogVisible = true;
        this.dialogLoading = true;
        this.dialogForm = JSON.parse(JSON.stringify(data))
        this.dialogLoading = false;
      },
    },
  }
</script>

<style scoped lang="less"> 
  
</style>
