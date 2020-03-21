/************  通用上传组件 
参数 详见props
方法 uploadSuccess 上传成功回调 返回response
*********/
<template>
  <div>  
    <el-upload 
      :disabled="isDisabled"
      ref="customUpload"
      :action="basePath"
      :headers="headers"
      :file-list="fileList"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :data="data"
      name="files"
    ><el-button :disabled="isDisabled" type="primary" :size="size" :loading="uploadLoading">{{ uploadLoading ? "上传中..." :  buttonText }}</el-button></el-upload>
  </div>
</template>

<script>
  export default {
    watch: {
      file: {
        handler(newV, oldV) {
          console.log(newV)
        },
        deep: true
      }
    },
    data () {
      return {
        headers: {},
        uploadLoading: false,
        typeList: { // 文件类型对应的type
          xls:  "application/vnd.ms-excel",
          xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          doc:  "application/msword",
          docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ppt:  "application/vnd.ms-powerpoint",
          pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          pdf:  "application/pdf",
          jpg:  "image/jpeg",
          gif:  "image/gif",
          png:  "image/png",
          mp4:  "video/mp4",
          avi:  "video/avi",
          mpeg: "video/mpeg",
        },
        basePath: this.common.basePath + this.url,
        fileList: []
      }
    },
    props: {
      url: { //上传文件的URL 不传默认传到通用接口
        type: String,
        default: "/file/uplode"
      },
      fileTypes: { //文件类型限制 不传不限制类型
        type: Array,
        default: function () {
          return []
        }
      },
      showSuccessNotice: { // 是否显示上传成功的提示信息
        default: false
      },
      buttonText: { // 上传文件的按钮文本
        type: String,
        default: "点击上传"
      },
      isDisabled: {
        type: Boolean,
        default: false, //false不禁用
      },
      size: { // 按钮的默认大小
        type: String,
        default: 'mini',
      },
      data: { // 上传时附带的参数
        required: false,
        type: Object,
        default: () => {}
      }
    },
    mounted () {
    },
    methods: {
      /**
       * 添加headers
       * @param  {[type]} file [description]
       * @return {[type]}      [description]
       */
      beforeUpload(file) {
        console.log(file.type)
        let flag = false //false表示默认错误 匹配到了正确的格式后 改为true

        if(this.fileTypes.length == 0) { //未给出具体的验证 允许上传所有文件
          flag = true
        } else {
          if(!file.type) { // 解析文件类型失败 即type = ""
            flag = false
          } else { // 给出了验证条件 并且当前上传的文件格式被成功解析 即非空
            this.fileTypes.forEach((item, index) => { //格式验证
              if(file.type == this.typeList[item]) {
                flag = true
              }
            })
          }
        }
        
        if (!flag) {
          this.$message.error(`请上传${this.fileTypes.join(', ')}格式的文件`)
          return false
        }
        try {
          if(sessionStorage.getItem("Access-Token")) {
            this.headers['Authorization'] = JSON.parse(sessionStorage.getItem("Access-Token") || null);
          }
          if(sessionStorage.getItem("Access-Key")) {
            this.headers['Access-Key'] = JSON.parse(sessionStorage.getItem("Access-Key") || null);
          }
        } catch(e) {
          this.$message.error("获取Authorization 或 Access-Key 有误, 上传文件失败!")
          return false
        }
        this.headers['nonce']      = Math.floor(Math.random()*10000000000000000) // 随机数0-10000000000000000
        this.headers['Time-Stamp'] = (new Date()).valueOf() // 当前时间戳
        this.headers['secret']     = "pom-product-client" // 口令
        this.headers['type']       = "PC"      // 口令

        let object = {
          'nonce':      this.headers.nonce,
          'Time-Stamp': this.headers['Time-Stamp'],
          'secret':     this.headers.secret,
          'Access-Key': this.headers['Access-Key'],
        }

        let array = []
        for ( let k in object ) {
          array.push(k)
        }

        array.sort()
        let FinalArray = [] //组合完成并排序后的数组
        array.forEach( (item, index) => {
          FinalArray.push(object[item])
        })
        this.headers['sign'] = window.md5Js(FinalArray.join(""))// 写入sign
        this.uploadLoading = true
      },
      uploadSuccess(response, file, fileList) {
        if(response&&response.meta.code == 0) {
          let result     = {}
          let resultList = []

          if(response.data) {
            result = {
              name:   file.response.data[0].fileName,
              path:   file.response.data[0].path,
              id: file.response.data[0].fileId
            }
          }

          if(response.data) {
            file.response.data.forEach( function(element, index) {
              resultList.push({
                name:   element.fileName,
                path:   element.path,
                id: element.fileId
              })
            });
          }
          
          this.$emit("uploadSuccess", result, resultList)// 上传组件设置multiple属性（是否支持多选文件），result为不支持多选文件的结果；resultList为支持多选的结果
          this.showSuccessNotice ? this.$message.success(`${file.name} 上传成功!`) : null
          this.fileList = []
          this.uploadLoading = false
        } else {
          this.$message.error(response.meta.message)
          this.fileList = []
          this.uploadLoading = false
        }
      },

      // 调用该组件
      // <upload :buttonText="点击上传" :url="'/file'" :fileTypes="['png', 'jpg']" :data="myFileData" @uploadSuccess="(response,multipleResponse) => {uploadFileSuccess(response,multipleResponse,'file')}"/>

    }
  }
</script>

<style>
  input.upload-file-modify {
    position: absolute;
    height: 35px;
    width: 90px;
    opacity: 0;
  }
</style>
