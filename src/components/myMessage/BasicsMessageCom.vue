/************ 基础信息 ***********/
<template>
  <div>
    <!-- 用户资料 -->
    <el-card v-loading="isLoad">
      <div slot="header" class="clearfix marb15">
        <span class="el-card-have-border-span">基础信息</span>  
        <div class="el-card-head-btn"> 
          <el-button type="primary" size="small" @click=" showDialog(1) ">完善</el-button>
        </div> 
      </div>
      <el-row v-if="userInfo">
        <el-col :span="5">    
          <el-avatar shape="square" :size="150" :src="common.imgPath + userInfo.picture" class="marr5 fl">
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
          </el-avatar>
        </el-col>
        <el-col :span="9">
          <p class="mart10">姓名：{{userInfo.real_name || ''}}</p>
          <p class="mart10">政治面貌：{{common._controlTable(userInfo.political_outlook)}}</p>
          <p class="mart10">出生日期：{{common._convertDate(userInfo.birthday, 'yyyy年MM月dd日')}}</p>
          <p class="mart10">移动电话：{{userInfo.phone_num || ''}}</p>
          <p class="mart10">婚姻状况：{{common._controlTable(userInfo.marital_status)}}</p> 
        </el-col>
        <el-col :span="10">
          <p class="mart10">性别：{{userInfo.sex == 0 ? '男' : '女'}}</p>
          <p class="mart10">民族：{{common._controlTable(userInfo.nation)}}</p>
          <p class="mart10">籍贯：{{common._controlTable(userInfo.native_place)}}</p>
          <p class="mart10">身份证号：{{userInfo.id_card || ''}}</p>
          <p class="mart10">工作电话：{{userInfo.phone || ''}}</p>
        </el-col>
        <el-col :span='24'>
          <p class="mart10">家庭住址：
            {{`
              ${common._countyDataByIdConvert(userInfo.province) }
              ${common._countyDataByIdConvert(userInfo.city)}
              ${common._countyDataByIdConvert(userInfo.county)}
              ${userInfo.address}
            `}}
          </p>
        </el-col>
        <el-col :span="24">
          <p class="mart10 desc-box pad5">简介：{{userInfo.description}}</p> 
        </el-col>
      </el-row>
    </el-card> 
    <el-row :gutter="20">
      <el-col :span="24">
        <!-- 学位学历 -->
        <el-card class="mart20" v-loading="isLoad">
          <div slot="header" class="clearfix marb15">
            <span class="el-card-have-border-span">学位学历</span>  
            <div class="el-card-head-btn"> 
              <el-button type="primary" size="small" @click=" showDialog(2) ">完善</el-button>
            </div> 
          </div>
          <el-row v-if="userInfo"> 
            <el-col :span="6">
              <p class="mart10">初始学历：{{ common._controlTable(userInfo.initial_degree) }}</p>
              <p class="mart10">最高学历：{{ common._controlTable(userInfo.highest_degree) }}</p>

              <p class="mart10">最高学位：{{ common._controlTable(userInfo.educational_background) }}</p>
            </el-col> 
            <el-col :span="9">
              <p class="mart10">毕业学校：{{ userInfo.initial_school || '' }}</p>
              <p class="mart10">毕业学校：{{ userInfo.highest_school || '' }}</p>

              <p class="mart10">外语语种：{{ common._controlTable(userInfo.fg_language) }}</p>
            </el-col> 
            <el-col :span="9">
              <p class="mart10">毕业时间：{{ common._showDate(userInfo.initial_time) }}</p>
              <p class="mart10">毕业时间：{{ common._showDate(userInfo.highest_time) }}</p>

              <p class="mart10">语言等级：{{ common._controlTable(userInfo.language_level) }}</p>
            </el-col>
          </el-row>
        </el-card> 
      </el-col>
      <el-col :span="24">
        <!-- 专业能力 -->
        <el-card class="mart20" v-loading="isLoad">
          <div slot="header" class="clearfix marb15">
            <span class="el-card-have-border-span">专业能力</span>  
            <div class="el-card-head-btn"> 
              <el-button type="primary" size="small" @click=" showDialog(3) ">完善</el-button>
            </div> 
          </div>
          <el-row v-if="userInfo"> 
            <el-col :span="14">
              <p class="mart10">专业职称：{{ common._controlTable(userInfo.technical_position) }}</p>
              <p class="mart10">执业资格：{{ common._controlTable(userInfo.technical_job) }}</p> 
            </el-col>  
            <el-col :span="10">
              <p class="mart10">获得时间：{{ common._showDate(userInfo.tech_post_time) }}</p>
              <p class="mart10">获得时间：{{ common._showDate(userInfo.technical_job_time) }}</p> 
            </el-col>
          </el-row>
        </el-card> 
      </el-col>
      <el-col :span="24">
        <!-- 专业能力 -->
        <el-card class="mart20" v-loading="isLoad">
          <div slot="header" class="clearfix marb15">
            <span class="el-card-have-border-span">职位职务</span>  
            <div class="el-card-head-btn"> 
              <el-button type="primary" size="small" @click=" showDialog(4) ">完善</el-button>
            </div> 
          </div>
          <el-row v-if="userInfo"> 
            <el-col :span="8">
              <p class="mart10">进入二局时间：{{ common._showDate(userInfo.join_partisan_date) }}</p>
              <p class="mart10">党内职务：{{ userInfo.party_job || '' }}</p> 
            </el-col>  
            <el-col :span="8">
              <p class="mart10">进入公司时间：{{ common._showDate(userInfo.join_date) }}</p>
              <p class="mart10">行政职务：{{userInfo.administration_job || '' }}</p> 
            </el-col>
            <el-col :span="8">
              <p class="mart10">岗位性质：{{ userInfo.post_nature || '' }}</p>
              <p class="mart10">工作部门：{{ userInfo.glodonDepartmentName }}</p> 
            </el-col>
          </el-row>
        </el-card> 
      </el-col>
    </el-row>
    <!-- 完善个人资料 --> 
    <el-dialog v-loading="isLoad" title="完善用户信息" :visible.sync="dialogUserFormVisible" width="50vw">
      <el-form ref="userForm"  :model="userForm" label-width="100px">
        <!-- 基础信息 -->
        <el-row v-if="showType == 1">
          <el-col :span="12"> 
            <el-form-item label="民族：" prop="nation"
              :rules="[
                { required: false, message: '请选择民族', trigger: 'blur' }
              ]">
              <el-select v-model="userForm.nation" filterable>
                <el-option 
                  v-for="(item, index) in controlTable[2].dictionaryList" 
                  :value="item.id" :label="item.name" :key=index>
                </el-option>
              </el-select> 
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期：" prop="birthday"
              :rules="[
                { required: false, message: '请选择出生日期', trigger: 'blur' }
              ]">
              <el-date-picker
                v-model="userForm.birthday"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="籍贯：" prop="native_place"
              :rules="[
                { required: false, message: '请选择籍贯', trigger: 'blur' }
              ]">
              <el-select v-model="userForm.native_place" filterable>
                <el-option 
                  v-for="(item, index) in controlTable[9].dictionaryList" 
                  :value="item.id" :label="item.name" :key=index>
                </el-option>
              </el-select> 
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="政治面貌：" prop="political_outlook"
              :rules="[
                { required: false, message: '请选择政治面貌', trigger: 'blur' }
              ]">
              <el-select v-model="userForm.political_outlook" filterable>
                <el-option 
                  v-for="(item, index) in controlTable[6].dictionaryList" 
                  :value="item.id" :label="item.name" :key=index>
                </el-option>
              </el-select> 
            </el-form-item>
          </el-col> 
          <el-col :span="12">
            <el-form-item label="婚姻：" prop="marital_status"
              :rules="[
                { required: false, message: '请选择婚姻', trigger: 'blur' }
              ]">
              <el-select v-model="userForm.marital_status" filterable>
                <el-option 
                  v-for="(item, index) in controlTable[4].dictionaryList" 
                  :value="item.id" :label="item.name" :key=index>
                </el-option>
              </el-select> 
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮编：" prop="email_code"
              :rules="[
                { required: false, message: '请输入邮编', trigger: 'blur' }
              ]">
              <el-input v-model="userForm.email_code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号：" prop="id_card"
              :rules="[
                { required: false, message: '请输入身份证号', trigger: 'blur' },
                {  pattern:  /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '身份证号不规范' },
              ]">
              <el-input v-model="userForm.id_card"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作电话：" prop="phone"
              :rules="[
                { required: false, message: '请输入工作电话', trigger: 'blur' },, {  pattern:  /(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/, message: '电话不规范' }
              ]">
              <el-input v-model="userForm.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24"> 
            <el-form-item
              prop="province"
              label="地址信息"
              :rules="{ required: false, message: '请选择区县', trigger: 'change'}">
              <el-cascader v-model="addressOptionsVal" ref="addressOptions" :options="addressOptions"  :props="addressProps" clearable @change="addressOptionsChange"></el-cascader> 
            </el-form-item>
          </el-col>
          <el-col :span="24"> 
            <el-form-item
              prop="address"
              label="详细地址"
              :rules="{ required: false, message: '请输入详细地址', trigger: 'blur'}">
              <el-input v-model="userForm.address" type="text" @blur="checkAddress"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="简介：" prop="description"
              :rules="[
                { required: false, message: '请输入简介', trigger: 'blur' }
              ]">
              <el-input type="textarea" :rows="4" maxlength="128" show-word-limit v-model="userForm.description"></el-input> 
            </el-form-item>
          </el-col> 
        </el-row>  
        <!-- 学位学历 -->
        <el-row v-if="showType == 2">
          <el-col :span="8">
            <el-form-item label="初始学历：" prop="initial_degree"
              :rules="[
                { required: false, message: '请选择学历', trigger: 'blur' }
              ]">
              <el-select v-model="userForm.initial_degree" filterable>
                <el-option 
                  v-for="(item, index) in controlTable[3].dictionaryList" 
                  :value="item.id" :label="item.name" :key=index>
                </el-option>
              </el-select> 
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="毕业学校：" prop="initial_school"
              :rules="[
                { required: false, message: '请输入毕业学校', trigger: 'blur' }
              ]">
              <el-input v-model="userForm.initial_school"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="毕业时间：" prop="initial_time"
              :rules="[
                { required: false, message: '请选择籍贯', trigger: 'blur' }
              ]">
              <date-select 
                :dateType="userForm.initial_time.type"  
                :value="userForm.initial_time.date_time"
                @dateEmit="((val) => ( dateEmitFun(val, userForm.initial_time) ))"
                @dateTypeEmit="((val) => ( dateTypeEmitFun(val, userForm.initial_time) ))">
              </date-select> 
            </el-form-item>
          </el-col> 

          <el-col :span="8">
            <el-form-item label="最高学历：" prop="highest_degree"
              :rules="[
                { required: false, message: '请选择学历', trigger: 'blur' }
              ]">
              <el-select v-model="userForm.highest_degree" filterable>
                <el-option 
                  v-for="(item, index) in controlTable[3].dictionaryList" 
                  :value="item.id" :label="item.name" :key=index>
                </el-option>
              </el-select> 
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="毕业学校：" prop="highest_school"
              :rules="[
                { required: false, message: '请输入毕业学校', trigger: 'blur' }
              ]">
              <el-input v-model="userForm.highest_school"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="毕业时间：" prop="highest_time"
              :rules="[
                { required: false, message: '请选择籍贯', trigger: 'blur' }
              ]">
              <date-select 
                :dateType="userForm.highest_time.type"  
                :value="userForm.highest_time.date_time"
                @dateEmit="((val) => ( dateEmitFun(val, userForm.highest_time) ))"
                @dateTypeEmit="((val) => ( dateTypeEmitFun(val, userForm.highest_time) ))">
              </date-select> 
            </el-form-item>
          </el-col> 
          <el-col :span="8">
            <el-form-item label="最高学位：" prop="educational_background"
              :rules="[
                { required: false, message: '请选择学历', trigger: 'blur' }
              ]">
              <el-select v-model="userForm.educational_background" filterable>
                <el-option 
                  v-for="(item, index) in controlTable[13].dictionaryList" 
                  :value="item.id" :label="item.name" :key=index>
                </el-option>
              </el-select> 
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外语语种：" prop="fg_language"
              :rules="[
                { required: false, message: '请选择学历', trigger: 'blur' }
              ]">
              <el-select v-model="userForm.fg_language" filterable>
                <el-option 
                  v-for="(item, index) in controlTable[18].dictionaryList" 
                  :value="item.id" :label="item.name" :key=index>
                </el-option>
              </el-select> 
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="语言等级：" prop="language_level"
              :rules="[
                { required: false, message: '请选择学历', trigger: 'blur' }
              ]">
              <el-select v-model="userForm.language_level" filterable>
                <el-option 
                  v-for="(item, index) in controlTable[5].dictionaryList" 
                  :value="item.id" :label="item.name" :key=index>
                </el-option>
              </el-select> 
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 专业能力 -->
        <el-row v-if="showType == 3">
          <el-col :span="12">
            <el-form-item label="专业职称：" prop="technical_position"
              :rules="[
                { required: false, message: '后台开发人员还没有开发出来对应的对照表', trigger: 'blur' }
              ]"> 
              <el-select v-model="userForm.technical_position" filterable>
                <el-option 
                  v-for="(item, index) in controlTable[17].dictionaryList" 
                  :value="item.id" :label="item.name" :key=index>
                </el-option>
              </el-select> 
            </el-form-item>
          </el-col> 
          <el-col :span="12">
            <el-form-item label="获得时间：" prop="tech_post_time"
              :rules="[
                { required: false, message: '请选择获得时间', trigger: 'blur' }
              ]"> 
              <date-select 
                :dateType="userForm.tech_post_time.type"  
                :value="userForm.tech_post_time.date_time"
                @dateEmit="((val) => ( dateEmitFun(val, userForm.tech_post_time) ))"
                @dateTypeEmit="((val) => ( dateTypeEmitFun(val, userForm.tech_post_time) ))">
              </date-select> 
            </el-form-item>
          </el-col>  

          <el-col :span="12">
            <el-form-item label="执业资格：" prop="technical_job"
              :rules="[
                { required: false, message: '请选择执业资格', trigger: 'blur' }
              ]"> 
              <el-select v-model="userForm.technical_job" filterable>
                <el-option 
                  v-for="(item, index) in controlTable[15].dictionaryList" 
                  :value="item.id.toString()" :label="item.name" :key=index>
                </el-option>
              </el-select> 
            </el-form-item>
          </el-col> 
          <el-col :span="12">
            <el-form-item label="获得时间：" prop="technical_job_time"
              :rules="[
                { required: false, message: '请选择获得时间', trigger: 'blur' }
              ]">
              <date-select 
                :dateType="userForm.technical_job_time.type"  
                :value="userForm.technical_job_time.date_time"
                @dateEmit="((val) => ( dateEmitFun(val, userForm.technical_job_time) ))"
                @dateTypeEmit="((val) => ( dateTypeEmitFun(val, userForm.technical_job_time) ))">
              </date-select> 
            </el-form-item>
          </el-col> 
        </el-row>
        <!-- 职位职务 -->
        <el-row v-if="showType == 4">
          <el-col :span="12">
            <el-form-item label="进入二局时间：" prop="join_partisan_date" label-width='130px'
              :rules="[
                { required: false, message: '请选择进入二局时间', trigger: 'blur' }
              ]">
              <date-select 
                :dateType="userForm.join_partisan_date.type"  
                :value="userForm.join_partisan_date.date_time"
                @dateEmit="((val) => ( dateEmitFun(val, userForm.join_partisan_date) ))"
                @dateTypeEmit="((val) => ( dateTypeEmitFun(val, userForm.join_partisan_date) ))">
              </date-select> 
            </el-form-item>
          </el-col> 
          <el-col :span="12"> 
            <el-form-item label="进入公司时间：" prop="join_date" label-width='130px'
              :rules="[
                { required: false, message: '请选择进入公司时间', trigger: 'blur' }
              ]">
              <date-select 
                :dateType="userForm.join_date.type"  
                :value="userForm.join_date.date_time"
                @dateEmit="((val) => ( dateEmitFun(val, userForm.join_date) ))"
                @dateTypeEmit="((val) => ( dateTypeEmitFun(val, userForm.join_date) ))">
              </date-select> 
            </el-form-item>
          </el-col>  

          <el-col :span="12">
            <el-form-item label="岗位性质：" prop="post_nature" label-width='130px'
              :rules="[
                { required: false, message: '不确实是不是对照表内的数据', trigger: 'blur' }
              ]">
              <el-input v-model="userForm.post_nature"></el-input>
            </el-form-item>
          </el-col> 
          <el-col :span="12">
            <el-form-item label="党内职务：" prop="party_job" label-width='130px'
              :rules="[
                { required: false, message: '请输入党内职务', trigger: 'blur' }
              ]">
              <el-input v-model="userForm.party_job"></el-input>
            </el-form-item>
          </el-col> 
          <el-col :span="12">
            <el-form-item label="行政职务：" prop="administration_job" label-width='130px'
              :rules="[
                { required: false, message: '请输入行政职务', trigger: 'blur' }
              ]">
              <el-input v-model="userForm.administration_job"></el-input>
            </el-form-item>
          </el-col> 
          <el-col :span="8">
            <!-- <el-form-item label="工作部门：" prop="post_id"
              :rules="[
                { required: false, message: '后台开发人员还没有开发出来对应的对照表', trigger: 'blur' }
              ]">
              {{userForm.glodonDepartmentName}}
            </el-form-item> -->
          </el-col> 
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserFormVisible = false" size="small">取消</el-button>
        <el-button type="primary" @click="submituserForm('userForm')" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div> 
</template>

<script> 
  import DateSelect from '../Date' 
  let id = 0;
  export default {
    data() {
      let self = this;
      return { 
        isLoad:                   true, 
        dialogUserFormVisible:    false, //用户弹框 
        userInfo:                 null,    //用户信息  
        controlTable:             JSON.parse(sessionStorage.getItem("controlTable")),
        userForm: {   //完善用户信息
          birthday:           null, //生日
          nation:             null, //民族
          native_place:       null, //籍贯
          political_outlook:  null, //政治面貌
          marital_status:     null, //婚姻状况
          email_code:         null, //邮编
          address:            null, //地址
          description:        null, //简介  
        },  
        showType:             1, 
        addressOptions: [], //地址区县
        addressProps: { children: 'sons', label: 'currentName', value: 'currentId'},
        addressOptionsVal: [],
      }
    },
    components: {  
      DateSelect
    },
    watch: {
    },
    created () {
    },
    mounted() {
      this.checkDictionary();
      this.queryUserInfo();  
      this.queryAdministrActive();
    },
    methods: {
      /**
       * 先检查该页面需要的字典列表是否存在
       * @return {[type]} [description]
       */
      checkDictionary(){ 
        let data = this.controlTable;
        for(let i in data){
          if(!data[i].dictionaryList.length){
            this._queryDictionaryByType(data[i]);
          }
        } 
      }, 
      /**
       * 获取当前用户信息
       * @return {[type]} [description]
       */
      queryUserInfo(){
        this.isLoad = true;
        this.axios.get(`${this.common.basePath}/user/findUser?id=${sessionStorage.getItem('Access-Key')}`, '').then( (response) => {
          if(response.data){   
            const { data } = response;
            this.isLoad = false; 
            this.userInfo = data; 
            this._userForm();
          } 
        }).catch( (error) => {
            this.isLoad = false;
            this.$message.error(error); 
        });
      },   
      /**
       * 表单重新赋值
       * @param  {[Object]} dataJson [description]
       * @return {[type]}      [description]
       */
      _userForm(){
        const data = JSON.parse(JSON.stringify(this.userInfo));
        this.userForm = {
          ...data,
          initial_time:             data.initial_time ? data.initial_time.type ? data.initial_time : {type: 1, date_time: null} : {type: 1, date_time: null},
          highest_time:             data.highest_time ? data.highest_time.type ? data.highest_time : {type: 1, date_time: null} : {type: 1, date_time: null},
          tech_post_time:           data.tech_post_time ? data.tech_post_time.type ? data.tech_post_time : {type: 1, date_time: null} : {type: 1, date_time: null},
          technical_job_time:       data.technical_job_time ? data.technical_job_time.type ? data.technical_job_time : {type: 1, date_time: null} : {type: 1, date_time: null},
          join_partisan_date:       data.join_partisan_date ? data.join_partisan_date.type ? data.join_partisan_date : {type: 1, date_time: null} : {type: 1, date_time: null},
          join_date:                data.join_date ? data.join_date.type ? data.join_date : {type: 1, date_time: null} : {type: 1, date_time: null},
        }
        this.addressOptionsVal = data.county&&data.county!=''?[data.province,data.city, data.county]:[data.province, data.city];
      },
      /**
       * 查询某一个类型字典列表，
       * @param  {[type]} typeId [description]
       * @return {[type]}        [description]
       */
      _queryDictionaryByType(data){
        this.isLoad = true;
        this.axios.post(`${this.common.basePath}/dictionary/type`,{typeId: data.id}).then((response) => { 
          data.dictionaryList = response.data.rows ? response.data.rows : [];
          sessionStorage.setItem('controlTable',JSON.stringify(this.controlTable)); 
          this.isLoad = false; 
        }).catch((errorMsg) => {
          this.isLoad = false;
          this.$message.error(errorMsg)
        }) 
      },
      /*
       * 时间组件广播回来的时间值
       * @params {string} val 时间组件返回回来的值
       * @params {string} formDatTypeeKey 当前页面的字段 
       */
      dateEmitFun(val,formDateKey){   
        formDateKey.date_time = val ? val : null;
        console.log(formDateKey)
      },
      /*
       * 时间组件广播回来的时间类型
       * @params {string} val 时间组件返回回来的值
       * @params {string} formDateKey 当前页面的字段 
       */
      dateTypeEmitFun(val,formDateKey){   
        formDateKey.type = val ? val : null;
        console.log(formDateKey)
      },
      /**
       * 显示弹框
       * @param  {[type]} type [description]
       * @return {[type]}      [description]
       */
      showDialog(type){
        this._userForm();
        this.showType = type;
        this.dialogUserFormVisible = true;
      },
      submituserForm(formName){ 
        this.$refs[formName].validate((valid) => {
          if (valid) { 
            this.isLoad = true; 
            if(this.userForm.birthday) this.userForm.birthday = new Date(this.userForm.birthday).getTime(); 
            this.axios.post(`${this.common.basePath}/user/user/update`,this.userForm).then((response) => { 
              this.queryUserInfo();
              this.dialogUserFormVisible = false;
              this.isLoad = false; 
            }).catch((errorMsg) => {
              this.isLoad = false;
              this.dialogUserFormVisible = false;
              this.$message.error(errorMsg)
            });
          }
        });
      },  
      /**
       * 查询区县树
       * @return {[type]} [description]
       */
      queryAdministrActive(){ 
        this.axios.post(`${this.common.basePath}/administrative/select`, '',{}).then( (response) => {
          this.addressOptions = response.data;
        }).catch( (error) => {  
          this.$message.error(error)
        }); 
      },
      /**
       * 地址校验, 根据输入的内容校验经纬度字段
       * @return {[type]} [description]
       */
      checkAddress () {    
        let pathLabels = this.$refs.addressOptions.getCheckedNodes()[0] ? this.$refs.addressOptions.getCheckedNodes()[0].pathLabels.join('') : '';
        let address = `${pathLabels}${this.userForm.address}`;

        if(address) {
          this.mapLocation(address)
        } else {
          this.userForm.latitude  = null
          this.userForm.longitude = null
          this.$refs.userForm.validateField("latitude")
        }
      },
      /**
       * 根据输入的地址返回经纬度, 并记录到表单对象中
       * @return none
       */
      mapLocation (address) { 
        // 百度地图API功能
        var map = new BMap.Map("allmap");
        var point = new BMap.Point(116.331398,39.897445); 
        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();   
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint(address, (point) => { 
          if (point) {      
            if(point.lng == '116.413384' && point.lat == '39.910925'){
              this.userForm.latitude  = null
              this.userForm.longitude = null
              this.$refs.userForm.validateField("latitude") 
            }else{
              this.userForm.latitude  = point.lat
              this.userForm.longitude = point.lng
              this.$refs.userForm.validateField("latitude")
            }
            
          }else{ 
            this.userForm.latitude  = null
            this.userForm.longitude = null
            this.$refs.userForm.validateField("latitude") 
          }
        }, null);  
      },
      addressOptionsChange(value, object){  
        this.userForm.province = value[0] || '';
        this.userForm.city = value[1] || '';
        this.userForm.county = value[2] || ''; 
        this.checkAddress();
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
