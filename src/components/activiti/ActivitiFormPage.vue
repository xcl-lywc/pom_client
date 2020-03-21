/*************** 流程自定义表单的展示页面 *************/

<template>
  <tables></tables>
</template>

<script>
  import LeftMenuMain from '../../views/mainFunction/components/LeftMenu.vue'
  import LeftMenuParty from '../../views/partyMember/components/LeftMenu.vue'
  import LeftMenuStaff from '../../views/staffAndWorkers/components/LeftMenu.vue'
  import tables from './form/ActivitiFormTableComponent.vue'
  export default {
    data() {
      return { 
        jobName:sessionStorage.getItem('jobName'),// 党员首页/职工首页/党委工作台
      }
    },
    
    components: { 
      LeftMenuMain,
      LeftMenuParty,
      LeftMenuStaff,
      tables
    },
    watch: {
    },
    created () {
    },
    mounted() { 
      
    },
    methods: { 
     
    },
  }
</script>

<style scoped lang="less"> 
  
</style>