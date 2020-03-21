/*************** 书记信箱 *************/
<template>
  <div>  
    <!-- 查询条件 -->
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline search-box marb20" label-width="100px"> 
      <el-form-item label="发送日期：" prop="SETime">
        <el-date-picker
          v-model="searchForm.SETime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="关键词：" prop="keyWords">
        <el-input v-model="searchForm.keyWords" placeholder="" style="width: 400px"></el-input>
      </el-form-item> 
      <el-form-item label="状态:" class="no-border" prop="status">
        <el-select v-model="searchForm.status"> 
          <el-option label="全部"  value=""></el-option>
          <el-option v-if="type=='sender'" v-for="item in statusArr_sender" :label="item.name"  :value="item.id"></el-option>
          <el-option v-if="type=='recipient'" v-for="item in statusArr_receiver" :label="item.name"  :value="item.id"></el-option>
        </el-select>
    </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryList">搜索</el-button>
        <el-button type="primary" @click="$refs.searchForm ? $refs.searchForm.resetFields() : '';">置空</el-button>
      </el-form-item>
    </el-form> 

    <el-row class="">
      <el-row> 
        <el-col :span="24">
          <!-- 部门简介 -->
          <el-card class="padb20" v-loading="isLoad"> 
            <div slot="header" class="clearfix marb15">
              <span class="el-card-have-border-span">信件</span> 
              <div class="el-card-head-btn">
                <el-button v-if="type=='sender'" type="primary" size="small" @click=" $router.push({name: 'PMCreateMailbox', params: {org_id: orgId, org_name: orgName}}) ">写信</el-button> 
              </div>
            </div> 
            <el-table  
              v-loading="isLoad" 
              border
              class="mart20"
              :data="tableData.rows" > 
              <el-table-column
                label="#"
                type="index"
                align="center"
                :index="(index) => (common.pageIndexFun(index, searchForm.pageNum))">
              </el-table-column> 
              <el-table-column prop="send_title" label="标题" show-overflow-tooltip align="center"></el-table-column> 
              <el-table-column prop="recipient_org_name" label="接收单位" show-overflow-tooltip v-if="type=='sender'" align="center">
              </el-table-column>
              <el-table-column prop="sender_name" label="发送人" show-overflow-tooltip v-if="type=='recipient'" align="center">
                <template slot-scope="scope"> 
                  <p class="mart10" v-if="scope.row.anonymous==0">{{scope.row.sender_name ? scope.row.sender_name : '无'}}</p>
                  <p class="mart10" v-if="scope.row.anonymous==1">【匿名】</p>
                </template>
              </el-table-column>
              <el-table-column prop="send_time" label="发送日期" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.cur_status&&scope.row.cur_status!=1">{{common._convertDate(scope.row.send_time, 'yyyy年MM月dd日')}}</span>
                  <span v-else>无</span>
                </template>
              </el-table-column> 
              <el-table-column prop="cur_status" label="状态" width="130" show-overflow-tooltip align="center">
                <template slot-scope="scope"> 
                  {{ statusConvert(scope.row.cur_status) }}
                </template>
              </el-table-column> 
              <el-table-column
                label="操作"
                fixed="right"
                align=""
                header-align="center"
                width="180">
                <template slot-scope="scope">
                  <div v-if="type=='sender'">
                    <el-button v-if="scope.row.cur_status == 1" @click=" sendMail(scope.row) " type="success" size="mini" :disabled="btnLoading==scope.row.id" v-loading="btnLoading==scope.row.id" element-loading-spinner="el-icon-loading" element-loading-background="rgba(103, 194, 58, 0.8)">发送</el-button>
                    <el-button v-if="scope.row.cur_status == 2" @click=" cancelMail(scope.row) " type="warning" size="mini" :disabled="btnLoading==scope.row.id" v-loading="btnLoading==scope.row.id" element-loading-spinner="el-icon-loading" element-loading-background="rgba(103, 194, 58, 0.8)">撤回</el-button>
                    <el-button v-if="scope.row.cur_status == 4" @click=" $router.push({name: 'PMSecretaryMailboxDetail', params: {mailbox_id: scope.row.id, operation_type: 'feedback'}}) " type="primary" size="mini">反馈</el-button> 
                    <el-button @click=" $router.push({name: 'PMSecretaryMailboxDetail', params: {mailbox_id: scope.row.id, operation_type: 'check'}}) " type="" size="mini">阅读</el-button>
                  </div>
                  <div v-if="type=='recipient'">
                    <el-button v-if="scope.row.cur_status == 2||scope.row.cur_status == 3" @click=" $router.push({name: 'SecretaryMailboxDetail', params: {mailbox_id: scope.row.id, operation_type: 'reply'}}) " type="primary" size="mini">处理</el-button> 
                    <el-button @click=" $router.push({name: 'SecretaryMailboxDetail', params: {mailbox_id: scope.row.id, operation_type: 'check'}}) " type="" size="mini">阅读</el-button>
                  </div>
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
</template>

<script> 
  export default {
    props: {
      orgId: {
        default: null,
        required: true,
      },
      orgName: {
        default: null,
        required: true,
      },
      type: {
        default: 'sender',
        required: true,
      },
      showStatus:{
        default: null,
        required: true,
      },
    },
    data() {
      return { 
        isLoad:       true, 
        btnLoading:   false,
        statusArr:[
          {id:1,name:'待发送'},{id:2,name:'已发送'},{id:3,name:'已阅读'},
          {id:4,name:'已处理'},{id:5,name:'已撤回'},{id:6,name:'已反馈'}
        ],
        statusArr_sender:[
          {id:1,name:'待发送'},{id:2,name:'已发送'},{id:3,name:'已阅读'},
          {id:4,name:'已处理'},{id:5,name:'已撤回'},{id:6,name:'已反馈'}
        ],
        statusArr_receiver:[
          {id:2,name:'待处理'},{id:3,name:'已阅读'},
          {id:4,name:'已处理'},{id:6,name:'已反馈'}
        ],
        assessKey:    sessionStorage.getItem('Access-Key'),
        tableData:    {total: 0, rows: []},
        searchForm: {         
          keyWords:       null, 
          status:         this.showStatus,
          sSendMailTime:  null,
          eSendMailTime:  null,
          pageNum:        this.common.elementPagination.pageNumDefault,
          pageSize:       this.common.elementPagination.pageSizeDefault,
          SETime:         [],
          sender:         sessionStorage.getItem('Access-Key'),
          recipient:      sessionStorage.getItem('Access-Key'),
        },     
        selectIdsList:    null,
      }
    },
    components: {  
    },
    watch: {
    },
    created () {
    },
    mounted() {  
      this.queryList(); 
    },
    methods: {  
      statusConvert(cur_status){ 
        let result = '00';
        let arr = this.type=='sender'? this.statusArr_sender : this.statusArr_receiver;
        this.statusArr.forEach( function(element, index) {
          // statements
          if(element.id == cur_status){
            result = element.name;
            return result;
          }
        });
        return result;
      },
      queryList(){ 
        const form = {
          ...this.searchForm,
          sSendMailTime: this.searchForm.SETime ? new Date(this.searchForm.SETime[0]).getTime() : null,
          eSendMailTime: this.searchForm.SETime ? new Date(this.searchForm.SETime[1]).getTime() : null,
        }
        delete form.SETime
        this.type == 'sender' ? delete form.recipient :　delete form.sender;
        this.searchForm.keyWords==''?this.searchForm.keyWords=null:''

        this.isLoad = true; 
        this.axios.post(`${this.common.basePath}/mailbox/list`, form).then((response) => {
          this.tableData = response.data;
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
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
        this.queryList();  
       },
      /*
       * 改变每页条数触发此事件
       * @param {number} val 当前数据
       */
      handleSizeChange(val, type){  
        this.searchForm.pageSize = val;
        this.queryList();  
       },  
      /**
       * 修改申请状态
       * @param  {[type]} id     [需要被修改的申请Id]
       * @param  {[type]} status [指定状态]
       * @return {[type]}        [description]
       */
      updateStatus(id, status){
        this.axios.post(`${this.common.basePath}/party/update`, {ids: id, approval_status: status}).then((response) => {
          this.$message.success(response.meta.message);
          this.queryList();
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })  
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

      /**
       * 发送邮件
       */
      sendMail(data){
        this.btnLoading = data.id;

        const form = {
          keyWords:        data.key_words,
          recipient:       data.recipient,
          recipientName:   data.recipient_name,
          sendContent:     data.send_content,
          sendFile:        data.send_file,
          sendTime:        new Date().getTime(),
          sendTitle:       data.send_title,
          sender:          data.sender,
          senderName:      data.sender_name,
          anonymous:       data.anonymous,
          recipientOrg:    data.recipient_org,
          cur_status:      2,
          id:              data.id,
        }

        this.axios.post(`${this.common.basePath}/mailbox/update`,form ).then((response) => {
          this.$message.success(response.meta.message);
          this.queryList();
          this.btnLoading = false;
        }).catch((errorMsg) => { 
          this.btnLoading = false;
          this.$message.error(errorMsg)
        })
      },
      /**
       * 撤回邮件
       */
      cancelMail(data){
        this.btnLoading = data.id;

        const form = {
          keyWords:        data.key_words,
          recipient:       data.recipient,
          recipientName:   data.recipient_name,
          sendContent:     data.send_content,
          sendFile:        data.send_file,
          sendTime:        data.send_time,
          sendTitle:       data.send_title,
          sender:          data.sender,
          senderName:      data.sender_name,
          anonymous:       data.anonymous,
          recipientOrg:    data.recipient_org,
          cur_status:      5,
          id:              data.id,
        }

        this.axios.post(`${this.common.basePath}/mailbox/update`,form ).then((response) => {
          this.$message.success(response.meta.message);
          this.queryList();
          this.btnLoading = false;
        }).catch((errorMsg) => { 
          this.btnLoading = false;
          this.$message.error(errorMsg)
        })
      },
    },
  }
</script>

<style scoped lang="less"> 
</style>
