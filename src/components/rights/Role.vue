<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容" v-model="roleParams.q" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getRoleList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表展示区 -->
      <el-table border :data="roleList" stripe style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bottom_line', i1 === 0 ? 'top_line': '', 'vcenter']"
              v-for="(item1, i1) in scope.row.permissions"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable>{{ item1.auth_name }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '': 'top_line', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag closable type="success">{{ item2.auth_name }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                    >{{ item3.auth_name }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="desc" label="说明"></el-table-column>
        <el-table-column label="创建时间" width="160">
          <template slot-scope="scope">{{ scope.row.create_time | formatTime() }}</template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button size="mini" type="primary">编辑</el-button>
            <el-button size="mini" type="danger">删除</el-button>
            <el-button size="mini" type="warning" @click="showRightDialog(scope.row)">授权</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        small
        @current-change="handleCurrentChange"
        :current-page="roleParams.offset / roleParams.size + 1"
        :page-size="roleParams.size"
        layout="total, prev, pager, next, jumper"
        :total="roleTotal"
      ></el-pagination>
    </el-card>
    <!-- 授权对话框 -->
    <el-dialog title="角色授权" :visible.sync="rightDialogVisible" width="50%" @close="setDialogClosed">
      <span>权限</span>
      <!-- 树状权限结构 -->
      <el-tree
        :data="permissionTree"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rightDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getRoleList();
  },
  data() {
    return {
      roleList: [],
      roleParams: {
        q: "",
        offset: 0,
        size: 10,
        order_by: "-create_time"
      },
      roleTotal: 0,
      rightDialogVisible: false,
      permissionTree: [],
      treeProps: {
        children: "children",
        label: "auth_name"
      },
      checkedKeys: []
    };
  },
  methods: {
      //获取角色列表
    async getRoleList() {
      const { data: res } = await this.$http.get("/role", {
        params: this.roleParams
      });
      if (res.code !== 0) return;
      this.roleList = res.data.items;
      // 角色总数
      this.roleTotal = res.data.total;
    },
    // 分页
    handleCurrentChange(val) {
      this.roleParams.offset = (val - 1) / this.roleParams.size;
      this.getRoleList();
      this.roleParams.offset = 0;
    },
    // 展示授权对话框
    async showRightDialog(role) {
      const { data: res } = await this.$http.get("/permission", {
        params: { mode: "tree" }
      });
      if (res.code !== 0) return;
      console.log(res);
      this.permissionTree = res.data;
      this.getCheckedKeys(role.permissions)
      console.log(this.checkedKeys)


      this.rightDialogVisible = true;
    },
    getCheckedKeys(permissions) {
      permissions.forEach(
        item => {this.recursiveGetCheckedKeys(item, this.checkedKeys)}
      );
    },
    recursiveGetCheckedKeys(node, arr) {
      if (node.children.length  === 0) {
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.recursiveGetCheckedKeys(item, arr);
      });
    },
    setDialogClosed() {
        this.checkedKeys = []
        this.permissionTree = []
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
.el-tag {
  margin: 7px;
}

.top_line {
  border-top: 1px solid #eee;
}
.bottom_line {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
