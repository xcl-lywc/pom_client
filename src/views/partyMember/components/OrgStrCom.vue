/*************** 组织架构 *************/
<template>
  <div>  
    <el-row :gutter="20">
      <el-col :span="12">
        <!-- 组织信息 -->
        <el-card class="padb20" v-loading="isLoad">
          <div slot="header" class="clearfix">
            <span>组织信息</span>   
          </div>   
          <el-row v-if="partyInfo"> 
            <el-col :span="12">
              <p class="mart10">名称：{{partyInfo.name}}</p>
              <p class="mart10">
                任期开始：{{common._showDate(partyInfo.office_start)}}
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
              <p class="mart10">地址：
                {{`
                  ${common._countyDataByIdConvert(partyInfo.province) }
                  ${common._countyDataByIdConvert(partyInfo.city)}
                  ${common._countyDataByIdConvert(partyInfo.county)}
                  ${partyInfo.address}
                `}}
              </p>
            </el-col>
            <el-col :span="24">
              <p class="mart10 desc-box pad5">简介：{{partyInfo.description}}</p> 
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <!-- 职能部门 -->
        <el-card class="padb20" v-loading="isLoad">
          <div slot="header" class="clearfix">
            <span>职能部门</span>   
          </div>   
          <el-tabs v-model="activeTagName" type="" v-if="department.total>0">
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
          <div v-else class="no-data">
            暂无数据
          </div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <!-- 班子成员 -->
        <el-card class="padb20 mart20" v-loading="isLoad">
          <div slot="header" class="clearfix">
            <span >班子成员</span>   
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
      <el-col :span="24">
        <!-- 党员花名册 -->
        <el-card class="padb20 mart20" v-loading="isLoad">
          <div slot="header" class="clearfix">
            <span >党员花名册</span>   
          </div>  
          <PartyMembersRoster :orgId='orgId' :partyNature="partyNature" type="home"></PartyMembersRoster>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>  
  import PartyMembersRoster from '../../mainFunction/partyMemberManagement/PartyMembersRosterCom.vue'
  export default {
    props:{
      orgId: {
        default: null,
        required: true,
      },
      partyNature: {
        default: null,
        required: true,
      }
    },
    data() {
      return { 
        isLoad:           false,
        assessKey:        sessionStorage.getItem('Access-Key'), 
        
        dialogPartyInfoVisible:  false,
        partyInfo:   null,
        leaderList:  [],
        department:  {rows: [], total: 0}, //职能部门
        activeTagName: null, //职能部门被选中项
      }
    },
    components: {   
      PartyMembersRoster
    },
    watch: {
    },
    created () {
    },
    mounted() { 
      this.init();
    },
    methods: {  
      init(){
        this.queryPartInfo();
        this.queryPartyDepartment();
      },
      /**
       * 查询党委信息
       * @return {[type]} [description]
       */
      queryPartInfo() {  
        //待修改接口名字 2，3
        let typeName;
        if(this.partyNature == 1){
          typeName = 'partyCommittee';
        }else if(this.partyNature == 2){
          typeName = 'findPartBranch';
        }else if(this.partyNature == 3){
          typeName = 'findPartGroup';
        }
        this.axios.get(`${this.common.basePath}/org/${typeName}?id=${this.orgId}`,).then((response) => {
          this.partyInfo = response.data;
          this.isLoad =  false;
          this.queryPartyCommitteeLeader();
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg);
        })  
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
        if( this.partyNature == 1 ){
          requestUrl = 'org/partyCommitteeLeader';
        }else if( this.partyNature == 2 ){
          requestUrl = 'org/partyBranchLeader';
        }else if( this.partyNature == 3 ){
          requestUrl = 'org/partyGroupLeader';
        }
        this.isLoad = true; 
        this.axios.post(`${this.common.basePath}/${requestUrl}`, {orgId: this.orgId, orgType: this.partyInfo.type, partyNature: sessionStorage.getItem('partyNature')}).then((response) => {
          const data = response.data ? response.data : [];
          
          // 职位有多个，将职位数组组装为字符串
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
