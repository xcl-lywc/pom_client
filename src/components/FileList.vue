/************** 文件列表显示组件 ************/
/* Date: 2018-10-29
/* Author: Mingzhang Zhao
/* data: [{name: "xxx", path: "xxx"}, ...] */

<template>
  <div class="file-list-wrap">
    <ul v-if="!!fileList && fileList.length > 0"> 
      <li v-for="(item, index) in fileList">

				<a v-if="item.path&&item.url" class="button-link"  :href="`${common.filePath}${item.path}`" target="_blank">{{item.name}}</a>
				<a v-if="item.url&&item.path==null&&item.raw==null" class="button-link"  :href="`${common.filePath}${item.url}`" target="_blank">{{item.name}}</a>
				<a v-if="item.raw" class="button-link"  :href="`${common.filePath}${item.response.data.path}`" target="_blank">{{item.name}}</a>
			</li>
    </ul>
  </div>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    props: {
      fileList: {
        type: Array,
        required: true,
      }
    },
    created () {
      this.fileList = this.fileList || []
    },
    mounted () {

    },
    methods: {

    }
  }
</script>

<style lang="less" scoped>
  .file-list-wrap {
    display: inline-block!important;
    ul>li a{
      color: #147cf4!important;
      text-decoration: none;
    }
  }
</style>