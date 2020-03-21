/************ 成果记录 ***********/
<template>
  <div>
    <!-- 学历 -->
    <el-card v-loading="isLoad">
      <div slot="header" class="clearfix marb15">
        <span class="el-card-have-border-span">学历</span>  
        <div class="el-card-head-btn"> 
          <el-button type="primary" size="small" @click=" showAddDialog(1) ">添加</el-button>
        </div> 
      </div> 
      <el-table
        :data="educationList" >
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column 
          prop="info_id"
          label="学历" > 
          <template slot-scope="scope">
            {{ common._controlTable(scope.row.info_id) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="award_org"
          label="颁发单位" >
        </el-table-column>
        <el-table-column
          prop="position"
          label="时间" >
          <template slot-scope="scope">
            {{common._convertDate(scope.row.create_time, 'yyyy年MM月dd日')}}
          </template>
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
    <!-- 学位 -->
    <el-card v-loading="isLoad" class="mart20">
      <div slot="header" class="clearfix marb15">
        <span class="el-card-have-border-span">学位</span>  
        <div class="el-card-head-btn"> 
          <el-button type="primary" size="small" @click=" showAddDialog(4) ">添加</el-button>
        </div> 
      </div> 
      <el-table
        :data="academicDegreeList" >
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column 
          prop="info_id"
          label="学位" > 
          <template slot-scope="scope">
            {{ common._controlTable(scope.row.info_id) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="award_org"
          label="颁发单位" >
        </el-table-column>
        <el-table-column
          prop="position"
          label="时间" >
          <template slot-scope="scope">
            {{common._convertDate(scope.row.create_time, 'yyyy年MM月dd日')}}
          </template>
        </el-table-column> 
        <el-table-column 
          label="操作" 
          width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="del(scope.row.id, 4)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card> 
    <!-- 执业资格 -->
    <el-card v-loading="isLoad" class="mart20">
      <div slot="header" class="clearfix marb15">
        <span class="el-card-have-border-span">执业资格</span>  
        <div class="el-card-head-btn"> 
          <el-button type="primary" size="small" @click=" showAddDialog(5) ">添加</el-button>
        </div> 
      </div> 
      <el-table
        :data="practisingQualificationList" >
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column 
          prop="info_id"
          label="执业资格" > 
          <template slot-scope="scope">
            {{ common._controlTable(scope.row.info_id) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="award_org"
          label="颁发单位" >
        </el-table-column>
        <el-table-column
          prop="position"
          label="时间" >
          <template slot-scope="scope">
            {{common._convertDate(scope.row.create_time, 'yyyy年MM月dd日')}}
          </template>
        </el-table-column> 
        <el-table-column 
          label="操作" 
          width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="del(scope.row.id, 5)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>     
    <!-- 新增 --> 
    <el-dialog v-loading="isLoad" title="新增" :visible.sync="dialogAddFormVisible" width="50vw">
      <el-form ref="addForm"  :model="addForm" label-width="100px">
        <el-form-item  v-if="addForm.type == 1" label="学历：" prop="info_id"
          :rules="[
            { required: true, message: '请选择学历', trigger: 'blur' }
          ]">
          <el-select v-model="addForm.info_id" filterable>
            <el-option 
              v-for="(item, index) in controlTable[3].dictionaryList" 
              :value="item.id" :label="item.name" :key=index>
            </el-option>
          </el-select> 
        </el-form-item>
        <el-form-item  v-if="addForm.type == 4" label="学位：" prop="info_id"
          :rules="[
            { required: true, message: '请选择学位', trigger: 'blur' }
          ]">
          <el-select v-model="addForm.info_id" filterable>
            <el-option 
              v-for="(item, index) in controlTable[13].dictionaryList" 
              :value="item.id" :label="item.name" :key=index>
            </el-option>
          </el-select> 
        </el-form-item>
        <el-form-item  v-if="addForm.type == 5" label="执业资格：" prop="info_id"
          :rules="[
            { required: true, message: '请选择执业资格', trigger: 'blur' }
          ]">
          <el-select v-model="addForm.info_id" filterable>
            <el-option 
              v-for="(item, index) in controlTable[15].dictionaryList" 
              :value="item.id" :label="item.name" :key=index>
            </el-option>
          </el-select> 
        </el-form-item>
        <el-form-item label="颁发单位：" prop="award_org"
          :rules="[
            { required: false, message: '请输入颁发单位', trigger: 'blur' }
          ]">
          <el-input v-model="addForm.award_org"></el-input>
        </el-form-item>  
        <el-form-item label="颁发时间：" prop="create_time"
          :rules="[
            { required: false, message: '请输入颁发时间', trigger: 'blur' }
          ]">
          <el-date-picker
            v-model="addForm.create_time"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
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
        controlTable:             JSON.parse(sessionStorage.getItem("controlTable")),
        educationList:                 [], // 学历列表 1
        academicDegreeList:            [], // 学位列表 4
        practisingQualificationList:   [], // 执业资格列表 5 
        addForm: {
          owner:           sessionStorage.getItem('Access-Key'),
          info_id:         null,
          award_org:       null,  
          create_time:     null,
          type:            1,  
        }
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
      this.queryList(1);
      this.queryList(4);  
      this.queryList(5);  
    },
    methods: { 
      /**
       * 先检查该页面需要的字典列表是否存在
       * @return {[type]} [description]
       */
      checkDictionary(){ 
        let data = this.controlTable;
        for(let i in data){
          // 3 为学历，13为学位 15为执行资格
          if(i == 3 || i == 13 || i == 15){
            if(!data[i].dictionaryList.length){
              this._queryDictionaryByType(data[i]);
            }
          }
          
        } 
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
      /**
       * 查询关系列表
       * @param  {[type]} type     [1为家庭成员，2为社会关系] 
       * @return {[type]}          [description]
       */
      queryList(type){
        this.isLoad = true;
        this.axios.post(`${this.common.basePath}/archives/select`, {type: type, user_id: sessionStorage.getItem('Access-Key')}).then( (response) => {
          let typeName ;
          switch(type){
            case 1:
              typeName = 'educationList';
              break;
            case 4:
              typeName = 'academicDegreeList';
              break;
            case 5:
              typeName = 'practisingQualificationList';
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
          this.axios.delete(`${this.common.basePath}/archives/delete?id=${id}`, '').then( (response) => {
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
      },
      /**
       * 添加数据
       * @return {[type]} [description]
       */
      submitAddForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {  
            this.isLoad = true;
            this.addForm.create_time = new Date(this.addForm.create_time).getTime();
            this.axios.post(`${this.common.basePath}/archives/create`, this.addForm).then( (response) => {
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
      },
      
    },
  }
</script>

<style scoped lang="less"> 
  .el-menu{
    border-right: none!important;
    width: 250px;
  }
</style>
