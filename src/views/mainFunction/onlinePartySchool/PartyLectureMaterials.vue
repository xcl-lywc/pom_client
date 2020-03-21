/*************** 党课资料 *************/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
          <el-breadcrumb-item>网上党校</el-breadcrumb-item>
          <el-breadcrumb-item>党课资料</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">
         <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline search-box marb20">
            <el-form-item label="标题：" prop="title">
              <el-input v-model="searchForm.title" placeholder="" style="width: 400px"></el-input>
            </el-form-item>
            <el-form-item label="创建时间：" prop="searchDateRange" class="marl20">
              <el-date-picker
                v-model="searchForm.searchDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="状态：" prop="status" class="marl20">
              <el-select v-model="searchForm.status">
                <el-option label="全部" value=""></el-option>
                <el-option label="已发布" value="1"></el-option>
                <el-option label="未发布" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">搜索</el-button>
              <el-button type="primary" @click="emptyForm('searchForm')">置空</el-button>
            </el-form-item>
          </el-form> 
          <el-card class="padb20" v-loading="isLoad">
            <div slot="header" class="clearfix marb15">
              <span class="el-card-have-border-span">党课列表</span>  
              <div class="el-card-head-btn">
                <el-button type="primary" size="small" @click=" showDialog() ">添加课程</el-button>
              </div>
            </div>  
            <el-row :gutter="20">
              <el-col v-for=" i in 18" :span="4" class="block-temp marb20">
                <div @click="$router.push({name: 'PartyLectureDetail',params:{lecture_id: 1}})" class="img-box">
                  <img class="img" src="../../../assets/img/doc.jpg"/>
                  <p>共{{i}}期</p>
                </div>
                <p @click="$router.push({name: 'PartyLectureDetail',params:{lecture_id: 1}})" ><span class="title single-line-text-overflow">我们走在大路上{}</span> <span class="status fr">编辑中{}</span></p>
              </el-col>
            </el-row>
            <el-pagination   
               class="fr mart20"
               background
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
               :current-page="common.elementPagination.pageNum"
               :page-sizes="common.elementPagination.pageSizes"
               :page-size="common.elementPagination.pageSizeDefault"
               layout="total, sizes, prev, pager, next"
               :total="listData.total">
            </el-pagination>  
          </el-card>
      </div>
    </div>
    <!-- 添加课程 -->
    <el-dialog title="添加课程" :visible.sync="dialogAddCourseFormVisible" width="900px">
      <el-form ref="addCourseForm"  :model="addCourseForm" label-width="100px">
        <el-row>
          <el-col :span="16">
            <el-form-item 
              label="课程名称：" prop="name"
              :rules="[
                { required: true, message: '请输入党委名称', trigger: 'blur' }
              ]">
              <el-input v-model="addCourseForm.name"></el-input>
            </el-form-item>
            <el-form-item
              prop="keyWords"
              label="关键词："
              :rules="[
                { required: true, message: '请输入关键词', trigger: 'blur' }
              ]"> 
              <el-tag 
                class="marr20"
                :key="index"
                v-for="(item, index) in addCourseForm.keyWords"
                closable
                :disable-transitions="false"
                @close="handleClose(item)">
                {{item}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="keyWordsInputVisible"
                v-model="keyWordsInputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showKeyWordsInput">添加</el-button>
            </el-form-item>
            <el-form-item
              prop="laudScore"
              label="用户操作："
              :rules="[
                { required: true, message: '请输入标题', trigger: 'blur' }
              ]"> 
              <el-checkbox v-model="addCourseForm.laudScore" true-label="0"  false-label="">点赞</el-checkbox>
              <el-checkbox v-model="addCourseForm.commentScore" true-label="0"  false-label="">评论</el-checkbox>
              <el-checkbox v-model="addCourseForm.learnScore" true-label="0"  false-label="">学习</el-checkbox>
              <el-checkbox v-model="addCourseForm.errorScore" true-label="0"  false-label="">报错</el-checkbox>
            </el-form-item> 
            <el-form-item 
              label="简介：" prop="description"
              :rules="[
                { required: true, message: '请输入党委名称', trigger: 'blur' }
              ]">
              <el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="addCourseForm.description"></el-input>
            </el-form-item>
          </el-col>    
          <el-col :span="8">
          <el-form-item 
            label="课程封面：" prop="cover">
            <el-upload
              class="avatar-uploader"
              v-if="isShowUpload"
              :headers="common.returnConfig()"
              :action="`${common.basePath}/file?type=1&orgId=${orgId}&userId=${accessKey}`"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="addCourseForm.cover" :src="addCourseForm.cover" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item> 
          </el-col> 
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddCourseFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddCourseForm('addCourseForm')">确 定</el-button>
      </div>
    </el-dialog>
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
        searchForm: {
          title:            null,
          searchDateRange:  null,
          status:           null,
        },
        listData:   {total: 0, rows: []},
        addCourseForm:  {
          name:         null,
          keyWords:     [],
          description:  null,
          laudScore:    null,
          commentScore: null,
          learnScore:   null,
          errorScore:   null,
        },
        keyWordsInputValue:     null,
        keyWordsInputVisible:    null,
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
      /**
       * 按条件搜索列表
       * @return {[type]} [description]
       */
      onSubmit(){
        this.getQueryList();
      },
      /**
       * 置空
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      emptyForm(formName){ 
        this.$refs[formName] ? this.$refs[formName].resetFields() : '';
      },
      /**
       * 查询列表
       * @return {[type]} [description]
       */
      getQueryList(){  
        this.axios.post(`${this.common.basePath}/${this.requestUrl}/article/list/all`, this._queryListParams()).then((response) => {
          this.listData = response.data;
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg)
        })  
      },
      _queryListParams(){
        this.searchForm.beginTime = this.searchForm.searchDateRange ? this.searchForm.searchDateRange[0].getTime() : '';
        this.searchForm.endTime = this.searchForm.searchDateRange ? this.searchForm.searchDateRange[1].getTime() : '';
        let params = JSON.parse(JSON.stringify(this.searchForm));
        delete params.searchDateRange;
        return params;
      },
      /*
       * 改变当前页码触发此事件
       * @param {number} val 当前页码
       * @param {string} type studentList为学生列表类型，memberList为所有成员列表 
       */
      handleCurrentChange(val, type){  
        this.searchForm.pageNum = val;
        this.getQueryList(); 
       },
      /*
       * 改变每页条数触发此事件
       * @param {number} val 当前数据
       */
      handleSizeChange(val, type){ 
        this.searchForm.pageSize = val;
        this.getQueryList(); 
       },
      /**
       * 显示添加课程弹框
       * @return {[type]} [description]
       */
      showDialog(){
        this.$refs.addCourseForm ? this.$refs.addCourseForm.resetFields() : '' ;
        this.dialogAddCourseFormVisible = true;

      }, 
      handleClose(tag) { 
        this.addCourseForm.keyWords.splice(tag, 1);
      },
      /**
       * 显示添加关键词的文本框
       * @return {[type]} [description]
       */
      showKeyWordsInput() {
        this.keyWordsInputVisible = true; 
        this.$nextTick(_ => { 
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      /**
       * 提交关键词
       * @return {[type]} [description]
       */
      handleInputConfirm() { 
        let inputValue = this.keyWordsInputValue;  
        
        this.addCourseForm.keyWords.push(inputValue);

        this.keyWordsInputVisible = false;
        this.keyWordsInputValue = '';
      },
      /*
       * 附件上传之前，验证的数据大小
       */
      beforeAvatarUpload(file){
        const isLt2M = file.size / 1024 / 1024 < 100;
        if (!isLt2M) {
          this.$message.error('附件大小不能超过 100MB!');
        }
        return isLt2M;
      },
      handleAvatarSuccess (response, file, filesList) {
        // --------- 做一个显示隐藏功能，保证请求头中的nonce可以实时刷新 ---------
        this.isShowUpload = false;  
        if(response.meta.code == 0){
          this.addCourseForm.cover = response.data.url;
        }
        this.isShowUpload = true;
      },
      /**
       * 点击保存, 
       * @return {[type]} [description]
       */
      submitAddCourseForm (formName) {   

        let form = {
          ...this.addCourseForm,
          commentScore:   !this.addCourseForm.commentScore ? '' : 0, 
          laudScore:      !this.addCourseForm.laudScore ? '' : 0, 
          errorScore:     !this.addCourseForm.errorScore ? '' : 0, 
          learnScore:     !this.addCourseForm.learnScore ? '' : 0, 
        } 

        this.$refs[formName].validate((valid) => {
          if (valid) { //验证通过    
            this.axios.post(`${this.common.basePath}/${this.articleType}/article`, form).then((response) => {
              this.$message.success(response.meta.message) 
              this.getQueryList();
            }).catch((errorMsg) => { 
              this.$message.error(errorMsg)
            })  
          } else {
            this.$message.error("请检查必填字段")
          }
        });
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