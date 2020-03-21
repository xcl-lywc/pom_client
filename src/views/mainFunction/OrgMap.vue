/************ 党建地图 ***********/
<template>
  <div class="content-wrap"> 
    <div class="content-wrap-box">
      <el-card class="content-title-card" shadow="never">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{name: 'mainFunctionHome'}">首页</el-breadcrumb-item>
          <el-breadcrumb-item>党建地图</el-breadcrumb-item> 
        </el-breadcrumb>
      </el-card>
      <div class="theme-main">
        <!-- 党员信息 -->
        <el-card>
          <div slot="header" class="clearfix" v-loading="isLoad">
            <span>党建地图</span> 
          </div>
          <div id="allmap" style="width: 100%; height: calc(100vh - 260px);"></div>
        </el-card> 
      </div>
    </div>
  </div> 
</template>

<script> 
  import LeftMenu from './components/LeftMenu'  
  import mapGif from '../../assets/img/mapGif1.gif'
  export default {
    data() {
      return {
        isLoad:         false,
        orgId:          sessionStorage.getItem('Access-OrgId'), 
        currentId:      this.$route.params.areaid,
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
      this.queryMapLocation();
    },
    methods: {
      map(mapLocation){
        // 百度地图API功能
        var map = new BMap.Map("allmap");
        var point = new BMap.Point(mapLocation[0].longitude,mapLocation[0].latitude);
        map.centerAndZoom(point, 11); 
        map.enableScrollWheelZoom();
        map.enableDragging();

        // 地图添加标注
        for (let item in mapLocation){
          let orgInfo = mapLocation[item];
          var point = new BMap.Point(orgInfo.longitude ,orgInfo.latitude);
          debugger
          this.addMarker(map, point,orgInfo);
        }
      },
      /**
       * 编写自定义函数,创建标注 
       * @param {[type]} point [description]
       */
      addMarker(mapObj, pointObj,orgInfo){
        var sContent =
	"<h4 style='margin:0 0 5px 0;padding:0.2em 0'>"+orgInfo.name+"</h4>" + 
	"<img style='float:right;margin:4px' id='imgDemo' src='"+orgInfo.photo+"' width='139' height='104' title='组织图片'/>" + 
	"<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>"+orgInfo.description+"</p>" + 
  "</div>";
        var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
        //var myIcon = new BMap.Icon("/jsdemo/img/fox.gif", new BMap.Size(300,157));
        var myIcon = new BMap.Icon(mapGif, new BMap.Size(53,53));
            //myIcon.setImageSize(new BMap.Size(50,52));
        var marker = new BMap.Marker( pointObj, {icon: myIcon} );
        marker.addEventListener("click", function(){          
	        this.openInfoWindow(infoWindow);
	        //图片加载完毕重绘infowindow
	        document.getElementById('imgDemo').onload = function (){
		        infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
	        }
	      });
        mapObj.addOverlay(marker);
      },
      /**
       * 全国地图数据
       * @return {[type]} [description]
       */
      queryMapLocation(){
        this.axios.get(`${this.common.basePath}/org/mapCity?currentId=`+this.currentId, {}).then( (response) => {
          let mapLocationList = response.data instanceof Array ? response.data : [];
          this.map(mapLocationList);
        }).catch( (error) => {
          this.$message.error(error);
        });
      }
    },
  }
</script>

<style scoped lang="less"> 
  .el-menu{
    border-right: none!important;
    width: 250px;
  }
</style>
