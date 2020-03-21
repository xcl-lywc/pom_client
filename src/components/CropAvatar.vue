<template>
	<div>
		<div class="custom-avatar" @click.navtive="showDialog">
			<div class="el-upload-avatar">
				<img v-if="resetAvatar" :src="common.imgPath + resetAvatar" class="avatar" :class="size"/>
      	<i v-else class="el-icon-plus avatar-uploader-icon" :class="size"></i>
			</div>
    </div>
		<el-dialog
      title="上传头像"
      top="25vh"
      :visible.sync="cropDialogVisible_"
      width="800px"
      :modal="true"
      append-to-body
      center>
     	<div style="min-width: 540px;width:600px;">
		    <div class="eleme overflow-hidden">
		      <el-upload 
		      	ref="customUploadAvatar"
			      class="custom-avatar"
			      :auto-upload="false"
			      :disabled="isDisabled"
			      :action="basePath"
			      :headers="headers"
			      :file-list="fileList"
			      :show-file-list="false"
			      :before-upload="beforeUpload"
		        :on-change="handleChange"
			      :data="data"
            name="files">
			      <el-button slot="trigger" size="small" type="primary" :disabled="isDisabled">选取图片</el-button>
		        <div style="display: inline-block;position: absolute;margin-left: 20px;">
		        	<el-button
			        	size="small" 
			        	type="success" 
			        	@click="submitUpload" 
			        	:disabled="option.img==''?true:false" 
			        	:loading="uploadLoading">
			        	{{ uploadLoading ? "上传中..." :  buttonText }}
			        </el-button>
			        <span slot="tip" class="el-upload__tip marl10">只能上传jpg/png文件</span>
		        </div>
			    </el-upload>
		    </div>
		    <div class="overflow-hidden">
		      <br />
		      <el-button type="primary" icon="el-icon-refresh-right" circle @click="rotateRight" title="右旋转"></el-button>
		      <el-button type="success" icon="el-icon-refresh-left" circle @click="rotateLeft" title="左旋转"></el-button>
		      <el-button type="danger" icon="el-icon-plus" circle @click="changeScale(1)"  title="放大"></el-button>
		      <el-button type="warning" icon="el-icon-minus" circle @click="changeScale(-1)"  title="缩小"></el-button>
					
		      <!-- <el-radio-group v-model="radio" @change="change" class="marl20" size="mini">
				    <el-radio label="big" border>大尺寸</el-radio>
				    <el-radio label="normal" border>正常尺寸</el-radio>
				    <el-radio label="small" border>小尺寸</el-radio>
				  </el-radio-group> -->
		    </div>
		    <div class="cropper">
		      <div class="cropper-content" style="margin-top:60px;margin-left:60px;">
		        <div class="cropper">
		          <vueCropper
		            ref="cropper"
		            :img="option.img"
		            :outputSize="option.size"
		            :outputType="option.outputType"
		            :info="true"
		            :full="option.full"
		            :canMove="option.canMove"
		            :canMoveBox="option.canMoveBox"
		            :original="option.original"
		            :autoCrop="option.autoCrop"
		            :autoCropWidth="option.autoCropWidth"
		            :autoCropHeight="option.autoCropHeight"
		            :fixedBox="option.fixedBox"
		            @realTime="realTime"
		            @imgLoad="imgLoad"
		          ></vueCropper>
		        </div>
		        <div style="margin-left:20px;margin-top:-44px;" v-if="previews.url">
              <!-- {{previews}} -->
		        	<!-- 大尺寸 -->
		          <div
		            class="show-preview"
		            :style="{'width': '200px', 'height':'205px',  'overflow': 'hidden', 'margin': '5px'}"
		          	>
		            <div style="width:200px;height:200px;border-radius:50%"  class="preview">
		              <img :src="previews.url" :style="previews.img" />
		            </div>
		          </div>
		        	<!-- 正常尺寸 -->
		          <div
		            class="show-preview"
		            :style="{'width': '70px', 'height':'75px',  'overflow': 'hidden', 'margin': '5px','margin-left': '65px'}"
		          	>
		            <div style="width:70px;height:70px;border-radius:50%"  class="preview">
		              <img :src="previewsImageUrl" style="width:70px;height:70px"/>
		            </div>
		          </div>
		          <!-- 小尺寸 -->
							<div
		            class="show-preview"
		            :style="{'width': '50px', 'height':'55px',  'overflow': 'hidden', 'margin': '5px','margin-left': '70px'}"
		          	>
		            <div style="width:50px;height:50px;border-radius:50%" class="preview">
		              <img :src="previewsImageUrl" style="width:50px;height:50px"/>
		            </div>
		          </div>		
		        </div>
		      </div>
		    </div>
		  </div>
    </el-dialog>
    </div>
	</div>  
</template>

<script>
import { VueCropper } from "vue-cropper";
export default {
  data() {
    return {
      assessKey:       Number(sessionStorage.getItem('Access-Key')),
    	cropDialogVisible_:false,
    	radio:'normal',
      // 剪切
      previews: {},
      previewsImageUrl:'',
      option: {
        img: "",
        outputSize: 1, //剪切后的图片质量（0.1-1）
        full: false, //输出原图比例截图 props名full
        outputType: "png",
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true
      },
      // 上传
      headers: {},
      uploadLoading: false,
      typeList: { // 文件类型对应的type
        jpg:  "image/jpeg",
        gif:  "image/gif",
        png:  "image/png",
      },
      basePath: this.common.basePath + this.url,
      fileList: [],
      resetAvatar:this.avatar
    };
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
    isDisabled: {
      type: Boolean,
      default: false, // false不禁用
    },
    cropDialogVisible: {// 上传剪裁的头像弹框
      type: Boolean,
      default: false, 
    },
    size: { // 按钮的默认大小
      type: String,
      default: 'mini',
    },
    data: { // 上传时附带的参数
      required: false,
      type: Object,
      default: () => {}
    },
    avatar: {
      type: String,
      default:null
    },
    buttonText: { // 上传头像1到服务器的按钮文本
      type: String,
      default: "上传头像"
    }
  },
  watch: {
    file: {
      handler(newV, oldV) {
        console.log(newV)
      },
      deep: true
    },
    avatar: {
      handler(newV, oldV) {
        this.resetAvatar=newV
        console.log(newV)
      },
      deep: true
    }
  },
  components: {
    VueCropper
  },
  methods: {
    showDialog(){ 
      this.isDisabled ? '' : this.cropDialogVisible_ = true;
      this.resetAvatar ? this.option.img = this.resetAvatar : this.option.img='';
      this.clear()
    },
  	// 添加新头像或头像数据暂无时，清空缓存
  	clear(){
  		// console.log(this.$refs.cropper)
      // console.log(this.previews)
  		if(this.$refs.cropper!=undefined){
  			if(this.option.img==''){
  				this.$refs.cropper.imgs = ''
  				this.$refs.cropper.$refs.cropperImg.alt = '';
  				this.$refs.cropper.clearCrop();
  			}
  		}
  	},
  	// 添加headers
    beforeUpload(file) {
    	// console.log('上传文件之前的钩子')
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
        this.$message.error("获取Access-Token 或 Access-Key 有误, 上传文件失败!")
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
    // 手动上传头像到服务器
    submitUpload(file) {
      // this.$refs.customUploadAvatar.submit();
      this.finish('Blob');
      // this.finish('Data');
    },
    // 生成选取的图片的本机路径给vue-cropper
    handleChange(file){
    	// console.log(file.raw);
    	// console.log("生成选取的图片的本机路径给vue-cropper");
    	let data = window.URL.createObjectURL(new Blob([file.raw]));
      this.option.img = data;
    },
    // 放大/缩小
    changeScale(num) {
      // console.log("changeScale");
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    // 左旋转
    rotateLeft() {
      // console.log("rotateLeft");
      this.$refs.cropper.rotateLeft();
    },
    // 右旋转
    rotateRight() {
      // console.log("rotateRight");
      this.$refs.cropper.rotateRight();
    },
    // 改变头像尺寸大小
  	change(val){
  		if(val==='big'){
  			this.option.autoCropWidth = 150;
  			this.option.autoCropHeight = 150
  		}else if(val==='normal'){
  			this.option.autoCropWidth = 100;
  			this.option.autoCropHeight = 100
  		}else if(val==='small'){
  			this.option.autoCropWidth = 50;
  			this.option.autoCropHeight = 50
  		}
  	},
    // 上传图片（点击上传按钮）
    finish(type) {
      // console.log("上传图片");
      let _this = this;
      let formData = new FormData();
      // 输出
      if (type === "Blob") {
        this.$refs.cropper.getCropBlob(data => {
        	// console.log(data)
          var formData = new FormData();
					formData.append("files", data);
          // ${this.common.basePath}/file?userId=${sessionStorage.getItem('Access-Key')}&type=${type}
	        this.axios.post(`${this.common.basePath}/file?userId=${sessionStorage.getItem('Access-Key')}&type=${type}`,formData).then((response) => {
	        	let result = {}
		        if(response.data) {
		          result = {
		            name: response.data[0].fileName,
		            path: response.data[0].path,
                fileId: response.data[0].fileId
		          }
		        }
		        this.$emit("uploadSuccess", result)
		        this.resetAvatar = result.path;
		        console.log('头像路径',this.resetAvatar)
		        this.showSuccessNotice ? this.$message.success(`${response.data.data.name} 上传成功!`) : null
		        this.fileList = []
		        this.uploadLoading = false
		        this.cropDialogVisible_ = false
	        }).catch((error) => {
	        	this.fileList = []
	        	this.cropDialogVisible_ = false
			      this.uploadLoading = false
	          this.$message.error(error);
	        });
        });
      } else {
      	//getImgAxis getCropData getCropChecked
        this.$refs.cropper.getCropData(data => {
          // console.log(data)
          /*var formData = new FormData();
					formData.append("file", data);
	        this.axios.post(`${this.common.basePath}/file/uplode`,formData).then((response) => {
	        	let result = {}
		        if(response.data.data) {
		          result = {
		            name: response.data.data.name,
		            path: response.data.data.path
		          }
		        }
		        this.$emit("uploadSuccess", result)
		        this.resetAvatar = result.path;
		        console.log('头像路径',this.resetAvatar)
		        this.showSuccessNotice ? this.$message.success(`${response.data.data.name} 上传成功!`) : null
		        this.fileList = []
		        this.uploadLoading = false
		        this.cropDialogVisible_ = false
	        }).catch((error) => {
	        	this.fileList = []
	        	this.cropDialogVisible_ = false
			      this.uploadLoading = false
	          this.$message.error(error);
	        });*/
        });
      }
    },
    // 实时预览函数
    realTime(data) { 
      // console.log("实时预览",data);
      this.$refs.cropper.getCropBlob(data => {
        let previewsImageUrl = window.URL.createObjectURL(new Blob([data]));
        this.previewsImageUrl = previewsImageUrl;
      });
      this.previews = data;
    },
    // 图片加载函数
    imgLoad(msg) {
      console.log("图片加载"+msg);
      // this.$message.error("图片加载"+msg); 
    }
  }
};
</script>

<style lang="less">
	.cropper-content {
	  min-width: 540px;
	  display: flex;
	  //   display: -webkit-flex;
	  //   justify-content: flex-end;
	  //   -webkit-justify-content: flex-end;
	  .cropper {
	    width: 260px;
	    height: 260px;
	    margin-top: -40px;
	  }
	  .show-preview {
	    flex: 1;
	    -webkit-flex: 1;
	    display: flex;
	    display: -webkit-flex;
	    justify-content: center;
	    -webkit-justify-content: center;
	    .preview {
	      overflow: hidden;
	      // border-radius: 50%;
	      border: 1px solid #cccccc;
	      background: #cccccc;
	      margin-left: 40px;
	    }
	  }
	}
	.cropper-content .show-preview .preview {
	  margin-left: 0;
	  -moz-user-select: none;
	  -webkit-user-select: none;
	  -ms-user-select: none;
	  -khtml-user-select: none;
	  user-select: none;
	}

	.custom-avatar{
    .el-upload-avatar {
    	display:inline-block;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload-avatar:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      color: #8c939d;
      text-align: center;
    }
    .avatar-uploader-icon.mini {
      font-size: 28px;
      width: 108px;
      height: 108px;
      line-height: 108px;
    }
    .avatar-uploader-icon.small {
      font-size: 28px;
      width: 128px;
      height: 128px;
      line-height: 128px;
    }
    .avatar-uploader-icon.medium {
      font-size: 28px;
      width: 158px;
      height: 158px;
      line-height: 158px;
    }
    .avatar-uploader-icon.large {
      font-size: 28px;
      width: 178px;
      height: 178px;
      line-height: 178px;
    }
    .avatar {
      display: block;
    }
    .avatar.mini {
      width: 108px;
      height: 108px;
    }
    .avatar.small {
      width: 128px;
      height: 128px;
    }
    .avatar.medium {
      width: 158px;
      height: 158px;
    }
    .avatar.large {
      width: 178px;
      height: 178px;
    }
  }
</style>