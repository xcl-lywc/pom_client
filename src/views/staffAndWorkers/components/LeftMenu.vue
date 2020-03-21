<!-- 职工 -->
<template>
	<el-menu 
    :default-active="activeNav"
    class="el-menu-vertical-demo" 
    :unique-opened="true"
    @select="navClicked">
    <div v-for="(itemO,indexO) in navJson.staffAndWorkers">
      <div v-if="itemO.children.length>0">
        <el-submenu :index="itemO.indexName">
          <template slot="title">
            <i :class="itemO.iconName"></i>
            <span>{{itemO.navName}}</span>
          </template>
          <el-menu-item-group>
            <div v-for="(itemT,indexT) in itemO.children">
              <div v-if="itemT.children.length>0">
                <el-submenu :index="itemT.indexName">
                  <template slot="title">
                    <i :class="itemT.iconName"></i>
                    <span>{{itemT.navName}}</span>
                  </template>
                  <el-menu-item-group v-for="(item,index) in itemT.children">
                    <el-menu-item :index="item.indexName" >
                      <template slot="title">
                        <i :class="item.iconName"></i>
                        <span>{{item.navName}}</span>
                      </template>
                    </el-menu-item>
                  </el-menu-item-group>  
                </el-submenu>
              </div>
              <div v-else>
                <el-menu-item  :index="itemT.indexName">
                  <template slot="title">
                    <i :class="itemT.iconName"></i>
                    <span v-if="itemT.indexName=='mainFunctionInfo'">{{infoMenuName}}</span>
                    <span v-else-if="itemT.indexName=='PartyCommitteeDownTask'">{{taskMenuName}}</span>
                    <span v-else-if="itemT.indexName=='CAWorkPlan'">{{['','党委','党支部'][Number(partyNature)]}}{{itemT.navName}}</span>
                    <span v-else-if="itemT.indexName=='CAWorkSummary'">{{['','党委','党支部'][Number(partyNature)]}}{{itemT.navName}}</span>
                    <span v-else>{{itemT.navName}}</span>
                  </template>
                </el-menu-item>
              </div>
            </div>
          </el-menu-item-group>
        </el-submenu>
      </div>
      <div v-else>
        <el-menu-item :index="itemO.indexName" class="el-menu-item-level-one">
          <i :class="itemO.iconName"></i>
          <span slot="title">{{itemO.navName}}</span>
        </el-menu-item>
      </div>
    </div>
  </el-menu>
</template>
<script>
  import navJson from '../../../plugins/navJson.json'
  export default{
    props: {
      activeNav: null,
    },
    data(){
      return {
        navJson
        // activeNav:        `${this.$route.name}${this.$route.params.key_type ? '/' + this.$route.params.key_type : ''}` || '',
      }
    },
    methods: {
      navClicked(val){ 
        if(val.includes('SAWTypeArticleList')){
          this.$router.push({name: 'SAWTypeArticleList', params: {key_type: val.split('/')[1]}});
        }else{
          this.$router.push({name: val});
        }
      }
    }
  }
</script>