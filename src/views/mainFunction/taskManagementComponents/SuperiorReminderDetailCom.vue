/*************** 上级通知-详情组件（职工和党员、工作台） *************/
<template>
  <el-form v-if="dialogDetailForm" label-width="120px" v-loading="dialogLoading">
    <el-row>
      <el-col :span="12">
        <el-form-item 
          label="创建单位：" prop="createOrgName">
          {{dialogDetailForm.createOrgName}}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item 
          label="提醒类型：" prop="taskTypeName">
          {{dialogDetailForm.taskTypeName}}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item 
          label="通知标题：" prop="taskName">
          {{dialogDetailForm.taskName}}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item 
          label="发布时间：" prop="createTime">
          {{common._convertDate(dialogDetailForm.createTime, 'yyyy/MM/dd hh:mm')}}
        </el-form-item>
      </el-col>
      <!-- <el-col :span="12">
        <el-form-item 
          label="截止时间：" prop="endTime">
          {{common._convertDate(dialogDetailForm.endTime, 'yyyy/MM/dd hh:mm')}}
        </el-form-item>
      </el-col> -->
      <el-col :span="12">
        <el-form-item 
          label="关键字：" prop="keyWords">
          {{dialogDetailForm.keyWords}}
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item 
          :label="(jobName=='职工首页'||jobName=='党员首页')?'接收人：':'接收单位：'" prop="assigneeVos">
          <el-table
            :show-header = 'false'
            :row-class-name="setClassName"
            :data="dialogDetailForm.assigneeVos?dialogDetailForm.assigneeVos:[]"
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-card class="box-card-expand">
                  <div slot="header">
                    <span>班子成员</span>
                  </div>
                  <el-table
                    :data="scope.row.orgAssigneeDetail?scope.row.orgAssigneeDetail:[]"
                    :show-header = 'false'
                    style="width: 100%">
                    <el-table-column prop="assigneeName" label="名称" width=""></el-table-column>
                    <el-table-column prop="read" label="状态" width="">
                      <template slot-scope="scopes">
                        <el-tag v-if="!scopes.row.read">未读</el-tag>
                        <el-tag v-if="scopes.row.read" type="success">已读</el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </template>
            </el-table-column>
            <el-table-column prop="assigneeName" label="名称" width=""></el-table-column>
            <el-table-column prop="read" label="状态" width="">
              <template slot-scope="scope" v-if="scope.row.assigneeType==1">
                <el-tag v-if="!scope.row.read">未读</el-tag>
                <el-tag v-if="scope.row.read" type="success">已读</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item 
          label="通知内容：" prop="taskContent">
          <!-- <el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="dialogDetailForm.taskContent" disabled></el-input> -->
          <div class="desc-box">{{dialogDetailForm.taskContent}}</div>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item 
          label="附件：" prop="privateFiles">
          <file-show :fileList="dialogDetailForm.privateFiles?JSON.parse(dialogDetailForm.privateFiles):[]" :closable="false"></file-show>
        </el-form-item>
      </el-col>   
    </el-row>
  </el-form>
</template>

<script>
  import FileShow from "../../../components/FileShow.vue"
  export default {
    data() {
      return { 
        orgId:           Number(sessionStorage.getItem('Access-OrgId')),
        assessKey:       Number(sessionStorage.getItem('Access-Key')),
        jobName:         sessionStorage.getItem('jobName'),// 党员首页/职工首页/党委、党小组、党支部名称
        dialogLoading:   false,
        bottonLoding:    false,

        // 详情
        dialogDetailForm:   {},
      }
    },
    components: { 
      FileShow
    },
    props: {
      nId:null, 
    },
    computed:{
      
    },
    watch: {
      'nId'(newValue,oldValue){
        if(newValue){
          this.view(newValue);
        }
      }
    },
    created () {
    },
    mounted() { 
      this.view(this.nId);
    },
    methods: { 
      /**
       * 解决Vue的表格中，expand只有某些行需要展开的问题。
       */
      setClassName({row, index}){
        // 通过自己的逻辑返回一个class或者空
        return row.assigneeType==1 ? 'custom-expand' : '';
      },
      

      /**
       * 查看详情
       * @author chuanlin.Xiao
       * @date   2020-01-07T17:36:13+0800
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      view(data){
        this.dialogLoading = true;
        this.axios.get(`${this.common.basePath}/notice/${data}`).then((response) => {
          this.dialogDetailForm = response.data;
          this.dialogLoading = false;
        }).catch((errorMsg) => {
          this.dialogLoading = false;
          this.$message.error(errorMsg);
        }) 
      },

    },
  }
</script>

<style> 
  .custom-expand .el-table__expand-column .cell {
    display: none;
  }
  .box-card-expand .el-card__header{
    padding: 0px 20px;
  }
</style>
