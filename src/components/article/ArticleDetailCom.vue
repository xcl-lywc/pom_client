/*************** 文章详情 *************/
<template>
  <div v-loading="isLoad" > 
    <!-- 文章基本信息 -->
    <el-card v-if="articleInfo"> 
      <div class="article-box">
        <h3 class="text-center">{{articleInfo.articleName}}</h3>
        <p class="text-center mart20">{{common._convertDate(articleInfo.createTime, 'yyyy年MM月dd日')}}</p>
        <p class="mart20">关键词：<span class="text-dim"><el-tag class="marr10" v-for="(item, index) in articleInfo.keyWords" :key="index">{{item}}</el-tag></span></p>
        <p class="mart20" v-html="articleInfo.articleContent"></p>
        <p class="mart20">
          附件：
          <!-- <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/" 
            multiple
            :limit="3" 
            :file-list="articleInfo.privateFiles ? JSON.parse(articleInfo.privateFiles) : []">  
          </el-upload> -->
          <file-preview :fileList="articleInfo.privateFiles ? JSON.parse(articleInfo.privateFiles) : []" :closable="false"></file-preview>
        </p>
        <p class="mart20 text-right font-icon-flex">
          <span class="marr20"><i @click="collect" class="fa fa-heart-o cursor-pointer"></i>({{articleInfo.collectionAomunt}})</span>
          <span class="marr20"><i @click="like" class="fa fa-thumbs-o-up cursor-pointer"></i>({{articleInfo.aLisksAomunt}})</span>
          <span class="marr20"><i class="el-icon-chat-line-square"></i>({{commentList.rows.length}})</span>
          <span class="marr20"><i @click="learn" class="el-icon-reading cursor-pointer"></i>({{articleInfo.learnAomunt}})</span>
          <span><i @click="$message('没接口')" class="el-icon-warning-outline cursor-pointer"></i></span>
        </p>
      </div> 
    </el-card>
    <!-- 评论列表 -->
    <el-card class="padb20 mart20" v-loading="isLoad">
      <div slot="header" class="clearfix">
        <span>评论列表</span>  
      </div> 
      <el-card class="marb20" shadow="never" v-for="(item, index) in commentList.rows">
        <p class="marb20">{{item.commentContent}}</p>
        <p class="text-right text-dim">
          <el-avatar shape="square" class="marr5 comment-photo" :size="30" :src="common.imgPath + userBaseInfo.picture">
          <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
        </el-avatar>
          {{item.creatorName}} {{common._convertDate(item.createTime, 'yyyy-MM-dd')}}
        </p>
      </el-card>
      <el-pagination   
         class="fr mart20"
         background
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="common.elementPagination.pageNum"
         :page-sizes="common.elementPagination.pageSizes"
         :page-size="common.elementPagination.pageSizeDefault"
         layout="total, sizes, prev, pager, next"
         :total="commentList.total">
      </el-pagination> 
    </el-card>
    <!-- 发表评论 -->
    <el-card class="mart20">
      <p class="text-dim"> 
        <el-avatar shape="square" class="marr5 comment-photo" :size="30" :src="common.imgPath + userBaseInfo.picture">
          <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
        </el-avatar>
        {{userBaseInfo.user_name}}
      </p>
      <p class="mart20">
        <el-input type="textarea" v-model="commentForm.commentContent" :rows="4" maxlength="128" show-word-limit></el-input>
      </p>
      <p class="mart20 text-right">
        <el-button @click="" type="primary" @click="submitReview">发表</el-button>
      </p>
    </el-card>
  </div> 
</template>

<script> 
  import FilePreview from "../FilePreview.vue"
  export default {
    data() {
      return {   
        isLoad:       true, 
        accessKey:    sessionStorage.getItem('Access-Key'),
        typeName:     sessionStorage.getItem('articleTypeName'),
        subtypeName:     sessionStorage.getItem('articleSubTypeName'),
        typeKey:      sessionStorage.getItem('articleTypeKey'),
        userBaseInfo: JSON.parse(sessionStorage.getItem('userBaseInfo')),
        typeId:       this.$route.params.type_id,
        articleId:    this.$route.params.article_id,
        articleInfo:  null,
        searchCommentForm: { 
          pageNum:         this.common.elementPagination.pageNumDefault,
          pageSize:        this.common.elementPagination.pageSizeDefault,
        },
        reviewSearchForm: {
          articleId:       this.$route.params.article_id,
          userId:          sessionStorage.getItem('Access-Key'),
          pageNum:         this.common.elementPagination.pageNumDefault,
          pageSize:        this.common.elementPagination.pageSizeDefault,
        }, 
        commentList: {rows: [], total: 0},
        commentForm: {
          articleId:     this.$route.params.article_id,
          commentContent: null,
          creator:        sessionStorage.getItem('Access-Key')
        }
      }
    },
    components: { 
      FilePreview 
    },
    watch: {
    },
    created () {
    },
    mounted() {
      this.getQueryDetailById();
      this.queryCommentList();
    },
    methods: {
      /**
       * 查询文章详情
       * @return {[type]} [description]
       */
      getQueryDetailById(){ 
        this.axios.get(`${this.common.basePath}/${this.typeKey}/${this.articleId}/detail?partyOrgId=${this.typeId}&userId=${this.accessKey}`, '').then((response) => {
          this.articleInfo = response.data; 
        }).catch((errorMsg) => { 
          this.$message.error(errorMsg)
        })  
      }, 
      /**
       * 查询评论列表
       * @return {[type]} [description]
       */
      queryCommentList(){ 
        this.isLoad = true;
        this.axios.post(`${this.common.basePath}/${this.typeKey}/review/list`, this.reviewSearchForm).then((response) => {
          this.commentList = response.data; 
          this.isLoad = false;
        }).catch((errorMsg) => { 
          this.isLoad = false;
          this.$message.error(errorMsg)
        })  
      },
      /*
       * 改变当前页码触发此事件
       * @param {number} val 当前页码
       * @param {string} type studentList为学生列表类型，memberList为所有成员列表 
       */
      handleCurrentChange(val, type){  
        this.searchCommentForm.pageNum = val;
        this.queryCommentList(); 
       },
      /*
       * 改变每页条数触发此事件
       * @param {number} val 当前数据
       */
      handleSizeChange(val, type){ 
        this.searchCommentForm.pageSize = val;
        this.queryCommentList(); 
       },
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
      /**
       * 发表评论
       * @return {[type]} [description]
       */
      submitReview(){   
        this.axios.post(`${this.common.basePath}/${this.typeKey}/review`, this.commentForm).then((response) => {
          this.queryCommentList();
          this.commentForm.commentContent = null;
          this.$message.success(response.meta.message);
        }).catch((errorMsg) => { 
          this.$message.error(errorMsg)
        })  
      },
      collect(){
        this.axios.post(`${this.common.basePath}/${this.typeKey}/collect?id=${this.articleId}&userId=${this.accessKey}`, '').then((response) => {
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
  .el-menu{
    border-right: none!important;
    width: 250px;
  }
  .article-box{
    .title{
      display: inline-block;
      width: calc(100% - 100px);
      padding-right: 40px;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .date{
      display: inline-block;
      color: #9E9E9E;
      position: relative;
      top: -4px;
    }
    .font-icon-flex{
      i{
        font-size: 23px;
      }
    }
  }
</style>
