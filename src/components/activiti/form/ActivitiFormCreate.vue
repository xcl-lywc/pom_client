/*************** 流程自定义表单的创建页面 *************/

<template>
  <el-row>
    <div class="content-wrap"> 
      <div class="content-wrap-box">
        <el-card class="content-title-card" shadow="never">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-if="jobName!='职工首页'&&jobName!='党员首页'" :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
            <el-breadcrumb-item v-if="jobName=='党员首页'" :to="{ name: 'PartyMemberHome' }">首页</el-breadcrumb-item> 
            <el-breadcrumb-item v-if="jobName=='职工首页'" :to="{ name: 'StaffAndWorkersHome' }">首页</el-breadcrumb-item> 
            <el-breadcrumb-item v-if="breadcrumbData" :to="{ name: breadcrumbData.name }">{{breadcrumbData.meta.sup}}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="breadcrumbData" :to="{ name: breadcrumbData.name }">{{breadcrumbData.meta.sub}}</el-breadcrumb-item>
            <el-breadcrumb-item>创建</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
        <div class="theme-main" v-loading="isLoad"> 
          <el-card class="marb20">
            <el-form ref="dialogCompleteForm" :model="dialogCompleteForm" label-width="120px">
              <el-row>
                <el-col :span="24">
                  <el-form-item 
                    v-if="paramsType&&paramsType==2"
                    label="汇报组织：" prop="createOrg"
                    :rules="[
                      { required: true, message: '请选择汇报组织', trigger: 'change' }
                    ]">
                    <el-radio-group v-model="dialogCompleteForm.createOrg" @change="">
                      <el-radio :label="item.id" v-for="(item,index) in myOrg.rows" :key="index">{{item.name}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item 
                    v-if="paramsType&&paramsType==3"
                    label="申报组织：" prop="createOrg"
                    :rules="[
                      { required: true, message: '请选择申报组织', trigger: 'change' }
                    ]">
                    <el-cascader @change="cascaderChange" @focus="cascaderFocus" :options="optionsCascader" filterable v-loading="isCascaderLoad" :props="propsCascader" clearable class="w400">
                      <div slot-scope="scope" @click="cascaderClick">{{scope.data.label}}</div>
                    </el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item 
                    label="填写内容：" prop="finsh"
                    :rules="[
                      { required: false, message: '填写内容', trigger: 'blur' }
                    ]">
                    <el-row >
                      <write-form @saveCustomForm="handleSubmit" ref='mychild' :form_list="form_list" class="costom-form-reset-style"></write-form>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item 
                    label="审批人：" prop="multiAssignees"
                    :rules="[
                      { required: true, message: '请至少选择一个审批人', trigger: 'change' }
                    ]">
                    <approver v-if="paramsType&&paramsType==1" @checkChangeApprover="checkChangeApprover" ref="approverChild" :approver='dialogCompleteForm.multiAssignees'></approver>
                    <approver v-if="paramsType&&(paramsType==2||paramsType==3)" @checkChangeApprover="checkChangeApprover" ref="approverChild" :approver='dialogCompleteForm.multiAssignees' :orgId="dialogCompleteForm.createOrg"></approver>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item 
                    label="上级审批人：" prop="superAssignees"
                    :rules="[
                      { required: false, message: '请至少选择一个上级审批人', trigger: 'change' }
                    ]">
                    <approver-sup v-if="jobName!='职工首页'&&jobName!='党员首页'" @checkChangeApproverSup="checkChangeApproverSup" ref="supApproverChild" :approver='dialogCompleteForm.superAssignees'></approver-sup>
                    <approver-sup v-if="jobName=='职工首页'||jobName=='党员首页'" @checkChangeApproverSup="checkChangeApproverSup" ref="supApproverChild" :approver='dialogCompleteForm.superAssignees' :orgId="dialogCompleteForm.createOrg"></approver-sup>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <div class="text-right">
                    <el-button v-if="breadcrumbData" @click="$router.push({name: breadcrumbData.name})">返 回</el-button>
                    <el-button type="primary" @click="saveForm('dialogCompleteForm')" :loading="bottonLoding" :disabled="bottonLoding">保 存{{bottonLoding?' 中...':''}}</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </div>
      </div>
    </div>
  </el-row> 
</template>

<script>
  import LeftMenuMain from '../../../views/mainFunction/components/LeftMenu.vue'
  import LeftMenuParty from '../../../views/partyMember/components/LeftMenu.vue'
  import LeftMenuStaff from '../../../views/staffAndWorkers/components/LeftMenu.vue'
  import approver from "../../Approver.vue"
  import ApproverSup from "../../ApproverSup.vue"
  export default {
    data() {
      return {
        jobName:          sessionStorage.getItem('jobName'),// 党员首页/职工首页/党委工作台
        paramsKey:        this.$route.params.key,
        paramsType:        this.$route.params.type,
        breadcrumbData:   JSON.parse(sessionStorage.getItem('CreateActivitiForm-SuperiorRouteData'))||null,
        partyNature:      this.$store.state.partyNature ? this.$store.state.partyNature : sessionStorage.getItem('partyNature'), //组织类型
        orgId:            Number(sessionStorage.getItem('Access-OrgId')),
        assessKey:        Number(sessionStorage.getItem('Access-Key')),
        isLoad:           false, 
        bottonLoding:     false,

        form_list: [], //最后需要保存的表单数据
        myOrg:     {rows:[],total:0},

        // 创建
        dialogCompleteForm:{
          multiAssignees:[],
          createOrg:   null,
          superAssignees:[],
        },
        
        // 申报组织
        isCascaderLoad:   true,
        optionsCascader: [],
        propsCascader: { 
          checkStrictly: true, 
        },
      }
    },
    components: { 
      LeftMenuMain,
      LeftMenuParty,
      LeftMenuStaff,
      approver,
      ApproverSup
    },
    watch: {
    },
    created () {
    },
    mounted() { 
      this.query();
      this.paramsType==2?this.query1():'';
      this.paramsType==3?this.queryFindTop():'';
    },
    methods: {
      cascaderFocus(val){
        this.transformTree(this.optionsCascader)
      },
      cascaderClick(val){ 
      },
      cascaderChange(val){ 
        if(val){
          this.dialogCompleteForm.createOrg = val.length ? val[val.length-1] : '';
        }
      },
      /**
       * 查询上级党委
       * @return {[type]} [description]
       */
      queryFindTop(){
        this.isCascaderLoad = true;
        this.axios.post(`${this.common.basePath}/org/findTop`, '').then( (response) => {
          const { data } = response;
          this.optionsCascader = data ? [{ value: data.id, id: data.id, label: data.name, children:[], disabled: true ,parentId:null }] : [];
          this.isCascaderLoad = false; 
          this._queryChildren(this.optionsCascader);
        }).catch( (error) => {
          this.isCascaderLoad = false;
          this.$message.error(error); 
        });  
      },
      /**
       * 递归获取到所有数据
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      _queryChildren(data){ 
        data.map((item) => {  
          this.queryChildren(item.id).then((response) => {
            item.children = [];
            response.map((itemV) => {
              if(itemV.partyNature){
                this.optionsCascader.push({
                  id:    itemV.id,
                  value: itemV.id, 
                  label: itemV.name, 
                  leaf:  !itemV.below,
                  parentId: itemV.parentId, 
                  children:[],
                })
                if(itemV.below){ 
                  this._queryChildren([itemV])
                }
              }
            })  
          })
        })
      },
      transformTree(list){
        this.optionsCascader = this.common.transformTree(list);
      },
      /**
       * 查询下级支部/小组
       * @param  {[type]} orgId       [上级组织Id]
       * @param  {[type]} partyNature [下属机构类型]
       * @return {[type]}             [description]
       */
      queryChildren(orgId){  
        return new Promise ((reslove, reject) => { 
          this.axios.post(`${this.common.basePath}/org/children`, {orgId: orgId, orgType: 1}).then( (response) => {
            reslove(response.data.rows ? response.data.rows : []);
          }).catch( (error) => {
              this.isLoad = false;
              this.$message.error(error); 
          });
        })
      },

      /**
       * 选中时的广播事件（审批人）
       * @author chuanlin.Xiao
       * @date   2020-01-09T14:29:56+0800
       * @param  {[type]}                 data [description]
       * @param  {[type]}                 type [description]
       * @return {[type]}                      [description]
       */
      checkChangeApprover(data){
        // console.log(data)
        this.dialogCompleteForm.multiAssignees = data
      },
      checkChangeApproverSup(data){
        this.dialogCompleteForm.superAssignees = data
      },
      
      /**
       * 通过processDefKey，获取创建表的流程表单
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:18:28+0800
       * @return {[type]}                 [description]
       */
      query() {  
        this.isLoad =  true;
        let that = this;
        this.axios.get(`${this.common.basePath}/workRecord/first/form?processDefKey=${this.paramsKey}`).then((response) => {
          
          // this.form_list = response.data.formData
          let form_list = response.data.formData;
          this.form_list = this.common.returnActivitiFormList(form_list);

          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.form_list = []
          this.$message.error(errorMsg);
        }) 
      },
      /**
       * 获取我的组织
       * @return {[type]} [description]
       */
      query1() {  
        // this.axios.post(`${this.common.basePath}/org/getAll`,{user_id:this.assessKey}).then((response) => {
        //   this.myOrg = response.data ? response.data : {rows:[],total:0};
        //   this.dialogCompleteForm.createOrg = response.data ? response.data.rows[0].org_id : {rows:[],total:0};
        // }).catch((errorMsg) => {
        //   this.$message.error(errorMsg);
        // }) 
        this.axios.post(`${this.common.basePath}/party/oneByUserId?id=${sessionStorage.getItem('Access-Key')}`, '').then((response) => {
          const { data } = response;
          data.party_committee_id ? this.myOrg.rows.push({id: data.party_committee_id, name: data.party_committee_name, partyNature: 1}) : '';
          data.party_branch_id ? this.myOrg.rows.push({id: data.party_branch_id, name: data.party_branch_name, partyNature: 2}) : '';
          data.party_group_id ? this.myOrg.rows.push({id: data.party_group_id, name: data.party_group_name, partyNature: 3}) : '';

          this.dialogCompleteForm.createOrg = this.myOrg.rows.length>0 ? this.myOrg.rows[0].id : null;
        }).catch((errorMsg) => { 
          this.$message.error(errorMsg)
        })
      },

      /**
       * 提交创建表，点击保存按钮；创建表
       * @param  {[type]} name [description]
       * @return {[type]}      [description]
       */
      handleSubmit(foromData) { 
        let obj = {}
        foromData.forEach( function(element, index) {
          obj[element.obj.name] = element.obj.value;
        });

        this.$refs.dialogCompleteForm.validate((valid) => {
          if (valid) {
            let url = null;
            // 创建表
            let form = obj;
            form.multiAssignees = this.dialogCompleteForm.multiAssignees
            form.superAssignees = this.dialogCompleteForm.superAssignees
            form.businessTask = -1;
            form.processDefKey = this.paramsKey;

            if(this.paramsType&&this.paramsType==1){// 工作台的工作记录创建
              url = `${this.common.basePath}/workRecord/add`
              form.createOrg = Number(sessionStorage.getItem('Access-OrgId'));
              form.createUser = Number(sessionStorage.getItem('Access-Key'));
            }

            if(this.paramsType&&(this.paramsType==2)){// 党员或职工的工作记录创建（党员义务）
              url = `${this.common.basePath}/workRecord/add`
              form.createOrg = null;
              form.createUser = Number(sessionStorage.getItem('Access-Key'));
              form.submitOrg = this.dialogCompleteForm.createOrg;
            }
            
            if(this.paramsType&&this.paramsType==3&&this.paramsKey&&this.paramsKey=='partyApplication'){// 入党申请
              url = `${this.common.basePath}/join/application`
              form.createOrg = null;
              form.createUser = Number(sessionStorage.getItem('Access-Key'));
              form.submitOrg = this.dialogCompleteForm.createOrg;
            }
            if(this.paramsType&&this.paramsType==3&&this.paramsKey&&(this.paramsKey=='transferToPreparatoryApplication'||this.paramsKey=='applicationForCorrection')){// 转正申请、转预备申请
              url = `${this.common.basePath}/workRecord/add`
              form.createOrg = Number(sessionStorage.getItem('Access-OrgId'));
              form.createUser = Number(sessionStorage.getItem('Access-Key'));
            }

            this.axios.post(url,form).then((response) => {
              this.$message.success(response.meta.message);
              this.bottonLoding = false;
              this.breadcrumbData ? this.$router.push({name: this.breadcrumbData.name}): '';
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
       * 保存表单
       * @author chuanlin.Xiao
       * @date   2020-01-14T10:34:50+0800
       * @return {[type]}                 [description]
       */
      saveForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.bottonLoding = true;
            this.$refs.mychild.handleSubmit();  
          } else {
            return false;
          }
        });
      },
    },
  }
</script>

<style scoped lang="less"> 
  
</style>