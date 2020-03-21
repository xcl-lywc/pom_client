/*************** 创建邮箱 *************/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'PartyMemberHome' }">首页</el-breadcrumb-item> 
          <el-breadcrumb-item :to="{ name: 'PMSecretaryMailbox' }">书记信箱</el-breadcrumb-item> 
          <el-breadcrumb-item>发送邮件</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">  
        <el-card v-loading="isLoad">  
          <el-form :model="mailboxForm" ref="mailboxForm" label-width="100px" class="demo-dynamic">
            <el-form-item
              prop="recipientOrg"
              label="接收组织："
              :rules="[
                { required: true, message: '请选择收件人', trigger: 'blur' }
              ]">
              <el-select v-model="mailboxForm.recipientOrg" @change="changeOrg">
                <el-option v-for="(item,index) in orgList" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="recipientName"
              prop="recipient"
              label="收件人："
              :rules="[
                { required: false, message: '请输入标题', trigger: 'blur' }
              ]">
              {{recipientName}}
            </el-form-item> 
            <el-form-item
              prop="senderName"
              label="写信人："
              :rules="[
                { required: true, message: '请输入标题', trigger: 'blur' }
              ]">
              {{mailboxForm.senderName}}
            </el-form-item>
            <el-form-item
              prop="anonymous"
              label="匿名发送："
              :rules="[
                { required: true, message: '请输入标题', trigger: 'blur' }
              ]">
              <el-radio-group v-model="mailboxForm.anonymous">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio> 
              </el-radio-group> 
            </el-form-item>
            <el-form-item
              prop="sendTitle"
              label="邮件主题："
              :rules="[
                { required: true, message: '请输入邮件主题', trigger: 'blur' }
              ]">
              <el-input v-model="mailboxForm.sendTitle"></el-input>
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
                v-for="(item, index) in mailboxForm.keyWords"
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
              prop="privateFiles"
              label="附件材料：" >
              <el-upload
                v-if="isShowUpload"
                :headers="common.returnConfig()"
                :action="`${common.basePath}/file?type=1&orgId=${orgId}&userId=${accessKey}`"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="beforeFileUpload" 
                name="files"
                :limit="99" >
                  <el-button size="small" type="primary">上传附件</el-button>
              </el-upload>
            </el-form-item> 
            <el-form-item
              prop="sendContent"
              label="正文："
              :rules="[
                { required: true, message: '请输入正文', trigger: 'blur' }
              ]">
               <el-input type="textarea" v-model="mailboxForm.sendContent" :rows="4" maxlength="1000" show-word-limit></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('mailboxForm',1)">稍后发送</el-button>
              <el-button type="primary" @click="submitForm('mailboxForm',2)">立即发送</el-button>
              <el-button @click="resetForm('mailboxForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>  
      </div>
    </div>
  </div>   
</template>

<script>
  import LeftMenu from '../components/LeftMenu'
  import Ueditor  from '../../../components/Ueditor'
  export default { 
    data() {
      return {   
        isLoad:       false,
        orgId:        this.$route.params.org_id,
        orgName:      this.$route.params.org_name,    
        accessKey:    sessionStorage.getItem('Access-Key'), 
        keyWordsInputVisible:  false,
        isShowUpload:          true,
        keyWordsInputValue:    null,
        orgList:               [],
        selectItem:            null,
        recipientName:         null,
        mailboxForm:   {
          keyWords:        [],
          recipient:       null,
          recipientName:   null,
          sendContent:     null,
          sendFile:        null,
          sendTime:        null,
          sendTitle:       null,
          sender:          sessionStorage.getItem('Access-Key'),
          senderName:      JSON.parse(sessionStorage.getItem('userBaseInfo')).real_name,
          anonymous:       null,
          recipientOrg:    null, 

        }
      }
    },
    components: { 
      LeftMenu,
      Ueditor
    },
    watch: {
    },
    created () {
      this.queryorgList();
    },
    mounted() {   
    },
    methods: {  
      /**
       * 查找组织列表
       * @return {[type]} [description]
       */
      queryorgList(){
        this.axios.get(`${this.common.basePath}/org/findAllPartCommitteeSuperior?id=${this.orgId}`, {}).then((response) => {
          this.orgList = response.data? response.data : [];
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })  
      },
      handleClose(tag) { 
        this.mailboxForm.keyWords.splice(tag, 1);
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
        
        this.mailboxForm.keyWords.push(inputValue);

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
        this.mailboxForm.sendFile = filesList.map((item, index) => {
          let result = {
            id:   item.response ? item.response.data[0].fileId : item.id,
            name: item.name
          }
          return result 
        })
        this.isShowUpload = true;
      },
      handleRemove (file, filesList) {
        // --------- 做一个显示隐藏功能，保证请求头中的nonce可以实时刷新 ---------
        this.isShowUpload = false;
        this.mailboxForm.sendFile = filesList 
        this.isShowUpload = true;
      },
      /**
       * 点击保存, 提交文章
       * @return {[type]} [description]
       */
      submitForm (formName,cur_status) {
        this.$refs[formName].validate((valid) => {
          if (valid) { //验证通过 
            if(cur_status==2){
              this.$confirm('是否立即发送该信件?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                // let form = JSON.parse(JSON.stringify(this.mailboxForm));
                this.isLoad = true;
                const form = {
                  ...this.mailboxForm,
                  sendFile: this.mailboxForm.sendFile?JSON.stringify(this.mailboxForm.sendFile):null,
                  keyWords: this.mailboxForm.keyWords.join(','),
                  cur_status:cur_status,
                } 

                this.axios.post(`${this.common.basePath}/mailbox/add`,form ).then((response) => {
                  this.$message.success(response.meta.message);
                  this.$router.push({name: 'PMSecretaryMailbox'});
                  this.isLoad = false;
                }).catch((errorMsg) => { 
                  this.isLoad = false;
                  this.$message.error(errorMsg)
                }) 
              }).catch(() => {}); 
            }else{
              // let form = JSON.parse(JSON.stringify(this.mailboxForm));
              this.isLoad = true;
              const form = {
                ...this.mailboxForm,
                sendFile: this.mailboxForm.sendFile?JSON.stringify(this.mailboxForm.sendFile):null,
                keyWords: this.mailboxForm.keyWords.join(','),
                cur_status:cur_status,
              } 

              this.axios.post(`${this.common.basePath}/mailbox/add`,form ).then((response) => {
                this.$message.success(response.meta.message);
                this.$router.push({name: 'PMSecretaryMailbox'});
                this.isLoad = false;
              }).catch((errorMsg) => { 
                this.isLoad = false;
                this.$message.error(errorMsg)
              }) 
            }
          } else {
            this.$message.error("请检查必填字段")
          }
        });
      }, 
      resetForm(formName){
        this.$refs[formName] ? this.$refs[formName].resetFields() : '';
      },
      changeOrg(){ 
        this.queryFindSuperiorSecretary();
      },
      /**
       * 获取某组织的上级组织书记
       * @return {[type]} [description]
       */
      queryFindSuperiorSecretary(){
        this.axios.get(`${this.common.basePath}/org/findSuperiorSecretary?id=${this.mailboxForm.recipientOrg}`, {}).then((response) => {
          this.mailboxForm.recipient = response.data ? response.data.user_id : null;
          this.recipientName = response.data ? response.data.user_name : null;
          this.mailboxForm.recipientName = response.data ? response.data.user_name : null;
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
