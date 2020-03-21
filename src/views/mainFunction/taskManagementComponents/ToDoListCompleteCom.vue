/*************** 待处理任务-完成任务时，填写表单组件（职工和党员） *************/
<template>
  <el-row v-loading="dialogLoading" :gutter="20">
    <el-col :span="12">
      <form-info :data='opreationData' :type='1'></form-info>
    </el-col>
    <el-col :span="12"><write-form @saveCustomForm="handleSubmit" :form_list="form_list" class="costom-form-reset-style_btnin"></write-form></el-col>
  </el-row>
</template>

<script>
	import FormInfo from "../../../components/CostomFormInfo.vue"
  export default {
    data() {
      return { 
        orgId:           Number(sessionStorage.getItem('Access-OrgId')),
        assessKey:       Number(sessionStorage.getItem('Access-Key')),
        isLoad:          true,
        jobName:         sessionStorage.getItem('jobName'),// 党员首页/职工首页/党委、党小组、党支部名称
        partyNature:     this.$store.state.partyNature ? this.$store.state.partyNature : sessionStorage.getItem('partyNature'), //组织类型
        dialogLoading:   false,

        form_list: [], // 最后需要保存的表单数据
        opreationData:null,
      }
    },
    components: { 
      FormInfo
    },
    props: {
      taskId:{
        type: String,
        default: function(){
          return ''
        }, 
      },
    },
    computed:{
      
    },
    watch: {
      'taskId'(newValue,oldValue){
        if(newValue){
          this.query5(newValue);
          this.queryDetail(newValue);
        }
        
      },
    	
    },
    created () {

    },
    mounted() { 
    	this.query5(this.taskId);
    	this.queryDetail(this.taskId);
    },
    methods: { 

      /**
       * 通过代办任务id，获取流程表单
       * @author chuanlin.Xiao
       * @date   2020-01-07T16:49:34+0800
       * @param  {[type]}                 id [description]
       * @return {[type]}                    [description]
       */
      query5(id) { 
        this.dialogLoading = false;
        this.axios.get(`${this.common.basePath}/workRecord/task/id`,{params:{processTaskId:id}}).then((response) => {
          this.form_list = response.data.formData
          this.dialogLoading =  false;
        }).catch((errorMsg) => {
          this.dialogLoading =  false; 
          this.$message.error(errorMsg);
        })  
      },  
      /**
       * 通过任务id， 获取具体表单的数据
       * @author chuanlin.Xiao
       * @date   2020-03-17T14:50:41+0800
       * @return {[type]}                 [description]
       */
      queryDetail(taskId){
        this.axios.get(`${this.common.basePath}/workflow/detail`,{params:{processTaskId:taskId}}).then((response) => {
          this.opreationData = response.data;
        }).catch((errorMsg) => {
          this.$message.error(errorMsg);
        }) 
      },

      /**
       * 完成任务
       * @author chuanlin.Xiao
       * @date   2020-01-07T16:07:00+0800
       * @return {[type]}                      [description]
       */
      complete(obj){
        let data = this.opreationData;
        this.$confirm('此操作将结束该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let form = {
            processTaskId: this.taskId,
            processVariables: obj,
            taskVariables: data.taskVariables
          }
          this.axios.post(`${this.common.basePath}/workflow/complete`,form).then((response) => {
            this.$emit("completeTask", response)
          }).catch((errorMsg) => {
            this.$message.error(errorMsg);
          }) 
        }).catch(() => {});
      },
      /**
       * 提交流程表单表单，点击保存按钮
       * @param  {[type]} name [description]
       * @return {[type]}      [description]
       */
      handleSubmit(foromData) { 
        let obj = {}
        foromData.forEach( function(element, index) {
          obj[element.obj.name] = element.obj.value;
        });
        let params = obj
        this.complete(obj);
      }, 

    },
  }
</script>

<style scoped lang="less"> 
  
</style>
