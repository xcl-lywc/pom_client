/************ 党员首页 ***********/
<template>
  <div>
    <!-- 党员资料 -->
    <el-card v-loading="isLoad">
      <div slot="header" class="clearfix marb15">
        <span class="el-card-have-border-span">党员信息</span>  
        <div class="el-card-head-btn">
          <el-button type="primary" size="small" @click=" dialogApplicationVisible = true ;transformTree(optionsCascader);">申请录入</el-button>
          <el-button v-if="isParty == 'true'" type="primary" size="small" @click=" dialogChangeOrgVisible = true ;">更改组织</el-button>
          <el-button v-if="isParty == 'true'" type="primary" size="small" @click=" dialogPartyMemberFormVisible = true ">完善</el-button>
        </div> 
      </div>
      <el-row v-if="isParty == 'true'"> 
        <el-col :span="24">
          <p class="mart10">所属党委：{{partyMemeberInfo.party_committee_name ? partyMemeberInfo.party_committee_name : ''}}</p>
        </el-col>
        <el-col :span="12"> 
          <p class="mart10">所属支部：{{partyMemeberInfo.party_branch_name ? partyMemeberInfo.party_branch_name : ''}}</p>
          <p class="mart10">申请日期：{{common._showDate(partyMemeberInfo.application_date)}}</p>
          <p class="mart10">入党日期：{{common._showDate(partyMemeberInfo.join_partisan_date)}}</p>
          <p class="mart10">是否是流动党员：{{ partyMemeberInfo.mobile ? '是' : '否' }}</p>
        </el-col>
        <el-col :span="12">
          <p class="mart10">所属小组：{{ partyMemeberInfo.party_group_name ? partyMemeberInfo.party_group_name : '' }}</p>
          <p class="mart10">入党介绍人：{{partyMemeberInfo.introducer}}</p>
          <p class="mart10">转正日期：{{ common._showDate(partyMemeberInfo.qualification_time) }}</p>
          <p class="mart10">是否失联：{{partyMemeberInfo.lost ? '是' : '否'}}</p>
        </el-col>
      </el-row>
      <p v-else class="text-center">你不是党员</p>
    </el-card> 
    <!-- 党员档案 -->
    <el-card v-loading="isLoad" class="mart20" v-if="isParty == 'true'">
      <div slot="header" class="clearfix">
        <span>党员档案</span> 
        <div class="el-card-head-btn">
          <el-button v-if="isParty == 'true'" type="primary" size="small" @click=" dialogPartyMemberFormVisible01 = true ">完善</el-button>
        </div>
      </div>
      <el-row>  
        <el-col :span="12"> 
          <p class="mart10">入党申请书：
            <el-button size="mini" title="点击下载" @click=" downloadFile(partyMemeberInfo.application) ">
              {{ partyMemeberInfo.application ? common._removeFileSuffix(JSON.parse(partyMemeberInfo.application).name) : ''}}
            </el-button>
          </p>
          <p class="mart10">政审资料：
            <el-button size="mini" title="点击下载" @click=" downloadFile(partyMemeberInfo.volunteer_letter) ">
              {{ partyMemeberInfo.political_appendix ? common._removeFileSuffix(JSON.parse(partyMemeberInfo.political_appendix).name) : ''}}
            </el-button> 
          </p> 
        </el-col>
        <el-col :span="12">
          <p class="mart10">转正申请书：
            <el-button size="mini" title="点击下载" @click=" downloadFile(partyMemeberInfo.political_appendix) ">
              {{ partyMemeberInfo.become_application ? common._removeFileSuffix(JSON.parse(partyMemeberInfo.become_application).name) : ''}}
            </el-button>   
          </p>
          <p class="mart10">入党自愿书：
            <el-button size="mini" title="点击下载" @click=" downloadFile(partyMemeberInfo.become_application) ">
              {{ partyMemeberInfo.volunteer_letter ? common._removeFileSuffix(JSON.parse(partyMemeberInfo.volunteer_letter).name) : ''}}
            </el-button>   
          </p> 
        </el-col>
      </el-row>
    </el-card> 
    <!-- 党员更改所属组织 -->
    <el-dialog title="更改所属组织" :visible.sync="dialogChangeOrgVisible" width="50vw">
      <el-form ref="changeOrgForm"  :model="changeOrgForm" label-width="100px">
        <el-form-item 
          label="组织：" prop="orgId"
          :rules="[
            { required: true, message: '请选择组织', trigger: 'blur' }
          ]">
          <el-cascader :props="props" filterable clearable v-model="changeOrgForm.orgId" :show-all-levels="false" class="w400"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChangeOrgVisible = false" size="small">取消</el-button>
        <el-button type="primary" @click="submitChangeOrg('changeOrgForm')" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 申请录入组织  (只有2党支部与3党小组才能申请录入) -->
    <el-dialog title="申请录入组织" :visible.sync="dialogApplicationVisible" v-loading="isCascaderLoad" width="50vw">
      <el-form ref="applicationOrgForm"  :model="applicationOrgForm" label-width="130px">
        <el-form-item 
          label="我的组织：" prop="orgId"
          :rules="[
            { required: true, message: '请选择组织', trigger: 'blur' }
          ]">
          <el-cascader @change="cascaderChange" :options="optionsCascader" filterable v-loading="isCascaderLoad" :props="propsCascader" clearable class="w400">
            <div slot-scope="scope" @click="cascaderClick">{{scope.data.label}}</div>
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogApplicationVisible = false"  size="small">取消</el-button>
        <el-button type="primary" @click="submitApplicationOrg('applicationOrgForm')" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 完善资料 -->
    <el-dialog title="完善党员信息" :visible.sync="dialogPartyMemberFormVisible" width="50vw">
      <el-form ref="partyMemberForm"  :model="partyMemberForm" label-width="130px">
        <el-form-item label="申请日期：" prop="application_date"
          :rules="[
            { required: false, message: '请选择申请日期', trigger: 'blur' }
          ]">
          <date-select 
            :dateType="partyMemberForm.application_date.type"  
            :value="partyMemberForm.application_date.date_time"
            @dateEmit="((val) => ( dateEmitFun(val, partyMemberForm.application_date) ))"
            @dateTypeEmit="((val) => ( dateTypeEmitFun(val, partyMemberForm.application_date) ))">
          </date-select>
        </el-form-item>
        <el-form-item label="入党日期：" prop="join_partisan_date"
          :rules="[
            { required: false, message: '请选择入党日期', trigger: 'blur' }
          ]">
          <date-select 
            :dateType="partyMemberForm.join_partisan_date.type"  
            :value="partyMemberForm.join_partisan_date.date_time"
            @dateEmit="((val) => ( dateEmitFun(val, partyMemberForm.join_partisan_date) ))"
            @dateTypeEmit="((val) => ( dateTypeEmitFun(val, partyMemberForm.join_partisan_date) ))">
          </date-select>
        </el-form-item>
        <el-form-item label="转正日期：" prop="qualification_time"
          :rules="[
            { required: false, message: '请选择转正日期', trigger: 'blur' }
          ]">
          <date-select 
            :dateType="partyMemberForm.qualification_time.type"  
            :value="partyMemberForm.qualification_time.date_time"
            @dateEmit="((val) => ( dateEmitFun(val, partyMemberForm.qualification_time) ))"
            @dateTypeEmit="((val) => ( dateTypeEmitFun(val, partyMemberForm.qualification_time) ))">
          </date-select>
        </el-form-item>
        <el-form-item label="是否是流动党员：" prop="mobile"
          :rules="[
            { required: false, message: '请输入成立日期', trigger: 'blur' }
          ]"> 
          <el-radio-group v-model="partyMemberForm.mobile">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio> 
          </el-radio-group> 
        </el-form-item> 
        <el-form-item label="是否失联：" prop="mobile"
          :rules="[
            { required: false, message: '请选择是否失联', trigger: 'blur' }
          ]"> 
          <el-radio-group v-model="partyMemberForm.lost">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio> 
          </el-radio-group> 
        </el-form-item> 
        <el-form-item label="入党介绍人：" prop="introducer"
          :rules="[
            { required: false, message: '请输入入党介绍人', trigger: 'blur' }
          ]">
          <el-input v-model="partyMemberForm.introducer"></el-input>
        </el-form-item> 
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPartyMemberFormVisible = false" size="small">取消</el-button>
        <el-button type="primary" @click="submitPartyMemberForm('partyMemberForm')" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="完善党员档案" :visible.sync="dialogPartyMemberFormVisible01" width="50vw">
      <el-form ref="partyMemberForm"  :model="partyMemberForm" label-width="130px">
        <el-form-item label="入党申请书：" prop="application"
          :rules="[
            { required: false, message: '请上传档案', trigger: 'blur' }
          ]">
          <el-upload
            :file-list="partyMemberForm.application ? [JSON.parse(partyMemberForm.application)] : []"
            :headers="common.returnConfig()"
            :action="`${common.basePath}/file?type=partyFile&orgId=${orgId}&userId=${accessKey}`"
            :on-remove="(file, filesList) => {handleRemove(file, filesList, 'application')}"
            :on-success="(response,file, filesList) => {handleSuccess(response, file, filesList, 'application')}"
            :before-upload="(file) => {beforeFileUpload(file, 'application')}" 
            name="files"
            :limit="99" >
              <el-button size="small" type="primary">上传档案</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="政审资料：" prop="political_appendix"
          :rules="[
            { required: false, message: '请上传档案', trigger: 'blur' }
          ]">
          <el-upload
            :file-list="partyMemberForm.political_appendix ? [JSON.parse(partyMemberForm.political_appendix)] : []"
            :headers="common.returnConfig()"
            :action="`${common.basePath}/file?type=partyFile&orgId=${orgId}&userId=${accessKey}`"
            :on-remove="(file, filesList) => {handleRemove(file, filesList, 'political_appendix')}"
            :on-success="(response,file, filesList) => {handleSuccess(response, file, filesList, 'political_appendix')}"
            :before-upload="(file) => {beforeFileUpload(file, 'political_appendix')}" 
            name="files"
            :limit="99" >
              <el-button size="small" type="primary">上传档案</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="转正申请书：" prop="become_application"
          :rules="[
            { required: false, message: '请上传档案', trigger: 'blur' }
          ]">
          <el-upload
            :file-list="partyMemberForm.become_application ? [JSON.parse(partyMemberForm.become_application)] : []"
            :headers="common.returnConfig()"
            :action="`${common.basePath}/file?type=partyFile&orgId=${orgId}&userId=${accessKey}`"
            :on-remove="(file, filesList) => {handleRemove(file, filesList, 'become_application')}"
            :on-success="(response,file, filesList) => {handleSuccess(response, file, filesList, 'become_application')}"
            :before-upload="(file) => {beforeFileUpload(file, 'become_application')}" 
            name="files"
            :limit="99" >
              <el-button size="small" type="primary">上传档案</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="入党自愿书：" prop="volunteer_letter"
          :rules="[
            { required: false, message: '请上传档案', trigger: 'blur' }
          ]">
          <el-upload
            :file-list="partyMemberForm.volunteer_letter ? [JSON.parse(partyMemberForm.volunteer_letter)] : []"
            :headers="common.returnConfig()"
            :action="`${common.basePath}/file?type=partyFile&orgId=${orgId}&userId=${accessKey}`"
            :on-remove="(file, filesList) => {handleRemove(file, filesList, 'volunteer_letter')}"
            :on-success="(response,file, filesList) => {handleSuccess(response, file, filesList, 'volunteer_letter')}"
            :before-upload="(file) => {beforeFileUpload(file, 'volunteer_letter')}" 
            name="files"
            :limit="99" >
              <el-button size="small" type="primary">上传档案</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPartyMemberFormVisible01 = false" size="small">取消</el-button>
        <el-button type="primary" @click="submitPartyMemberForm01('partyMemberForm')" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!-- {{optionsCascader}} -->
  </div>
</template>

<script> 
  import DateSelect from '../Date' 
  let id = 0;
  export default {
    data() {
      let self = this;
      return { 
        isLoad:                        true,
        isCascaderLoad:                true,
        dialogApplicationVisible:      false,
        dialogPartyMemberFormVisible:  false,
        dialogPartyMemberFormVisible01:false,
        dialogChangeOrgVisible:        false,
        isParty: 			sessionStorage.getItem('isParty'),
        orgId:            sessionStorage.getItem('orgId'),
        accessKey:        sessionStorage.getItem('Access-Key'),
        partyMemeberInfo:         {}, //党员信息 
        userBaseInfo:             JSON.parse(sessionStorage.getItem("userBaseInfo")), //用户信息 
        applicationOrgForm:       {
          orgId:    null,
        },
        changeOrgForm:{
          orgId:    [],
        },
        props:{
          checkStrictly : true,
          lazy:true,
          lazyLoad(node,resolve){
            self.lazyLoad(node,resolve)
          }
        },
        partyMemberForm: {   //完善党员信息
          application_date:   {date_time: null, type: 1},
          join_partisan_date:    {date_time: null, type: 1},
          qualification_time: {date_time: null, type: 1},
          lost:               true,
          mobile:             false,
          introducer:         null,
        },
        optionsCascader: [],
        propsCascader: { 
          checkStrictly: true, 
        },

      }
    },
    components: {  
      DateSelect
    },
    watch: {
    },
    created () {
    },
    mounted() {
      this.isParty == 'true' ? this.getPartyOne() : this.isLoad = false;
      this.queryFindTop();
    },
    methods: {
      /**
       * 动态加载组织树
       * @author chuanlin.Xiao
       * @date   2020-03-20T14:55:53+0800
       * @param  {[type]}                 node    [description]
       * @param  {[type]}                 resolve [description]
       * @return {[type]}                         [description]
       */
      lazyLoad(node, resolve) {
        // return;
        if (node.level === 0) {
          this.axios({method: "post",url: `${this.common.basePath}/party/oneByUserId?id=${sessionStorage.getItem('Access-Key')}`}).then(res => {
            console.log(res)
            const data = [
              {
                value: res.data.party_committee_id,
                label: res.data.party_committee_name,
                leaf:  false
              }
            ];
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(data);
          }).catch(err => { this.$message.error(err); });
        } else if(node.level > 0) {
          this.axios.post(`${this.common.basePath}/org/children`, {orgId: node.value,orgType: 1}).then(res => {
            const data = res.data.rows.map((value, i) => ({
              value: value.id,
              label: value.name,
              leaf:  !value.below
            }));
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(data);
          }).catch(err => {this.$message.error(err);});
        } else {
          return resolve([]);
        }
      },
      submitChangeOrg(formName){  
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let partyOrgId = this.changeOrgForm.orgId.length>0?this.changeOrgForm.orgId[this.changeOrgForm.orgId.length-1] : null;
            this.axios.post(`${this.common.basePath}/party/update/batch`, {partyOrgId: partyOrgId, partyMemberIds: [this.partyMemeberInfo.id]}).then( (response) => {
              this.$message.success('更改所属组织'+response.meta.message+'，需重新登录！')
              this.dialogChangeOrgVisible = false;
              this.getPartyOne();
            }).catch( (error) => {
              this.dialogChangeOrgVisible = false;
              this.$message.error(error)
            }); 
          } else { 
            return false;
          }
        });
      },

      /*
       * 附件上传之前，验证的数据大小
       */
      beforeFileUpload(file,type){
        const isLt2M = file.size / 1024 / 1024 < 100;
        if (!isLt2M) {
          this.$message.error('附件大小不能超过 100MB!');
        }
        return isLt2M;
      },
      handleSuccess (response, file, filesList, type) {
        //-------------- 组装附件数据 -----------------
        let result = null;
        filesList.map((item, index) => {
          result = {
            id:   item.response ? item.response.data[0].fileId : item.id,
            name: item.name,

          }
        })
        this.partyMemberForm[type] = JSON.stringify(result)


      },
      handleRemove (file, filesList,type) {
        // --------- 做一个显示隐藏功能，保证请求头中的nonce可以实时刷新 ---------
        this.partyMemberForm[type] = null;
      },

      cascaderClick(val){ 
      },
      cascaderChange(val){ 
        if(val){
          this.applicationOrgForm.orgId = val.length ? val[val.length-1] : '';
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
          this.optionsCascader = [];
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
            response.map((itemV,itemI) => {
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
       * 获取当前用户的党员信息
       * @return {[type]} [description]
       */
      getPartyOne(){
        this.isLoad = true;
        this.axios.post(`${this.common.basePath}/party/oneByUserId?id=${sessionStorage.getItem('Access-Key')}`, '').then( (response) => {
          this.isLoad = false; 
          if(response.data){  
            const { data } = response;
            this.partyMemeberInfo = data;
            this.partyMemberForm = {
              ...data,
              application_date:   !data.application_date ? {data_time: null, type: 1} : data.application_date,
              join_partisan_date:    !data.join_partisan_date ? {data_time: null, type: 1} : data.join_partisan_date,
              qualification_time: !data.qualification_time ? {data_time: null, type: 1} : data.qualification_time,
            }
          } 
        }).catch( (error) => {
            this.isLoad = false;
            this.$message.error(error); 
        });
      },  
      /*
       * 时间组件广播回来的时间值
       * @params {string} val 时间组件返回回来的值
       * @params {string} formDatTypeeKey 当前页面的字段 
       */
      dateEmitFun(val,formDateKey){  
        formDateKey.date_time = val;
      },
      /*
       * 时间组件广播回来的时间类型
       * @params {string} val 时间组件返回回来的值
       * @params {string} formDateKey 当前页面的字段 
       */
      dateTypeEmitFun(val,formDateKey){ 
        formDateKey.type = val;
      },
      submitApplicationOrg(formName){  
        this.isCascaderLoad = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/party/input`, {partyOrgId: this.applicationOrgForm.orgId, userId: [this.userBaseInfo.id]}).then( (response) => {
              this.$message.success(response.meta.message)
             
              this.isCascaderLoad = false;
              this.dialogApplicationVisible = false;
             
              this.getPartyOne();
            }).catch( (error) => {
              
              this.isCascaderLoad = false; 
              this.dialogApplicationVisible = false;
              this.$message.error(error)
            }); 
          } else { 
            this.isCascaderLoad = false; 
            return false;
          }
        });
      },
      /**
       * 完善党员信息
       * @return {[type]} [description]
       */
      submitPartyMemberForm(){
        let form ={
          ...this.partyMemberForm
        };
        form.join_party_date = form.join_partisan_date;
        // delete form.join_partisan_date
        this.axios.post(`${this.common.basePath}/party/update`, form).then( (response) => {
          this.$message.success(response.meta.message)
          this.dialogPartyMemberFormVisible = false;
         
          this.getPartyOne();
        }).catch( (error) => { 
          this.dialogPartyMemberFormVisible = false;
          this.$message.error(error)
        }); 
      },
      /**
       * 完善党员档案
       * @return {[type]} [description]
       */
      submitPartyMemberForm01(){
        this.axios.post(`${this.common.basePath}/party/update`, {...this.partyMemberForm, id: this.partyMemeberInfo.id}).then( (response) => {
          this.$message.success(response.meta.message)
          this.dialogPartyMemberFormVisible01 = false;
         
          this.getPartyOne();
        }).catch( (error) => { 
          this.dialogPartyMemberFormVisible01 = false;
          this.$message.error(error)
        }); 
      },

      /**
       * 下载附件
       * @param  {[type]} jsonStringData [description]
       * @return {[type]}                [description]
       */
      downloadFile(jsonStringData){
        if(jsonStringData){
          let data = JSON.parse(jsonStringData);
          this.common.downloadFile(data.id);  
        }
      }
    },
  }
</script>

<style scoped lang="less"> 
  .el-menu{
    border-right: none!important;
    width: 250px;
  }
</style>
