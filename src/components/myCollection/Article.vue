/*************** 我的收藏 - 文章资讯 *************/
<template>
  <div>
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline search-box marb20">
      <el-form-item label="" prop="keyWords" label-width='0'>
        <el-input v-model="searchForm.keyWords" placeholder="" style="width: 400px" placeholder="请输入标题、关键字查询"></el-input>
      </el-form-item>
      <el-form-item label="发布时间：" prop="searchDateRange" class="marl20">
        <el-date-picker
          v-model="searchForm.searchDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="emptyForm('searchForm')">置空</el-button>
      </el-form-item>
    </el-form>

    <el-card class="padb20">
      <div slot="header" class="clearfix">
        <span>文章列表</span>  
      </div> 
      <div class="article-box"> 
        <el-row class="mart10" v-for="(item, index) in dataList.rows" :gutter="20">
          <el-col :span="16">
            <el-link class="title" :underline="false" 
            @click="$router.push({name: detailPageRouterName, params: {article_id: item.id}})">
             {{item.articleName}}
            </el-link> 
          </el-col>
          <el-col :span="4"><span class="cursor-pointer" @click="goToArticleType(item.articleType)">{{item.articleType}}</span></el-col>
          <el-col :span="4"><span class="date">{{common._convertDate(item.collectTime, 'yyyy-MM-dd')}}</span></el-col>
        </el-row> 
      </div>
      <el-pagination   
         class="fr mart20"
         background
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="common.elementPagination.pageNum"
         :page-sizes="common.elementPagination.pageSizes"
         :page-size="common.elementPagination.pageSizeDefault"
         layout="total, sizes, prev, pager, next"
         :total="dataList.total">
      </el-pagination> 
    </el-card>
  </div> 
</template>

<script> 
  export default {
    props: {
      detailPageRouterName: {
        required: true,
        default: 'SAWCollectionArticleDetail'
      }
    },
    data() {
      return { 
        typeId:           this.$route.params.type_id,
        typeName:         sessionStorage.getItem('articleTypeName'),
        subTypeName:      sessionStorage.getItem('articleSubTypeName'),
        typeKey:          sessionStorage.getItem('articleTypeKey'),
        searchForm: {
          keyWords:        null,          
          beginTime:       null,
          endTime:         null,
          searchDateRange: null,
          pageNum:         this.common.elementPagination.pageNumDefault,
          pageSize:        this.common.elementPagination.pageSizeDefault,
          special:         this.$route.params.type_id, 
          userId:          sessionStorage.getItem('Access-Key'),
        },
        dataList: {rows: [], total: 0},
      }
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
       * 根据当前地址传入的参数名字来做相应的操作
       * @return {[type]} [description]
       */
      goToArticleType(typeName){
        let articleTypeNametemp, articleTypeKey;
        
        switch(typeName){
          case '中央精神':
            articleTypeNametemp = '中央精神';
            articleTypeKey = 'centre';
            break;
          case '政策法规':
            articleTypeNametemp = '政策法规';
            articleTypeKey = 'policies'; 
            break;
          case '领导讲话':
            articleTypeNametemp = '领导讲话';
            articleTypeKey = 'leader'; 
            break;
          case '上级文件':
            articleTypeNametemp = '上级文件';
            articleTypeKey = 'superior'; 
            break;
          case '党建制度':
            articleTypeNametemp = '党建制度';
            articleTypeKey = 'institution'; 
            break;
          case '学习路上':
            articleTypeNametemp = '学习路上';
            articleTypeKey = 'road'; 
            break;
          case '反腐倡廉':
            articleTypeNametemp = '反腐倡廉';
            articleTypeKey = 'corruption'; 
            break;
          case '他山之石':
            articleTypeNametemp = '他山之石';
            articleTypeKey = 'stone'; 
            break;
        }
        sessionStorage.setItem('articleTypeName',articleTypeNametemp);
        sessionStorage.setItem('articleTypeKey',articleTypeKey);

        if(this.detailPageRouterName == 'SAWCollectionArticleDetail'){
          this.$router.push({name: 'SAWTypeArticleList', params: {key_type: articleTypeKey}});
        }else{
          this.$router.push({name: 'PMTypeArticleList', params: {key_type: articleTypeKey}});
        }
        

      },
      /**
       * 按条件搜索列表
       * @return {[type]} [description]
       */
      onSubmit(){
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
        this.axios.post(`${this.common.basePath}/article/collect/list`, this._queryListParams()).then((response) => {
          this.dataList = response.data;
        }).catch((errorMsg) => { 
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
      color: #9E9E9E;
      position: relative;
      top: -4px;
    }
  }
</style>
