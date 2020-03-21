/************ 社会关系 ***********/
<template>
  <div>
    <!-- 家庭成员 -->
    <el-card v-loading="isLoad">
      <div slot="header" class="clearfix marb15">
        <span class="el-card-have-border-span">家庭成员</span>  
        <div class="el-card-head-btn"> 
          <el-button type="primary" size="small" @click=" showAddDialog(1) ">添加</el-button>
        </div> 
      </div> 
      <el-table
        :data="familyList" >
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="other_name"
          label="姓名" >
        </el-table-column>
        <el-table-column
          prop="other_position"
          label="职业" >
        </el-table-column>
        <el-table-column
          prop="contact"
          label="联系方式" >
        </el-table-column>
        <el-table-column
          prop="relation_name"
          label="关系" >
        </el-table-column>
        <el-table-column
          prop="date"
          label="操作" 
          width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="del(scope.row.id, 1)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>  
    <!-- 社会关系 -->
    <el-card v-loading="isLoad" class="mart20">
      <div slot="header" class="clearfix marb15">
        <span class="el-card-have-border-span">社会关系</span>  
        <div class="el-card-head-btn"> 
          <el-button type="primary" size="small" @click=" showAddDialog(2) ">添加</el-button>
        </div> 
      </div> 
      <el-table
        :data="socialList" >
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="other_name"
          label="姓名" >
        </el-table-column>
        <el-table-column
          prop="other_position"
          label="职业" >
        </el-table-column>
        <el-table-column
          prop="contact"
          label="联系方式" >
        </el-table-column>
        <el-table-column
          prop="relation_name"
          label="关系" >
        </el-table-column>
        <el-table-column
          prop="date"
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
        <el-form-item label="姓名：" prop="other_name"
          :rules="[
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]">
          <el-input v-model="addForm.other_name"></el-input>
        </el-form-item>
        <el-form-item label="关系：" prop="relation_name"
          :rules="[
            { required: false, message: '请输入关系', trigger: 'blur' }
          ]">
          <el-input v-model="addForm.relation_name"></el-input>
        </el-form-item>
        <el-form-item label="职业：" prop="other_position"
          :rules="[
            { required: false, message: '请输入职业', trigger: 'blur' }
          ]">
          <el-input v-model="addForm.other_position"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="contact"
          :rules="[
            { required: false, message: '请输入联系方式', trigger: 'blur' }
          ]">
          <el-input v-model="addForm.contact"></el-input>
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
        familyList:               [], //家庭成员列表
        socialList:               [], //社会关系列表  
        addForm: {
          other_name:      null,
          other_position:  null,
          owner:           sessionStorage.getItem('Access-Key'),
          relation_name:   null, 
          type:            1,
          contact:         null,
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
      this.queryList(1);  
      this.queryList(2);  
    },
    methods: { 
      /**
       * 查询关系列表
       * @param  {[type]} type     [1为家庭成员，2为社会关系] 
       * @return {[type]}          [description]
       */
      queryList(type){
        this.isLoad = true;
        this.axios.post(`${this.common.basePath}/relation/select`, {type: type, user_id: sessionStorage.getItem('Access-Key')}).then( (response) => {
          let typeName = type == 1 ? 'familyList' : 'socialList';
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
          this.axios.delete(`${this.common.basePath}/relation/delete?id=${id}`, '').then( (response) => {
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
            this.axios.post(`${this.common.basePath}/relation/create`, this.addForm).then( (response) => {
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
