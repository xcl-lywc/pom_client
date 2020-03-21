<template>
  <el-row>
    <div class="content-wrap">
      <div class="content-wrap-box">
        <el-card class="content-title-card" shadow="never">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="val">{{common.pageJson[val].name}}</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
        <div class="theme-main">
          <el-row :gutter="20">
            <!--  表格布局 左右侧布局  左侧文结果内容   右侧为组织导航  -->
            <el-col :span="20">
              <!-- 工作记录总览数据  -->
              <!-- <router-view :currentOrg=orgInfo></router-view> -->
              <generalAffairsResult :currentOrg=orgInfo :typeName="common.pageJson[val].name" class="content-wrap-box"></generalAffairsResult>
            </el-col>
            <!-- 党组织导航列表内容 -->
            <el-col :span="4">
              <el-card class="" style="position:fixed;">
                <!-- 工作记录总览数据  -->
                <el-tree :load="loadNode" lazy :props="defaultProps" @node-click="handleNodeClick" class="content-tree-box"></el-tree>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </el-row>
</template>
        
<script>
import generalAffairsResult from "./generalAffairsResult.vue";
export default {
  data() {
    return {
      //环境依赖参数
      orgId: Number(sessionStorage.getItem("Access-OrgId"))
        ? Number(sessionStorage.getItem("Access-OrgId"))
        : 1,
      orgName: "当前党委",
      assessKey: Number(sessionStorage.getItem("Access-Key")),

      //临时变量
      orgInfo: {},
      pageHeader:
        JSON.parse(
          sessionStorage.getItem("CreateActivitiForm-SuperiorRouteData")
        ) || null,
      //内部数据
      orgTree: [],
      //组织树数据绑定设置
      defaultProps: {
        nochild: "below",
        children: "children",
        label: "name"
      },

      val:this.$route.query.val,// val
    };
  },
  components:{
    generalAffairsResult
  },
  mounted() {

  },
  methods: {
    resolveTopnode(node,resolve) {
      //待修改接口名字 2，3
      let typeName;
      if (sessionStorage.getItem("partyNature") == 1) {
        typeName = "partyCommittee";
      } else if (sessionStorage.getItem("partyNature") == 2) {
        typeName = "findPartBranch";
      } else if (sessionStorage.getItem("partyNature") == 3) {
        typeName = "findPartGroup";
      } else {
        typeName = "partyCommittee";
      }
      this.axios
        .get(`${this.common.basePath}/org/${typeName}?id=${this.orgId}`)
        .then(response => {
          this.orgInfo = response.data;
          this.orgName = this.orgInfo.name;
          this.isLoad = false;
          resolve([{ id: this.orgInfo.id, name: this.orgInfo.name, nochild: false }])
        })
        .catch(errorMsg => {
          this.isLoad = false;
          this.$message.error(errorMsg);
        });
    },
    handleNodeClick(data) {
        this.orgInfo = data;
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.resolveTopnode(node,resolve);
      } else if (node.level > 0) {
        this.axios
          .post(`${this.common.basePath}/org/children`, {
            orgId: node.data.id,
            orgType: 1
          })
          .then(response => {
              if(response.data.rows){
                  let childNode = response.data.rows.map((item,i) =>{
                      item.nochild = item.below;
                      return item;
                  });
                  resolve(childNode);
              }else{
                  resolve([]);

              }
          })
          .catch(error => {
            this.isLoad = false;
            this.$message.error(error);
          });
      } else {
        debugger;
        return resolve([]);
      }
    }
  }
};
</script>
        
<style>
</style>