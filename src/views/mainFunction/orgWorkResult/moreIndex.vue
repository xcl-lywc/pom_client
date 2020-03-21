<template>
  <el-row>
    <div class="content-wrap">
      <div class="content-wrap-box">
        <el-card class="content-title-card" shadow="never">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'mainFunctionHome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{typeName}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{selectedFormName}}</el-breadcrumb-item>
          </el-breadcrumb>
        </el-card>
        <div class="theme-main">
          <el-row :gutter="20">
            <!--  表格布局 左右侧布局  左侧文结果内容   右侧为组织导航  -->
            <el-col :span="20">
              <!-- 工作记录总览数据  -->
              <el-card>
                <el-container>
                  <!-- 查询条件 -->
                  <el-header>
                    <el-form :inline="true">
                      <!-- 记录状态 -->
                      <el-form-item label="状态">
                        <el-select v-model="value" placeholder="请选择" @change="onStatusChange">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <!-- 记录创建时间 -->
                      <el-form-item label="提交时间">
                        <el-date-picker
                          v-model="value1"
                          value-format="timestamp"
                          @change="onTimeChange"
                          type="daterange"
                          align="right"
                          unlink-panels
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :picker-options="pickerOptions"
                        ></el-date-picker>
                      </el-form-item>
                    </el-form>
                  </el-header>
                  <el-main>
                    <el-table :data="tableData.rows" stripe border style="width: 100%">
                      <el-table-column fixed label="序号" type="index" width="50" align="center"></el-table-column>
                      <el-table-column
                        prop="endTime"
                        label="创建时间"
                        show-overflow-tooltip
                        width="150"
                        align="center"
                      >
                        <template
                          slot-scope="scope"
                        >{{common._convertDate(scope.row.beginTime, 'yyyy-MM-dd')}}</template>
                      </el-table-column>
                      <el-table-column label="工作记录表" align="center">
                        <div v-for="(item,index) in formDate" :key="index">
                          <el-table-column
                            prop="processVariables"
                            :label="item.obj.label"
                            show-overflow-tooltip
                            width
                            align="center"
                            v-if="item.obj.type!='uploads'"
                          >
                            <template slot-scope="scope">
                              <div
                                v-if="item.obj.type=='slider'"
                              >{{scope.row.processVariables[item.obj.name]}}%</div>
                              <div
                                v-else-if="item.obj.fotmatType=='daterange'"
                              >{{scope.row.processVariables[item.obj.name][0]}} 至 {{scope.row.processVariables[item.obj.name][1]}}</div>
                              <div v-else-if="item.obj.type=='uploads'">
                                <file-show
                                  :fileList="scope.row.processVariables[item.obj.name]?scope.row.processVariables[item.obj.name]:[]"
                                  :closable="false"
                                ></file-show>
                              </div>
                              <div v-else>{{scope.row.processVariables[item.obj.name]}}</div>
                            </template>
                          </el-table-column>
                        </div>
                      </el-table-column>
                      <el-table-column
                        prop="curStatus"
                        label="状态"
                        show-overflow-tooltip
                        width="100"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <el-tag v-if="scope.row.curStatus==1" type="success ">进行中</el-tag>
                          <el-tag type="warning" v-if="scope.row.curStatus==2">已结束</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column fixed="right" label="操作" width="100" align="center">
                        <template slot-scope="scope">
                          <!-- <el-button type="primary" size="small" @click="">编辑</el-button> -->
                          <el-button type size="small" @click="view('dialogForm',scope.row)">查看</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <el-pagination
                      background
                      class="text-right mart10"
                      small
                      layout="total, sizes, prev, pager, next"
                      :current-page="searchForm.pageNum"
                      :page-sizes="searchForm.pageSizes"
                      :page-size="common.elementPagination.pageSizeDefault"
                      :total="tableData.total"
                      @size-change="pageSizeChange"
                      @current-change="pageCurrentChange"
                    ></el-pagination>
                  </el-main>
                </el-container>
              </el-card>
            </el-col>
            <!-- 党组织导航列表内容 -->
            <el-col :span="4">
              <el-card class="marb20 content-wrap-box">
                <!-- 工作记录总览数据  -->
                <el-tree
                  :load="loadNode"
                  lazy
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                  style="height:calc(100vh - 243px)"
                ></el-tree>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      orgId: Number(sessionStorage.getItem("Access-OrgId"))
        ? Number(sessionStorage.getItem("Access-OrgId"))
        : 1,
      selectedOrg: this.$route.query.selectOrg
        ? this.$route.query.selectOrg
        : Number(sessionStorage.getItem("Access-OrgId")),
      selectedForm: this.$route.query.selectedForm,
      selectedFormName: this.$route.query.selectedFormName,
      typeName: this.$route.query.typeName,
      formDate: {},
      tableData: [],
      //内部数据
      orgTree: [],
      //组织树数据绑定设置
      defaultProps: {
        nochild: "below",
        children: "children",
        label: "name"
      },
      options: [
        { value: false, label: "审批中" },
        { value: true, label: "已完成" }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      searchForm: { pageSize: 10, pageNum: 1 },
      value: null,
      value1: [
        new Date().getTime() - 3600 * 1000 * 24 * 90,
        new Date().getTime()
      ]
    };
  },
  mounted() {
    this.queryFormConfig();
    this.queryFormHistery();
  },
  methods: {
    /**
     * 分页
     * @author chuanlin.Xiao
     * @date   2020-01-06T10:13:24+0800
     * @param  {[type]}                 val [description]
     * @return {[type]}                     [description]
     */
    pageSizeChange(val) {
      this.searchForm.pageSize = val;
      this.searchForm.pageNum = 1
      this.queryFormHistery();
    },
    pageCurrentChange(val) {
      this.searchForm.pageNum = val;
      this.queryFormHistery();
    },
    /**
     * 监听到统计数据的查询条件
     * @return
     */
    onChange() {
      this.searchForm.pageNum = 1;
      this.queryFormHistery();
    },
    /**
     * 监听到统计数据的查询条件
     * @return
     */
    onTimeChange() {
      // 当时间发生改变时重置页码
      this.searchForm.pageNum = 1;
      this.queryFormHistery();
    },
    /**
     * 监听到统计数据的查询条件
     * @return
     */
    onStatusChange() {
      // 当状态发生改变时重置页码
      this.searchForm.pageNum = 1;
      this.queryFormHistery();
    },
    /**
     * 查询表单配置的属性配置
     */
    queryFormConfig() {
      let query = this.$route.query.selectedForm;
      this.axios
        .get(
          `${this.common.basePath}/workRecord/first/form?processDefKey=${query}`
        )
        .then(response => {
          this.formDate = response.data.formData;
          // let form_list = response.data.formData
          // this.form_list = this.common.returnActivitiFormList(form_list);
          this.isLoad = false;
        })
        .catch(errorMsg => {
          this.isLoad = false;
          this.form_list = [];
          this.$message.error(errorMsg);
        });
    },
    /**
     * 查询表单填报历史
     */
    queryFormHistery() {
      let url = `${this.common.basePath}/workflow/instance/history`;
      let form = {
        pageNum: this.searchForm.pageNum
          ? this.searchForm.pageNum
          : this.common.elementPagination.pageNum,
        pageSize: this.searchForm.pageSize
          ? this.searchForm.pageSize
          : this.common.elementPagination.pageSize,
        finish: this.value,
        beginTime: this.value1
          ? this.value1[0]
          : new Date().getTime() - 3600 * 1000 * 24 * 90,
        endTime: this.value1 ? this.value1[1] : new Date().getTime()
      };
      form.keyList = [this.selectedForm];
      if (this.selectedOrg) {
        form.processVariables = {
          createOrg: Number(this.selectedOrg)
        };
      } else {
        form.processVariables = {
          createOrg: Number(sessionStorage.getItem("Access-OrgId"))
        };
      }

      this.axios
        .post(url, form)
        .then(response => {
          this.tableData = response.data
            ? response.data
            : { rows: [], total: 0 };
          this.isLoad = false;
        })
        .catch(errorMsg => {
          this.isLoad = false;
          this.$message.error(errorMsg);
        });
    },
    resolveTopnode(node, resolve) {
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
          resolve([
            { id: this.orgInfo.id, name: this.orgInfo.name, nochild: false }
          ]);
        })
        .catch(errorMsg => {
          this.isLoad = false;
          this.$message.error(errorMsg);
        });
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.resolveTopnode(node, resolve);
      } else if (node.level > 0) {
        this.axios
          .post(`${this.common.basePath}/org/children`, {
            orgId: node.data.id,
            orgType: 1
          })
          .then(response => {
            if (response.data.rows) {
              let childNode = response.data.rows.map((item, i) => {
                item.nochild = item.below;
                return item;
              });
              resolve(childNode);
            } else {
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
    },
    handleNodeClick(data) {
      this.selectedOrg = data.id;
      // 党组织发生切换时重置页码
      this.searchForm.pageNum = 1;
      this.queryFormHistery();
    }
  }
};
</script>

<style>
</style>