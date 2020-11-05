<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容" v-model="articleParams.q" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getArticleList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- <el-button type="primary" @click="addArticle">添加文章</el-button> -->
          <el-dropdown trigger="click" @command="handleCommand">
          <el-button type="primary">
            添加文章<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">新建文章</el-dropdown-item>
            <el-dropdown-item command="2">新建markdown</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </el-col>
      </el-row>
      <!-- 文章列表展示区 -->
      <el-table border :data="articleList" stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="view_counts" label="阅读数"></el-table-column>
        <el-table-column prop="weight" label="置顶"></el-table-column>
        <el-table-column label="作者" prop="author.nickname"></el-table-column>
        <el-table-column label="创建时间" width="160">
          <template slot-scope="scope">{{ scope.row.create_time | formatTime() }}</template>
        </el-table-column>
        <el-table-column label="公开">
          <template slot-scope="scope">
            <el-switch style="display: block" v-model="scope.row.publish"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <el-button size="mini" type="primary">编辑</el-button>
          <el-button size="mini" type="danger">删除</el-button>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        small
        @current-change="handleCurrentChange"
        :current-page="articleParams.offset / articleParams.size + 1"
        :page-size="articleParams.size"
        layout="total, prev, pager, next, jumper"
        :total="articleTotal"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getArticleList();
  },
  data() {
    return {
      articleList: [],
      articleParams: {
        q: "",
        offset: 0,
        size: 10,
        order_by: "-create_time"
      },
      articleTotal: 0
    };
  },
  methods: {
    async getArticleList() {
      const { data: res } = await this.$http.get("/article", {
        params: this.articleParams
      });
      console.log(res);
      if ( res.code !== 0 ) return
      this.articleList = res.data.items
      this.articleTotal = res.data.total
    },
    handleCurrentChange(val) {
      this.articleParams.offset = (val - 1) / this.articleParams.size;
      this.getArticleList();
      this.articleParams.offset = 0;
    },
    handleCommand(command) {
      if (command === "1") {
        // this.$router.push('/article/add')
        console.log('富文本')
      } else {
        this.$router.push('/article/add')
      }
      
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
