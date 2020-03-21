/*************** 通知范围、接受单位组件 *************/
<template>
  <el-card shadow="never">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-button v-if="type==1" type="text" size="mini" @click="query2_(orgId);activeId=orgId" :class="{'text-danger':activeId==orgId,'text-black':activeId!=orgId}">所有党员</el-button>
        <el-button v-if="type==2" type="text" size="mini" @click="query10(orgId);activeId=orgId" :class="{'text-danger':activeId==orgId,'text-black':activeId!=orgId}">所有组织</el-button>
        <!-- 1党委 -->
        <el-collapse accordion v-if="partyNature==1">
          <el-collapse-item title="下级党委" name="1">
            <div v-for="org in orgPartyCommitteeList.rows" @click="type==1?query2_(org.id):query10(org.id);activeId=org.id" :class="{'text-danger':activeId===org.id}" class="marl10"><i class="el-icon-caret-right"></i>&nbsp;<span>{{org.name}}</span></div> 
            <div v-if="orgPartyCommitteeList.total===0" class="no-data">
              暂无数据
            </div>
          </el-collapse-item>
          <el-collapse-item title="下级支部" name="2">
            <div v-for="org in orgBranchList.rows" @click="type==1?query2_(org.id):query10(org.id);activeId=org.id" :class="{'text-danger':activeId===org.id}" class="marl10"><i class="el-icon-caret-right"></i>&nbsp;<span>{{org.name}}</span></div> 
            <div v-if="orgBranchList.total===0" class="no-data">
              暂无数据
            </div>
          </el-collapse-item>
          <el-collapse-item title="职能部门" name="4">
            <div v-for="org in partyDepartmentList.rows" @click="type==1?query2_(org.id):query10(org.id);activeId=org.id" :class="{'text-danger':activeId===org.id}" class="marl10"><i class="el-icon-caret-right"></i>&nbsp;<span>{{org.name}}</span></div> 
            <div v-if="partyDepartmentList.total===0" class="no-data">
              暂无数据
            </div>
          </el-collapse-item>
        </el-collapse>
        <!-- 2党支部 -->
        <el-collapse accordion v-if="partyNature==2">
          <!-- <el-collapse-item title="下级支部" name="2">
            <div v-for="org in orgBranchList.rows" @click="type==1?query2_(org.id):query10(org.id);activeId=org.id" :class="{'text-danger':activeId===org.id}" class="marl10"><i class="el-icon-caret-right"></i>&nbsp;<span>{{org.name}}</span></div> 
            <div v-if="orgBranchList.total===0" class="no-data">
              暂无数据
            </div>
          </el-collapse-item> -->
          <el-collapse-item title="下级党小组" name="5">
            <div v-for="org in orgPartyGroupList.rows" @click="type==1?query2_(org.id):query10(org.id);activeId=org.id" :class="{'text-danger':activeId===org.id}" class="marl10"><i class="el-icon-caret-right"></i>&nbsp;<span>{{org.name}}</span></div> 
            <div v-if="orgBranchList.total===0" class="no-data">
              暂无数据
            </div>
          </el-collapse-item>
          <el-collapse-item title="职能部门" name="3">
            <div v-for="org in partyDepartmentList.rows" @click="type==1?query2_(org.id):query10(org.id);activeId=org.id" :class="{'text-danger':activeId===org.id}" class="marl10"><i class="el-icon-caret-right"></i>&nbsp;<span>{{org.name}}</span></div> 
            <div v-if="partyDepartmentList.total===0" class="no-data">
              暂无数据
            </div>
          </el-collapse-item>
        </el-collapse>
        <!-- 3党小组 -->
        <el-collapse accordion v-if="partyNature==3">
          <el-collapse-item title="职能部门" name="3">
            <div v-for="org in partyDepartmentList.rows" @click="type==1?query2_(org.id):query10(org.id);activeId=org.id" :class="{'text-danger':activeId===org.id}" class="marl10"><i class="el-icon-caret-right"></i>&nbsp;<span>{{org.name}}</span></div> 
            <div v-if="partyDepartmentList.total===0" class="no-data">
              暂无数据
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-col>
      <el-col :span="18" v-if="type===1">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange($event,'person')"  class="fr">全选</el-checkbox>
        <el-checkbox-group v-model="dialogType=='edit'?person:person_" @change="handleCheckChange($event,'person')" size="small" v-if="partyList_&&partyList_.total>0" class="marl10">
          <el-checkbox v-for="person in partyList_.rows" :label="person.owner" :key="person.owner"  style="width: 100%;" class='marb10'>
            <i class="el-icon-user"></i> &nbsp;<span>{{person.owner_name}}</span>
          </el-checkbox>
        </el-checkbox-group>
        <div v-else class="no-data">
          暂无数据
        </div>
      </el-col>
      <el-col :span="18" v-if="type===2">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange($event,'org')"  class="fr">全选</el-checkbox>
        <el-checkbox-group v-model="dialogType=='edit'?org:org_" @change="handleCheckChange($event,'org')" size="small" v-if="leaderList_&&leaderList_.length>0" class="marl10">
          <el-checkbox v-for="leader in leaderList_" :label="leader.id" :key="leader.id"  style="width: 100%;" class='marb10'>
            <i class="el-icon-user"></i> &nbsp;<span>{{leader.userName+'（'+leader.position+'）'}}</span>
          </el-checkbox>
        </el-checkbox-group>
        <div v-else class="no-data">
          暂无数据
        </div>
      </el-col>
    </el-row>
  </el-card> 
</template>

<script>
  export default {
    data() {
      return { 
        orgId:           Number(sessionStorage.getItem('Access-OrgId')),
        assessKey:       Number(sessionStorage.getItem('Access-Key')),
        isLoad:          true,
        jobName:         sessionStorage.getItem('jobName'),// 党员首页/职工首页/党委、党小组、党支部名称
        partyNature:     this.$store.state.partyNature ? this.$store.state.partyNature : sessionStorage.getItem('partyNature'), //组织类型

        partyList_:   {rows:[],total:0},
        leaderList_:  [],

        checkAll: false,
        isIndeterminate:true,

        activeId:Number(sessionStorage.getItem('Access-OrgId')),// 被激活的组织

        partyDepartmentList:  {rows:[],total:0},// 职能部门
        orgBranchList:        {rows:[],total:0},// 下级支部
        orgPartyCommitteeList:{rows:[],total:0},// 下级党委
        orgPartyGroupList:    {rows:[],total:0},// 下级党小组

        org_:this.org,
        person_:this.person,
      }
    },
    props: {
      type:{
        type: Number,
        default: 1, //1 党员；2 组织
      },
      dialogType:{
        type: String,
        default: 'add', 
      },
      person:{
        type: Array,
        default: function(){
          return []
        },
      },
      org:{
        type: Array,
        default: function(){
          return []
        }, 
      },
    },
    computed:{
      
    },
    watch: {
      type(newValue,oldValue){
        if(newValue){
          this.type==1?this.query2_(this.activeId):this.query10(this.activeId);
        }
        
      }
    },
    created () {
      this.query20();
    },
    mounted() { 
      this.type==1?this.query2_(this.activeId):this.query10(this.activeId);
    },
    methods: { 
      handleCheckAllChange(val,type) {

        let all = [];

        if(type=='person'){

          this.partyList_.rows.forEach( function(element, index) {
            all.push(element.owner)
          });

          if(this.dialogType=='edit'){
            this.person = val ? all : [];
          }else{
            this.person_ = val ? all : [];
          }

        }else{

          this.leaderList_.forEach( function(element, index) {
            all.push(element.id)
          });

          if(this.dialogType=='edit'){
            this.org = val ? all : [];
          }else{
            this.org_ = val ? all : [];
          }

        }
        this.isIndeterminate = false;
      },
      /**
       * 选中时的广播事件
       * @author chuanlin.Xiao
       * @date   2020-01-09T14:24:54+0800
       * @param  {[type]}                 value [description]
       * @param  {[type]}                 type  [description]
       * @return {[type]}                       [description]
       */
      handleCheckChange(value,type) {
        let checkedCount = value.length;
        if(type=='person'){
          this.checkAll = checkedCount === this.partyList_.rows.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.partyList_.rows.length;
        }else{
          this.checkAll = checkedCount === this.leaderList_.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.leaderList_.length;
        }
        this.$emit("checkChange", value, type)
      },

      /**
       * 获取党员列表
       * @author chuanlin.Xiao
       * @date   2020-01-06T16:09:21+0800
       * @return {[type]}                 [description]
       */ 
      query2_(orgId) {  
        this.axios.post(`${this.common.basePath}/party/list`,{party_orgs_id:  orgId}).then((response) => {
          this.partyList_ = response.data ? response.data : {rows:[],total:0}
        }).catch((errorMsg) => {
          this.$message.error(errorMsg);
        })  
      }, 
      /**
       * 获取领导列表
       * @author chuanlin.Xiao
       * @date   2020-01-08T10:52:00+0800
       * @param  {[type]}                 orgId [description]
       * @return {[type]}                       [description]
       */
      query10(orgId) {  
        this.axios.post(`${this.common.basePath}/leader/list/item`,{orgId: orgId}).then((response) => {
          this.leaderList_ = response.data ? response.data : []
        }).catch((errorMsg) => {
          this.$message.error(errorMsg);
        })  
      }, 
      /**
       * 根据不同的partyNature，请求数据
       * @author chuanlin.Xiao
       * @date   2020-01-09T09:30:38+0800
       * @return {[type]}                 [description]
       */
      query20(){
        if(this.partyNature==1){// 党委
          this.query_partyDepartmentList();
          this.query_orgBranchList();
          this.query_orgPartyCommitteeList();
        }else if(this.partyNature==2){// 党支部
          this.query_partyDepartmentList();
          this.query_orgBranchList();
          this.query_orgPartyGroupList();
        }else if(this.partyNature==3){// 党小组
          this.query_partyDepartmentList();
        }
      },
      query_partyDepartmentList(){
        // 职能部门
        this.axios.post(`${this.common.basePath}/org/partyDepartment`,{orgId: this.orgId}).then((response) => {
          this.partyDepartmentList = response.data ? response.data : {rows:[],total:0}
        }).catch((errorMsg) => {
          this.$message.error(errorMsg);
        }) 
      },
      query_orgBranchList(){
        // 下级支部
        this.axios.post(`${this.common.basePath}/org/children`,{orgId:this.orgId,orgType:1,partyNature:2}).then((response) => {
          this.orgBranchList = response.data ? response.data : {rows:[],total:0}
        }).catch((errorMsg) => {
          this.$message.error(errorMsg);
        }) 
      },
      query_orgPartyCommitteeList(){
        // 下级党委
        this.axios.post(`${this.common.basePath}/org/children`,{orgId:this.orgId,orgType:1,partyNature:1}).then((response) => {
          this.orgPartyCommitteeList = response.data ? response.data : {rows:[],total:0}
        }).catch((errorMsg) => {
          this.$message.error(errorMsg);
        }) 
      },
      query_orgPartyGroupList(){
        // 下级党小组
        this.axios.post(`${this.common.basePath}/org/children`,{orgId:this.orgId,orgType:1,partyNature:3}).then((response) => {
          this.orgPartyGroupList = response.data ? response.data : {rows:[],total:0}
        }).catch((errorMsg) => {
          this.$message.error(errorMsg);
        }) 
      },
    },
  }
</script>

<style scoped lang="less"> 
  
</style>
