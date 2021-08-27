<template>
  <el-container class="honme-container">
    <!-- 顶部菜单栏 -->
    <el-header>
      <div>
        <img src="../assets/logo.jpg" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <!-- <el-aside width="200px"> -->
      <el-aside :width="isCollapse ? '63px':'200px'">
        <!-- 折叠按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏主体 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-sub-menu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板区域 -->
            <template #title>
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/'+subItem.path)"
            >
              <template #title>
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <!-- 右侧菜单栏 -->
      <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>


export default {
  data() {
    return {
      menuList: [],
      //   图标数组
      iconObj: {
        "125": "el-icon-user-solid",
        "103": "el-icon-s-tools",
        "101": "el-icon-s-goods",
        "102": "el-icon-s-order",
        "145": "el-icon-s-data",
      },
      //   侧边栏折叠开关
      isCollapse: false,
    //   被激活的链接地址
      activePath:""
    };
  },
  created() {
    this.getMenuList();
    this.activePath=window.sessionStorage.getItem('activePath');
  },
  methods: {
    // 退出登录事件
    logout() {
      // 1.清除本地token
      window.sessionStorage.clear();
      // 2.跳转到登录页面
      this.$router.push("/login");
    },
    // 获取菜单栏数据
    async getMenuList() {
      const { data: res } = await this.$axios.get("menus");
      // 数据获取失败
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // 数据获取成功
      this.$message.success(res.meta.msg);
      // 获取数据写入数组
      this.menuList = res.data;
    //   console.log(this.menuList);
    },
    // 侧边栏折叠开关
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接激活状态
    saveNavState(activePath){
        // 记录路径到session
        window.sessionStorage.setItem('activePath',activePath)
        // 马上修改激活Index
        this.activePath = activePath
    }
  },
};
</script>

<style>
.el-header {
  background-color: #373d3f;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: white;
  font-size: 40px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header span {
  /* padding-left: 10px; */
}
.el-header img {
  height: 50px;
  width: 50px;
  border-radius: 50%;
}
.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}

.honme-container {
  height: 100%;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: white;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
