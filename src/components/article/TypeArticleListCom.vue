/*************** (类型不同显示的名字不同) *************/
<template>
  <div>
    <!-- <el-input placeholder="请输入内容" v-model="keyWords" class="input-with-select marb20"> 
      <el-button slot="append" icon="el-icon-search" @click="getQueryList"></el-button>
    </el-input> -->
    <el-card v-for='(item, index) in dataList' :key="index" class="marb20" v-loading="isLoad">
      <div slot="header" class="clearfix">
        <span>{{item.name}}</span> 
        <el-button 
          class="el-card-head-btn" type="text" 
          @click="goToPage({name: item.name, id: item.id})">更多</el-button>
      </div> 
      <div class="article-box" v-if="item.childrens">   
        <p class="mart10" v-for="(itemA, indexA) in item.childrens.rows" :key="indexA">
          <el-link class="title" :underline="false" 
            @click="$router.push({name: detailPageRouterName, params: {type_id: item.id, article_id: itemA.id}})">
             {{itemA.articleName}}
          </el-link> 
          <span class="date">{{common._convertDate(itemA.createTime, 'yyyy-MM-dd')}}</span>
        </p> 
      </div>
    </el-card>
  </div>
</template>

<script> 
  export default {
    props: {
      listPageRouterName: {  //列表页跳转路由Name
        default: 'SAWArticleList',
        required: true,
      },
      detailPageRouterName: {   //详情页跳转路由Name
        default: 'SAWArticleDetail',
        required: true,
      },
      orgId: {
        default: sessionStorage.getItem('Access-OrgId'), 
        required: true,
      }
    },
    data() {
      return { 
        isLoad:      true,
        keyType:     this.$route.params.key_type,  
        keyWords:    null, 
        dataList:    [],
      }
    },
    components: {  
    },
    computed: { 
    },
    watch: {
    },
    created () { 
    },
    mounted() {
      //------------ 从职工首页进入 ------------
      if(this.listPageRouterName == 'SAWArticleList') {
        this.initArticle([{id: 1, name: '中铁二局集团公司党委'}])
      }else{
        this.findAllPartCommitteeSuperior();
      } 
    },
    methods: {
      findAllPartCommitteeSuperior(){
        this.isLoad = true;
        this.axios.post(`${this.common.basePath}/party/oneByUserId?id=${sessionStorage.getItem('Access-Key')}`).then((r) => {
          this.axios.get(`${this.common.basePath}/org/findAllPartCommitteeSuperior`, {params: {id: r.data.party_committee_id}}).then((response) => {
            this.initArticle(response.data);
            this.isLoad = false;
          }).catch((errorMsg) => {
            this.isLoad = false; 
            this.$message.error(errorMsg)
          }) 
        }).catch((errorMsg) => {
          this.isLoad = false; 
          this.$message.error(errorMsg)
        })
          
      },
      initArticle(response){
        response.forEach( (item,index) => {
          item.childrens = [];
          this.getQueryList(item, index);
        })
        this.dataList = response;
      }, 
      /**
       * 查询列表
       * @return {[type]} [description]
       */
      getQueryList(item,index){   
        this.isLoad = true;
        this.axios.post(`${this.common.basePath}/${this.keyType}/article/list/ed`, {special: '', partyOrgId: item.id,keyWords: this.keyWords}).then((response) => {
          item.childrens = response.data; 
          this.isLoad = false;
        }).catch((errorMsg) => {
          this.isLoad = false; 
          this.$message.error(errorMsg)
        })  
      }, 
      goToPage(item){ 
        this.$router.push({name: this.listPageRouterName, params: {type_id: item.id}});
        sessionStorage.setItem('articleSubTypeName', item.name);
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
