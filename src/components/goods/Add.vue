<template >
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert title="添加商品信息" type="info" center show-icon :closable='false'></el-alert>
            <!--  进度条-->
            <el-steps  align-center :space="200" :active="Number(activeIndex)" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- tab标签页 -->
            <el-form label-position='top' :model="goodsruleForm" :rules="goodsrules" ref="goodsruleFormref" label-width="100px">
                <el-tabs tab-position="left" v-model="activeIndex" :before-leave='preventChange' @tab-click='tabClick()'>
                    <!-- 基本信息区域 -->
                    <el-tab-pane label="基本信息" name='0'>
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="goodsruleForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="goodsruleForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="goodsruleForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number" type="number">
                            <el-input v-model="goodsruleForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop='goods_cat'>
                            <el-cascader v-model="goodsruleForm.goods_cat" :options="optionslist" :props="prop" @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- 商品参数区域 -->
                    <el-tab-pane label="商品参数" name='1'>
                        <el-form-item :label="item.attr_name" v-for="(item,index) of manyParamsLists" :key='index'>
                            <!-- 复选框显示区域 -->
                             <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="items" v-for="(items,indexs) of item.attr_vals" :key='indexs' border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- 商品属性区域 -->
                    <el-tab-pane label="商品属性" name='2'>
                        <el-form-item :label="item.attr_name" v-for="(item,index) of onlyParamslist" :key='index'>
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <!-- 商品图片 -->
                    <el-tab-pane label="商品图片" name='3'>
                        <!-- action图片上传的地址 on-success文件上传成功时调用的函数 -->
                        <el-upload :on-success='uploadSuccess' :headers='requestHeader' class="upload-demo" action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove"
                             list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <!-- 商品内容 -->
                    <el-tab-pane label="商品内容" name='4'>
                        <!-- 文本编辑器 -->
                        <quill-editor v-model="goodsruleForm.goods_introduce"></quill-editor>
                        <!-- 添加商品按钮 -->
                        <el-button type="primary" class="btn" @click='addGoods'>添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
             </el-form>
        </el-card>
        <!-- 预览图片对话框 -->
        <el-dialog title="预览图片" :visible.sync="dialogVisible" width="50%">
            <img :src="previewUrl" alt="" width="100%">
        </el-dialog>
    </div>
</template>
<script>
import _ from 'lodash'
export default {
    data(){
        return{
            // 进度条的激活项的索引
            activeIndex:'0',
            // 当前商品的数据对象
            goodsruleForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                // 当前商品的类别ID
                goods_cat:[],
                // 当前商品的路径
                pics:[],
                // 当前商品的介绍
                goods_introduce:'',
                // 动态参数和静态属性列表
                attr:[]
            },
            // 商品所有的分类列表
            optionslist:[],
            // 分类级联选择器的配置项
            prop:{
                expandTrigger: 'hover',
                // 指定选项的子选项是选项对象的哪个属性值
                children:'children',
                // 选项标签上显示的值
                label:'cat_name',
                // 指定activekeys存放的是什么
                value:'cat_id',
            },
            // 当前商品数据的校验规则
            goodsrules:{
                goods_name:[{required:true,message:'请输入商品名称',trigger:'blur'}],
                goods_price:[{required:true,message:'请输入商品价格',trigger:'blur'}],
                goods_weight:[{required:true,message:'请输入商品重量',trigger:'blur'}],
                goods_number:[{required:true,message:'请输入商品数量',trigger:'blur'}],
                goods_cat:[{required:true,message:'请选择商品类别',trigger:'blur'}]
            },
            // 商品动态参数列表
            manyParamsLists:[],
            // 商品静态属性列表
            onlyParamslist:[],
            // 为图片上传设置请求消息头
            requestHeader:{
                Authorization:window.sessionStorage.getItem('token')
            },
            // 当前预览图片的url
            previewUrl:'',
            //预览图片对话框的显示与隐藏
            dialogVisible:false
        }
    },
    created(){
        this.getParamsList()
    },
    methods:{
        async getParamsList(){
            const {data:res}=await this.axios.get('categories')
            if(res.meta.status!==200){
                return this.message.error('获取分类列表失败')
            }
            this.optionslist=res.data
        },
        // 监控商品分类级联选择框的变化
        handleChange(){
            if(this.goodsruleForm.goods_cat.length!==3){
                return this.goodsruleForm.goods_cat=[]
            }
        },
        // 没有选择商品分类阻止标签页切换
         preventChange(activeName,oldActiveName){
            if(oldActiveName==='0'&& this.goodsruleForm.goods_cat.length!==3){
                this.message.error("请先选择商品分类")
                return false
            }
            // 也可以通过标签页的tab-click事件判断当前激活了哪个选项
            if(activeName==='1'){
                this.getgoodsParams()
            }
            
        },
        //获取商品参数
        async getgoodsParams(){
            const {data:res}=await this.axios.get('categories/'+this.cat_id+'/attributes',{
                    params:{sel:'many'}
                })
                res.data.forEach(item=>{
                    // 将字符串转化为列表便于后续的页面渲染
                    item.attr_vals=item.attr_vals.length===0?[]:item.attr_vals.split(' ')
                })
                this.manyParamsLists=res.data
        },
        // 标签页激活项发生改变时触发
        async tabClick(){
            // 判断当前处在哪个激活项
            if(this.activeIndex==='2'){
                const{data:res}=await this.axios.get('categories/'+this.cat_id+'/attributes',{
                    params:{sel:'only'}
                })
                if(res.meta.status!==200){
                    return this.message.error("获取属性失败")
                }
                this.onlyParamslist=res.data
            }
        },
        // 图片上传成功的操作
        uploadSuccess(response){
            const picurl={pic:response.data.tmp_path}
            this.goodsruleForm.pics.push(picurl)
        },
        //图片预览时的操作 
        handlePreview(file){
            this.previewUrl=file.response.data.url
            this.dialogVisible=true
        },
        // 图片移除时的操作
        handleRemove(file){
            // 获取将要删除图片的临时路径
            const picurl=file.response.data.tmp_path
            // 根据路径获取图片在数组中的索引
            const index=this.goodsruleForm.pics.findIndex(item=>{
                return item.pic===picurl
            })
            // 根据索引删除列表中的图片地址
            this.goodsruleForm.pics.splice(index,1)
        },
        // 添加商品
         addGoods(){
            this.$refs.goodsruleFormref.validate(async val=>{
                if(!val){
                    return this.message.error("请填写必要的信息")
                }
                // 由于级联选择器只能绑定数组对象，而发送请求时要将goods_cat数组对象转化为字符串所以用cloneDeep深拷贝一份数据对象
                const form=_.cloneDeep(this.goodsruleForm)
                form.goods_cat=form.goods_cat.join(',')
            //    处理动态参数
                this.manyParamsLists.forEach(item=>{
                    const newInfo={
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals.join(' ')
                    }
                    this.goodsruleForm.attr.push(newInfo)
                })
                // 处理静态属性
                this.onlyParamslist.forEach(item=>{
                    const newInfo={
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals
                    }
                    this.goodsruleForm.push(newInfo)
                })
                form.attr=this.goodsruleForm.attr
            //    发送请求的参数处理完毕可以向服务器发送请求
                const {data:res}= await this.axios.post('goods',form)
                if(res.meta.status!==201){
                    return this.message.error("添加商品失败")
                }
                this.message.success("添加商品成功")
                // 添加商品成功后跳转到列表页
                this.$router.push('/goods')
            })
        }
    },
    computed:{
        cat_id(){
            if(this.goodsruleForm.goods_cat.length===3){
                return this.goodsruleForm.goods_cat[this.goodsruleForm.goods_cat.length-1]
            }
            return null
        }
    }
}
</script>
<style  scoped>
.el-steps{
    margin: 20px 0;
}
.el-checkbox{
    margin: 0 20px 0 0!important;
}
.btn{
    margin-top: 15px;
}
</style>