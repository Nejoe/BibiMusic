<template>
  <div class="home">
    <el-container>
      <el-aside width="225px">
        <div class="logo">
          <h1>BiBiMusic</h1>
        </div>
        <el-menu router :default-active="$router.currentRoute.path">
          <el-menu-item index="/discover" active-class="active">
            <i class="el-icon-s-shop"></i>
            <span slot="title">发现音乐</span>
          </el-menu-item>
          <el-menu-item index="/search" active-class="active">
            <i class="el-icon-search"></i>
            <span slot="title">搜索</span>
          </el-menu-item>
          <el-submenu index="/favorites" active-class="active">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span slot="title">我的收藏</span>
            </template>
            <el-menu-item-group v-if="$store.state.isLogin">
              <template slot="title">创建的歌单<i class="el-icon-plus" style="cursor:pointer"
                  @click="handleClick"></i></template>
              <el-menu-item v-for="item in myPlaylist" :key="item.id" :index="'/playlist/' + item.id">
                <template slot="title" :show-overflow-tooltip="true">
                  <i class="el-icon-document"></i>
                  <span slot="title">{{ item.name }}</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="收藏的歌单" v-if="$store.state.isLogin">
              <el-menu-item v-for="item in myFavorite" :key="item.id" :index="'/playlist/' + item.id">
                <template slot="title">
                  <i class="el-icon-document"></i>
                  <span slot="title">{{ item.name }}</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
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
    return {
      playlistData: [],
    };
  },
  computed: {
    // 我创建的歌单
    myPlaylist() {

      return this.playlistData.filter(item => item.user_id === this.$store.state.userInfo.id);
    },
    // 我收藏的歌单
    myFavorite() {
      if (this.playlistData.length === 0) {
        return []
      } else {
        return this.playlistData.filter(item => item.user_id !== this.$store.state.userInfo.id);
      }
    },
  },
  methods: {
    handleClick() {
      this.$prompt('请输入新歌单标题', '新建歌单', {
        confirmButtonText: '创建',
        cancelButtonText: '取消',
        // 歌单标题正则验证，不能包含@和#和空格和长度不能超过16
        inputPattern: /^[^@\s#]{1,16}$/,
        inputErrorMessage: '歌单名不能包含@或#或空格，长度在1-16之间',
        center: true
      }).then(({ value }) => {
        this.addPlaylist(value);
      }).catch(() => { });
    },
    addPlaylist(name) {
      this.$axios({
        url: '/playlist/addPlaylist',
        method: 'post',
        data: {
          playlist_name: name,
          user_id: this.$store.state.userInfo.id,
          playlist_cover: 'http://localhost:3000/upload/images/playlist_cover/default.png'
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: res.data.msg
          });
          this.getUserPageInfo();
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          });
        }
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '创建中止',
        });
      });
    },
    getUserPageInfo() {
      // 获取歌曲信息
      this.$axios({
        method: "GET",
        url: "/playlist/getUserPageInfo",
        params: {
          user_id: this.$store.state.userInfo.id,
        },
      }).then((res) => {
        if (res.data.code === 200) {
          this.playlistData = res.data.obj;
          // 处理playlistData中每个歌单名字过长的问题
          this.playlistData.forEach(item => {
            if (item.name.length > 8) {
              item.name = item.name.slice(0, 8) + '...';
            }
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
  },
  watch: {
    '$store.state.isLogin': function (newVal, oldVal) {
      if (!newVal) {
        // 清空侧边栏的歌单
        this.playlistData = [];
      }
    },
    // 歌单页面删除后会跳转到Home，监听路由变化，更新侧边栏歌单
    '$store.state.isRefresh': function (newVal, oldVal) {
      if (newVal === true) {
        this.getUserPageInfo();
      }
      this.$store.state.isRefresh = false;
    }
  },
  mounted() {
    this.getUserPageInfo();
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
  /* color: #303133; */
  border-right: 1px solid #E4E7ED;
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
