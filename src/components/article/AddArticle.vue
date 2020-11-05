<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加文章</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- <mavon-editor v-model="context" :toolbars="toolbars" /> -->
      <!-- 标题区域 -->

      <!-- 文章编辑区域 -->
      <div id="article_editor">
        <Markdown v-if="editorType==='1'" />
        <wang-editor
        style='height:300px;'
        v-model="value"
    ></wang-editor>
      </div>
    </el-card>
  </div>
</template>

<script>
import Markdown from "../../plugins/markdown/pro";
import wangEditor  from "./wang-editor"
export default {
  data() {
    return {
      editorType: "2",
      value: '',
    };
  },
  components: {
    Markdown,
    wangEditor
  }
};
</script>

<style lang="less" scoped>
</style>
