/*************** 待处理事项 *************/
<template>
  <task></task>
</template>

<script>
  import LeftMenu from '../components/LeftMenu'
  import task from '../../mainFunction/taskManagementComponents/ToDoList.vue'
  export default {
    data() {
      return { 
      }
    },
    
    components: { 
      LeftMenu,
      task
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
