/*************** 文章详情 *************/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item> 
          <el-breadcrumb-item :to="{ name: `${articleType.replace(articleType[0],articleType[0].toUpperCase())}Article` }">
            {{articleTypeName}}
          </el-breadcrumb-item> 
          <el-breadcrumb-item>上传文章</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
      <div class="theme-main"> 
        <!-- 文章基本信息 -->
        <el-card v-loading="isLoad">  
          <el-form :model="articleForm" ref="articleForm" label-width="100px" class="demo-dynamic">
            <el-form-item
              prop="articleName"
              label="标题："
              :rules="[
                { required: true, message: '请输入标题', trigger: 'blur' }
              ]">
              <el-input v-model="articleForm.articleName"></el-input>
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
                v-for="(item, index) in articleForm.keyWords"
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
            <!-- <el-form-item prop="keyWords"
              label="类型："
              :rules="[
                { required: true, message: '请输入关键词', trigger: 'blur' }
              ]"> 
              <el-select v-model="articleForm.special">
                <el-option v-for="(item, index) in policiesTypeList" :value="item.atId.toString()" :label="item.atName"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item
              prop="articleContent"
              label="正文内容："
              :rules="[
                { required: true, message: '请输入内容', trigger: 'blur' }
              ]">
              <ueditor :config="editorConfig" ref="ueditor"></ueditor>
            </el-form-item>
            <el-form-item
              prop="privateFiles"
              label="附件内容：" >
              <!-- <el-upload
                v-if="isShowUpload"
                :headers="common.returnConfig()"
                :action="`${common.basePath}/file?type=1&orgId=${orgId}&userId=${accessKey}`"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="beforeFileUpload"
                :file-list="fileList"
                name="files"
                :limit="99" >
                  <el-button size="small" type="primary">上传附件</el-button>
              </el-upload> -->
              <el-upload
                v-if="isShowUpload"
                :action="`${common.uEApiPath}/ueditor/exec?action=uploadfile`"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="beforeFileUpload"
                :file-list="fileList"
                name="upfile"
                :limit="99" >
                  <el-button size="small" type="primary">上传附件</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item
              prop="articleName"
              label="文章设置："
              :rules="[
                { required: true, message: '请输入标题', trigger: 'blur' }
              ]"> 
              <el-checkbox v-model="articleForm.laudScore" true-label="0"  false-label="">点赞</el-checkbox>
              <el-checkbox v-model="articleForm.commentScore" true-label="0"  false-label="">评论</el-checkbox>
              <el-checkbox v-model="articleForm.learnScore" true-label="0"  false-label="">学习</el-checkbox>
              <el-checkbox v-model="articleForm.errorScore" true-label="0"  false-label="">报错</el-checkbox>
            </el-form-item> 
            <el-form-item>
              <el-button type="primary" @click="submitForm('articleForm')">提交</el-button>
              <el-button @click="resetForm('articleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>  
      </div>
    </div>
  </div>  
</template>

<script> 
  import Ueditor  from '../../../components/Ueditor'
  export default { 
    data() {
      return {   
        isLoad:       false,
        articleId:    this.$route.params.article_id,
        articleType:  this.$route.params.article_type,
        articleTypeName:     sessionStorage.getItem('articleTypeName'),
        accessKey:    sessionStorage.getItem('Access-Key'),
        orgId:        sessionStorage.getItem('Access-OrgId'),
        articleForm:  { 
          articleContent:  null,
          articleName:     null,
          articleNum:      null,
          articleWord:     null,
          author:          null,
          creator:         sessionStorage.getItem('Access-Key'),
          keyWords:        [],
          commentScore:    null,
          errorScore:      null,
          laudScore:       null,
          learnScore:      null,
          partyOrgId:      sessionStorage.getItem('Access-OrgId'),
          privateFiles:    null,
          special:         '',
        },  
        policiesTypeList:    [], //政策法规类型列表
        keyWordsInputValue:     null,
        keyWordsInputVisible:    null,
        
        fileList: [], //附件列表
        isShowUpload:      true,
        editorConfig: {
          /*可以在此处定义工具栏的内容*/
          elementPathEnabled: false,
          autoHeightEnabled: false,
          autoFloatEnabled: false,　　//是否工具栏可浮动
          initialContent: ' ',   //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
          autoClearinitialContent: false, 
          //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
          initialFrameWidth: null,
          initialFrameHeight: 450,
          BaseUrl: '',
          UEDITOR_HOME_URL: '/ueditor/'
        },
      }
    },
    components: {  
      Ueditor
    },
    watch: {
    },
    created () {

    },
    mounted() {  
      // this.getPoliciesType();
      // ------------- 如果传过来的Id不是add,表示是编辑功能 ----------
      this.articleId !='add' ? this.getQueryDetailById() : '' ;
    },
    methods: { 
      /**
       * 查询文章详情
       * @return {[type]} [description]
       */
      getQueryDetailById(){
        this.axios.get(`${this.common.basePath}/${this.articleType}/${this.articleId}/detail?partyOrgId=${this.orgId}&userId=${this.accessKey}`, '').then((response) => {
          this._special(response.data);

        }).catch((errorMsg) => { 
          this.$message.error(errorMsg)
        })  
      },
      _special(data){ 
        if(data.special){
          data.special.forEach( (item) => {
            data.special = item.atType.toString();
          }) 
        }   
        data.commentScore = data.commentScore == 0 ? true : false;
        data.errorScore =  data.errorScore == 0 ? true : false;
        data.laudScore =  data.laudScore == 0 ? true : false;
        data.learnScore =  data.learnScore == 0 ? true : false;
        this.fileList = JSON.parse(data.privateFiles);
        this.$refs.ueditor.setContent(data.articleContent);
        
        this.articleForm = {
          articleContent:  data.articleContent,
          articleName:     data.articleName,
          articleNum:      null,
          articleWord:     null,
          author:          null,
          creator:         sessionStorage.getItem('Access-Key'),
          keyWords:        data.keyWords,
          commentScore:    data.commentScore,
          errorScore:      data.errorScore,
          laudScore:       data.laudScore,
          learnScore:      data.learnScore,
          partyOrgId:      sessionStorage.getItem('Access-OrgId'),
          privateFiles:    this.fileList,
          special:         '',
        };
      },
      handleClose(tag) { 
        this.articleForm.keyWords.splice(tag, 1);
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
        console.log(inputValue)
        if(!inputValue||inputValue==''){return}
        this.articleForm.keyWords.push(inputValue);

        this.keyWordsInputVisible = false;
        this.keyWordsInputValue = '';
      },
      /*
       * 附件上传之前，验证的数据大小
       */
      beforeFileUpload(file){
        const isLt2M = file.size / 1024 / 1024 < 100;
        if (!isLt2M) {
          this.$message.error('附件大小不能超过 100MB!');
        }
        return isLt2M;
      },
      handleSuccess (response, file, filesList) {
        // --------- 做一个显示隐藏功能，保证请求头中的nonce可以实时刷新 ---------
        this.isShowUpload = false;  
        //-------------- 组装附件数据 -----------------
        let result = {
          path:   file.response ? file.response.path : '',
          name:   file.name
        }
        this.fileList.push(result)
        this.isShowUpload = true;
      },
      handleRemove (file, filesList) {
        // --------- 做一个显示隐藏功能，保证请求头中的nonce可以实时刷新 ---------
        this.isShowUpload = false;
        //-------------- 组装附件数据 -----------------
        this.fileList = filesList.map((item, index) => {
          let result = {
            path:   item.path ? item.path : '',
            name:   item.name
          }
          return result 
        })
        this.isShowUpload = true;
      },
      /**
       * 点击保存, 提交文章
       * @return {[type]} [description]
       */
      submitForm (formName) { 
        let requestUrl = this.articleId == 'add' ? 
                `${this.common.basePath}/${this.articleType}/article` : 
                `${this.common.basePath}/${this.articleType}/article/${this.articleId}`

        this.articleForm.articleContent = this.$refs.ueditor.getUEContent(); 
        this.articleForm.privateFiles = JSON.stringify(this.fileList)
        let form = {
          ...this.articleForm,
          commentScore:   !this.articleForm.commentScore ? '' : 0, 
          laudScore:      !this.articleForm.laudScore ? '' : 0, 
          errorScore:     !this.articleForm.errorScore ? '' : 0, 
          learnScore:     !this.articleForm.learnScore ? '' : 0, 
        } 

        this.$refs[formName].validate((valid) => {
          if (valid) { //验证通过    
            this.isLoad = true;
            this.axios.post(requestUrl, form).then((response) => {
              this.$message.success(response.meta.message)
              this.$router.push({name: `${this.articleType.replace(this.articleType[0],this.articleType[0].toUpperCase())}Article`});
              this.isLoad = false;
            }).catch((errorMsg) => {
              this.isLoad = false; 
              this.$message.error(errorMsg)
            })  
          } else {
            this.$message.error("请检查必填字段")
          }
        });
      },
      /**
       * 查询政策法规类型
       * @return {[type]} [description]
       */
      getPoliciesType(){  
        this.axios.get(`${this.common.basePath}/${this.articleType}/type`, '').then((response) => {
          this.policiesTypeList = response.data;
        }).catch((errorMsg) => { 
          this.$message.error(errorMsg)
        })  
      },
      resetForm(formName){
        this.$refs[formName] ? this.$refs[formName].resetFields() : '';
      }
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
      color: #ccc;
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
