/************ 饼图 ***********/
<template>
  <div :style="{ width:chartWidth, height: chartHeight }" ref="myEchart"></div> 
</template>

<script>
  import echarts from "echarts"; 
  import '../../../node_modules/echarts/map/js/china.js' // 引入中国地图数据
   
  export default {
    props:{
      chartWidth: {
        default: "100%",
        required: true,
      },
      chartHeight: {
        default: "300px",
        required: true,
      },
      seriesData : {
        required: true,
        default: [],
      }
    },
    data() {
      return { 
      }
    },
    components: {  
    },
    watch: {
      seriesData(){
        this.chinaConfigure();
      }
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
        myChart.setOption({
            title: {
                text: '年龄分布图',
                subtext: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b} : {c} ({d}%)'
            },
            legend: { 
                bottom: 10,
                left: 'center',
                data: ['西凉', '益州', '兖州', '荆州', '幽州']
            },
            series: [
                {
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '50%'],
                    selectedMode: 'single',
                    data: this.seriesData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }); 
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
