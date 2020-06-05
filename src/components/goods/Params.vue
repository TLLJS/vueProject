<template>
    <div>
         <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片试图区域 -->
        <el-card>
            <!-- 警告区域 -->
            <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable='false' show-icon></el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="cat">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                     <el-cascader v-model="selectKeys" :options="catelists" :props="cateProps" @change="handleChange"></el-cascader>
                </el-col>
            </el-row>
            <!-- 添加参数的Tab页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="selectKeys.length===3?false:true" @click="setdialogVisible=true">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableDate"  border stripe>
                        <!-- 展开列 -->
                        <el-table-column type="expand" label="详情" width="60">
                            <template slot-scope="scoped">
                                <!-- 显示原来的版式 -->
                                <el-tag class="tags" v-for="(item,index) in scoped.row.attr_vals" :key="index" closable @close='deleteTag(index,scoped.row)'> {{item}}</el-tag>
                                <!-- 添加版式 -->
                                <el-input class="input-new-tag" v-if="scoped.row.inputVisible" v-model="scoped.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scoped.row)" @blur="handleInputConfirm(scoped.row)"></el-input>
                                <el-button v-else  size="small" @click="showInput(scoped.row)" type="primary">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="序号" width="60"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称" ></el-table-column>
                        <el-table-column  label="操作" >
                            <template slot-scope="scopeds">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="changeParams(scopeds.row)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletes(scopeds.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="selectKeys.length===3?false:true" @click="setdialogVisible=true">添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableDate"  border stripe>
                        <!-- 展开列 -->
                        <el-table-column type="expand" label="详情" width="60">
                            <template slot-scope="scoped">
                                <!-- 显示原来的版式 -->
                                <el-tag class="tags" v-for="(item,index) in scoped.row.attr_vals" :key="index" closable @close='deleteTag(index,scoped.row)'> {{item}}</el-tag>
                                <!-- 添加版式 -->
                                <el-input class="input-new-tag" v-if="scoped.row.inputVisible" v-model="scoped.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scoped.row)" @blur="handleInputConfirm(scoped.row)"></el-input>
                                <el-button v-else  size="small" @click="showInput(scoped.row)" type="primary">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="序号" width="60"></el-table-column>
                        <el-table-column prop="attr_name" label="属性名称" ></el-table-column>
                        <el-table-column  label="操作" >
                            <template slot-scope="scopeds">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click='changeParams(scopeds.row)'>编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"@click="deletes(scopeds.row)" >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加动态参数和静态属性对话框 -->
        <el-dialog :title="`添加${setParams}`" :visible.sync="setdialogVisible" width="45%" @close='resetForm()'>
            <el-form :model="ParruleForm" :rules="Parrules" ref="Parrulesref" label-width="100px">
                <el-form-item :label="setParams" prop="attr_name">
                    <el-input v-model="ParruleForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams()">确 定</el-button>
            </span>
        </el-dialog>
         <!-- 修改动态参数和静态属性对话框 -->
         <el-dialog :title="`修改${setParams}`" :visible.sync="changedialogVisible" width="45%" @close='resetchangeForm()'>
            <el-form :model="changeParruleForm" :rules="changeParrules" ref="changeParrulesref" label-width="100px">
                <el-form-item :label="setParams" prop="attr_name">
                    <el-input v-model="changeParruleForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changedialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams()" >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            // 商品分类列表数据
            catelists:[],
            // 当前级联选择框选中项的ID
            selectKeys:[],
            // 级联选择框的相关配置
            cateProps:{
                expandTrigger: 'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children' 
            },
            // 被激活的页签
            activeName:'many',
            // 动态参数列表数据
            manyTableDate:[],
            // 静态属性列表数据
            onlyTableDate:[],
            // 控制添加动态参数和静态属性的显示与隐藏
            setdialogVisible:false,
            // 添加静态属性和动态参数的表单数据
            ParruleForm:{
                attr_name:''
            },
            // 添加动态参数和静态属性的验证规则
            Parrules:{
                attr_name:[{ required: true, message: '请输入相关参数', trigger: 'blur' }]
            },
            // 控制修改动态参数和静态属性的显示与隐藏
            changedialogVisible:false,
            // 修改静态属性和动态参数的表单数据
            changeParruleForm:{
                attr_name:''
            },
            // 修改动态参数和静态属性的验证规则
            changeParrules:{
                attr_name:[{ required: true, message: '请输入相关参数', trigger: 'blur' }]
            },
            // 当前要编辑的动态参数或者静态属性的attr_id
            pid:'',
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        // 获取商品分类列表数据
        async getCateList(){
            const{data:res}=await this.axios.get('categories')
            if(res.meta.status!==200){
                return this.message.error("获取商品列表失败")
            }
            this.catelists=res.data
            // console.log(this.catelists)
        },
        // 监控级联选择框的变化
         handleChange(){
            //  调用获取参数列表的函数
           this.getParamslists()
        },
        // 获取参数列表数据
        async getParamslists(){
             // 选中的不是三级分类
            if(this.selectKeys.length!==3){
                this.selectKeys=[]
                // 清空动态参数表格
                this.manyTableDate=[]
                // 清空静态属性表格
                this.onlyTableDate=[]
                return
            }
            // 证明选中的是三级分类 发送请求，获取参数列表
            var ID=this.selectKeys[this.selectKeys.length-1]
            const{data:res}=await this.axios.get('categories/'+ID+'/attributes',{
                params:{sel:this.activeName}
            })
            if(res.meta.status!==200){
                return this.message.error("获取参数列表失败")
            }
            //将参数列表中的字符串转化为数组
            res.data.forEach(item => {
                item.attr_vals=item.attr_vals?item.attr_vals.split(' '):[]
                // 控制该行添加版式文本框的显示与隐藏
                item.inputVisible=false
                //该行添加版式文本框的值
                item.inputValue=''
            });
            // console.log(res.data)
            // 将动态参数列表和静态属性列表保存到不同的数据对象中
            if(this.activeName==='many'){
                this.manyTableDate=res.data
                console.log(this.manyTableDate)
            }else{
                this.onlyTableDate=res.data
            }
        },
        // Tab页签点击事件的处理函数
        handleTabClick(){
            //  调用获取参数列表的函数
            this.getParamslists()
            // console.log(this.activeName);
        },
        // 关闭添加动态参数和静态属性对话框时重置表单
        resetForm(){
            this.$refs.Parrulesref.resetFields()
        },
        // 向服务器发送请求添加动态参数或者静态属性
        addParams(){
            // 首先对表单进行预验证
            this.$refs.Parrulesref.validate(async value=>{
                if(!value){
                    return this.message.error("请输入相关内容")
                }
                const {data:res}=await this.axios.post('categories/'+this.selectKeys[this.selectKeys.length-1]+'/attributes',
                    {attr_name:this.ParruleForm.attr_name,
                    attr_sel:this.activeName})
                if(res.meta.status!==201){
                    return this.message.error('添加失败')
                }
                this.message.success('添加成功')
                // 重新获取参数列表
                 this.getParamslists()
                this.setdialogVisible=false
            })
        },
        // 查询动态参数或者静态属性
        async changeParams(obj){
            // 首先根据 ID 查询参数并渲染到页面上
            // console.log(obj)
            // 将当前的静态属性或者动态参数的 ID 存到pid中 便于后续发送请求修改静态属性或者动态参数
            this.pid=obj.attr_id
            // 打开对话框
            this.changedialogVisible=true
            const {data:res}=await this.axios.get('categories/'+this.selectKeys[this.selectKeys.length-1]+'/attributes/'+obj.attr_id,
            {
                params:{attr_sel:this.activeName}
            })
            if(res.meta.status!==200){
                return this.message.error("获取参数失败")
            }
            this.changeParruleForm.attr_name=res.data.attr_name
        },
        // 关闭修改动态参数和静态属性对话框时重置表单
        resetchangeForm(){
            this.$refs.changeParrulesref.resetFields()
        },
        // 向服务器发送请求修改动态参数或者静态属性
        editParams(){
            //首先对表单进行预验证
            this.$refs.changeParrulesref.validate(async val=>{
                if(!val){
                    return this.message.error('请输入相关内容')
                }
                // 表单通过验证向服务器发送请求
                const{data:res}=await this.axios.put('categories/'+this.selectKeys[this.selectKeys.length-1]+'/attributes/'+this.pid,
                    {attr_name:this.changeParruleForm.attr_name,
                    attr_sel:this.activeName}
                    )
                if(res.meta.status!==200){
                    return this.message.error('更新失败')
                }
                this.message.success('更新成功')
                this.getParamslists()
                this.changedialogVisible=false
            })
        },
        // 删除静态参数或者静态属性
        async deletes(obj){
            const ress=await this.confirm('此操作将永久删除该内容, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>{
                return err
            })
            // console.log(ress)
            // 判断用户是否点击确定按钮
            if(ress!=='confirm'){
                return this.message.info('已取消删除！')
            }
            // 用户点击了确定按钮 发送请求
            const {data:res}=await this.axios.delete('categories/'+this.selectKeys[this.selectKeys.length-1]+'/attributes/'+obj.attr_id)
            // console.log(res)
            if(res.meta.status!==200){
                return this.message.error('删除失败！')
            }
            this.message.success('删除成功！')
            this.getParamslists()
        },
        // 显示添加版式输入框
        showInput(row){
            row.inputVisible=true
            // 自动获取焦点
            // $nextTick就是当页面上的元素被重新渲染之后，才会执行函数中的代码 由于row.inputVisible=true是页面上不是立即被渲染出文本框，因此需要等待渲染之后再执行自动获得焦点
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
        });
        },
        // 显示添加版式标签
         handleInputConfirm(row){
            if(row.inputValue.trim().length===0){
                row.inputValue=''
                row.inputVisible=false
                return 
            }
            
            // 输入无误后将数据追加到列表中
            row.attr_vals.push(row.inputValue.trim())
             // 清空输入框中的数据
            row.inputValue=''
            row.inputVisible=false
            // 向服务器发送请求修改版式
            this.saveContent(row)
           
        },
        // 修改版式标签请求函数
        async saveContent(row){
            // 向服务器发送请求修改版式
            const {data:res}=await this.axios.put('categories/'+this.selectKeys[this.selectKeys.length-1]+'/attributes/'+row.attr_id,
             {attr_name:row.attr_name,
            attr_sel:row.attr_sel,
            attr_vals:row.attr_vals.join(' ')})
            // console.log(res)
            if(res.meta.status!==200){
                return this.message.error("修改失败")
            }
            this.message.success('修改成功')
        },
        // 删除版式标签
        deleteTag(index,row){
            row.attr_vals.splice(index,1)
             // 向服务器发送请求修改版式
           this.saveContent(row)
        }
    },    

    computed:{
        // 显示动态参数还是静态属性
        setParams(){
            if(this.activeName==='many'){
                return '动态参数'
            }else{
                return '静态属性'
            }
        },
    }
}
</script>
<style scoped>
.cat{
    margin: 15px 0;
}
.input-new-tag{
    
    width: 120px;
}
.tags{
    margin: 15px;
}
</style>