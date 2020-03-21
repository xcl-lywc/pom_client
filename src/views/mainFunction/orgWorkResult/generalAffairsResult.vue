/*************综合事务      工作记录完成情况详情查询页面 *****************************************************/
<template>
  <div class="content-wrap">
    <div class="content-wrap-box">
      <!-- 工作记录总览数据  -->
      <el-card class="marb20">
        <div slot="header" class="clearfix">
          <span>数据总览</span>
        </div>
        <el-container>
          <!-- 搜索条件-->
          <el-header>
            <el-form>
              <el-form-item label="日期区间">
                <el-date-picker
                  v-model="value1"
                  value-format="timestamp"
                  @change="onChangeCount"
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
          <!--表格内容-->
          <el-main>
            <el-table :data="workRecordData" style="width: 100%">
              <el-table-column prop="name" label="记录名称" fixed></el-table-column>
              <div v-for="(item,index) in activitiConfig" :key="index">
                <el-table-column :prop="'label'+(index+1)" :label="item.option_name"></el-table-column>
              </div>
            </el-table>
          </el-main>
        </el-container>
      </el-card>
      <!-- 党委工作规划 -->
      <div v-for="(item,index) in activitiConfig" :key="index">
        <activitiResult :activitiInfo="item" :orgInfo="orgInfo" :typeName="typeName" class="marb20"></activitiResult>
      </div>
    </div>
  </div>
</template>
<script>
import activitiResult from "./baseActivitiResult.vue";
export default {
  data() {
    return {
      //环境依赖参数
      orgInfo: {},
      activitiConfig: [
        { key: "ser", name: "党委工作记录", properties: "label1" },
        { key: "ser2", name: "党委工作总结", properties: "label1" }
      ],
      assessKey: Number(sessionStorage.getItem("Access-Key")),

      //组织树数据绑定设置
      workRecordData: [],
      //日期区间选择表单
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
      //日期默认值设置-开始时间
      value1: [new Date().getTime() - 3600 * 1000 * 24 * 90 ,new Date().getTime()],

      val:this.$route.query.val,// val
    };
  },
  components: {
    activitiResult
  },
  mounted() {
     this.queryWorkKeyList();
     this.queryWorkRecordOverview();
  },
  props: {
    currentOrg:{
    type: Object,
    required: true,
  },typeName:{
    type: String,
    required: true,
  }},
  watch: {
    currentOrg: function(orgNode) {
      this.orgInfo = orgNode;
      this.queryWorkRecordOverview();
    }
  },
  methods: {
    /**
     * 监听到统计数据的查询条件
     * @return
     */
    onChangeCount() {
      this.queryWorkRecordOverview();
    },

    /**
     * 初始化当前页面展示统计项
     */
    queryWorkKeyList(){
      let params = {};
      let url = this.common.basePath+'/workflow/option/find_list?menuId='+this.common.pageJson[this.val].id;
      this.axios.post(url,params).then(response => {
        this.activitiConfig = response.data;
      })
    },

    /**
     * 查询工作记录概况
     * @return {[type]} [description]
     */
    queryWorkRecordOverview() {
      let params = {
        partyOrgId: Number(this.orgInfo.id),
        menueGroupId: this.common.pageJson[this.val].id,
        beginTime: this.value1 ? this.value1[0] : new Date().getTime() - 3600 * 1000 * 24 * 90,
        endTime: this.value1
          ? this.value1[1]
          : new Date()
      };
      this.axios
        .post(`${this.common.basePath}/workflow/instance/count/custom`, params)
        .then(response => {
          let data = response.data;
          if (data) {
            data.map((item, i) => {
              if (i === 0) {
                item.name = "总数";
              } else if (i === 1) {
                item.name = "进行中";
              } else {
                item.name = "积分";
              }
            });
          }
          this.workRecordData = data ? data : [];
          this.isLoad = false;
        })
        .catch(errorMsg => {
          this.isLoad = false;
          this.$message.error(errorMsg);
        });
    }
  }
};
</script>