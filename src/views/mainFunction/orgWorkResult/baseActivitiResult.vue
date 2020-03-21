<template>
<el-row>
  <el-card class="mard20">
    <div slot="header" class="clearfix">
      <span>{{activitiInfo.option_name}}</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="onMoreinfoClick">更多</el-button>
    </div>
    <el-row>
      <!-- 查询条件 -->
      <el-col>
        <el-form :inline="true">
          <el-form-item label="状态">
            <el-select v-model="value" placeholder="请选择" @change="onChange">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期区间">
            <el-date-picker
              v-model="value1"
              value-format="timestamp"
              @change="onChange"
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
      </el-col>
      <!-- 表单内容 -->
      <el-col>
        <el-table :data="tableData.rows" stripe border style="width: 100%">
          <el-table-column fixed label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column
            prop="endTime"
            label="创建时间"
            show-overflow-tooltip
            width="150"
            align="center"
          >
            <template slot-scope="scope">{{common._convertDate(scope.row.beginTime, 'yyyy-MM-dd')}}</template>
          </el-table-column>
          <el-table-column label="工作记录表" align="center">
            <div v-for="(item,index) in formDate" :key=index>
              <el-table-column
                prop="processVariables"
                :label="item.obj.label"
                show-overflow-tooltip
                width
                align="center"
                v-if="item.obj.type!='uploads'"
              >
                <template slot-scope="scope">
                  <div v-if="item.obj.type=='slider'">{{scope.row.processVariables[item.obj.name]}}%</div>
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
          <el-table-column prop="curStatus" label="状态" show-overflow-tooltip width="100"  align='center'>
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
      </el-col>
    </el-row>
  </el-card>

  <!-- 详情 -->
  <el-dialog title="详情" :visible.sync="dialogVisible" width="800px">
    <el-form v-if="dialogForm" ref="dialogForm"  :model="dialogForm" label-width="100px" v-loading="dialogLoading">
      <el-row>
        <el-col :span="24">
          <el-form-item 
            label="名称：">
            {{dialogForm.processDefinitionName}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item 
            label="开始时间：">
            {{common._convertDate(dialogForm.beginTime, 'yyyy/MM/dd')}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item 
            label="截止时间：">
            {{common._convertDate(dialogForm.endTime, 'yyyy/MM/dd')}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item 
            label="状态：">
            <el-tag v-if="dialogForm.curStatus==1" type="success ">进行中</el-tag>
            <el-tag type="warning" v-if="dialogForm.curStatus==2">已结束</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item 
            label="工作记录：">
            <form-info :data='dialogForm' :type='2'></form-info>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</el-row>
</template>

<script>
import FormInfo from "../../../components/CostomFormInfo.vue"
export default {
  data() {
    return {
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
      value: null,
      value1: [new Date().getTime() - 3600 * 1000 * 24 * 90, new Date().getTime()],
      activitiKey: "ser",
      tableData: {},
      formDate: [],

      // 详情
      dialogVisible:false,
      dialogLoading:false,
      dialogForm:   null,
    };
  },
  components:{
    FormInfo
  },
  props: {
    orgInfo: {
      type: Object,
      required: true
    },
    activitiInfo: {
      type: Object,
      required: true
    },
    typeName: {
      type: String,
      required: true,
    }
  },
  watch: {
    orgInfo: function(val){
      this.query1();
      this.queryActivityList();

    }
  },
  mounted(){
    this.query1();
    this.queryActivityList();
  },
  methods: {
    onMoreinfoClick(){
      this.$router.push({ path: '/mainfunction/moreResult',query:{ selectedFormName:this.activitiInfo.option_name,typeName:this.typeName,selectedForm:this.activitiInfo.processDefKey} })

    },
    /**
     * 查看详情
     * @author chuanlin.Xiao
     * @date   2019-12-24T16:50:07+0800
     * @param  {[type]}                 formName [description]
     * @param  {[type]}                 data     [description]
     */
    view(formName,data){
      // console.log(data)
      this.dialogVisible = true;
      this.dialogLoading = true;
      this.dialogForm = JSON.parse(JSON.stringify(data))
      this.dialogLoading = false;
    },

    onChange() {
      console.log(this.value1)
      this.queryActivityList();
    },
    /**
       * 通过processDefKey，获取创建表的流程表单
       * @author chuanlin.Xiao
       * @date   2019-12-24T16:18:28+0800
       * @return {[type]}                 [description]
       */
      query1() {  
        let that = this;
        let query = ''
        query = this.activitiInfo.processDefKey;
        if(query===undefined){return}
        this.axios.get(`${this.common.basePath}/workRecord/first/form?processDefKey=${query}`).then((response) => { 
          this.formDate = response.data.formData
          // let form_list = response.data.formData
          // this.form_list = this.common.returnActivitiFormList(form_list);
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.form_list = []
          this.$message.error(errorMsg);
        }) 
      }, 
      /**
       * 查询历史数据
       */
    queryActivityList() {
      let url = `${this.common.basePath}/workflow/instance/history`;
      let form = {
        pageNum: 0,
        pageSize: 5,
        finish: this.value,
        beginTime: this.value1?this.value1[0]:new Date().getTime() - 3600 * 1000 * 24 * 90,
        endTime: this.value1?this.value1[1]:new Date().getTime(),
      };
      form.keyList = [this.activitiInfo.processDefKey];
      form.processVariables = {
        createOrg: Number(this.orgInfo.id)
      };
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
    }
  }
};
</script>

<style>
</style>