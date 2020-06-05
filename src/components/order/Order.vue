<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span="9">
                    <el-input placeholder="请输入内容" v-model="queryinfo.query" class="input-with-select" clearable @clear='getTableDate'>
                        <el-button slot="append" icon="el-icon-search" @click="getTableDate"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 表格区域 -->
             <el-table :data="tableData" stripe border>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="订单编号" prop='order_number'></el-table-column>
                <el-table-column label="订单价格" prop='order_price'></el-table-column>
                <el-table-column label="是否付款" >
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.order_pay==='0'">未付款</el-tag>
                        <el-tag type="primary" v-else>已付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop='is_send'></el-table-column>
                <el-table-column label="下单时间">
                    <template slot-scope="scope">
                        <p>{{scope.row.create_time|dataTime}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="changeaddress"></el-button>
                        <el-button type="success" icon="el-icon-location" size="mini"  @click="showwuliu"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryinfo.pagenum"
                :page-sizes="[10, 20, 30, 40]" :page-size="queryinfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="Number(total)">
            </el-pagination>
        </el-card> 
        <!-- 修改订单地址对话框 -->
        <el-dialog title="修改地址" :visible.sync="changedialogVisible" @close='resetFiles'>
            <el-form :model="changeruleForm" :rules="changeruleFormrules" ref="changeruleFormref" label-width="100px" class="demo-ruleForm">
                <el-form-item label="省市区/县" prop="selectskeys">
                    <el-cascader v-model="changeruleForm.selectskeys" :options="citydate" :props="{ expandTrigger: 'hover' }" @change="handleChange"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="changeruleForm.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changedialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="changedialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 物流对话框 -->
        <el-dialog title="当前物流进度" :visible.sync="showdialogVisible">
            <el-timeline :reverse="reverse">
                <el-timeline-item v-for="(activity, index) of wuliudata" :key="index" :timestamp="activity.time">{{activity.context}}</el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>
<script>
import citydate from "./citydata.js"
export default {
    data(){
        return{
            // 获取订单列表的查询参数
            queryinfo:{
                // 用户输入的搜索内容
                query:'',
               
                // 获取第几页的数据
                pagenum:1,
                 // 每页显示几条
                pagesize:10,
            },
            // 页面中表格的数据
            tableData:[],
            // 总的订单数据
            total:'',
            // 控制修改订单地址对话框的显示与隐藏
            changedialogVisible:false,
            // 修改订单的表单数据
            changeruleForm:{
                // 当前选择的省市区县
            selectskeys:[],
            // 详细地址数据
            address:''
            },
            // 修改订单的表单数据的验证规则对象
            changeruleFormrules:{
                selectskeys:[{required:true,message:'请输入内容',trigger:'blur'}],
                address:[{required:true,message:'请输入内容',trigger:'blur'}]
            },
            // 从外部导入的级联选择器的省市区地址数据
            citydate,
            // 控制物流对话框的显示与隐藏
            showdialogVisible:false,
            // 当前物流信息数据
            wuliudata:[],
            // 控制物流时间线的正序还是倒序
            reverse:false
        }
    },
    created(){
        this.getTableDate()
    },
    methods:{
        // 获取订单列表数据
        async getTableDate(){
            const {data:res}=await this.axios.get('orders',{
                params:this.queryinfo
            })
            if(res.meta.status!==200){
                return this.message.error('获取订单列表失败')
            }
            this.tableData=res.data.goods
            this.total=res.data.total
        },
        // 监控分页条每页显示几条
        handleSizeChange(newSize) {
            this.queryinfo.pagesize=newSize
            this.getTableDate()
        },
        // 监控分页条当前显示第几页
        handleCurrentChange(val) {
            this.queryinfo.pagenum=val
            this.getTableDate()
        },
        // 修改订单地址
        changeaddress(){
            this.changedialogVisible=true
        },
        // 修改订单地址的级联选择器发生变化是触发
        handleChange(){
            console.log(this.changeruleForm.selectskeys)
        },
        // 修改订单地址对话框关闭时重置表单
        resetFiles(){
            this.$refs.changeruleFormref.resetFields()
        },
        // 显示物流对话框事件
        async showwuliu(){
            this.showdialogVisible=true
            // 向服务器发送请求获取物流信息
            const {data:res}=await this.axios.get('kuaidi/804909574412544580')
            if(res.meta.status!==200){
                return this.message.error("获取物流信息失败")
            }
            this.wuliudata=res.data
            console.log(this.wuliudata)
        }
    }
}
</script>
<style scoped>
.el-cascader{
    width: 100%;
}
</style>