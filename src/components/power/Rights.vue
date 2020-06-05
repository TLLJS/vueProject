<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
             <el-table :data="rightList" style="width: 100%" stripe border class="table">
                 <!-- 索引列 -->
                <el-table-column type='index' label="序号" ></el-table-column>
                <el-table-column prop="authName" label="权限名称" ></el-table-column>
                <el-table-column prop="path" label="路径" ></el-table-column>
                <!-- 只要想自定义标签内部的显示方式（也就是说只要想在标签内部插入内容） 就使用作用域插槽 -->
                <el-table-column prop="level" label="权限等级">
                    <template slot-scope="scopes">
                        <el-tag v-if="scopes.row.level=='0'">一级</el-tag>
                        <el-tag v-else-if="scopes.row.level=='1'" type="success">二级</el-tag>
                        <el-tag v-else-if="scopes.row.level=='2'" type="warning">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return{
            // 权限列表数据
            rightList:[]
        }
    },
    created(){
        this.getrightList()
    },
    methods:{
        async getrightList(){
            const {data:res}=await this.axios.get('rights/list')
            if(res.meta.status!==200){
                return this.message.error("获取用户权限列表失败");
            }
            this.rightList=res.data;
            console.log(this.rightList)
        }
    }
}
</script>
<style scoped>
.table{
  font-size: 12px;
}
</style>