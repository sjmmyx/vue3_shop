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
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <template #append>
              <el-button icon="el-icon-search" @click="getUserList"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="isShowAddForm = true"
            >用户添加</el-button
          >
        </el-col>
      </el-row>
      <!-- 数据表格 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="ID"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 操作区 > 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <!-- 操作区 > 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row)"
            ></el-button>
            <!-- 操作区 > 设置按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      v-model="isShowAddForm"
      width="40%"
      @close="addDialogFormClose"
    >
      <!-- 对话框内容主体信息 表单信息 -->
      <el-form
        :model="addDialogForm"
        :rules="addFormRules"
        ref="addFormRef"
        :label-position="labelPosition"
        label-width="80px"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addDialogForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addDialogForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addDialogForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addDialogForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部信息 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowAddForm = false">取 消</el-button>
          <el-button type="primary" @click="addBtn">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单对其方式
      labelPosition: "left",
      // 获取用户列表的参数
      queryInfo: {
        // 搜索内容
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      //   添加用户弹框数据
      addDialogForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //   用户总数
      total: 0,
      //   用户列表
      userList: [],
      //   添加用户对话框开关
      isShowAddForm: false,
      //   添加用户框校验规则
      addFormRules: {
        // 校验用户名
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        // 校验密码
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        // 校验邮箱
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        // 校验手机号
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
      },
    };
  },
  // 模板加载自动执行事件
  created() {
    // 获取服务端列表数据
    this.getUserList();
  },
  methods: {
    // 关闭对话框清空数据
    addDialogFormClose() {
      this.$refs["addFormRef"].resetFields();
    },
    // 获取用户列表 方法
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
    // 监听pagesize 改变事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      // 保存到pagesize
      this.queryInfo.pagesize = newSize;
      // 重新发起请求
      this.getUserList();
    },
    // 监听 页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      // 保存到pagenum
      this.queryInfo.pagenum = newPage;
      // 重新发起请求
      this.getUserList();
    },
    // 监听用户状态修改
    async userStateChanged(state) {
      const uId = state.id;
      const type = state.mg_state;
      const api = `users/${uId}/state/${type}`;
      // 发送API请求
      const { data: res } = await this.$axios.put(api);
      if (res.meta.status !== 200) {
        state.mg_state = !state.mg_state;
        return this.$message.error("用户状态修改失败 " + res.meta.msg);
      }
      this.$message.success(`用户： ${state.username} 状态修改成功`);
    },
    // 添加用户按钮
    addBtn() {
      // 1. 再次校验表单数据
      this.$refs["addFormRef"].validate(async (valid) => {
        if (!valid) {
          return;
        }
        // 2. 校验通过发起网络请求
        const { data: res } = await this.$axios.post(
          "users",
          this.addDialogForm
        );
        //    2.1 添加失败 返回服务端数据
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败： " + res.meta.msg);
        }
        // 2.2 添加成功，关闭列表，刷新表单数据
        this.$message.success("添加成功");
        this.getUserList();
        this.isShowAddForm = false;
      });
    },
    // 删除用户
    async deleteUser(row) {
      const uId = row.id;
      const username = row.username;
      this.$confirm(
        `确认永久删除用户：[ ${username} ]  (此操作不可恢复！)`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          // 1.发送AXIOS请求后台删除
          const { data: res } = await this.$axios.delete("users/" + uId);
          //   2.判断服务器返回状态码
          //   2.1如果状态码不为200 删除失败
          if (res.meta.status !== 200) {
            return this.$message.error("删除失败： " + res.meta.msg);
          }
          //   2.2 状态码为200删除成功
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          //   3.刷新用户列表信息
          this.getUserList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.el-pagination {
  margin-top: 15px;
}
</style>
