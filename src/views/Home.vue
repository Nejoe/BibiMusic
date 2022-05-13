<template>
  <div class="home">
    <el-container>
      <el-aside width="225px">
        <div class="logo">
          <h1>BiBiMusic</h1>
        </div>
        <el-menu
          router
          :default-active="$router.currentRoute.path"
          background-color="#FFFFFF"
        >
          <el-menu-item index="/discover" active-class="active">
            <i class="el-icon-s-shop"></i>
            <span slot="title">发现音乐</span>
          </el-menu-item>
          <el-menu-item index="/search" active-class="active">
            <i class="el-icon-search"></i>
            <span slot="title">搜索</span>
          </el-menu-item>
          <el-menu-item index="/favorites" active-class="active">
            <i class="el-icon-star-on"></i>
            <span slot="title">收藏</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <audio-player></audio-player>
  </div>
</template>

<script>
import AudioPlayer from "../components/player/AudioPlayer";
export default {
  name: "Home",
  components: { AudioPlayer },
  data() {
    return {};
  },
  methods: {
    mounted() {

    },
  },
};
</script>
<style>
.home {
  height: 100%;
  width: 100%;
}
.logo {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
}
.el-aside {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: auto;
  background: #FFFFFF;
  color: #303133;
  border-right:1px solid #E4E7ED;
  /* color: white; */
}
.el-header {
  position: sticky;
  top: 0;
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #DCDFE6;
  background: #FFFFFF;
  /* color: white; */
  z-index: 2;
}
.el-main {
  padding: 0 !important;
  color: #303133;
  background-color: #FAFAFA;
}
.el-container {
  padding-bottom: 90px;
  height: 100%;
}
.el-menu {
  border-right: none !important;
}
.el-menu-item {
  height: 50px !important;
  line-height: 50px !important;
}
</style>
