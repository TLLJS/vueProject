<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div id="echarsa" style="width: 700px;height:400px;"></div>
        </el-card>
    </div>
</template>
<script>
// 导入echarts
 import echarts from 'echarts'
// 导入loash合并对象
import _ from 'lodash'
export default {
    data(){
        return{
             options: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#E9EEF3'
                    }
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
                    boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                    type: 'value'
                    }
                ]
        }
        }
    },
    async mounted(){
        // 由于在created阶段DOM元素还没有被渲染，所以要在mounted中显示图表
        // 基于准备好的dom，初始化echarts实例
         var mycharts=echarts.init(document.getElementById('echarsa'))
         const{data:res}=await this.axios.get('reports/type/1')
            if(res.meta.status!==200){
                this.message.error("获取报表数据失败")
            }
        // 指定图表的配置项和数据
         const obj=_.merge(res.data,this.options)
        // 使用刚指定的配置项和数据显示图表。
         mycharts.setOption(obj);
    },
}
</script>
<style scoped>

</style>