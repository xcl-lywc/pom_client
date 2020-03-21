/*************** 展示不同流程自定义表单信息组件 *************/

<template>
  <el-row v-loading="dialogLoading">
    <el-card shadow="never" v-if="matchData&&matchData.length>0">
      <div slot="header" class="clearfix">
        <span>工作记录</span>
      </div>
      <el-form class="show-form-info" label-width="120px">
        <!-- {{matchData}} -->
        <div v-for="item in matchData">
          <el-form-item :label="item.label+'：'">
            <div v-if="item.type=='uploads'">
              <!-- {{item.value}} -->
              <file-show :fileList="item.value?item.value:[]" :closable="false"></file-show>
            </div>
            <div v-else>{{item.value}}</div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <el-card shadow="never" v-else>
      <div slot="header" class="clearfix">
        <span>工作记录</span>
      </div>
      <el-form class="show-form-info no-data">暂无数据</el-form>
    </el-card>
  </el-row>  
</template>

<script>
  import FileShow from "../components/FileShow.vue"
  export default {
    data() {
      return { 
        orgId:           Number(sessionStorage.getItem('Access-OrgId')),
        assessKey:       Number(sessionStorage.getItem('Access-Key')),
        dialogLoading:   false,

        matchData: [], // 流程实例，匹配的表单信息

        data_:this.data,
      }
    },
    components: { 
      FileShow
    },
    props: {
      type:{
        type: Number,
        default: 1, //1 与任务的表单；2 与流程相关的表单
      },
      data:{
        type: Object,
        default: null, 
      },
    },
    computed:{
     
    },
    watch: {
      data(newval,oldval){
        console.log(newval,oldval)
        this.matchData = []; 
        this.type==1?this.dataMatching01(newval):this.dataMatching02(newval);
      },
    },
    created () {
    },
    mounted() {
      this.matchData = []; 
      this.type==1?this.dataMatching01(this.data_):this.dataMatching02(this.data_);
    },
    methods: { 
      
      /**
       * 数据匹配 列表中的processVariables与formData重装数据
       * @author chuanlin.Xiao
       * @date   2020-01-14T17:04:18+0800
       * @param  {[type]}                 data              [description]
       * @return {[type]}                                   [description]
       */
      dataMatching01(data){
        if(!data){return;}
        let that = this;
        let formData = [];
        let obj = {};
        this.dialogLoading = true;
        // 通过任务id， 获取具体表单的数据
        this.axios.get(`${this.common.basePath}/workflow/detail`,{params:{processTaskId:data.taskId}}).then((response) => {
          obj = response.data.processVariables
          // 通过流程实例id， 获取第一个节点表单
          this.axios.get(`${this.common.basePath}/workRecord/form/instanceId`,{params:{instanceId:data.processInstanceId}}).then((r) => {
            formData = r.data.formData;
            console.log(obj)
            console.log(formData)
            let matchData = [];
            formData.forEach( function(element, index) {
              let val = obj[element.obj.name]
              // if(element.obj.type=='datePicker'){
              //   val = that.common._convertDate(val, 'yyyy/MM/dd hh:mm')
              // }
              if(element.obj.type=='slider'){
                val = val+'%'
              }
              if(element.obj.fotmatType=='daterange'){
                val = val[0]+' 至 '+val[1]
              }
              matchData.push({label:element.obj.label,value:val,type:element.obj.type})
            });
            this.matchData = matchData
            console.log(matchData)
            this.dialogLoading = false;
          }).catch((errorMsg) => {
            this.dialogLoading = false;
            this.$message.error(errorMsg);
          })

          this.dialogLoading = false;
        }).catch((errorMsg) => {
          this.dialogLoading = false;
          this.$message.error(errorMsg);
        })    
      },

      /**
       * 数据匹配 列表中的processVariables与formData重装数据
       * @author chuanlin.Xiao
       * @date   2020-01-14T17:04:18+0800
       * @param  {[type]}                 data              [description]
       * @return {[type]}                                   [description]
       */
      dataMatching02(data){
        console.log(data)
        let that = this;
        let formData = [];
        let obj = data.processVariables;
        this.dialogLoading = true;
        // 通过流程实例id， 获取第一个节点表单
        this.axios.get(`${this.common.basePath}/workRecord/form/instanceId`,{params:{instanceId:data.id}}).then((r) => {
          formData = r.data.formData;
          console.log(obj)
          console.log(formData)
          let matchData = [];
          formData.forEach( function(element, index) {
            let val = obj[element.obj.name]
            // if(element.obj.type=='datePicker'){
            //   val = that.common._convertDate(val, 'yyyy/MM/dd hh:mm')
            // }
            if(element.obj.type=='slider'){
              val = val+'%'
            }
            if(element.obj.fotmatType=='daterange'){
              val = val[0]+' 至 '+val[1]
            }
            matchData.push({label:element.obj.label,value:val,type:element.obj.type})
          });
          this.matchData = matchData
          console.log(matchData)
          this.dialogLoading = false;
        }).catch((errorMsg) => {
          this.dialogLoading = false;
          this.$message.error(errorMsg);
        })  
      },

    },
  }
</script>

<style scoped lang="less"> 
  
</style>
