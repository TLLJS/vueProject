<template>
  <div class="login_container">
    <div class="login">
       <!-- 头像区域 -->
       <div class="headerbox">
         <img src="../assets/logo.png" alt="">
       </div>
       <!-- 表单区域 :model绑定整个表单的数据 :rules绑定表单的验证规则 ref绑定整个表单对象方便重置表单-->
       <el-form class="forms" :model="loginform" :rules="formRules" ref="loginFormRef">
         <!-- 用户名 -->
          <el-form-item prop='username'>
            <!-- 里面的内容可以随意更换 prefix-icon为文本框添加前值图标-->
            <el-input  prefix-icon="iconfont icon-user" v-model="loginform.username"></el-input>
          </el-form-item >
          <!-- 密码  prop 属性设置为需校验的字段名-->
          <el-form-item prop='password'>
            <el-input  prefix-icon="iconfont icon-3702mima" v-model="loginform.password" type="password"></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item  class="btns">
             <el-button type="primary" @click="login()">登录</el-button>
             <el-button type="info" v-on:click="resetFlie()">重置</el-button>
          </el-form-item>
       </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      //登录表单的数据绑定对象
      loginform:{
        username:'admin',
        password:'123456'
      },
      // 表单验证的规则对象
      formRules:{
        // 用户名的验证
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur'}
        ],
        // 密码的验证
        password:[
          {required:true,message:'请输入登录密码',trigger:'blur'},
          {min: 6, max: 12, message: '长度在6到12个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
    // 重置按钮
    resetFlie(){
      // this.$refs.loginFormRef用来获取form表单对象
      // 重置整个表单
      this.$refs.loginFormRef.resetFields();
    },
    // 登录按钮
    login(){
      // 预验证
      this.$refs.loginFormRef.validate(async valid=>{
        if(!valid){
          return;
        }
        // 返回一个promise对象
        // this.axios.post("login",this.loginForm).then(res=>{
        //   console.log(res)
        // })
        // 发送登录请求
      const {data:res}=  await this.axios.post("login",this.loginform)
          if(res.meta.status!==200){
            return this.message.error("登陆失败");
          }
          this.message.success("登录成功");
          // 将登陆成功之后的token,保存到客户端的sessionstorge中
          window.sessionStorage.setItem("token",res.data.token);
          // 通过编程式导航跳转到后台主页，路由地址是/home
          this.$router.push('/home');
      })
    }
  }
}
</script>

<style scoped>
.login_container{
  position: relative;
    background-color:#2b4b6b;
    height: 100%;
}
.login{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.headerbox{
  width: 130px;
  height: 130px;
  position: absolute;
  left: 50%;
  top: -20%;
  transform: translateX(-50%);
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0  10px #ddd;
  border: 1px solid #eee;
  padding: 10px;
}
.headerbox img{
  width: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.forms{
  position:absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing:border-box;
}
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>