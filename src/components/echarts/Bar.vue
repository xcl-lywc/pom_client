/************ 柱状图 ***********/
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
      xAxisData:{
        type:Array,
        default:function(){
          return []
        },
      },
      seriesData:{
        type:Array,
        default:function(){
          return []
        },
      },
    },
    data() {
      return { }
    },
    components: {  
    },
    watch: {
      xAxisData(newValue, oldValue) {//监听数据变化
        this.xAxisData = newValue
        this.chinaConfigure()
  　　　},
      seriesData(newValue, oldValue) {//监听数据变化
        this.seriesData = newValue
        this.chinaConfigure()
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
        myChart.setOption({
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: this.xAxisData,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '分数',
                    type: 'bar',
                    barWidth: '60%',
                    data: this.seriesData
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

