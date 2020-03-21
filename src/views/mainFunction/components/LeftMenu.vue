<template>
  <el-menu 
    :default-active="activeNav"
    class="el-menu-vertical-demo" 
    :unique-opened="true"
    @select="navClicked"
    @open="openSubMenu">
    <div v-for="(itemO,indexO) in navJson.mainFunction">
      <div v-if="itemO.children.length>0">
        <el-submenu :index="itemO.indexName" v-show="isHideMenu(itemO.isHideMenu)">
          <template slot="title">
            <i :class="itemO.iconName"></i>
            <span>{{itemO.navName}}</span>
          </template>
          <el-menu-item-group>
            <div v-for="(itemT,indexT) in itemO.children">
              <div v-if="itemT.children.length>0">
                <el-submenu :index="itemT.indexName" v-show="isHideMenu(itemO.isHideMenu)">
                  <template slot="title">
                    <i :class="itemT.iconName"></i>
                    <span>{{itemT.navName}}</span>
                  </template>
                  <el-menu-item-group v-for="(item,index) in itemT.children">
                    <el-menu-item :index="item.indexName" v-show="isHideMenu(item.isHideMenu)">
                      <template slot="title">
                        <i :class="item.iconName"></i>
                        <span>{{item.navName}}</span>
                      </template>
                    </el-menu-item>
                  </el-menu-item-group>  
                </el-submenu>
              </div>
              <div v-else>
                <el-menu-item  :index="itemT.indexName" v-show="isHideMenu(itemT.isHideMenu)" v-if="infoMenuName&&taskMenuName">
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
        <el-menu-item :index="itemO.indexName" v-show="isHideMenu(itemO.isHideMenu)" class="el-menu-item-level-one">
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
      partyNature:null,
    },
    data(){
      return {
        navJson
        // activeNav:        this.$route.name || '',
        // partyNature:      this.$store.state.partyNature ? this.$store.state.partyNature : sessionStorage.getItem('partyNature'), //组织类型
      }
    },
    computed: {
      /**
       * 组织信息根据不同类型，返回不同的名字
       * @return {[type]} [description] 
       * orgType ("组织类别1.机构2.部门")
       * partyNature ("下属机构类型。1.是党委2.是支部3.是党小组")
       */
      infoMenuName(){   
        if(this.partyNature == 1){
          return '党委信息'
        }else if(this.partyNature == 2){
          return '支部信息'
        }else if(this.partyNature == 3){
          return '党小组信息'
        }else{
          return false //如果返回false 直接该行栏目都隐藏掉
        }
      }, 
      taskMenuName(){
        if(this.partyNature == 1){
          return '组织任务'
        }else if(this.partyNature == 2 || this.partyNature == 3){
          return '任务'
        }

        return false; //如果返回false 直接该行栏目都隐藏掉
      },
    },
    watch: { 
    },
    methods: {
      navClicked(val){  
        if(val == 'mainFunctionTeamManagement'){
          this.$router.push({name: val, params: {org_id: sessionStorage.getItem('Access-OrgId'),party_nature:sessionStorage.getItem('partyNature')}});
        }else {
          this.$router.push({name: val});
        }
        
      },
      /**
       * 打开子菜单，前往数据总览页面
       * @author chuanlin.Xiao
       * @date   2020-03-19T13:46:48+0800
       * @param  {[type]}                 val  [description]
       * @param  {[type]}                 path [description]
       * @return {[type]}                      [description]
       */
      openSubMenu(val,path){
        if(this.common.pageJson[val]===undefined){return}
        this.$router.push({ path: '/mainfunction/result',query:{ val:val } })
      },
      /**
       * 需要隐藏的栏目
       * @param  {[type]}  arrayAuthority 传入需要隐藏的类型Id数组
       * @return {Boolean}   true为需要显示， false为不显示；
       * 1 党委 2 支部 3 党小组
       */
      isHideMenu(arrayAuthority){  
        let bool = true; 
        arrayAuthority.map( item => {
          if(item == this.partyNature){
            bool = false;
          }
        })
        return bool;
      }
    }
  }
</script>