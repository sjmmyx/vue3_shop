<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 格栅系统 -->
      <el-row :gutter="30">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input placeholder="请输入内容">
            <template #append>
              <el-button icon="el-icon-search"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary">用户添加</el-button>
        </el-col>
      </el-row>
      <!-- 数据表格 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="ID"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态"></el-table-column>
        <el-table-column prop="" label="操作"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取用户列表的参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      total: 0,
      userList: [],
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$axios.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户数据失败：" + res.meta.msg);
      }
      this.$message.success(res.meta.msg);
      this.total = res.data.total;
      this.userList = res.data.users;
      console.log(this.userList);
    },
  },
};
</script>

<style>

</style>
