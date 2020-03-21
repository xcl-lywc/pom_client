/*************** 下级任务详情（组织任务详情） *************/

<template>
  <el-row>
    <div class="content-wrap"> 
      <div class="content-wrap-box">
        <el-card class="content-title-card" shadow="never">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-if="jobName!='职工首页'&&jobName!='党员首页'" :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
            <el-breadcrumb-item v-if="jobName=='党员首页'" :to="{ name: 'PartyMemberHome' }">首页</el-breadcrumb-item> 
            <el-breadcrumb-item v-if="jobName=='职工首页'" :to="{ name: 'StaffAndWorkersHome' }">首页</el-breadcrumb-item>  
            <el-breadcrumb-item>任务管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'PartyCommitteeDownTask' }">组织任务</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
        <div class="theme-main"> 
          <!-- 任务详情 -->
          <el-card class="marb20" v-loading="isLoad">
            <div slot="header" class="clearfix marb15">
              <span :class="{'el-card-have-border-span':false}">任务详情</span>  
              <div class="el-card-head-btn"></div>
            </div>  
            <el-row v-if="detailData">
              <el-form :inline="false" size="small">
                <el-col :span="12">
                  <el-form-item label="任务类型：">{{detailData.taskTypeName}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="发布单位：">{{detailData.createOrgName}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="任务名称：">{{detailData.taskName}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="任务状态：">
                    <el-tag v-if="detailData.curStatus==20">删除</el-tag>
                    <el-tag type="success" v-if="detailData.curStatus==1">进行中</el-tag>
                    <el-tag type="warning" v-if="detailData.curStatus==2">已结束</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="发布时间：">{{common._convertDate(detailData.createTime, 'yyyy/MM/dd hh:mm')}}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="截止时间：">{{common._convertDate(detailData.endTime, 'yyyy/MM/dd hh:mm')}}</el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="任务附件：">
                    <file-show :fileList="detailData.privateFiles?JSON.parse(detailData.privateFiles):[]" :closable="false"></file-show>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="任务内容：">
                    <!-- <el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="detailData.taskContent" disabled></el-input> -->
                    <div class="desc-box">{{detailData.taskContent}}</div>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
          </el-card>
          <!-- 完成情况 -->
          <el-card class="marb20" v-loading="isLoad">
            <div slot="header" class="clearfix marb15">
              <span class="el-card-have-border-span">完成情况</span>  
              <div class="el-card-head-btn"></div>
            </div>  
            <el-row v-if="detailData">
              <el-collapse accordion @change="collapseChange">
                <div v-if="detailData.assigneeVos&&detailData.assigneeVos.length>0">
                  <el-collapse-item v-for='(item,index) in detailData.assigneeVos' :name="(index+1)+'-'+item.assignee+'-'+item.assigneeType">
                    <template slot="title">
                      <div>
                        {{item.assigneeName}}
                      </div>
                      <div style="position: absolute;right: 50px;">
                        <span v-if="item.curStatus==2">已完成</span>
                        <span v-if="item.curStatus==1">未完成</span>
                        <el-button type="text" class="marl20">{{item.tasScore}}分</el-button>
                        <el-button type="primary" class="marl20" size="mini" @click.native.stop="score('dialogForm',item)">评分</el-button>
                      </div>
                    </template>
                    <el-table
                      :data="tableData.rows"
                      stripe
                      border
                      style="width: 100%">
                      <el-table-column fixed label="序号" type="index" width="50" align='center'></el-table-column>
                      <el-table-column prop="processDefinitionName" label="工作记录名称" show-overflow-tooltip width=""  align='center'></el-table-column>
                      <el-table-column prop="beginTime" label="开始时间" show-overflow-tooltip width=""  align='center'>
                        <template slot-scope="scope">
                          {{common._convertDate(scope.row.beginTime, 'yyyy/MM/dd hh:mm')}}
                        </template>
                      </el-table-column>
                      <el-table-column prop="endTime" label="结束时间" show-overflow-tooltip width=""  align='center'>
                        <template slot-scope="scope">
                          {{common._convertDate(scope.row.endTime, 'yyyy/MM/dd hh:mm')}}
                        </template>
                      </el-table-column>
                      <el-table-column prop="curStatus" label="状态" show-overflow-tooltip width=""  align='center'>
                        <template slot-scope="scope">
                          <el-tag v-if="scope.row.curStatus==1" type="success ">进行中</el-tag>
                          <el-tag type="warning" v-if="scope.row.curStatus==2">已结束</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column prop="taskScoreAvg" label="积分" show-overflow-tooltip width=""  align='center'></el-table-column>
                      <el-table-column fixed="right" label="工作记录" width="80" align='center'>
                        <template slot-scope="scope">
                          <el-button type="" size="small" @click='dialogFormVisible = true;opreationData = scope.row;'>查看</el-button>
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
                      @size-change="pageSizeChange($event,(index+1)+'-'+item.assignee+'-'+item.assigneeType)"
                      @current-change="pageCurrentChange($event,(index+1)+'-'+item.assignee+'-'+item.assigneeType)">
                    </el-pagination> 
                  </el-collapse-item>
                </div>
                <div v-else class="no-data">
                  暂无数据
                </div>
              </el-collapse>
            </el-row>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 评分 -->
    <el-dialog title="评分" :visible.sync="dialogVisible" width="800px">
      <el-form ref="dialogForm"  :model="dialogForm" label-width="120px" v-loading="dialogLoading">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="评分：" prop="taskScore"
              :rules="[
                { required: true, message: '请输入评分', trigger: 'blur' }
              ]">
              <el-input-number v-model="dialogForm.taskScore" :min="0" :max="10"></el-input-number> 分
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="备注：" prop="description"
              :rules="[
                { required: true, message: '请输入内容', trigger: 'blur' }
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

    <!-- 表单详情 -->
    <el-dialog title="详情" :visible.sync="dialogFormVisible" width="800px" :show-close="true">
      <el-row v-loading="dialogLoading" :gutter="20">
        <el-col :span="24">
          <form-info :data='opreationData' :type='2'></form-info>
        </el-col>
      </el-row>
    </el-dialog>
  </el-row>  
</template>

<script>
  import LeftMenu from '../components/LeftMenu'
  import upload from "../../../components/Upload.vue"
  import FileShow from "../../../components/FileShow.vue"
  import FormInfo from "../../../components/CostomFormInfo.vue"
  export default {
    data() {
      return { 
        orgId:           Number(sessionStorage.getItem('Access-OrgId')),
        assessKey:       Number(sessionStorage.getItem('Access-Key')),
        jobName:         sessionStorage.getItem('jobName'),// 党员首页/职工首页/党委、党小组、党支部名称
        isLoad:          true,
        paramsId:        this.$route.params.id,
        bottonLoding:    false,

        searchForm:{
          pageNum:         this.common.elementPagination.pageNumDefault,
          pageSize:        this.common.elementPagination.pageSizeDefault,
        },

        detailData:    null,
        tableData:     {rows:[],total:0},

        dialogVisible:false,
        dialogLoading:false,
        dialogForm:   {
          taskScore:          null,
          description:        null,
        },
        toScoreData:  null,// 去评分的数据

        // 表单详情 
        dialogFormVisible:false,
        opreationData: null,// 被操作的某一个任务数据
      }
    },
    computed:{
      
    },
    components: { 
      LeftMenu,
      upload,
      FileShow,
      FormInfo
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
       * 分页
       * @author chuanlin.Xiao
       * @date   2020-01-06T10:13:24+0800
       * @param  {[type]}                 val [description]
       * @return {[type]}                     [description]
       */
      pageSizeChange(val,data) {
        let index = Number(data.split('-')[0]);// 序号
        let id    = Number(data.split('-')[1]);// 组织或用户id
        let type  = Number(data.split('-')[2]);// 类型,1用户，2组织

        this.searchForm.pageSize = val
        this.query11(id,type)
      },
      pageCurrentChange(val,data) {
        let index = Number(data.split('-')[0]);// 序号
        let id    = Number(data.split('-')[1]);// 组织或用户id
        let type  = Number(data.split('-')[2]);// 类型,1用户，2组织

        this.searchForm.pageNum = val
        this.query11(id,type)
      },
      
      /**
       * 完成情况 折叠面板的change事件
       * @author chuanlin.Xiao
       * @date   2020-01-10T15:47:51+0800
       * @param  {[type]}                 val [description]
       * @return {[type]}                     [description]
       */
      collapseChange(val){

        let index = Number(val.split('-')[0]);// 序号
        let id    = Number(val.split('-')[1]);// 组织或用户id
        let type  = Number(val.split('-')[2]);// 类型,1用户，2组织

        this.searchForm.pageNum = 1;
        this.searchForm.pageSize = 10;

        val==''?'':this.query11(id,type);
      },

      /**
       * 查询
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:18:28+0800
       * @return {[type]}                 [description]
       */
      query() {  
        this.axios.get(`${this.common.basePath}/task/${this.paramsId}`).then((response) => {
          this.detailData = response.data;
          this.isLoad = false;
        }).catch((errorMsg) => {
          this.isLoad = false;
          this.$message.error(errorMsg);
        }) 
      }, 
      /**
       * 获取历史的实例
       * @author chuanlin.Xiao
       * @date   2020-01-10T15:19:18+0800
       * @param  {[type]}                 id,type [description]
       * @return {[type]}                          [description]
       */
      query11(id,type) {  
        let form = {processVariables:{businessTask:this.paramsId,createOrg:id,createUser:id},pageNum:this.searchForm.pageNum,pageSize:this.searchForm.pageSize}
        type==1? form.processVariables.createOrg = null : delete form.processVariables.createUser
        this.axios.post(`${this.common.basePath}/workflow/instance/history`,form).then((response) => {
          this.tableData = response.data ? response.data : {rows:[],total:0};
        }).catch((errorMsg) => {
          this.$message.error(errorMsg);
        }) 
      }, 

      /**
       * 评分
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:50:07+0800
       * @param  {[type]}                 formName [description]
       * @param  {[type]}                 data     [description]
       */
      score(formName,data){
        this.toScoreData = data;
        this.dialogVisible = true;
        this.$refs[formName]?this.$refs[formName].resetFields():'';
      },
      /**
       * 提交表单
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:48:04+0800
       * @param  {[type]}                 formName [description]
       * @return {[type]}                          [description]
       */
      submitForm(formName) {
        let data = this.toScoreData
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.bottonLoding = true;
            let form = {
              assignee:        data.assignee,
              assigneeType:    data.assigneeType,
              creator:         this.assessKey,
              createOrg:       this.orgId,
              taskScore:       this.dialogForm.taskScore,
              description:     this.dialogForm.description,
              taskId:          this.paramsId,
            }
            this.axios.post(`${this.common.basePath}/task/score`,form).then((response) => {
              this.$message.success(response.meta.message);
              this.query();
              this.bottonLoding = false;
              this.dialogVisible = false;
            }).catch((errorMsg) => {
              this.bottonLoding = false;
              this.$message.error(errorMsg);
            }) 
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
    },
  }
</script>

<style scoped lang="less"> 
  
</style>
