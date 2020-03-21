/************ 中国地图 ***********/
<template>
  <div :style="{ width:chartWidth, height: chartHeight }" ref="myEchart"></div> 
</template>

<script>
  import echarts from "echarts"; 
  import '../../../node_modules/echarts/map/js/china.js' // 引入中国地图数据
  import imgPath from '../../assets/img/hongqi.jpg'
  export default {
    props:{
      chartWidth: {
        default: "100%",
        required: false,
      },
      chartHeight: {
        default: "400px",
        required: false,
      },
      mapData:{ 
        type:    Array,
        default: [],
        required: true,
      }
    },
    data() {
      return { 
      }
    },
    components: {  
    },
    watch: {
      mapData(){
        this.chinaConfigure();
      },
    },
    created () { 
    },
    mounted() {  
      this.chinaConfigure();
    },
    methods: { 
      chinaConfigure() {  
        let myChart = echarts.init(this.$refs.myEchart); //这里是为了获得容器所在位置    
        window.onresize = myChart.resize;
        myChart.setOption({ // 进行相关配置
          backgroundColor: "#FFF",
          tooltip: { 
            trigger: 'item',
            formatter: (params,ticket,callback) => {
              // debugger 
              return `${params.name}: ${params.data.value.size || 0}个党委`
            },
          }, // 鼠标移到图里面的浮动提示框
          dataRange: {
            show: false,
            min: 0,
            max: 1000,
            text: ['High', 'Low'],
            realtime: true,
            calculable: true,
            color: ['orangered', 'yellow', 'lightskyblue']
          },
          geo: { // 这个是重点配置区
            map: 'china', // 表示中国地图
            zoom: 1.25,
            roam: true,
            label: {
              normal: {
                show: true, // 是否显示对应地名
                textStyle: {
                  color: 'rgba(0,0,0,0.4)'
                }
              }
            },
            itemStyle: {
              normal: {
                borderColor: 'rgba(0, 0, 0, 0.2)'
              },
              emphasis: {
                areaColor: null,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
          series: [
            {
              type: 'scatter',
              coordinateSystem: 'geo' // 对应上方配置
            },
            {
              name: '启动次数', // 浮动框的标题
              type: 'map',

              geoIndex: 0,
              data: this.mapData,
            },
            {
              type: 'custom',
              coordinateSystem: 'geo',
              silent: true,
              renderItem: (params, api) => { 
                return {
                    type: 'image', 
                    style: {
                      image: this.mapData[params.dataIndex].value.size ? imgPath : "" ,
                      width: 20,
                      x: api.coord([
                          this.mapData[params.dataIndex] ? this.mapData[params.dataIndex].value.lon : '', 
                          this.mapData[params.dataIndex] ? this.mapData[params.dataIndex].value.lat : ''
                      ])[0],
                      y: api.coord([
                          this.mapData[params.dataIndex] ? this.mapData[params.dataIndex].value.lon : '', 
                          this.mapData[params.dataIndex] ? this.mapData[params.dataIndex].value.lat : ''
                      ])[1]
                    }
                };
              },
              data: this.mapData,
            }
          ]
        }); 

        // 处理点击事件并且跳转相对应的页面
        myChart.on('click',  (params) => {
          this.$router.push({name: 'OrgMap', params: {areaid: params.data.id}}) 
        });
      },
      _dataJson(){
        return [{
          "id":   "1-1",
          "name": "北京",
          "value": [116.405285, 39.904989, 2]
        }, {
          "id":   "1-1",
          "name": "上海",
          "value": [121.472644, 31.231706, 6]
        }]
      },
    },
  }
</script>

<style scoped lang="less"> 
  .el-menu{
    border-right: none!important;
    width: 250px;
  }
</style>
