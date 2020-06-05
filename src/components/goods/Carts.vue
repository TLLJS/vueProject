<template>
    <div>
         <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card >
            <el-row>
                <el-col >
                    <el-button type="primary" @click="addFenlei()">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <tree-table style="margin-top:15px" :selection-type='false' :expand-type='false' show-index border :data="getGoodsList" :columns="columns">
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scoped">
                    <i class="el-icon-success" v-if="scoped.row.cat_deleted===false" style="color:lightgreen"></i>
                    <i class="el-icon-error" v-else style="color:red"></i>
                </template>
                <!-- 排序模板 -->
                <template slot="orders" slot-scope="scopeds">
                    <el-tag v-if="scopeds.row.cat_level=='0'" size='mini'>一级</el-tag>
                    <el-tag v-else-if="scopeds.row.cat_level===1" type="success" size='mini'>二级</el-tag>
                    <el-tag v-else-if="scopeds.row.cat_level===2" type="warning" size='mini'>三级</el-tag>
                </template>
                <!-- 操作模板 -->
                 <template slot="caozuo" slot-scope="scopeds">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
                </template>
            </tree-table>
            <!-- 分页条 -->
            <el-pagination style="margin-top:15px" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" 
                :page-sizes="[4, 8, 16, 30]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="Number(total)">
            </el-pagination>
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="setdialogVisible" width="45%" @close='closeDuihua' >
            <!-- 添加分类的表单 -->
            <el-form  label-width="100px" :model="addCateForm" :rules="addCateFormrules" ref="adddialog" >
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <!-- 级联选择菜单 -->
                 <el-form-item label="父级分类：">
                     <!-- props用来指定级联选择器 相关配置 clearable是否支持清空选项-->
                     <el-cascader clearable  v-model="selectkeys" :props='casePros'  :options="parentsLists"  @change="sethandleChange" style="width:100%"></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setpowers()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            // 商品列表数据
            getGoodsList:[],
            //表格对应的列标题
            columns: [
            // 第一列
          {
            label: '分类名称',
            prop: 'cat_name',
            align:'center',
            headerAlign:'center'
          },
        //   第二列
          {
            label:'是否有效',
            // 当前列定义为模板列
            type:'template',
            // 当前列使用的模板名称
            template:'isok',
            align:'center',
            headerAlign:'center'

          },
        //   排序列
          {
            label:'排序',
            // 当前列定义为模板列
            type:'template',
            // 当前列使用的模板名称
            template:'orders',
            align:'center',
            headerAlign:'center'

          },
          //   操作列
          {
            label:'操作',
            // 当前列定义为模板列
            type:'template',
            // 当前列使用的模板名称
            template:'caozuo',
            align:'center',
            headerAlign:'center'

          }
          ],
            // 查询条件
            queryInfo:{
                // 获取几层数据
                type:3,
                // 每页显示几条数据
                pagesize:4,
                // 当前显示第几页
                pagenum:1
            },
            // 总的数据条数
            total:'',
            // 控制添加分类对话框的显示与隐藏
            setdialogVisible:false,
            // 分类表单的数据对象
            addCateForm:{
                // 要添加的分类名称
                cat_name:'',
                // 父级分类ID
                cat_pid:0,
                // 分类等级，默认添加一级分类
                cat_level:0
            },
            // 父级分类列表
            parentsLists:[],
            // 级联选择器的相关配置
            casePros:{
                // 以什么方式激活级联选择器
                expandTrigger: 'hover',
                // 当前选中项的ID
                value:'cat_id',
                // 显示看到的列表项的名字
                label:'cat_name'
                },
                // 选中分类的ID数组
                selectkeys:[],
            // 分类表单的数据的验证规则对象
            addCateFormrules:{
                cat_name:[{required:true,message:'请输入分类名称',trigger:'blur'}]
            }
        }
    },
    created(){
        // 获取商品列表
        this.getGoodsLists()
    },
    methods:{
        // 监听每页显示几条数据
        handleSizeChange(pagesizes) {
            // 向服务器发送请求获取列表数据
            this.queryInfo.pagesize=pagesizes
            this.getGoodsLists()
        },
        // 监听当前显示第几页
        handleCurrentChange(pagenums) {
            this.queryInfo.pagenum=pagenums
            this.getGoodsLists()
        },
            // 发送请求获取商品列表
        async getGoodsLists(){
            const {data:res}=await this.axios.get('categories',{
                params:this.queryInfo
            })
            if(res.meta.status!==200){
                return this.message.error("获取商品列表失败")
            }
            this.getGoodsList=res.data.result
            this.total=res.data.total
        },
        // 显示添加分类对话框
        async addFenlei(){
             // 发送请求获取用户分类列表
            const {data:res}=await this.axios.get('categories',{
                params:{type:2}
            })
            this.parentsLists=res.data
            console.log(res.data)
            this.setdialogVisible=true
        },
        // 级联选择器选中项发变化触发
        sethandleChange(){
            // console.log(this.selectkeys)
            // 如果selectkeys数组中的length大于0说明选中了父级分类
            if(this.selectkeys.length>0){
                // 为父级分类的ID赋值
                this.addCateForm.cat_pid=this.selectkeys[this.selectkeys.length-1]
                // 为当前分类等级赋值
                this.addCateForm.cat_level=this.selectkeys.length
            }else{
                // 为父级分类的ID赋值
                this.addCateForm.cat_pid=0;
                // 为当前分类等级赋值
                this.addCateForm.cat_level=0;
            }
        },
        // 点击确定按钮添加新类
        setpowers(){
            // console.log(this.addCateForm)
            // 发请求之前对表单进行预验证
            this.$refs.adddialog.validate(async valid=>{
                if(!valid){
                    this.setdialogVisible = true
                    return this.message.error("请输入相关内容")
                }
                const {data:res}=await this.axios.post('categories',this.addCateForm)
                if(res.meta.status!==201){
                    return this.message.error("添加分类失败")
                }
                this.message.success("添加分类成功");
                this.getGoodsLists()
                this.setdialogVisible = false
            })
        },
        // 关闭添加分类对话框重置其对话框
        closeDuihua(){
            // 重置表单数据
            this.$refs.adddialog.resetFields()
            this.selectkeys=[]
            this.addCateForm.cat_level=0
            this.addCateForm.cat_pid=0
        }
    }
}
</script>
<style scoped>

</style>