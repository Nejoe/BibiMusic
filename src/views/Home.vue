<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">
        <div class="logo">
          <h1>BiBiMusic</h1>
        </div>
        <el-menu
          router
          :default-active="$router.currentRoute.path"
          background-color="#000000"
          text-color="#b3b3b3"
          active-text-color="#FFFFFF"
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
      // this.$axios({
      //   url: "http://music.163.com/api/song/media?id=1485777161",
      //   method: "get",
      // }).then((res) => {
      //   console.log(res);
      // });
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
  text-align: center;
}
.el-aside {
  display: block;
  width: auto;
  background: #000000;
  color: white;
}
.el-header {
  position: sticky;
  top: 0;
  width: 100%;
  height: 60px;
  background: #070707;
  color: white;
}
.el-main {
  padding: 0 !important;
  color: white;
  background-color: #121212;
}
.el-container {
  padding-bottom: 90px;
  height: 100%;
}
.el-menu {
  border-right: none !important;
}
.el-menu-item:hover > i,
.el-menu-item:hover > span {
  color: #ffffff;
}
li {
  list-style: none;
}
</style>
