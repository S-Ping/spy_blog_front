<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容" v-model="userParams.q" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表展示区 -->
      <el-table border :data="userList" stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            <span
              v-for="(role, index) in scope.row.roles"
              :key="role.id"
            >{{ index == scope.row.roles.length - 1 ? role.name: role.name + '，'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="上次登录" width="160">
          <template slot-scope="scope">{{ scope.row.last_login | formatTime() }}</template>
        </el-table-column>
        <el-table-column prop="login_ip" label="登录IP"></el-table-column>
        <el-table-column prop="login_addr" label="登陆地"></el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">{{ scope.row.create_time | formatTime() }}</template>
        </el-table-column>
        <el-table-column label="锁定">
          <template slot-scope="scope">
            <el-switch style="display: block" v-model="scope.row.lock"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <el-button size="mini" type="danger">删除</el-button>
          <el-button size="mini" type="warning">分配角色</el-button>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        small
        @current-change="handleCurrentChange"
        :current-page="userParams.offset / userParams.size + 1"
        :page-size="userParams.size"
        layout="total, prev, pager, next, jumper"
        :total="userTotal"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList();
  },
  data() {
    return {
      userList: [],
      userParams: {
        offset: 0,
        size: 10,
        q: "",
        order_by: "-create_time"
      },
      userTotal: 0
    };
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("/user", {
        params: this.userParams
      });
      if (res.code !== 0) return;
      this.userTotal = res.data.total;
      this.userList = res.data.items;
    },
    handleCurrentChange(val) {
      this.userParams.offset = (val - 1) / this.userParams.size;
      this.getUserList();
      this.userParams.offset = 0;
    }
  }
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
