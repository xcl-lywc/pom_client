/*************** 审批人组件（领导班子成员） *************/
<template>
  <el-card shadow="never">
    <el-row :gutter="20">
      <el-col :span="24" v-if="positionList.total>0">
        <el-collapse class="marb20">
          <div  v-for="item in positionList.rows">
            <el-collapse-item  :title="item.name" :name="item.id">
              <el-checkbox-group v-model="approver_" @change="handleCheckChange($event)" size="small" v-if="approverList&&approverList.length>0">
                <el-checkbox v-for="(person,index) in approverList" :label="person.user_id" :key="index"  style="width: 100%;" v-if="person.position_id===item.id">
                  <i class="el-icon-user"></i> &nbsp;<span>{{person.user_name}}</span>
                </el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
          </div>
        </el-collapse>
      </el-col>
      <el-col :span="24" v-else class="no-data">暂无数据</el-col>
    </el-row>
  </el-card>
     
</template>

<script>
  export default {
    data() {
      return { 
        // orgId:                 Number(sessionStorage.getItem('Access-OrgId')),
        assessKey:             Number(sessionStorage.getItem('Access-Key')),

        positionList: {rows:[],total:0},
        approverList: [],

        approver_:this.approver,
      }
    },
    props: {
      approver:{
        type: Array,
        default: function(){
          return []
        },
      },
      orgId:{
        type: Number,
        default: function(){
          return Number(sessionStorage.getItem('Access-OrgId'))
        },
      }
    },
    computed:{
      
    },
    watch: {
      orgId(newValue,oldValue){
        if(newValue){
          this.query7();
          this.query8();
        }
        
      },
    },
    created () {

    },
    mounted() {
      this.orgId?this.query7():'';
      this.orgId?this.query8():'';
    },
    methods: {
      /**
       * 选中时的广播事件
       * @author chuanlin.Xiao
       * @date   2020-01-09T14:24:54+0800
       * @param  {[type]}                 value [description]
       * @param  {[type]}                 type  [description]
       * @return {[type]}                       [description]
       */
      handleCheckChange(value) {
        this.$emit("checkChangeApprover", value)
      },
      /**
       * 获取当前组织下的职位列表
       * @author chuanlin.Xiao
       * @date   2020-01-10T11:34:52+0800
       * @return {[type]}                 [description]
       */
      query7() {  
        this.axios.post(`${this.common.basePath}/position/list`,{org_id:this.orgId}).then((response) => {
          this.positionList = response.data ? response.data : {rows:[],total:0};
        }).catch((errorMsg) => {
          this.$message.error(errorMsg);
        })  
      },
      /**
       * 获取当前组织下的领导/审批人
       * @author chuanlin.Xiao
       * @date   2020-01-10T11:35:37+0800
       * @return {[type]}                 [description]
       */
      query8() {  
        this.axios.post(`${this.common.basePath}/leader/list`,{orgId:this.orgId}).then((response) => {
          this.approverList = response.data ? response.data : [];
        }).catch((errorMsg) => {
          this.$message.error(errorMsg);
        })  
      },
    },
  }
</script>

<style lang="less"> 
  
</style>
