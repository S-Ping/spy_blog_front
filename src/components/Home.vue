<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <img src="" alt="SPYBlog Admin" />
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="menuIsCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#011429"
          text-color="#fff"
          active-text-color="#1d7af4" router :collapse="menuIsCollapse" unique-opened :collapse-transition="false" :default-active="activeMenu">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.auth_name }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveActiveMenu('/'+subItem.path)">
                <template slot="title">
                <i :class="subItem.icon"></i>
                <span>{{ subItem.auth_name }}</span>
                </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体内容 -->
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      menuIsCollapse: false,
      activeMenu: ''
    }
  },
  created () {
    this.getMenus()
    this.activeMenu = window.sessionStorage.getItem('activeMenu')
  },
  methods: {
    logout () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenus () {
      const { data: res } = await this.$http.get('/menu')
      this.menuList = res.data
    },
    toggleCollapse () {
        this.menuIsCollapse = !this.menuIsCollapse
    },
    saveActiveMenu(path) {
      this.activeMenu = path
      window.sessionStorage.setItem('activeMenu', path)
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #02060a;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-aside {
  background-color: #011429;
  .el-menu {
    border-right: none;
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
}
.el-main {
  background-color: #f0f2f5;
}
.toggle-button {
    background-color: #011429;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}

</style>
