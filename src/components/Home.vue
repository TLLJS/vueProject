<template>
  <div class="elcontainer">
      <el-container class="elcontainer">
          <!-- 头部区域 -->
        <el-header class="header">
            <div class="headers">
                <img src="../assets/logo.png" alt="" style="width:61px;height:56px">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="loginOut()">退出</el-button>
        </el-header>
        <!-- 页面主题区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="widths">
                <!-- 折叠按钮 -->
                <div class="btn" @click="togglebtn()">|||</div>
                <!-- 菜单区域 default-active列表中某项被激活时的状态 :collapse-transition是否启用折叠动画建议不启用容易卡顿 :collapse是否折叠 :router是否开启路由模式-->
                <el-menu :default-active='activePath' :router='true' :collapse-transition='false' :collapse="changeMenus" background-color="#333744" text-color="#fff" active-text-color="#409BFF" :unique-opened='true'>
                    <!-- 一级菜单 -->
                    <!-- index只接受字符串必须将数字转化为字符串 -->
                    <el-submenu :index="index.toString()" v-for="(item,index) of  menuList" :key='index'>
                        <!-- 模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/'+items.path" v-for="(items,indes) of item.children" :key='indes' @click="saveNavState('/'+items.path)">
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                                <span>{{items.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
      </el-container>
  </div>
</template>

<script>
export default {
    data(){
        return{
            // 左侧菜单的数据
            menuList:[],
            // 左侧菜单图标数据
            iconsObj:{
                125:'iconfont icon-users',
                103:'iconfont icon-tijikongjian',
                101:'iconfont icon-shangpin',
                102:'iconfont icon-danju',
                145:'iconfont icon-baobiao'
            },
            // 控制菜单折叠
            changeMenus:false,
            // 菜单的宽度的数据
            widths:'200px',
              // 菜单高亮
            activePath:""
        }
    },
    methods:{
        // 退出登录
        loginOut(){
            // 清除token
            window.sessionStorage.removeItem('token');
            // 跳转的登录页
            this.$router.push('/login')
        },
        // 获取菜单数据
      async  getList(){
            const {data:res}=await this.axios.get('menus')
            if(res.meta.status!==200){
                return this.message.error(res.meta.msg);
            }
            this.menuList=res.data;
        },
        // 侧边菜单的折叠与展开
        togglebtn(){
            this.changeMenus=!this.changeMenus;
            if(this.changeMenus){
                this.widths='64px'
            }else{
                this.widths='200px'
            }
        },
        // 保存菜单中某一项被激活的index,赋值给default-active即可被激活显示
        saveNavState(paths){
            window.sessionStorage.setItem('active',paths);
            // 没有刷新页面时的高亮显示某个菜单
            this.activePath=paths;
        }
    },
    created(){
        this.getList();
        // 刷新页面保证高亮激活的菜单
        this.activePath=window.sessionStorage.getItem('active');
    },

}
</script>

<style scoped>
.elcontainer{
    height: 100%;
}
.header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #373d41;
    padding-left: 0;
    color: #fff;
    font-size: 20px;
}
.headers{
    display: flex;
    align-items: center;
}
.headers span{
    margin-left: 15px;
}
.el-aside{
    background-color: #333744;
}
.el-main{
    background-color: #eaedf1;
}
.el-menu{
    border: 0;
}
.iconfont{
    margin-right: 10px;
}
.btn{
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    cursor: pointer;
    text-align: center;
    letter-spacing: 2px;
}
</style>