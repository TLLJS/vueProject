<template>
  <div>
      <!-- 面包屑导航区域 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  -->
    <el-card class="box-card">
      <!-- 添加和搜素用户区域 -->
        <el-input placeholder="请输入内容"  class=" my_input" v-model="paramsInfo.query" clearable @clear='getUserLists()'>
          <el-button slot="append" icon="el-icon-search" @click="getUserLists()"></el-button>
        </el-input>
        <el-button type="primary" class="my_butoon" @click="dialogVisible=true">添加用户</el-button>
        <!-- 用户列表区域 stripe属性可以创建带斑马纹的表格 border-->
        <el-table :data="userLists"  stripe border class="table">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column  label="状态">
            <!-- 用户状态的开关 通过作用域插槽拿到当前该行的数据-->
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="changeStatus(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" width='180px'>
            <template slot-scope="scopes">
              <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUsers(scopes.row)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delInfo(scopes.row.id)"></el-button>
              <!-- 分配角色按钮 -->
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable='false' >
                <el-button type="warning" icon="el-icon-share" size="mini" @click="setRoles(scopes.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
         <el-pagination class="My_pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="Number(paramsInfo.pagenum)"
            :page-sizes="[4, 6, 8,14]" :page-size="paramsInfo.pagesize"  layout="total, sizes, prev, pager, next, jumper" :total="Number(total)">
        </el-pagination>
    </el-card>
    <!-- 添加用户信息 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="45%" @close='resetMsg'>
        <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="passwords" >
            <el-input v-model="addForm.passwords" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="tel">
            <el-input v-model="addForm.tel"></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的信息 -->
    <el-dialog title="修改用户信息" :visible.sync="editdialogVisible" width="45%" @close='editReset()'>
      <el-form :model="editaddForm" :rules="editaddFormrules" ref="editaddFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editaddForm.editusername" disabled></el-input>
          </el-form-item>
           <el-form-item label="邮箱" prop="editemail">
            <el-input v-model="editaddForm.editemail"></el-input>
          </el-form-item>
           <el-form-item label="手机" prop="editTel">
            <el-input v-model="editaddForm.editTel"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setdialogVisible" width="45%" @close='resetPowesUser()'>
        <div>
          <p>当前的用户：{{usermsg.username}}</p>
          <p>当前的角色：{{usermsg.role_name}}</p>
          <div>分配新角色 
             <el-select  placeholder="请选择" v-model="currentPower">
              <el-option v-for="item in userpowerLists" :key="item.id" :label="item.roleName" :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="setdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setPowesUser()">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    // 邮箱的自定义校验规则
    var checkEmail=(rule,value,callback)=>{
      const reg=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      if(reg.test(value)){
        // 邮箱合法直接返回
         return callback()
      }
        return  callback(new Error("请输入合法的邮箱"));
    };
    // 手机号的自定义校验规则
    var checkTel=(rule,value,callback)=>{
      const reg=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if(reg.test(value)){
        // 手机号合法直接返回
         return callback()
      }
      return callback(new Error("请输入合法的手机号"));
    }
    return {
      // 获取用户列表的参数对象
      paramsInfo:{
        query:'',
        pagenum:1,
        pagesize:6
      },
      // 用户列表数据
      userLists:[],
      // 数据库中用户的总数
      total:'',
      // 获取的当前页
      pagenum:'',
      // 控制添加用户的文本框的显示与隐藏
      dialogVisible:false,
      // 控制添加用户的文本框的显示与隐藏
      editdialogVisible:false,
      //添加的用户信息
      addForm:{
        username:'',
        passwords:'',
        email:'',
        tel:''
      },
      // 修改的用户信息
      editaddForm:{
        editusername:'',
        editemail:'',
        editTel:''

      },
      // 当前要修改的用户ID
      editID:'',
      // 控制分配角色对话框的显示与隐藏
      setdialogVisible:false,
      // 当前分配角色的信息
      usermsg:{},
      // 所有分配角色列表数据
      userpowerLists:[],
      // 当前被选中的角色ID
      currentPower:'',
      // 修改用户信息的验证规则
      editaddFormrules:{
        // 邮箱的验证规则
        editemail:[
          {required:true,message:'请输入邮箱',trigger:'blur'},
           { validator: checkEmail,trigger: 'blur'}],
        
        // 手机号的验证规则
        editTel:[{required:true,message:'请输入手机号',trigger:'blur'},
                   { validator: checkTel, trigger: 'blur'}]
      },
      // 添加用户信息的验证规则
      addFormrules:{
        username:[{ required: true, message: '请输入用户名', trigger: 'blur' },
                  { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }],
        passwords:[{required:true,message:'请输入密码',trigger:'blur'},
                   {min:6,max:12,message:'长度在 6 到 12 个字符',trigger: 'blur'}],
        email:    [{required:true,message:'请输入邮箱',trigger:'blur'},
                   { validator: checkEmail,trigger: 'blur'}],
        tel:  [{required:true,message:'请输入手机号',trigger:'blur'},
                   { validator: checkTel, trigger: 'blur'}]           
      }
    }
  },
  created(){
    // 每次刷新页面重新加载用户列表
    this.getUserLists();
  },
  methods:{
    // 监听每页数据个数的变化
     handleSizeChange(pagesizes) {
        this.paramsInfo.pagesize=pagesizes;
        //    根据最新的pagesize重新向服务器发请求
        this.getUserLists();
      },
      // 监听当前用户看的是第几页
      handleCurrentChange(pagenums) {
        this.paramsInfo.pagenum=pagenums;
        // 根据最新的pagenum重新向服务器发请求
        this.getUserLists();
      },
    async  getUserLists(){
      // 发送请求获取用户列表
      const {data:res} =await  this.axios.get('users',{
          params:this.paramsInfo
        });
        if(res.meta.status!==200){
          return this.message.console.error(('获取用户列表失败！'));
        }
        this.total=res.data.total;
        this.userLists=res.data.users;
      },
      // 修改用户状态
    async  changeStatus(status){
        // 发送请求修改用户状态
      const {data:res}= await this.axios.put('users/'+status.id+'/state/'+status.mg_state)
      if(res.meta.status!==200){
        // 修改失败后重置回原来状态
         status.mg_state=!status.mg_state;
        return this.message.error("修改用户状态失败");
      }
      this.message.success("修改用户状态成功！")
    },
    // 添加用户
    addUser(){
      // 预验证整个表单是否填写真确
      this.$refs.addFormRef.validate(async (status)=>{
        if(status){
          this.dialogVisible=false;
          var obj={
            username:this.addForm.username,
            password:this.addForm.passwords,
            email:this.addForm.email,
            mobile:this.addForm.tel}
            // 向服务器发送请求添加用户
          const {data:res}= await  this.axios.post('users',obj)
          if(res.meta.status!==201){
            return this.message.error("添加用户失败！"+res.meta.msg);
          };
          this.message.success("添加用户成功！")
          this.getUserLists();
        }else{
          this.message.error("格式不正确，无法提交");
          this.dialogVisible = true;
        }
      })
    },
    // 查看用户信息(也可以通过id向服务器发送请求获取数据)
    editUsers(userInfo){
      this.editdialogVisible=true
      this.editaddForm.editusername=userInfo.username
      this.editaddForm.editemail=userInfo.email
      this.editaddForm.editTel=userInfo.mobile
      // 记录下当前用户的ID便于后续的修改
      this.editID=userInfo.id;
    },
    // 修改用户信息
    changeInfo(){
      // 预验证整个表单是否填写真确
      this.$refs.editaddFormRef.validate(async status=>{
        if(!status){
          return this.message.error('格式不正确，无法提交')
        }
        const {data:res}=await this.axios.put("users/"+this.editID,{
          email:this.editaddForm.editemail,
          mobile:this.editaddForm.editTel
        });
        if(res.meta.status!==200){
          this.editdialogVisible = false;
          return this.message.error("修改用户信息失败")
        }
        this.message.success("修改用户信息成功");
        this.getUserLists();
        this.editdialogVisible = false;
      })
    },
    // 关闭添加用户对话框时重置表单
    resetMsg(){
      this.$refs.addFormRef.resetFields();
    },
    // 关闭修改用户对话框时重置表单
    editReset(){
      this.$refs.editaddFormRef.resetFields();
    },
    // 删除用户信息
    async  delInfo(uid) {
       const res= await this.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>{
          // 向外抛出错误信息 res能够获取到
          return err
        })
        // 判断用户是否点击了确定按钮
        if(res!=='confirm'){
          return this.message.info("已取消删除操作")
        }
        // 向服务器发送请求删除用户
        const {data:ress}=await this.axios.delete("users/"+uid);
        if(ress.meta.status!=200){
          return this.message.error("删除失败")
        }
        this.message.success("删除成功");
        // 删除后重新刷新列表数据
        this.getUserLists()
      },
      // 分配角色
      async setRoles(userms){
        this.usermsg=userms
        // 发送请求获取所有角色列表
        const {data:res}=await this.axios.get('roles')
        //  console.log(res)
        if(res.meta.status!==200){
          return this.message.error("获取角色列表失败")
        }
        this.userpowerLists=res.data
        this.setdialogVisible=true
      },
      // 修改用户角色
      async setPowesUser(){
        if(!this.currentPower){
          return this.message.error("请选择角色")
        }
        // 向服务器发送请求修改用户角色
        const {data:res}=await this.axios.put(`users/${this.usermsg.id}/role`,{
          rid:this.currentPower
        })
        console.log(res)
        if(res.meta.status!==200){
          return this.message.error("修改用户角色失败")
        }
        this.message.success("修改用户角色成功")
        // 修改数据之后重新发送请求刷新页面
        this.getUserLists();
        this.setdialogVisible = false
      },
      // 关闭修改角色对话框重置对话框
      resetPowesUser(){
        this.currentPower=''
        this.usermsg=''
      }
  }
}
</script>

<style scoped>
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
.My_pagination{
  margin-top: 15px;
}
</style>