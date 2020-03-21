/************ 书记信箱 ***********/
<template>
  <div v-loading="isLoad">
    <!-- 邮件内容 -->
    <el-card>
      <div slot="header" class="clearfix">
        <span>邮件内容</span> 
      </div>
      <el-row> 
        <el-col :span="9">
          <p class="mart10">收件组织：{{info.recipient_org_name ? info.recipient_org_name : '无'}}</p>
          <p class="mart10" v-if="info.anonymous==0">写信人：{{info.sender_name ? info.sender_name : '无'}}</p>
          <p class="mart10" v-if="info.anonymous==1">写信人：【匿名】</p>
          <p class="mart10">邮件主题：{{info.send_title ? info.send_title : '无'}}</p>
          <p class="mart10">关键词：{{info.key_words ? info.key_words : '无'}}</p> 
          <p class="mart10"></p>
        </el-col>
        <el-col :span="10">
          <p class="mart10">收件人：{{info.recipient_name ? info.recipient_name : '无'}}</p>
          <p class="mart10">写信时间：{{common._convertDate(info.send_time, 'yyyy年MM月dd日')}}</p>
        </el-col> 
        <el-col :span="24">
          <p class="mart10">附件： 
            <el-button size="mini" v-for="(item, index) in info.send_file ? JSON.parse(info.send_file) : []" title="点击下载" @click=" downloadFile(item) ">
              {{ common._removeFileSuffix(item.name) }}
            </el-button> 
          </p> 
        </el-col>
        <el-col :span="24">
          <p class="mart10 desc-box pad5">邮件内容：{{info.send_content ? info.send_content : '无'}}</p> 
        </el-col>
      </el-row>
    </el-card>    
    <!-- 处理结果展示 -->
    <el-card v-if="info.cur_status == 4||info.cur_status == 6" class="mart20"> 
      <div slot="header" class="clearfix">
        <span>处理结果</span> 
      </div>
      <el-row> 
        <el-col :span="24">
          <p class="mart10">回复内容：{{info.reply_content ? info.reply_content : '无'}}</p>
        </el-col>
        <el-col :span="24">
          <p class="mart10">处理材料：
            <!-- <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/" 
              multiple
              :limit="3" 
              :file-list="info.reply_file ? JSON.parse(info.reply_file) : []">  
            </el-upload> -->
            <el-button size="mini" 
              v-for="(item, index) in info.reply_file ? JSON.parse(info.reply_file) : []" 
              title="点击下载" @click=" downloadFile(item) ">
              {{ common._removeFileSuffix(item.name) }}
            </el-button>
          </p>
        </el-col>
      </el-row>
    </el-card>
    <!-- 反馈意见展示 -->
    <el-card v-if="info.cur_status == 6" class="mart20"> 
      <div slot="header" class="clearfix">
        <span>反馈意见</span> 
      </div>
      <el-row> 
        <el-col :span="24">
          <p class="mart10">评价：
            <el-rate v-model="info.feedback_score" disabled show-score text-color="#ff9900"></el-rate>
          </p>
        </el-col>
        <el-col :span="24">
          <p class="mart10">反馈：{{info.feedback_content ? info.feedback_content : '无'}}</p>
        </el-col>
      </el-row>
    </el-card>
    <!-- 处理结果 -->
    <el-card v-if="operationType == 'reply' && (info.cur_status == 2||info.cur_status == 3)" class="mart20"> 
      <div slot="header" class="clearfix">
        <span>处理结果</span> 
      </div>
      <el-form ref="replyForm"  :model="replyForm" label-width="100px">
        <el-form-item label="回复内容：" prop="replyContent"
          :rules="[
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]">
          <el-input type="textarea" v-model="replyForm.replyContent" :rows="4" maxlength="128" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="附件材料：" prop="replyContent"
          :rules="[
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]">
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
      </el-form> 
      <p class="mart20 text-right">
        <el-button @click="" type="primary" @click="submitReview('replyForm')">发表</el-button>
      </p>
    </el-card>
    <!-- 反馈意见 -->
    <el-card v-if="operationType == 'feedback' && info.cur_status == 4" class="mart20"> 
      <div slot="header" class="clearfix">
        <span>反馈意见</span> 
      </div>
      <el-form ref="feedbackForm"  :model="feedbackForm" label-width="100px">
        <el-form-item label="评分：" prop="feedbackScore"
          :rules="[
            { required: true, message: '请评分', trigger: 'blur' }
          ]"> 
          <el-rate v-model="feedbackForm.feedbackScore" show-score text-color="#ff9900"></el-rate>
        </el-form-item>
        <el-form-item label="回复内容：" prop="feedbackContent"
          :rules="[
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]">
          <el-input type="textarea" v-model="feedbackForm.feedbackContent" :rows="4" maxlength="128" show-word-limit></el-input>
        </el-form-item> 
      </el-form> 
      <p class="mart20 text-right">
        <el-button @click="" type="primary" @click="submitFeedbackForm('feedbackForm')">发表</el-button>
      </p>
    </el-card>
  </div>
</template>

<script> 
  export default {
    data() {
      return {
        isLoad:           true,
        isShowUpload:     true,
        mailboxId:        this.$route.params.mailbox_id,
        operationType:    this.$route.params.operation_type,
        orgId:            sessionStorage.getItem('orgId'),
        accessKey:        sessionStorage.getItem('Access-Key'),
        info: {},         //党员信息
        fileList:         [],
        replyList: {rows: [], total: 0},
        replyForm: {
          id:             this.$route.params.mailbox_id, 
          replyContent:   null,
          replyFile:      null,
          replyUserId:    sessionStorage.getItem('Access-Key')
        },
        feedbackForm:    { 
          feedbackContent:  null,
          feedbackScore:    0,
          id:               this.$route.params.mailbox_id,
        }
      }
    },
    components: {  
    },
    watch: {
    },
    created () { 
    },
    mounted() {
      this.getInfo();
    },
    methods: {
      /**
       * 获取当前用户的党员信息
       * @return {[type]} [description]
       */
      getInfo(){ 
        this.axios.get(`${this.common.basePath}/mailbox/info?id=${this.mailboxId}&userId=${this.accessKey}`, '').then( (response) => {
          const { data } = response;
          if(data){
            data.feedback_score = data.feedback_score ? data.feedback_score : 0;
          } 
          this.info = data;
          this.isLoad = false; 
        }).catch( (error) => {
          this.isLoad = false;
          this.$message.error(error); 
        });
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
        this.replyForm.replyFile = filesList.map((item, index) => {
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
        this.replyForm.replyFile = filesList 
        this.isShowUpload = true;
      },
      submitReview(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) { //验证通过    
            const form = {
              ...this.replyForm,
              replyFile: JSON.stringify(this.replyForm.replyFile),
            }
            this.axios.post(`${this.common.basePath}/mailbox/reply`, form).then((response) => {
              this.$message.success(response.meta.message);
              this.getInfo();
            }).catch((errorMsg) => { 
              this.$message.error(errorMsg)
            })  
          } else {
            this.$message.error("请检查必填字段")
          }
        });
      },
      submitFeedbackForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) { //验证通过     
            this.axios.post(`${this.common.basePath}/mailbox/feedback`, this.feedbackForm).then((response) => {
              this.$message.success(response.meta.message);
              this.getInfo();
            }).catch((errorMsg) => { 
              this.$message.error(errorMsg)
            })  
          } else {
            this.$message.error("请检查必填字段")
          }
        });
      },
      /**
       * 下载附件
       * @param  {[type]} jsonStringData [description]
       * @return {[type]}                [description]
       */
      downloadFile(jsonStringData){
        if(jsonStringData){
          this.common.downloadFile(jsonStringData.id);  
        }
      }
    },
  }
</script>

<style scoped lang="less"> 
  .el-menu{
    border-right: none!important;
    width: 250px;
  }
</style>
