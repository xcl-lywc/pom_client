/**
 * 文件预览 组件
 * @author chuanlin.Xiao
 * @date   2019-11-08T10:33:24+0800
 * @version v1.0.0 (2019/11/08)
 * @company chuangxiangyuan
*/
<template>
  <div class="file-show-list-wrap_bolb">
    <div v-if="fileList && fileList.length > 0"> 
      <el-tag
        class="tag"
        v-for="(tag,index) in fileList"
        :key="`${index}文件展示`"
        :closable="closable"
        @close="$emit('handleClose',tag);"
        @click="isDownload?handleClick(tag):''">
        <!-- 图片 -->
        <div style="display:inline-block;" :style="isDownload ? 'cursor: pointer' : ''"  v-if="
          tag.name.split('.')[1]==='jpg'||
          tag.name.split('.')[1]==='png'||
          tag.name.split('.')[1]==='jpeg'||
          tag.name.split('.')[1]==='gif'||
          tag.name.split('.')[1]==='bmp'">
          <img :src="`${tag.path}`" :onerror="errimage" class="thumbnail fl"/>
          <span class="fl name">{{tag.name}}</span>
        </div>
        <!-- 视频-->
        <div style="display:inline-block;" :style="isDownload ? 'cursor: pointer' : ''" v-else-if="
          tag.name.split('.')[1]==='mp4'||
          tag.name.split('.')[1]==='rmvb'||
          tag.name.split('.')[1]==='wmv'||
          tag.name.split('.')[1]==='asf'||
          tag.name.split('.')[1]==='avi'||
          tag.name.split('.')[1]==='3gp'||
          tag.name.split('.')[1]==='mpg'||
          tag.name.split('.')[1]==='mkv'||
          tag.name.split('.')[1]==='dvd'||
          tag.name.split('.')[1]==='ogm'||
          tag.name.split('.')[1]==='mpeg2'||
          tag.name.split('.')[1]==='mpeg4'||
          tag.name.split('.')[1]==='mpeg'||
          tag.name.split('.')[1]==='mov'">
          <img src="../assets/img/video.jpg" class="thumbnail fl"/>
          <span class="fl name">{{tag.name}}</span>
        </div>
        <!-- 音频 -->
        <div style="display:inline-block;" :style="isDownload ? 'cursor: pointer' : ''" v-else-if="
          tag.name.split('.')[1]==='mp3'||
          tag.name.split('.')[1]==='ogg'||
          tag.name.split('.')[1]==='wav'||
          tag.name.split('.')[1]==='ape'||
          tag.name.split('.')[1]==='cda'||
          tag.name.split('.')[1]==='midi'||
          tag.name.split('.')[1]==='acc'||
          tag.name.split('.')[1]==='mac'">
          <img src="../assets/img/audio.jpg" class="thumbnail fl"/>
          <span class="fl name">{{tag.name}}</span>
        </div>
        <!-- doc文件 -->
        <div style="display:inline-block;" :style="isDownload ? 'cursor: pointer' : ''" v-else-if="
          tag.name.split('.')[1]==='doc'||
          tag.name.split('.')[1]==='docx'">
          <img src="../assets/img/doc.jpg" class="thumbnail fl"/>
          <span class="fl name">{{tag.name}}</span>
        </div>
        <!-- xls文件 -->
        <div style="display:inline-block;" :style="isDownload ? 'cursor: pointer' : ''" v-else-if="
          tag.name.split('.')[1]==='xls'||
          tag.name.split('.')[1]==='xlsx'">
          <img src="../assets/img/xls.jpg" class="thumbnail fl"/>
          <span class="fl name">{{tag.name}}</span>
        </div>
        <!-- txt文件 -->
        <div style="display:inline-block;" :style="isDownload ? 'cursor: pointer' : ''" v-else-if="
          tag.name.split('.')[1]==='txt'">
          <img src="../assets/img/txt.jpg" class="thumbnail fl"/>
          <span class="fl name">{{tag.name}}</span>
        </div>
        <!-- ppt文件 -->
        <div style="display:inline-block;" :style="isDownload ? 'cursor: pointer' : ''" v-else-if="
          tag.name.split('.')[1]==='ppt'||
          tag.name.split('.')[1]==='pptx'">
          <img src="../assets/img/ppt.jpg" class="thumbnail fl"/>
          <span class="fl name">{{tag.name}}</span>
        </div>
        <!-- zip文件 -->
        <div style="display:inline-block;" :style="isDownload ? 'cursor: pointer' : ''"  v-else-if="
          tag.name.split('.')[1]==='zip'">
          <img src="../assets/img/zip.jpg" class="thumbnail fl"/>
          <span class="fl name">{{tag.name}}</span>
        </div>
        <!-- 其它文件 -->
        <div style="display:inline-block;" :style="isDownload ? 'cursor: pointer' : ''" v-else>
          <img src="../assets/img/unknow.jpg" class="thumbnail fl"/>
          <span class="fl name">{{tag.name}}</span>
        </div>
      </el-tag>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        errimage: 'this.src="' + require('../assets/img/err.png') + '";this.οnerrοr=null',//图片加载失败
      }
    },
    props: {
      fileList: {
        type: Array,
        // required: true,
      },
      closable:{
        type:Boolean,
        default:false
      },
      isDownload: { // true为能下载附件
        type: Boolean,
        default: true, 
      }
    },
    created () {
      // this.fileList = this.fileList || []
    },
    mounted () {
      
    },
    methods: {
      errorHandler() {
        return false
      },
      handleClick(val){
        // console.log(val)
        window.open(this.common.filePreviewUrl+'?url='+encodeURIComponent(val.path));
      },
    }
  }
</script>

<style lang="less" >
  .file-show-list-wrap_bolb {
    overflow:hidden;
    .tag{
      height:62px !important;
      box-sizing:border-box;
      padding:5px 10px;
      margin-right: 10px;
      display:display-block;
      margin-bottom:10px;
      .thumbnail{
        width:50px;
        height:50px;
        
      }
      .name{
        padding: 10px;
      }

      .el-icon-close{
        top:-20px;
      }
    }
    
  }
</style>