<template>
  <div>
    <el-header>
      <nav-bar></nav-bar>
    </el-header>
    <el-main>
      <div class="main">
        <div class="playlist" v-for="(item, index) in playlist" :key="index">
          <div class="title">
            <h2>{{ item.playlistTitle }}</h2>
            <span>查看全部</span>
          </div>
          <ul class="list">
            <li
              class="item"
              @click="playMusic(song.id)"
              v-for="song in item.musicList"
              :key="song.id"
            >
              <div class="cover">
                <img :src="song.cover" alt="歌曲封面" />
              </div>
              <!-- <button class="play">
                  <i class="el-icon-caret-right"></i>
                </button> -->
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
      //歌单列表数据
      playlist: [
        {
          playlistTitle: "热门歌曲",
          musicList: [
            {
              id: 1,
              name: "バッグパイパー",
              cover:
                "https://p1.music.126.net/-y3BfZwvRZrI3awBbR8m-w==/1420569023661522.jpg?param=130y130",
            },
            {
              id: 2,
              name: "空っぽの空に潰される",
              cover:
                "https://p2.music.126.net/OpGFAyxs4qY2U5lfrLwx8w==/109951166200423289.jpg?param=130y130",
            },
            {
              id: 3,
              name: "Rap God",
              cover:
                "https://p1.music.126.net/kkjR8eZGGM1AUYs1_6EGHQ==/109951165378735128.jpg?param=130y130",
            },
            {
              id: 4,
              name: "BiBiC HEART",
              cover:
                "https://p1.music.126.net/eUx3ZA2ww-oz8fVTpRgBGQ==/109951166339020379.jpg?param=130y130",
            },
            {
              id: 5,
              name: "The 89's Momentum",
              cover:
                "https://p2.music.126.net/M_UW-PpjlbF0-9TxlHfUSg==/109951166337486481.jpg?param=130y130",
            },
          ],
        },
        {
          playlistTitle: "纯音乐",
          musicList: [
            {
              id: 1,
              name: "バッグパイパー",
              cover:
                "https://p1.music.126.net/-y3BfZwvRZrI3awBbR8m-w==/1420569023661522.jpg?param=130y130",
            },
            {
              id: 4,
              name: "BiBiC HEART",
              cover:
                "https://p1.music.126.net/eUx3ZA2ww-oz8fVTpRgBGQ==/109951166339020379.jpg?param=130y130",
            },
            {
              id: 5,
              name: "The 89's Momentum",
              cover:
                "https://p2.music.126.net/M_UW-PpjlbF0-9TxlHfUSg==/109951166337486481.jpg?param=130y130",
            },
          ],
        },
        {
          playlistTitle: "日语",
          musicList: [
            {
              id: 2,
              name: "空っぽの空に潰される",
              cover:
                "https://p2.music.126.net/OpGFAyxs4qY2U5lfrLwx8w==/109951166200423289.jpg?param=130y130",
            },
          ],
        },
        {
          playlistTitle: "欧美",
          musicList: [
            {
              id: 3,
              name: "Rap God",
              cover:
                "https://p1.music.126.net/kkjR8eZGGM1AUYs1_6EGHQ==/109951165378735128.jpg?param=130y130",
            },
          ],
        },
      ],
    };
  },
  methods: {
    ...mapActions({ playMusic: "setCurrentSong" }),
  },
  computed: {},
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
  margin-right: 30px;
  width: 180px;
  height: 230px;
  background-color: #181818;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.item:hover {
  background-color: #282828;
}
.item:hover > .cover {
  /* 边框暗阴影 */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}
.cover {
  /* position: relative; */
  /* padding: 10px; */
  width: 150px;
  height: 150px;
  border-radius: 5px;
  overflow: hidden;
}
.cover > img {
  width: 100%;
  height: 100%;
}
.play {
  /* position:relative ;
  bottom: 20px;
  right: 20px; */
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background-color: #1fdf64;
  transition: all 0.1s ease;
  translate: 50px;
}
.play:hover {
  bottom: 17px;
  right: 17px;
  width: 35px;
  height: 35px;
}
</style>