/************ 经历记录 ***********/
<template>
  <div>
    <!-- 工作经历 -->
    <el-card v-loading="isLoad">
      <div slot="header" class="clearfix marb15">
        <span class="el-card-have-border-span">工作经历</span>  
        <div class="el-card-head-btn"> 
          <el-button type="primary" size="small" @click=" showAddDialog(6) ">添加</el-button>
        </div> 
      </div> 
      <el-table
        :data="workList" >
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column 
          label="时间" >
          <template slot-scope="scope">
            {{common._convertDate(scope.row.begin_time, 'yyyy年MM月dd日')}}~
            {{common._convertDate(scope.row.end_time, 'yyyy年MM月dd日')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="工作单位/地址" >
          <template slot-scope="scope">
            {{`
              ${common._countyDataByIdConvert(scope.row.province)}
              ${common._countyDataByIdConvert(scope.row.city)}
              ${common._countyDataByIdConvert(scope.row.county)}
              ${scope.row.address}
            `}}
          </template>
        </el-table-column>
        <el-table-column
          prop="info"
          label="经历" >
        </el-table-column> 
        <el-table-column 
          label="操作" 
          width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="del(scope.row.id, 6)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card> 
    <!-- 学习经历 -->
    <el-card v-loading="isLoad" class="mart20">
      <div slot="header" class="clearfix marb15">
        <span class="el-card-have-border-span">学习经历</span>  
        <div class="el-card-head-btn"> 
          <el-button type="primary" size="small" @click=" showAddDialog(1) ">添加</el-button>
        </div> 
      </div> 
      <el-table
        :data="studyList" >
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column 
          label="时间" >
          <template slot-scope="scope">
            {{common._convertDate(scope.row.begin_time, 'yyyy年MM月dd日')}}~
            {{common._convertDate(scope.row.end_time, 'yyyy年MM月dd日')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="学校名称/地址" >
          <template slot-scope="scope">
            {{`
              ${common._countyDataByIdConvert(scope.row.province)}
              ${common._countyDataByIdConvert(scope.row.city)}
              ${common._countyDataByIdConvert(scope.row.county)}
              ${scope.row.address}
            `}}
          </template>
        </el-table-column>
        <el-table-column
          prop="info"
          label="经历" >
        </el-table-column> 
        <el-table-column 
          label="操作" 
          width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="del(scope.row.id, 1)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card> 
    <!-- 培训经历 -->
    <el-card v-loading="isLoad" class="mart20">
      <div slot="header" class="clearfix marb15">
        <span class="el-card-have-border-span">培训经历</span>  
        <div class="el-card-head-btn"> 
          <el-button type="primary" size="small" @click=" showAddDialog(2) ">添加</el-button>
        </div> 
      </div> 
      <el-table
        :data="trainList" >
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column 
          label="时间" >
          <template slot-scope="scope">
            {{common._convertDate(scope.row.begin_time, 'yyyy年MM月dd日')}}~
            {{common._convertDate(scope.row.end_time, 'yyyy年MM月dd日')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="学校名称/地址" >
          <template slot-scope="scope">
            {{`
              ${common._countyDataByIdConvert(scope.row.province)}
              ${common._countyDataByIdConvert(scope.row.city)}
              ${common._countyDataByIdConvert(scope.row.county)}
              ${scope.row.address}
            `}}
          </template>
        </el-table-column>
        <el-table-column
          prop="info"
          label="经历" >
        </el-table-column> 
        <el-table-column 
          label="操作" 
          width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="del(scope.row.id, 2)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>  
    <!-- 新增 --> 
    <el-dialog v-loading="isLoad" title="新增" :visible.sync="dialogAddFormVisible" width="50vw">
      <el-form ref="addForm"  :model="addForm" label-width="100px">
        <el-form-item label="经历：" prop="info"
          :rules="[
            { required: true, message: '请输入经历', trigger: 'blur' }
          ]">
          <el-input v-model="addForm.info"></el-input>
        </el-form-item>
        <el-form-item label="时间：" prop="BETime"
          :rules="[
            { required: false, message: '请选择开始结束时间', trigger: 'blur' }
          ]">
          <el-date-picker
            v-model="addForm.BETime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="地址：" prop="address"
          :rules="[
            { required: true, message: '请输入地址', trigger: 'blur' }
          ]">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item> -->
        <el-form-item
          prop="province"
          label="地址信息"
          :rules="{ required: false, message: '请选择省区县', trigger: 'change'}">
          <el-cascader filterable v-model="addressOptionsVal" ref="addressOptions" placeholder="请选择省区县" :options="addressOptions"  :props="addressProps" clearable @change="addressOptionsChange"></el-cascader> 
        </el-form-item>
        <el-form-item
          prop="address"
          label="详细地址"
          :rules="{ required: false, message: '请输入详细地址', trigger: 'blur'}">
          <el-input v-model="addForm.address" type="text" @blur="checkAddress"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click=" dialogAddFormVisible = false " size="small">取消</el-button>
        <el-button type="primary" @click=" submitAddForm('addForm') " size="small">确 定</el-button>
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
        dialogAddFormVisible:     false, //弹框  
        workList:                 [], // 工作经历列表6
        studyList:                [], // 学习经历列表 1
        trainList:                [], // 培训经历列表2
        activeType:               6,
        addForm: {
          owner:           sessionStorage.getItem('Access-Key'),
          begin_time:      null,
          end_time:        null,
          address:         null, 
          info:            null, //经历
          type:            6, 
          BETime:          null,
        },

        addressOptionsVal: [],
        addressOptions: [], //地址区县
        addressProps: { children: 'sons', label: 'currentName', value: 'currentId'},
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
      this.queryList(1);
      this.queryList(2);  
      this.queryList(6); 
      this.queryAdministrActive(); 
    },
    methods: { 
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
        this.addForm.province = value[0] || '';
        this.addForm.city = value[1] || '';
        this.addForm.county = value[2] || ''; 
        this.checkAddress();
      },
      /**
       * 地址校验, 根据输入的内容校验经纬度字段
       * @return {[type]} [description]
       */
      checkAddress () {   
        let pathLabels = this.$refs.addressOptions.getCheckedNodes()[0] ? this.$refs.addressOptions.getCheckedNodes()[0].pathLabels.join('') : '';
        let address = `${pathLabels}${this.addForm.address}`;
        if(address) {
          this.mapLocation(address)
        } else {
          this.addForm.latitude  = null
          this.addForm.longitude = null
          this.$refs.addForm.validateField("latitude")
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
              this.addForm.latitude  = null
              this.addForm.longitude = null
              this.$refs.addForm.validateField("latitude") 
            }else{
              this.addForm.latitude  = point.lat
              this.addForm.longitude = point.lng
              this.$refs.addForm.validateField("latitude")
            }
            
          }else{ 
            this.addForm.latitude  = null
            this.addForm.longitude = null
            this.$refs.addForm.validateField("latitude") 
          }
        }, null);  
      },

      /**
       * 查询关系列表
       * @param  {[type]} type     [1为家庭成员，2为社会关系] 
       * @return {[type]}          [description]
       */
      queryList(type){
        this.isLoad = true;
        this.axios.post(`${this.common.basePath}/experience/select`, {type: type, user_id: sessionStorage.getItem('Access-Key')}).then( (response) => {
          let typeName ;
          switch(type){
            case 1:
              typeName = 'studyList';
              break;
            case 2:
              typeName = 'trainList';
              break;
            case 6:
              typeName = 'workList';
              break; 
          } 

          let { data }  = response;
          this[typeName] = data.rows ? data.rows : [];
          this.isLoad = false;
        }).catch( (error) => {
            this.isLoad = false;
            this.$message.error(error); 
        });
      },
      /**
       * 删除指定Id数据
       * @param  {[Number]} id [对应Id]
       * @param  {[Number]} type [1为家庭成员，2为社会关系] 
       * @return {[type]}    [description]
       */
      del(id, type){
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`${this.common.basePath}/experience/delete?id=${id}`, '').then( (response) => {
            this.queryList(type);
            this.$message.success(response.meta.message);
            this.isLoad = false;
          }).catch( (error) => {
              this.isLoad = false;
              this.$message.error(error); 
          });
        }).catch(() => {});
      },
      /**
       * 显示添加弹框
       * @param  {[type]} type [description]
       * @return {[type]}      [description]
       */
      showAddDialog(type){
        this.addForm.type = type;
        this.dialogAddFormVisible = true;
        this.$refs.addForm ? this.$refs.addForm.resetFields() : '';
        this.addressOptionsVal = [];
        this.addForm.BETime = null;
      },
      /**
       * 添加数据
       * @return {[type]} [description]
       */
      submitAddForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isLoad = true;
            let form = {...this.addForm}
            form.begin_time = new Date(form.BETime[0]).getTime();
            form.end_time = new Date(form.BETime[1]).getTime();
            delete form.BETime;

            this.axios.post(`${this.common.basePath}/experience/create`, form).then( (response) => {
              this.queryList(this.addForm.type);
              this.$message.success(response.meta.message);
              this.isLoad = false;
              this.dialogAddFormVisible = false;
            }).catch( (error) => {
                this.isLoad = false;
                this.dialogAddFormVisible = false;
                this.$message.error(error); 
            });
          } else { 
            return false;
          }
        });
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
