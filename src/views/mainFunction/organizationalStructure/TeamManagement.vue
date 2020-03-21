/*************** 班子管理 *************/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>  
          <el-breadcrumb-item>组织架构</el-breadcrumb-item> 
          <el-breadcrumb-item>班子管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card> 
      <div class="theme-main" v-loading="loading">   

        <el-card class="padt20" v-if="positionList ? positionList.length : false"> 
          <el-checkbox-group v-model="ids" size="small">
            <div v-for="(item,index) in positionList">
              <el-collapse v-model="activeIndexs" @change="handleChange" accordion>
                <el-collapse-item :name="item.id">
                  <template slot="title">
                    <el-checkbox :label="item.id" :key="item.id" class="checkbox-position">&nbsp;</el-checkbox>&nbsp;&nbsp;&nbsp;{{item.name}}
                  </template>
                  <div class="marb20 text-right">
                    <el-button type="primary" size="small" @click=" addPlus(item) ">编辑职位</el-button>
                    <el-button type="primary" size="small" @click=" showAddPeople(item.id) ">添加班子</el-button>
                  </div>
                  <div v-if="judge(item.id)" class="content-empty line-height-100">该职位暂无班子成员</div>
                  <div v-for="(childItem,childIndex) in teamList">
                    <el-card class="box-card marb20" shadow="hover" v-if="item.id===childItem.position_id">
                      <el-row :gutter="20">
                        <el-col :span="5" class="head-img">
                          <el-avatar :size="150" shape="square" :src="common.filePath + childItem.headImage" class="marr5 fl">
                            <img v-if="item.sex==0" src="../../../assets/img/male.png"/>
                            <img v-else-if="item.sex==1" src="../../../assets/img/female.png"/>
                            <img v-else src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                          </el-avatar>
                        </el-col>
                        <el-col :span="19">
                          <el-row>
                            <el-col :span="12">
                              <p class="mart10">姓名：{{childItem.user_name ? childItem.user_name : '无'}}</p>
                              <p class="mart10">职位：{{childItem.position_id===item.id ? item.name : '无'}}</p>
                            </el-col>
                            <el-col :span="12">
                              <p class="mart10">入职时间：{{common._convertDate(childItem.create_time, 'yyyy年MM月dd日 hh:mm')}}</p>
                              <p class="mart10">任期结束：{{common._convertDate(childItem.stop_time, 'yyyy年MM月dd日 hh:mm')}}</p>
                            </el-col>
                            <el-col :span="24">
                              <p class="mart10 desc-box pad5">简介：{{childItem.description ? childItem.description : '暂无简介'}}</p>
                            </el-col> 
                          </el-row>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-button v-if="childItem.cur_status === 20" type="warning" size="mini mart10 fr" @click.stop="" disabled>已离任</el-button>
                        <el-button v-if="childItem.cur_status === 1" type="warning" size="mini mart10 fr" @click.stop="leavingOffice(childItem.id)">离任</el-button>
                      </el-row>
                    </el-card>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-checkbox-group>
          <div class="mart10">
            <el-button type="success" size="mini" @click="addPlus(null)">添加职位</el-button>
            <el-button type="danger" size="mini" @click="del" :disabled="ids.length===0 ? true : false">删除职位</el-button>
          </div>
        </el-card>
        <el-card v-else class="content-empty">
          <span>暂无班子成员信息，请选择组织</span>
          <p class="mart20">
            <el-button type="success" size="mini" @click="addPlus(null)">添加职位</el-button>
          </p>
        </el-card>
        <!-- 添加职位弹框 -->
        <el-dialog  
          title="添加/编辑职位" 
          :visible.sync="dialogFormVisible" 
          width='750px'
          v-loading="dialogLoading"> 
          <el-form 
            :model="plusform" 
            ref="plusform"
            :label-width="formLabelWidth">
            <el-form-item 
              label="名称：" 
              prop="config"
              :rules="[{ required: true, message: '请输入职位名称', trigger: 'blur' },]">
              <!-- <el-input v-model="plusform.name" class="w300"></el-input> -->
              <el-select type="text" v-model="plusform.config" value-key="id" class="fill-width" palceholder="请选择职位">
                <el-option 
                  v-for="(option, index) in allPostionList" 
                  :value="option.id" 
                  :label="option.name" 
                  :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item 
              label="描述：" 
              prop="description">
              <el-input type="textarea" v-model="plusform.description" rows="5" maxlength="128" show-word-limit></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button @click="$refs['plusform'].resetFields();">重 置</el-button>
            <el-button type="primary" @click="submitPlusForm('plusform')">保 存</el-button>
          </div> 
        </el-dialog> 

        <!-- 添加领导dialog -->
        <el-dialog 
          title="添加领导"
          :close-on-click-modal="false"
          :visible.sync="peopleDialogVisible"
          width="40vw"
          v-loading="dialogLoading"> 
            <el-form ref="leaderForm" label-width="60px" size="small">
              <!-- <el-form-item label="职位" required>
                <el-select type="text" v-model="position" value-key="id" class="fill-width" palceholder="请选择职位">
                  <el-option 
                    v-for="(option, index) in allPostionList" 
                    :value="option.id" 
                    :label="option.name" 
                    :key="index"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="姓名：">
                <div class="search-name-wrap">
                  <el-input type="text" v-model="peopleName" palceholder="请输入人员姓名" @keyup.enter.native="getPeopleTableListData"></el-input>
                  <el-button type="primary" @click="getPeopleTableListData">搜索</el-button>
                </div>
              </el-form-item>
            </el-form>
            <span class="tip-text">搜索人员之后需要点击将其选中</span>
            <el-table
              ref="peopleTable"
              stripe
              :data="peopleTableListData"
              tooltip-effect="dark"
              style="width: 100%; max-height: 386px; overflow-y: auto;"
              v-loading="peopleLoading"
              @cell-click="clickSingle">
              <el-table-column
                prop="real_name"
                label="姓名"
                width="120">
              </el-table-column>
              <el-table-column
                prop="org_name"
                label="支部"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                width="100">
                <template v-if="tablePeopleId == scope.row.id" slot-scope="scope">
                  <span class="text-red" >已选择 <i class="el-icon-success"></i></span>
                </template>
              </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="peopleDialogVisible = false">取 消</el-button>
              <el-button @click="submitPeople" type="primary" :disabled="!tablePeopleId || !positionId">确 定</el-button>
            </div>  
        </el-dialog>
      </div>
    </div>
  </div> 
</template>

<script> 
  export default {
    data() {
      return { 
        loading:                false,
        dialogLoading:          false,
        peopleLoading:          false,
        peopleDialogVisible:    false,
        newOrgId:               null,
        orgId:                  this.$route.params.org_id,
        partyNature:            this.$route.params.party_nature,
        activeIndexs:           [],

        teamList:[],//班子成员
        allPostionList: [], //职位select的列表
        positionList:[],//职位列表
        ids:[],//删除职位的id数组

        //添加职位
        formLabelWidth: '100px',
        dialogFormVisible:false,
        plusform: {
          description: null,
          id:          null,
          config:      null,
          org_id:      sessionStorage.getItem('Access-OrgId'),
        }, 
        position:            null, 
        positionId:          null,  //当前被选中的职位Id
        tablePeopleId:       null,  //当前选中的人员id
        peopleName:          "",    //表单输入的人员名称
        peopleTableListData: [],    //人员表格数据 
      }
    },
    components: {  
    },
    computed:{ 
      /**
       * 判断该职位下是否有班子成员
       * @param  {[type]} id 职位id
       * @return {[type]}    [description]
       */
      judge(){ 
        return function(id){
          let val = false;
          let position_id_arr = [];
          if(this.teamList.length>0){
            this.teamList.forEach( (item) => {position_id_arr.push(item.position_id)});//循环遍历得到position_id的数组
            if(position_id_arr.length>0){
              position_id_arr.indexOf(id)===-1 ? val = true : val = false;
              return val;
            }else{
              return val;
            }
          }else{
            return val;
          };
        }
      },
    },
    watch: { 
    },
    created() {

    },
    mounted() {
      this.queryAllPositionList();
      this.getPositionList();
      this.queryTeamList();
    },
    methods: {
      /**
       * 查询所有职位
       * @return {[type]} [description]
       */
      queryAllPositionList(){ 
        this.axios.post(`${this.common.basePath}/positionConfig/list`, {type: this.partyNature}).then((response) => {
          this.loading = false;
          this.allPostionList = response.data ? response.data.rows : [];
        }).catch((error) => {
          this.loading = false; 
          this.$message.error(error);  
        });
      },

      /**
       * 当前激活面板改变时触发
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      handleChange(val) {
        // console.log(val);
      },

      /**
       * 班子成员 list查询 POST
       * @param  {[type]} data 组织id
       * @return {[type]}      [description]
       */
      queryTeamList(id){  
        this.loading = true;
        this.axios.post(`${this.common.basePath}/leader/list`, {orgId: this.orgId}).then((response) => {
          this.loading = false;
          this.teamList = response.data ? response.data : [];//班子成员
        }).catch((error) => {
          this.loading = false;
          this.teamList = [];
          this.$message.error(error);  
        });
      },
      _teamListParams(id){
        return{
          orgId:id,
        }
      },
      /**
       * 做筛选的人员列表
       * @return {[type]} [description]
       */
      getPeopleTableListData(){
        this.peopleLoading = true;
        this.axios.post(`${this.common.basePath}/user/user/list`, {realName:this.peopleName}).then((response) => {
          this.peopleLoading = false;
          this.peopleTableListData = response.data.rows ? response.data.rows : [];//班子成员
        }).catch((error) => {
          this.peopleLoading = false;
          this.peopleTableListData = [];
          this.$message.error(error);  
        });
      },
      clickSingle (item) {
        this.tablePeopleId = item.id
      },
      /**
       * 职位列表 list查询 POST
       * @param  {[type]} data 组织id
       * @return {[type]}      [description]
       */
      getPositionList(){  
        this.loading = false;
        this.axios.post(`${this.common.basePath}/position/list`,this._positionListParams()).then((response) => {
          this.loading = false; 
          this.positionList = response.data.rows;//职位列表
        }).catch((error) => {
          this.loading = false; 
          this.$message.error(error);  
        });
      },
      _positionListParams(){
        return{
          org_id: this.orgId,
        }
      }, 
      /**
       * 添加按钮
       * @param {[type]} data 数据
       */
      addPlus(data){
        if(data){
          this.plusform = {config: null, id: data.id, description: data.description};
        }else { 
          this.plusform = {config: null, description: null, org_id: this.orgId};
          this.$refs['plusform'] ? this.$refs['plusform'].resetFields(): '';
        }
        this.dialogFormVisible = true;
      },
      /**
       * 提交添加职位的表单
       * @param  {[type]} formName       [表单]
       * @return {[type]}                [description]
       */
      submitPlusForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addPosition()
          } else {
            return false;
          }
        });
      },
      /**
       * 删除按钮
       * @return {[type]} [description]
       */
      del() {
        this.$confirm('是否执行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delPosition(this.ids)
        }).catch(() => {});    
      },
      /**
       * 离任按钮
       * @return {[type]} [description]
       */
      leavingOffice(id) {
        this.$confirm('是否离任?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.leavingOffice_(id);
        }).catch(() => {});    
      },

      /**
       * 班子成员-职位的form添加 POST
       * @return {[type]} [description]
       */
      addPosition(){
        this.dialogLoading = true;
        let order = this.positionList.length+1;  
        let requestUrl = this.plusform.id ? `${this.common.basePath}/position/update` : `${this.common.basePath}/position/new`

        this.axios.post(requestUrl, this.plusform).then((response) => {
          this.dialogLoading = false;
          this.dialogFormVisible = false;
          this.getPositionList()
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.dialogLoading = false;
          this.dialogFormVisible = false;
          this.$message.error(error);  
        });
      },
      /**
       * 班子成员的离任 POST
       * @param  {[type]} id [description]
       * @return {[type]}      [description]
       */
      leavingOffice_(id){
        this.axios.post(`${this.common.basePath}/leader/delete`,{id:id}).then((response) => {
          this.queryTeamList()
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /**
       * 班子成员-职位的多个删除 POST
       * @param  {[type]} ids [description]
       * @return {[type]}      [description]
       */
      delPosition(ids){
        this.axios.post(`${this.common.basePath}/position/delete`,{ids:ids,org_id:this.orgId}).then((response) => {
          this.getPositionList()
          this.$message({type: 'success',message: '删除成功!'});
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
    /**
     * 添加班子领导
     * @param  {[type]} positionId [description]
     * @return {[type]}            [description]
     */
     showAddPeople(positionId){
        this.peopleDialogVisible = true;
        this.positionId = positionId;
        this.getPeopleTableListData();
     },
     /**
      * 保存某个职位下面添加的班子领导
      * @return {[type]} [description]
      */
     submitPeople(){
        this.dialogLoading = true;
        this.axios.post(`${this.common.basePath}/leader/add`,{user_id: this.tablePeopleId, position_id:this.positionId}).then((response) => {
          this.queryTeamList()
          this.$message({type: 'success',message: response.meta.message});
          this.peopleDialogVisible = false;
          this.dialogLoading = false;
        }).catch((error) => {
          this.peopleDialogVisible = false;
          this.dialogLoading = false;
          this.$message.error(error);  
        });
     }
    }
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
  .leader-box-flex{
    display: flex; 
    align-items: flex-end;
  }
  .add-leader-btn{
    width: 100%;
  }
  .search-name-wrap {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
  .content-empty{
    line-height: 80px;
    width: 100%;
    text-align:center;
    color: #909399;
    font-size:14px; 
  }
</style>
