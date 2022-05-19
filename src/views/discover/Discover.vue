<template>
  <div>
    <el-header>
      <nav-bar></nav-bar>
    </el-header>
    <el-main v-loading="loading">
      <div class="main">
        <div class="playlist" v-for="(item, index) in playlist" :key="index">
          <div class="title">
            <h2>{{ item.playlistTitle }}</h2>
            <el-button @click="goPlaylistDetail(item.id)">查看全部</el-button>
          </div>
          <ul class="list">
            <li class="item" @click="goMusicDetail(song.id)" v-for="song in item.musicList" :key="song.id">
              <div class="cover">
                <img :src="'/api' + song.cover" alt="" />
                <button class="play" @click.stop="playMusic(song.id)">
                  <i class="el-icon-caret-right"></i>
                </button>
              </div>
              <span>{{ song.name }}</span>
            </li>
          </ul>
        </div>
      </div>
    </el-main>
  </div>
</template>
<script>
import NavBar from "../../components/navBar/NavBar";
import { mapActions } from "vuex";
export default {
  name: "Discover",
  components: { NavBar },
  data() {
    return {
      loading: true,
      showPlayBtn: false,
      songLimit: 6,
      //歌单列表数据
      playlist: [],
    };
  },
  methods: {
    ...mapActions({ playMusic: "changeCurrentSong" }),
    goMusicDetail(id) {
      this.$router.push({
        name: "Music",
        params: { id },
      });
    },
    goPlaylistDetail(id) {
      this.$router.push({
        name: "Playlist",
        params: { id },
      });
    },
    getDiscoverPlaylist() {
      // 获取部分歌单来展示
      this.$axios({
        url: "/playlist/getDiscoverPlaylist",
        method: "GET",
        params: {
          page: 1,
          pageSize: 10,
          songLimit: this.songLimit,
        },
      }).then((res) => {
        this.playlist = res.data.obj;
        this.loading = false;
      });
    }
  },
  created() {
    this.getDiscoverPlaylist();
  },
  mounted() {

  },
};
</script>
<style>
.main {
  display: flex;
  padding: 20px;
  flex-direction: column;
  justify-content: space-between;
}

.playlist {
  margin-bottom: 25px;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.item {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin: 0 20px 30px 0;
  width: 180px;
  height: 230px;
  background-color: #FFFFFF;
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.item>span {
  text-align: center;
  max-width: 160px;
}

.item:hover {
  background-color: #EBEEF5;
}

.item:hover>.cover {
  /* 边框暗阴影 */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.item:hover :nth-child(2) {
  visibility: visible;
  /* display: block; */
  opacity: 1;
}

.cover {
  position: relative;
  /* padding: 10px; */
  width: 150px;
  height: 150px;
  border-radius: 5px;
  overflow: hidden;
}

.cover img {
  width: 100%;
  height: 100%;
}

.play {
  visibility: hidden;
  /* display: none; */
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background-color: #409eff;
  transition: all 0.2s ease-in-out;
  translate: 50px;
  opacity: 0;
}

.play:hover {
  bottom: 7px;
  right: 7px;
  width: 36px;
  height: 36px;
}
</style>