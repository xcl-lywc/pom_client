/*************** 党课详情 *************/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
          <el-breadcrumb-item>网上党校</el-breadcrumb-item>
          <el-breadcrumb-item :to="{name: 'partylecturematerials'}">党课资料</el-breadcrumb-item>
          <el-breadcrumb-item>党课详情</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">
        <!-- 文章基本信息 -->
        <el-card > 
          <div class="article-box">
            <p class="mart10">课程名称：{}</p>
            <p class="mart10">关键词：<span class="text-dim"><el-tag class="marr5" v-for="i in 3" :key="i">关键词{{i}}</el-tag></span></p>
            <p class="mart10 desc-box pad5">简介：{}</p> 
          </div> 
        </el-card>
        <el-card class="padb20 mart20" v-loading="isLoad">
          <div slot="header" class="clearfix">
            <span>视频名称{} 发布党委名称{}</span>  
            <p class="fr"> 
              <span class="marr20"><i @click="like" class="fa fa-thumbs-o-up cursor-pointer"></i>({})</span>
              <span class="marr20"><i class="el-icon-chat-line-square"></i>({})</span>
              <span class="marr20"><i @click="learn" class="el-icon-reading cursor-pointer"></i>({})</span> 
            </p>
          </div> 
          <el-row :gutter="20">
            <el-col :span="16">
              <video width="100%" height="100%" controls>
                <source src="movie.mp4" type="video/mp4">
                <source src="movie.ogg" type="video/ogg">
                <source src="movie.webm" type="video/webm">
                <object data="movie.mp4" width="320" height="240">
                  <embed src="movie.swf" width="320" height="240">
                </object> 
              </video>
            </el-col>
            <el-col :span="8">
              <el-tabs v-model="activeName">
                <el-tab-pane label="详情" name="1">
                  <p class="mart10">{我们一起走过}</p>
                  <p class="mart10 desc-box pad5">{描述}</p>
                  <p class="mart10">附件：
                    <el-upload
                      class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/" 
                      multiple
                      :limit="3" 
                      :file-list="[]">  
                    </el-upload>
                  </p> 
                </el-tab-pane>
                <el-tab-pane label="评论" name="2">
                  <el-card shadow="never" v-for="(item, index) in commentList.rows">
                    <p class="marb20">{{item.commentContent}}</p>
                    <p class="text-right text-dim">
                      <el-avatar shape="square" class="marr5 comment-photo" :size="30" :src="common.filePath + item.picture">
                        <img v-if="item.sex===1" src="../../../assets/img/male.png"/>
                        <img v-else-if="item.sex===2" src="../../../assets/img/female.png"/>
                        <img v-else src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                      </el-avatar>
                      {{item.creatorName}} {{common._convertDate(item.createTime, 'yyyy-MM-dd')}}
                    </p>
                  </el-card>
                  <el-pagination   
                     class="fr mart20"
                     background 
                     :current-page="common.elementPagination.pageNum"
                     :page-sizes="common.elementPagination.pageSizes"
                     :page-size="common.elementPagination.pageSizeDefault"
                     layout="total, sizes, prev, pager, next"
                     :total="commentList.total">
                  </el-pagination> 
                </el-tab-pane>
                <el-tab-pane label="课时" name="3">
                  <el-card class="marb10" shadow="never" v-for="i in 2">
                    <div class="">
                      <p class="text-center"><img width="70%" height="100px" src="../../../assets/img/zip.jpg"></p>
                      <p class="mart10 text-center">{课时名称}</p>
                    </div>
                  </el-card>
                  <el-pagination   
                     class="fr mart20"
                     background 
                     :current-page="common.elementPagination.pageNum"
                     :page-sizes="common.elementPagination.pageSizes"
                     :page-size="common.elementPagination.pageSizeDefault"
                     layout="total, sizes, prev, pager, next"
                     :total="commentList.total">
                  </el-pagination> 
                </el-tab-pane> 
              </el-tabs>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="padb20 mart20" v-loading="isLoad">
          <div slot="header" class="clearfix">
            <span>相似课程推荐</span>   
          </div> 
          <el-row :gutter="20">
            <el-col v-for="i in 4" :span="6">
              <el-card class="">
                <p class="text-center"><img width="85%" height="100px" src="../../../assets/img/zip.jpg"></p>
                <p class="mart10 text-center">{课程名称}</p>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div> 
  </div> 
</template>

<script> 
  import LeftMenu from '../components/LeftMenu'
  export default {
    data() {
      return { 
        isLoad:                       false,
        isShowUpload:                 true,
        dialogAddCourseFormVisible:   false,
        accessKey:    sessionStorage.getItem('Access-Key'),
        orgId:        sessionStorage.getItem('Access-OrgId'),
        activeName:   '1',
        commentList:  {total: 0, rows: [{commentContent: '描述描述描述', picture: '/', createTime: '2019-12-19', creatorName: 'xyy'}]}
      }
    },
    components: { 
      LeftMenu, 
    },
    watch: {
    },
    created () {
    },
    mounted() {
    },
    methods: {
      like(){
        this.axios.get(`${this.common.basePath}/${this.typeKey}/like?id=${this.articleId}&userId=${this.accessKey}`, '').then((response) => {
          this.getQueryDetailById();
          this.$message.success(response.meta.message);
        }).catch((errorMsg) => { 
          this.$message.error(errorMsg)
        })   
      },
      learn(){
        this.axios.get(`${this.common.basePath}/${this.typeKey}/learn/${this.articleId}?userId=${this.accessKey}`, '').then((response) => {
          this.getQueryDetailById();
          this.$message.success(response.meta.message);
        }).catch((errorMsg) => { 
          this.$message.error(errorMsg)
        })   
      },
    },
  }
</script>

<style scoped lang="less">  
.block-temp{
  .img-box{
    position: relative;
    .img{
      width: 100%;
    }
    p{
      position: absolute;
      bottom: 4px;
      right: 0;
      background: #ccc;
      padding: 5px;
      color: #fff;
    }
  }
  
  .title{
    width: calc(100% - 56px);
    display: inline-block;
  }
}
</style>
<style type="text/css">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>