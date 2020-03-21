<template>
  <div id="app">
    <!-- 根据需要显示不同的布局情况 -->
    <component :is="layout"></component>   
  </div>
</template>

<script>
  import BlankLayout from "./layout/BlankLayout.vue";
  import NavLayout from "./layout/NavLayout.vue" 

  export default {
    props: {
      layout: {
        type: String,
        default: "nav-layout"
      }
    },
    watch: {
      "$route": {
        handler (to, from) { 
        },
        deep: true
      }
    },
    components: {
      "nav-layout":   NavLayout,                                    
      "blank-layout": BlankLayout
    },
		data() {
      return {
      };
    },
    created(){ 
    },
		mounted() {
		},
    methods: {
    }
  }
</script>
<style>
  #app{
    overflow: hidden;
  }
  .qrcode-canvas-wrap>canvas {
    width: 260px!important;
    height: 260px!important;
  }
</style>
