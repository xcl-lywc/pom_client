/*************** 党委信息 *************/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
          <el-breadcrumb-item>组织架构</el-breadcrumb-item>
          <el-breadcrumb-item>党委信息</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
      <div class="theme-main"> 
        <!-- 组织信息 -->
        <el-card class="padb20" v-loading="isLoad">
          <div slot="header" class="clearfix marb15">
            <span class="el-card-have-border-span">组织信息</span>  
            <div class="el-card-head-btn">
              <el-button type="primary" size="small" @click=" dialogPartyInfoVisible = true ">编辑</el-button>
              <el-button type="primary" size="small" @click="dismiss">解散</el-button>
            </div>
          </div>  
          <el-row v-if="partyInfo"> 
            <el-col :span="12">
              <p class="mart10">名称：{{partyInfo.name}}</p>
              <p class="mart10">
                任期开始：{{common._showDate(partyInfo.office_start)}}
              </p>
              <p class="mart10">地址：
                {{`
                  ${common._countyDataByIdConvert(partyInfo.province) }
                  ${common._countyDataByIdConvert(partyInfo.city)}
                  ${common._countyDataByIdConvert(partyInfo.county)}
                  ${partyInfo.address}
                `}}
              </p>
            </el-col>
            <el-col :span="12">
              <p class="mart10">
                成立日期：{{common._showDate(partyInfo.buildtime)}}
              </p>
              <p class="mart10">
                任期结束：{{common._showDate(partyInfo.office_stop)}}
              </p>
            </el-col>
            <el-col :span="24">
              <p class="mart10 desc-box pad5">简介：{{partyInfo.description}}</p> 
            </el-col>
          </el-row>
        </el-card>
        <!-- 班子成员 -->
        <el-card class="padb20 mart20" v-loading="isLoad">
          <div slot="header" class="clearfix marb15">
            <span class="el-card-have-border-span">班子成员</span>  
            <div class="el-card-head-btn">
              <el-button type="primary" size="small" @click="$router.push({name: 'mainFunctionTeamManagement', params: {org_id: orgId,party_nature:partyNature}})">管理</el-button>
              <el-button type="primary" size="small" @click="queryLeaderList();dialogChangeVisible = true;">换届设置</el-button>
            </div>
          </div>  
          <el-row>
            <el-col :span="4" v-for="(item, index) in leaderList" class="marr20 text-center leader-box marb20">
              <p style="display: inline-block;">
                <el-avatar :size="120" shape="square" :src="common.imgPath + item.headImage" class="marr5 fl">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                </el-avatar>
              </p>
              <p class="mart5">
                <el-row>
                  <el-col :span="10" class="single-line-overflow">{{item.user_name}}</el-col>
                  <el-col :span="14" class="single-line-overflow" :title="item.position_name">{{item.position_name}}</el-col>
                </el-row> 
              </p>
            </el-col>  
          </el-row>
        </el-card>
        <!-- 职能部门 -->
        <el-card class="padb20 mart20" v-loading="isLoad">
          <div slot="header" class="clearfix marb15">
            <span class="el-card-have-border-span">职能部门</span>  
            <div class="el-card-head-btn">
              <el-button type="primary" size="small" @click="$router.push({name: 'FunctionalDepartments'})">管理</el-button> 
            </div>
          </div>   
          <el-tabs v-model="activeTagName" type="">
            <el-tab-pane v-for="(item, index) in department.rows" :label="item.name">
              <el-row> 
                <el-col :span="24">
                  <p class="mart10">部门名称：{{item.name}}</p> 
                </el-col>
                <el-col :span="24">
                  <p class="mart10">地址：
                    {{`
                      ${common._countyDataByIdConvert(item.province) }
                      ${common._countyDataByIdConvert(item.city)}
                      ${common._countyDataByIdConvert(item.county)}
                      ${item.address}
                    `}}
                  </p>
                </el-col>
                <el-col :span="24">
                  <p class="mart10 desc-box pad5">简介：{{item.description}}</p> 
                </el-col>
              </el-row>
            </el-tab-pane> 
          </el-tabs>
        </el-card>
      </div>
    </div>
    <!-- 编辑组织信息 -->
    <el-dialog title="编辑组织信息" :visible.sync="dialogPartyInfoVisible" width="50vw">
      <el-form ref="partyInfo"  :model="partyInfo" label-width="130px" v-if="partyInfo">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="党委名称：" prop="name"
              :rules="[
                { required: true, message: '请输入党委名称', trigger: 'blur' }
              ]">
              <el-input v-model="partyInfo.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
             <el-form-item label="成立日期：" prop="buildtime"
              :rules="[
                { required: false, message: '请输入成立日期', trigger: 'blur' }
              ]">
              <date-select 
                :dateType="partyInfo.buildtime.type"  
                :value="partyInfo.buildtime.date_time"
                @dateEmit="((val) => ( dateEmitFun(val, partyInfo.buildtime) ))"
                @dateTypeEmit="((val) => ( dateTypeEmitFun (val, partyInfo.buildtime) ))">
              </date-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任期开始：" prop="office_start"
              :rules="[
                { required: false, message: '请输入成立日期', trigger: 'blur' }
              ]">
              <date-select 
                :dateType="partyInfo.office_start.type"  
                :value="partyInfo.office_start.date_time"
                @dateEmit="((val) => ( dateEmitFun(val, partyInfo.office_start) ))"
                @dateTypeEmit="((val) => ( dateTypeEmitFun (val, partyInfo.office_start) ))">
              </date-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任期结束：" prop="office_stop"
              :rules="[
                { required: false, message: '请输入成立日期', trigger: 'blur' }
              ]"> 
              <date-select 
                :dateType="partyInfo.office_stop.type"  
                :value="partyInfo.office_stop.date_time"
                @dateEmit="((val) => ( dateEmitFun(val, partyInfo.office_stop) ))"
                @dateTypeEmit="((val) => ( dateTypeEmitFun (val, partyInfo.office_stop) ))">
              </date-select>
            </el-form-item>
          </el-col> 
          <el-col :span="24"> 
            <el-form-item
              prop="province"
              label="地址信息"
              :rules="{ required: false, message: '请选择省区县', trigger: 'change'}">
              <el-cascader filterable v-model="addressOptionsVal" ref="addressOptions" placeholder="请选择省区县" :options="addressOptions"  :props="addressProps" clearable @change="addressOptionsChange"></el-cascader> 
            </el-form-item>
          </el-col>
          <el-col :span="24"> 
            <el-form-item
              prop="address"
              label="详细地址"
              :rules="{ required: false, message: '请输入详细地址', trigger: 'blur'}">
              <el-input v-model="partyInfo.address" type="text" @blur="checkAddress"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="简介：" prop="description"
              :rules="[
                { required: false, message: '请输入党委名称', trigger: 'blur' }
              ]">
              <el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="partyInfo.description"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col> 
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPartyInfoVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPartyInfoForm('partyInfo')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 换届设置 -->
    <el-dialog title="换届设置" :visible.sync="dialogChangeVisible" width="50vw">
      <el-table
        v-loading="dialogLoading"
        :data="leaderList01"
        :show-header="false"
        style="width: 100%">
        <el-table-column prop="headImage" label="#" width="60" align="center">
          <template slot-scope="scope"> 
            <el-avatar :size="50" shape="square" :src="common.imgPath + scope.row.headImage">
              <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="姓名" width="120" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="position_name" label="职位" width="120" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="position_name" label="换届时间" width="600px" align="center">
          <template slot-scope="scope"> 
            <el-date-picker
              v-model="scope.row.create_time"
              type="date"
              value-format="timestamp"
              placeholder="任期开始">
            </el-date-picker>
            &nbsp;&nbsp; 至 &nbsp;&nbsp;
            <el-date-picker
              v-model="scope.row.stop_time"
              type="date"
              value-format="timestamp"
              placeholder="任期结束">
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="position_name" label="换届操作" width="100px" show-overflow-tooltip align="center" fixed="right">
          <template slot-scope="scope"> 
            <el-button @click="changeMembership(scope.row)" size="small" type="primary">换届</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChangeVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>  
</template>

<script> 
  import DateSelect from '../../../components/Date'
  export default {
    data() {
      return { 
        isLoad:      true,
        orgId:       sessionStorage.getItem('Access-OrgId'),
        partyNature: sessionStorage.getItem('partyNature'),
        assessKey:       sessionStorage.getItem('Access-Key'),
        dialogPartyInfoVisible:  false,
        partyInfo:   null,
        leaderList:  [],
        department:  {rows: [], total: 0}, //职能部门
        activeTagName: null, //职能部门被选中项
        addressOptions: [], //地址区县
        addressProps: { children: 'sons', label: 'currentName', value: 'currentId'},
        addressOptionsVal: [],

        dialogChangeVisible:false,
        leaderList01:[],
        dialogLoading:false,


      }
    },
    components: {  
      'date-select': DateSelect
    },
    watch: {
    },
    created () {
    },
    mounted() { 
      this.queryPartInfo(); 
      this.queryPartyDepartment();
      this.queryAdministrActive();
      // this.queryLeaderList();
    },
    methods: { 
      /**
       * 班子换届设置
       * @author chuanlin.Xiao
       * @date   2020-03-12T18:02:59+0800
       * @param  {[type]}                 data [description]
       * @return {[type]}                      [description]
       */
      changeMembership(data){
        this.dialogLoading = false;
        this.axios.post(`${this.common.basePath}/leader/update`, data).then((response) => {
          this.$message.success(response.meta.message);
          this.queryLeaderList();
          this.dialogLoading = false;
        }).catch((errorMsg) => {
          this.dialogLoading = false;
          this.$message.error(errorMsg)
        }) 
      },
      /**
       * 查询党委信息
       * @return {[type]} [description]
       */
      queryPartInfo() {    
        this.isLoad = true;
        //待修改接口名字 2，3
        let typeName;
        if(sessionStorage.getItem('partyNature') == 1){
          typeName = 'partyCommittee';
        }else if(sessionStorage.getItem('partyNature') == 2){
          typeName = 'findPartBranch';
        }else if(sessionStorage.getItem('partyNature') == 3){
          typeName = 'findPartGroup';
        }
        this.axios.get(`${this.common.basePath}/org/${typeName}?id=${this.orgId}`,).then((response) => {
          this._partyInfo(response.data);
          this.isLoad =  false;
          this.queryPartyCommitteeLeader();
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg);
        })  
      }, 
      /**
       * 重组数据
       * @param  {[Object]} dataJson [description]
       * @return {[type]}      [description]
       */
      _partyInfo(data){  
        this.partyInfo = {
          ...data,
          buildtime:     data.buildtime ? data.buildtime.type ? data.buildtime : {type: 1, date_time: null} : {type: 1, date_time: null},
          office_start:  data.office_start ? data.office_start.type ? data.office_start : {type: 1, date_time: null} : {type: 1, date_time: null},
          office_stop:   data.office_stop ? data.office_stop.type ? data.office_stop : {type: 1, date_time: null} : {type: 1, date_time: null}, 
        }
        this.addressOptionsVal = data.county&&data.county!=''?[data.province,data.city, data.county]:[data.province, data.city];
      }, 
      /**
       * 
       * 查询班子成员
       * @return {[type]} [description]
       * 1.是党委2.是支部3.是党小组"
       */
      queryPartyCommitteeLeader() { 
        //待修改接口名字 2，3
        let requestUrl;
        if(sessionStorage.getItem('partyNature') == 1){
          requestUrl = 'org/partyCommitteeLeader';
        }else if(sessionStorage.getItem('partyNature') == 2){
          requestUrl = 'org/partyBranchLeader';
        }else if(sessionStorage.getItem('partyNature') == 3){
          requestUrl = 'org/partyGroupLeader';
        }
        this.isLoad = true; 
        this.axios.post(`${this.common.basePath}/${requestUrl}`, {orgId: this.orgId, orgType: this.partyInfo.type, partyNature: sessionStorage.getItem('partyNature')}).then((response) => {
          const data = response.data ? response.data : [];
          data.map((item) => {
            item.position_name = [];
            item.positions.map((p) => {
              item.position_name.push(p.position_name)
            })

            item.position_name = item.position_name.join(',');
          })
          this.leaderList = data;
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg)
        })  
      }, 
      /**
       * 
       * 查询班子成员
       * @return {[type]} [description]
       * 1.是党委2.是支部3.是党小组"
       */
      queryLeaderList() { 
        this.leaderList01 = [];
        this.dialogLoading = true;
        this.axios.post(`${this.common.basePath}/leader/list`, {orgId: this.orgId}).then((response) => {
          this.leaderList01 = response.data ? response.data : [];
          this.dialogLoading = false;
        }).catch((errorMsg) => {
          this.dialogLoading = false;
          this.$message.error(errorMsg)
        })  
      }, 
      /**
       * 
       * 查询职能部门
       * @return {[type]} [description]
       */
      queryPartyDepartment() { 
        this.isLoad = true; 
        this.axios.post(`${this.common.basePath}/org/partyDepartment`, {orgId: this.orgId}).then((response) => {
          this.department = response.data;
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg)
        })  
      },   
      /*
       * 时间组件广播回来的时间值
       * @params {string} val 时间组件返回回来的值
       * @params {string} formDatTypeeKey 当前页面的字段 
       */
      dateEmitFun(val,formDateKey){  
        formDateKey.date_time = val;
      },
      /*
       * 时间组件广播回来的时间类型
       * @params {string} val 时间组件返回回来的值
       * @params {string} formDateKey 当前页面的字段 
       */
      dateTypeEmitFun(val,formDateKey){ 
        formDateKey.type = val;
      },
      /**
       * 地址校验, 根据输入的内容校验经纬度字段
       * @return {[type]} [description]
       */
      checkAddress () {   
        let pathLabels = this.$refs.addressOptions.getCheckedNodes()[0] ? this.$refs.addressOptions.getCheckedNodes()[0].pathLabels.join('') : '';
        let address = `${pathLabels}${this.partyInfo.address}`;
        if(address) {
          this.mapLocation(address)
        } else {
          this.partyInfo.latitude  = null
          this.partyInfo.longitude = null
          this.$refs.partyInfo.validateField("latitude")
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
              this.partyInfo.latitude  = null
              this.partyInfo.longitude = null
              this.$refs.partyInfo.validateField("latitude") 
            }else{
              this.partyInfo.latitude  = point.lat
              this.partyInfo.longitude = point.lng
              this.$refs.partyInfo.validateField("latitude")
            }
            
          }else{ 
            this.partyInfo.latitude  = null
            this.partyInfo.longitude = null
            this.$refs.partyInfo.validateField("latitude") 
          }
        }, null);  
      },
      /**
       * 提交党委信息
       * @return {[type]} [description]
       */
      submitPartyInfoForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isLoad =  true;
            this.axios.post(`${this.common.basePath}/org/update`, this.partyInfo).then((response) => {
              this.isLoad =  false;
              this.queryPartInfo();
              this.dialogPartyInfoVisible = false;
              this.$message.success(response.meta.message);
            }).catch((errorMsg) => {
              this.isLoad =  false; 
              this.dialogPartyInfoVisible = false;
              this.$message.error(errorMsg)
            })  
          } else { 
            return false;
          }
        });
        
      },
      /**
       * 解散组织
       * @return {[type]} [description]
       */
      dismiss() {  
        this.$confirm('确定要解散吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(`${this.common.basePath}/org/dismiss?org_id=${this.orgId}&user_id=${this.assessKey}`,).then((response) => {
            this.queryPartInfo();
            this.$message.success(response.meta.message);
          }).catch((errorMsg) => {
            this.isLoad =  false; 
            this.$message.error(errorMsg);
          })  
        }).catch(() => {});
        
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
      addressOptionsChange(value, object){
        this.partyInfo.province = value[0] || '';
        this.partyInfo.city = value[1] || '';
        this.partyInfo.county = value[2] || ''; 
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
  }
  .leader-box{
    border: 1px solid #efefef;
    width: 150px;
    padding: 10px;
  }
</style>
