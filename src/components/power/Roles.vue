<template>
    <div>
         <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card style="margin-top:15px">
            <!-- 添加角色按钮 -->
            <el-button type="primary" class="my_butoon">添加角色</el-button>
            <el-table :data="getUserlists" style="width: 100%" stripe border class="table">
                <!-- 展开列 -->
                <el-table-column type='expand' label="详情" >
                    <template slot-scope="scopes">
                        <!-- 动态绑定calss -->
                        <el-row :class="['bdbottom',index===0?'bdtop':'','vcenter']" v-for="(item,index) of scopes.row.children" :key='index'>
                            <!-- 一级权限 -->
                            <el-col :span='5'>
                                <el-tag closable @close='removerRoles(scopes.row,item.id)'>{{item.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级权限和三级权限 -->
                            <el-col :span='19'>
                                <el-row v-for="(item1,index1) of item.children" :key='index1' :class="[index1===0?'':'bdtop','vcenter']">
                                    <!-- 二级权限 -->
                                    <el-col :span='6'>
                                        <el-tag closable type="success" @close='removerRoles(scopes.row,item1.id)' >{{item1.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级权限 -->
                                    <el-col :span='18'>
                                        <el-tag closable @close='removerRoles(scopes.row,item2.id)' type="warning" v-for="(item2,index2) of item1.children" :key='index2'>{{item2.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                 <!-- 索引列 -->
                <el-table-column type='index' label="序号" ></el-table-column>
                <el-table-column prop="roleName" label="角色名称" ></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述" ></el-table-column>
                <el-table-column  label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="setPowers(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限对话框 -->
        <el-dialog title="请选择相关权限" :visible.sync="setdialogVisible" width="40%" @close='setdialogVisibles()'>
            <!-- 权限列表 -->
            <el-tree ref="treesRef" node-key='id' :default-checked-keys='defakey' show-checkbox default-expand-all :data="setpowerLists"  :props="setpowerProps"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="changePowes()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            // 角色列表数据
            getUserlists:[],
            // 控制分配权限对话框的显示与隐藏
            setdialogVisible:false,
            // 权限列表数据
            setpowerLists:[],
            // 要显示的权限列表数据
            setpowerProps: {
                children: 'children',
                label: 'authName'
            },
            // 默认选中的权限列表
            defakey:[],
            // 要显示的权限列表的角色ID
            powesId:''
        }
    },
    created(){
        this.getUserlist()
    },
    methods:{
        // 发送请求获取角色列表数据
        async getUserlist(){
            const {data:res}=await this.axios.get('roles')
            if(res.meta.status!==200){
                return this.message.error("获取用户列表失败");
            }
            this.getUserlists=res.data;
        },
        // 删除对应的权限
        async removerRoles(roles,uid){
           const res=await this.confirm('此操作将永久删除该权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>{
                return err
            })
            // 判断用户是否按下确定
            if(res!=='confirm'){
                return this.message.info("已取消了删除")
            }
            // 发送请求删除用户权限数据
            const {data:ress}=await this.axios.delete(`roles/${roles.id}/rights/${uid}`)
                console.log(res)
                if(ress.meta.status!==200){
                    return this.message.error("删除用户权限失败");
                }
                this.message.success('删除用户权限成功')
                roles.children=ress.data;
        },
        // 获取分配权限列表
        async setPowers(role){
            // 将当前角色ID保存下来
            this.powesId=role.id;
            const {data:res} =await this.axios.get('rights/tree')
            if(res.meta.status!==200){
                return this.message.error('权限列表获取失败')
            }
            this.setpowerLists=res.data;
            console.log(this.setpowerLists)
            // 递归获取要默认显示的节点ID
            this.getNodeID(role,this.defakey)
            this.setdialogVisible=true
        },
        // 通过递归获取角色下所以的三级权限的id,并保存到defakey数组中
        getNodeID(node,arr){
            if(!node.children){
                // 表明当前节点为3级节点
                return arr.push(node.id)
            }
            node.children.forEach(element => {
                this.getNodeID(element,arr)
            });
        },
        //当分配权限对话框关闭时清除选中的权限列表防止defakey列表中的数据累加
        setdialogVisibles(){
            this.defakey=[];
        },
        // 修改用户权限
        async changePowes(){
            // 获取当前选中节点的ID
           const arr1= this.$refs.treesRef.getCheckedKeys()
            // 获取当前半选中节点的ID
           const arr2=this.$refs.treesRef.getHalfCheckedKeys()
           const queryArr=arr1.concat(arr2);
           const {data:res}=await this.axios.post('roles/'+this.powesId+'/rights',{
               rids:queryArr.join(',')
           })
           if(res.meta.status!==200){
               return this.message.error("分配用户权限失败")
           }
        // 根据最新数据重新刷新页面
           this.message.success("分配用户权限成功")
           this.getUserlist();
           this.setdialogVisible = false
        }
    }
}
</script>
<style scoped>
.table{
  font-size: 12px;
  margin-top: 15px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.el-tag{
    margin: 7px;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>