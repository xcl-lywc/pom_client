/*************** 政策法规 *************/
<template>
  <div>
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline search-box marb20">
      <el-form-item label="" prop="keyWords" label-width='0'>
        <el-input v-model="searchForm.keyWords" placeholder="" style="width: 400px" placeholder="请输入标题、关键字查询"></el-input>
      </el-form-item>
      <el-form-item label="时间：" prop="searchDateRange" class="marl20">
        <el-date-picker
          v-model="searchForm.searchDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
        <el-button type="primary" @click="emptyForm('searchForm')">置空</el-button>
      </el-form-item>
    </el-form> 
    <el-card class="padb20" v-loading="isLoad">
      <div slot="header" class="clearfix">
        <span>文件列表</span>  
      </div> 
       <el-table
        fixed="right"
        :row-key="getTableRowKeys"
        ref="tableRef"
        :data="tableData.rows"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="articleName"
          label="标题" >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="100">
          <template slot-scope="scope">
            {{common._convertDate(scope.row.createTime, 'yyyy-MM-dd')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createName"
          width="200"
          label="上传人">
        </el-table-column>
        <el-table-column
          prop="address"
          width="290"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click=" goToCheckDetail(scope.row.id) ">查看</el-button>
            <el-button v-if="scope.row.curStatus != 2" type="primary" size="mini" @click=" goToEditArticle(scope.row.id) ">编辑</el-button>
            <el-button v-if="scope.row.curStatus != 2" type="primary" size="mini" @click=" release(scope.row.id) ">发布</el-button>
            <el-button type="danger" size="mini" @click=" delById(scope.row.id) ">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination   
         class="fr mart20"
         background
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="common.elementPagination.pageNum"
         :page-sizes="common.elementPagination.pageSizes"
         :page-size="common.elementPagination.pageSizeDefault"
         layout="total, sizes, prev, pager, next"
         :total="tableData.total">
      </el-pagination> 
      <p class="mart20">
        <el-button type="primary" @click=" goToCreateArticle ">上传</el-button>
        <el-button type="danger" @click=" delBatch(multipleCheckValue) ">删除</el-button>
      </p>
    </el-card>
  </div>  
</template>

<script>
  import LeftMenu from '../components/LeftMenu'
  export default {
    props:{
      requestUrl: {
        default: 'policies',
        required: true,
      }
    },
    data() {
      return { 
        isLoad:      true,
        typeId:      this.$route.params.type_id, 
        searchForm: {
          keyWords:        null,          
          beginTime:       null,
          endTime:         null,
          searchDateRange: null, 
          partyOrgId:      sessionStorage.getItem('Access-OrgId'),
          pageNum:         this.common.elementPagination.pageNumDefault,
          pageSize:        this.common.elementPagination.pageSizeDefault,
        },
        tableData: {rows: [], total: 0},
        multipleCheckValue:  [], //被选中的数据

      }
    },
    components: { 
      LeftMenu
    },
    watch: {
    },
    created () {
    },
    mounted() {
      this.getQueryList();
    },
    methods: {
      /**
       * 指定表单选中的值为id
       * @return {[type]} [description]
       */
      getTableRowKeys(item){ 
        return item.id;
      },
      /**
       * 按条件搜索列表
       * @return {[type]} [description]
       */
      onSubmit(){
        this.searchForm.pageNum = 1;
        this.getQueryList();
      },
      /**
       * 置空
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      emptyForm(formName){ 
        this.$refs[formName] ? this.$refs[formName].resetFields() : '';
        this.searchForm.searchDateRange = null;
      },
      /**
       * 查询列表
       * @return {[type]} [description]
       */
      getQueryList(){  
        this.axios.post(`${this.common.basePath}/${this.requestUrl}/article/list/all`, this._queryListParams()).then((response) => {
          this.tableData = response.data;
          this.isLoad =  false;
        }).catch((errorMsg) => {
          this.isLoad =  false; 
          this.$message.error(errorMsg)
        })  
      },
      _queryListParams(){
        this.searchForm.beginTime = this.searchForm.searchDateRange ? this.searchForm.searchDateRange[0].getTime() : '';
        this.searchForm.endTime = this.searchForm.searchDateRange ? this.searchForm.searchDateRange[1].getTime() : '';
        let params = JSON.parse(JSON.stringify(this.searchForm));
        delete params.searchDateRange;
        return params;
      },
      /*
       * 改变当前页码触发此事件
       * @param {number} val 当前页码
       * @param {string} type studentList为学生列表类型，memberList为所有成员列表 
       */
      handleCurrentChange(val, type){  
        this.searchForm.pageNum = val;
        this.getQueryList(); 
       },
      /*
       * 改变每页条数触发此事件
       * @param {number} val 当前数据
       */
      handleSizeChange(val, type){ 
        this.searchForm.pageSize = val;
        this.getQueryList(); 
       }, 
      /**
       * 发布
       * @return {[type]} [description]
       */
      release(id){
        this.axios.get(`${this.common.basePath}/${this.requestUrl}/release/${id}`, '').then((response) => {
          this.getQueryList();
          this.$message.success(response.meta.message);
        }).catch((errorMsg) => { 
          this.$message.error(errorMsg)
        })  
      },
      /**
       * 指定Id删除
       * @return {[type]} [description]
       */
      delById(id){
        this.axios.delete(`${this.common.basePath}/${this.requestUrl}/delete/${id}`,'').then((response) => {
          this.getQueryList();
          this.$message.success(response.meta.message);
        }).catch((errorMsg) => { 
          this.$message.error(errorMsg)
        })  
      },
      /**
       * 批量删除
       * @return {[type]} [description]
       */
      delBatch(ids){
        this.axios.post(`${this.common.basePath}/${this.requestUrl}/delete/batch`, ids).then((response) => {
          this.getQueryList();
          this.$message.success(response.meta.message);
        }).catch((errorMsg) => { 
          this.$message.error(errorMsg)
        })  
      },
      /**
       * 多选赋值
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      handleSelectionChange(val){
        this.multipleCheckValue = [];
        val.forEach( (item) => {
          this.multipleCheckValue.push(item.id);
        })
      }, 
      /**
       * 跳转编辑新闻页面
       * @return {[type]} [description]
       */
      goToEditArticle(articleId){ 
        sessionStorage.setItem('articleTypeName', this.$route.meta.navName)
        this.$router.push({name: 'CreateArticle', params: {article_id: articleId, article_type: this.requestUrl}});
      },
      /**
       * 跳转新建新闻页面
       * @return {[type]} [description]
       */
      goToCreateArticle(){ 
        sessionStorage.setItem('articleTypeName', this.$route.meta.navName);
        this.$router.push({name: 'CreateArticle', params: {article_id: 'add', article_type: this.requestUrl}});
      },
      /**
       * 查看详情
       * @return {[type]} [description]
       */
      goToCheckDetail(id){ 
        sessionStorage.setItem('articleTypeName', this.$route.meta.navName);
        this.$router.push({name: `${this.requestUrl.replace(this.requestUrl[0],this.requestUrl[0].toUpperCase())}ArticleDetail`, params: {article_id: id}})
      }
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
</style>
