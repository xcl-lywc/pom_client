/**************文本编辑器*************/
/* 需要根据不同的编辑状态初始化      */

<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>

<script>
  import '../../public/ueditor/ueditor.config.js'
  import '../../public/ueditor/ueditor.all.js'
  import '../../public/ueditor/lang/zh-cn/zh-cn.js'

  export default {
    name: "UEditor",
    props: {
      id: {
          type: String
      },
      config: {
          type: Object,
          default: "",
      },
    },
    watch :{
      // config: {
      //   handler (newV, oldV) {
      //     UE.delEditor('editor');
      //     this.editor = UE.getEditor('editor', newV);
      //     //this.editor.setContent(newV.initialContent)
      //     console.log(newV.initialContent)     
      //   },
      //   deep: true
      // }
    },
    data() {
      return {
        editor: null
      }
    },
    created () {

    },
    mounted () {
      if(document.getElementById("editor")) {
        UE.delEditor('editor');
      }
      this.editor = UE.getEditor('editor', this.config);
    },
    methods:{
      getUEContent: function(){
        return this.editor.getContent();
      },
      /**
       * 设置编辑器内的值
       */
      setContent (content) {
        this.editor.setContent(content)
      }
    }
  }
</script>
<style>
  .edui-editor.edui-default {
    z-index: 99!important;
  }
</style>