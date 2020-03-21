/*************** 职能部门 *************/
<template>
  <div> 
    <el-card class=""> 
      <div slot="header" class="clearfix">
        <span class="el-card-have-border-span">{{partyNature?['','下级党委','下级支部','党小组'][partyNature]:'职能部门'}}</span>  
        <div class="el-card-head-btn">  
          <el-button type="primary" size="small" @click=" showDialog('add') ">添加</el-button>
        </div>
      </div>   
      <el-row v-if=" department.length ">
        <el-col :span="4">
          <ul class="small-menu-ul">
            <li 
              class="cursor-pointer" 
              :class="activeDepartment.id == item.id ? 'small-menu-active' : ''"
              v-for="(item, index) in department" :key="index"
              @click=" changeDepartments(item) "> 
               {{item.name}} 
            </li>
          </ul> 
        </el-col>
        <el-col :span="20">
          <!-- 部门简介 -->
          <el-card class="padb20" v-loading="isLoad">
            <div slot="header" class="clearfix marb15">
              <span class="el-card-have-border-span">部门简介</span>  
              <div class="el-card-head-btn">
                <el-button type="primary" size="small" @click=" showDialog('update') ">编辑</el-button>
                <el-button type="primary" size="small" @click="dismiss">解散</el-button>
              </div>
            </div>  
            <el-row v-if="activeDepartment"> 
              <el-col :span="12">
                <p class="mart10">部门名称：{{activeDepartment.name}}</p>
                <p class="mart10">电话：{{activeDepartment.phone}}</p>
              </el-col>
              <el-col :span="12">
                <p class="mart10"> 
                  建立时间：{{common._showDate(activeDepartment.buildtime)}}
                </p>
                <p class="mart10">
                  邮箱：{{activeDepartment.mailbox}}
                </p> 
              </el-col>
              <el-col :span="12">
                <p class="mart10">
                  地址：
                  {{`
                    ${common._countyDataByIdConvert(activeDepartment.province) }
                    ${common._countyDataByIdConvert(activeDepartment.city)}
                    ${common._countyDataByIdConvert(activeDepartment.county)}
                    ${activeDepartment.address}
                  `}}
                </p> 
              </el-col>
              <el-col :span="24">
                <p class="mart10 desc-box pad5">简介：{{activeDepartment.description}}</p> 
              </el-col>
            </el-row>
          </el-card> 
          <!-- 班子成员 -->
          <el-card class="padb20 mart20" v-loading="isLoad">
            <div slot="header" class="clearfix marb15">
              <span class="el-card-have-border-span">班子成员</span>  
              <div class="el-card-head-btn">
                <el-button type="primary" size="small" @click="$router.push({name: 'mainFunctionTeamManagement', params: {org_id: activeDepartment.id, party_nature:partyNature?partyNature:4}})">管理</el-button>
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
        </el-col>
      </el-row> 
      <el-row class="text-center" v-else>暂无组织信息，请添加组织</el-row>
    </el-card> 
    <!-- 编辑组织信息 -->
    <el-dialog v-loading="isLoad" title="添加/编辑" :visible.sync="dialogDepartmentVisible" width="50vw">
      <el-form ref="orgForm"  :model="orgForm" label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="组织名称：" prop="name"
              :rules="[
                { required: true, message: '请输入党委名称', trigger: 'blur' }
              ]">
              <el-input v-model="orgForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
             <el-form-item label="建立日期：" prop="buildtime"
              :rules="[
                { required: false, message: '请输入成立日期', trigger: 'blur' }
              ]">
              <date-select 
                :dateType="orgForm.buildtime.type"  
                :value="orgForm.buildtime.date_time"
                @dateEmit="((val) => ( dateEmitFun(val, orgForm.buildtime) ))"
                @dateTypeEmit="((val) => ( dateTypeEmitFun(val, orgForm.buildtime) ))">
              </date-select>
            </el-form-item>
          </el-col>   
          <el-col :span="12">
            <el-form-item
              prop="phone"
              label="电话"
              :rules="[{ required: false, message: '请输入电话', trigger: 'blur' }, {  pattern:  /(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/, message: '电话不规范' }]">
              <el-input v-model="orgForm.phone" type="text"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="mailbox"
              label="邮箱"
              :rules="[{ required: false, message: '请输入邮箱地址', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
              <el-input v-model="orgForm.mailbox" type="text"></el-input>
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
              <el-input v-model="orgForm.address" type="text" @blur="checkAddress"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item 
              label="简介：" prop="description"
              :rules="[
                { required: false, message: '请输入党委名称', trigger: 'blur' }
              ]">
              <el-input type="textarea" :rows="5" :maxlength="128" :show-word-limit="true" v-model="orgForm.description"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col> 
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDepartmentVisible = false">取消</el-button>
        <el-button type="primary" @click="submitactiveDepartmentForm('activeDepartment')">确 定</el-button>
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
            {{scope.row.headImage}}
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="姓名" width="120" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="position_name" label="职位" width="120" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="position_name" label="换届时间" width="600px" show-overflow-tooltip align="center">
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
  import LeftMenu from '../../components/LeftMenu'
  import DateSelect from '../../../../components/Date'
  export default {
    props: {
      menuRequestUrll: { //小栏目请求地址
        default: 'org/partyDepartment',
        required: true,
      },
      memberRequestUrll: { //成员查询请求地址
        default: 'org/partyDepartmentLeader',
        required: true,
      },
      orgType: null,
      partyNature: null,
    },
    data() {
      return { 
        isLoad:      true,
        orgId:       sessionStorage.getItem('Access-OrgId'),
        assessKey:       sessionStorage.getItem('Access-Key'),
        operationType: 'add',
        dialogDepartmentVisible:  false, 
        department:  [], //职能部门
        leaderList:  [],
        orgForm:     {
          name:        null,
          buildtime:   {type: 1, date_time: null},
          phone:       null,
          mailbox:     null,
          description: null,
          address:     null,
        },
        activeDepartment: null,//被选中的部门

        addressOptionsVal: [],
        addressOptions: [], //地址区县
        addressProps: { children: 'sons', label: 'currentName', value: 'currentId'},

        dialogChangeVisible:false,
        leaderList01:[],
        dialogLoading:false,
      }
    },
    components: { 
      LeftMenu,
      'date-select': DateSelect
    },
    watch: {
    },
    created () {
    },
    mounted() {  
      // console.log(this.partyNature)
      this.queryPartyDepartment();
      this.queryAdministrActive();
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
        this.orgForm.province = value[0] || '';
        this.orgForm.city = value[1] || '';
        this.orgForm.county = value[2] || ''; 
        this.checkAddress();
      },
      /**
       * 地址校验, 根据输入的内容校验经纬度字段
       * @return {[type]} [description]
       */
      checkAddress () {   
        let pathLabels = this.$refs.addressOptions.getCheckedNodes()[0] ? this.$refs.addressOptions.getCheckedNodes()[0].pathLabels.join('') : '';
        let address = `${pathLabels}${this.orgForm.address}`;
        if(address) {
          this.mapLocation(address)
        } else {
          this.orgForm.latitude  = null
          this.orgForm.longitude = null
          this.$refs.orgForm.validateField("latitude")
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
              this.orgForm.latitude  = null
              this.orgForm.longitude = null
              this.$refs.orgForm.validateField("latitude") 
            }else{
              this.orgForm.latitude  = point.lat
              this.orgForm.longitude = point.lng
              this.$refs.orgForm.validateField("latitude")
            }
            
          }else{ 
            this.orgForm.latitude  = null
            this.orgForm.longitude = null
            this.$refs.orgForm.validateField("latitude") 
          }
        }, null);  
      },

      /**
       * 显示弹框
       * @param  {[type]} type [操作类型]
       * @return {[type]}      [description]
       */
      showDialog(type){  
        if(type == 'add'){  
          this.orgForm = {
            name:        null,
            buildtime:   {type: 1, date_time: null},
            phone:       null,
            mailbox:     null,
            description: null,
            address:     null,
          },
          this.$refs.orgForm ? this.$refs.orgForm.resetFields() : '';
          this.addressOptionsVal = [];
        }else{
          this.orgForm = {...this.activeDepartment};
          let data = this.orgForm;
          this.addressOptionsVal = data.county&&data.county!=''?[data.province,data.city, data.county]:[data.province, data.city];
        } 
        this.operationType = type; 
        this.dialogDepartmentVisible = true;
      },
      /**
       * 
       * 查询职能部门
       * @return {[type]} [description]
       */
      queryPartyDepartment() { 
        this.isLoad = true; 
        this.axios.post(`${this.common.basePath}/${this.menuRequestUrll}`, {orgId: this.orgId, orgType: this.orgType, partyNature: this.partyNature}).then((response) => {
          this.department = response.data.rows ? response.data.rows : [];
          this._department();
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg)
        })  
      },
      _department(){ 
        this.department.forEach( (item, index) => {
          if(index == 0) { 
            if(!item.buildtime) item.buildtime = {type: 1, date_time: null};
            
            this.activeDepartment = item; 
            this.queryPartyCommitteeLeader();
          }
        }) 
      }, 
      /**
       * 
       * 查询班子成员
       * @return {[type]} [description]
       */
      queryPartyCommitteeLeader() { 
        this.isLoad = true; 
        this.axios.post(`${this.common.basePath}/${this.memberRequestUrll}`, {orgId: this.activeDepartment.id}).then((response) => {
          const data = response.data ? response.data : [];
          if(this.memberRequestUrl='leader/list'){
            
          }else {
            data.map((item) => {
              item.position_name = [];
              item.positions.map((p) => {
                item.position_name.push(p.position_name)
              })

              item.position_name = item.position_name.join(','); 
            })
          }
          
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
        this.axios.post(`${this.common.basePath}/leader/list`, {orgId: this.activeDepartment.id}).then((response) => {
          this.leaderList01 = response.data ? response.data : [];
          this.dialogLoading = false;
        }).catch((errorMsg) => {
          this.dialogLoading = false;
          this.$message.error(errorMsg)
        })  
      }, 
      /**
       * 解散部门 (待完善)
       * @return {[type]} [description]
       */
      dismiss() {  
        this.$confirm('确定要解散吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(`${this.common.basePath}/org/dismiss?org_id=${this.activeDepartment.id}&user_id=${this.assessKey}`,).then((response) => {
            this.queryPartyDepartment();
            this.$message.success(response.meta.message);
          }).catch((errorMsg) => {
            this.isLoad =  false; 
            this.$message.error(errorMsg);
          })  
        }).catch(() => {}); 
      },
      /**
       * 改变部门，查询对应信息
       * @return {[type]} [description]
       */
      changeDepartments(item){
        this.activeDepartment = {
          ...item,
          buildtime: item.buildtime ? item.buildtime : {type: 1, date_time: null}
        }
        this.queryPartyCommitteeLeader();
      },
      /**
       * 提交党委信息
       * @return {[type]} [description]
       * partyNature 组织类别1.机构2.部门 
       * orgType 下属机构类型。1.是党委 2.是支部 3.是党小组  
       */
      submitactiveDepartmentForm(formName){
        let reuqestUrl = this.operationType == 'add' ? 
                      `${this.common.basePath}/org/new` : 
                      `${this.common.basePath}/org/update`
        this.isLoad =  true;
        
        this.axios.post(reuqestUrl, this._formParams()).then((response) => {
          this.isLoad =  false;
          this.queryPartyDepartment();
          this.dialogDepartmentVisible = false;
          this.$message.success(response.meta.message);
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.dialogDepartmentVisible = false;
          this.$message.error(errorMsg)
        })  
      },
      _formParams(){
        let form = {
          ...this.orgForm,
          superior_id: this.orgId,
        }
        if(this.operationType == 'add'){
          form.type = this.orgType;
          // form.partyNature = this.partyNature;
          form.partyNature = this.partyNature?this.partyNature:4
        }
        return form;
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
  .small-menu-ul{
    width: 200px;
    li{
      padding: 5px 20px;
      line-height: 40px;
      border: 1px solid #e2e2e2;
      margin: 0 0 -1px -1px;
    }
    .small-menu-active{
      color: #fff;
      background: #de1201; 
    }
  }
</style>
