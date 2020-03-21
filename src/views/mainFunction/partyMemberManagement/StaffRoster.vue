/*************** 党员管理（党委 职工花名册） *************/
<template>
  <el-row>
    <h1 class="no-data">暂不开发</h1>
    <!-- <crop-avatar :fileTypes="['png', 'jpg']" @uploadSuccess="uploadAvatarSuccess" :size="'mini'" :avatar="personForm.head_img"></crop-avatar> -->

    <!-- <write-form @saveCustomForm="handleSubmit" :form_list="form_list"></write-form> -->
    <!-- <img :src="common.filePath + '/Blob/1/d23e88b9f09c4722bed6dff9d14cf130.blob'" alt=""> -->
  </el-row>
</template>

<script>
  import LeftMenu from '../components/LeftMenu'
  import CropAvatar from '../../../components/CropAvatar.vue'
  export default {
    data() {
      return { 
        personForm:{
          head_img:''
        },
        form_list: [], //最后需要保存的表单数据
      }
    },
    
    components: { 
      LeftMenu,
      CropAvatar
    },
    watch: {
    },
    created () {
    },
    mounted() { 
      this.query()
    },
    methods: { 
      uploadAvatarSuccess(val){

      },
      handleSubmit(val){

      },
      /**
       * 通过processDefKey，获取创建表的流程表单
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:18:28+0800
       * @return {[type]}                 [description]
       */
      query() {  
        this.axios.get(`${this.common.basePath}/workRecord/first/form?processDefKey=PartyDuesTurnInRecord`).then((response) => {
          let form_list = response.data.formData
          form_list.forEach( function(element, index) {
            if(element.ele == "datePicker"){
              element.obj.format != "yyyy-MM-dd" ? element.obj.format = "yyyy-MM-dd" : '';
              element.obj.require = false
              // element.obj.name = ''
            }else if(element.ele == "inputNumber"){
              element.obj.require = false
              // element.obj.name = ''
            }else if(element.ele == "timePicker"){
              element.obj.require = false
              // element.obj.name = ''
            }
          });
          this.form_list = form_list
        }).catch((errorMsg) => {
          this.form_list = []
          this.$message.error(errorMsg);
        }) 
      },
    },
  }
</script>

<style scoped lang="less"> 
  
</style>