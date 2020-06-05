<template>
    <div>
          <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
        <!-- 添加商品区域 -->
            <el-input placeholder="请输入内容" v-model="querinfo.query" class=" my_input"  clearable @clear='getGoodsList()'>
                <!-- 搜索图标 -->
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
            </el-input>
            <el-button type="primary" class="my_butoon"  @click="addGoods()">添加商品</el-button>
            <!-- 商品列表区域 stripe属性可以创建带斑马纹的表格 border-->
            <el-table :data="goodsList"  stripe border>
                <el-table-column type="index" label="序号" width="50px"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称" ></el-table-column>
                <el-table-column prop="goods_price" label="商品价格(元)" width="110px"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
                <el-table-column  label="创建时间" width="140">
                    <template slot-scope="scoped">
                        {{scoped.row.add_time|dataTime}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130">
                    <template slot-scope="scoped">
                        <el-button type="primary" icon="el-icon-edit"  size='mini'></el-button>
                        <el-button type="danger" icon="el-icon-delete" size='mini' @click="deletegoods(scoped.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="querinfo.pagesize" :page-sizes="[10, 20, 30, 40]"
                :page-size="querinfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="Number(total)">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                // 获取商品列表的查询参数
                querinfo:{
                    query:'',
                    pagenum:1,
                    pagesize:6
                },
                // 商品列表数据
                goodsList:[],
                // 共有多少条商品数据
                total:''
            }
        },
        created(){
            this.getGoodsList()
        },
        methods:{
            async getGoodsList(){
                const{data:res}=await this.axios.get('goods',{params:this.querinfo})
                if(res.meta.status!==200){
                    return this.message.error('获取商品列表失败')
                }
                this.total=res.data.total
                this.goodsList=res.data.goods
            },
            // 监听每页数据条数的变化
            handleSizeChange(newsize) {
                // 根据最新的数据条数向服务器发送请求重新刷新页面
                this.querinfo.pagesize=newsize
                this.getGoodsList()
            },
            // 监听页数的变化
            handleCurrentChange(newnum) {
                // 根据最新的页码向服务器发送请求重新刷新页面
                this.querinfo.pagenum=newnum
                this.getGoodsList()
            },
            // 删除对应的商品
            async deletegoods(row) {
                // console.log(row)
                const ress=await this.confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=>{
                    return err
                })
                if(ress!=='confirm'){
                    return this.message.info('已取消删除！')
                }
                const{data:res}=await this.axios.delete('goods/'+row.goods_id)
                console.log(res)
                if(res.meta.status!==200){
                   return this.message.error('删除失败')
                }
                this.message.success('删除成功')
                this.getGoodsList()
            },
            // 跳转到添加商品页面
            addGoods(){
                this.$router.push('/goods/add')
            }
        }
    }
</script>
<style  scoped>
.my_input{
  width: 38%;
}
.my_butoon{
  margin-left: 15px;
}
.table{
  margin-top:15px;
  font-size: 12px;
}
.el-pagination{
    margin-top: 15px;
}
</style>