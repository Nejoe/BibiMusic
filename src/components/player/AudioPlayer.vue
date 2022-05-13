<template>
  <div class="player">
    <aplayer ref="aplayer" :autoplay="true" :showLrc="true" :music="currentSong" theme="#409EFF" :volume="1"
      :list="musicList" repeat="repeat-all" :listFolded="true" v-if="refresh"/>
  </div>
</template>

<script>
import Aplayer from "vue-aplayer";
import { mapState } from "vuex";
Aplayer.disableVersionBadge = true;
export default {
  name: "AudioPlayer",
  components: { Aplayer },
  data() {
    return {
      refresh: true,
    };
  },
  methods: {

  },
  computed: {
    ...mapState({ currentSong: "currentSong", musicList: "musicList" }),
  },
  watch: {
    //当前播放歌曲发生变化时，自动播放音乐
    "currentSong"() {
      // vue重新加载refs对象
      this.refresh = false;
      this.$nextTick(()=>{
        this.refresh = true;
      })
    },
    "musicList"() {
      this.refresh = false;
      this.$nextTick(()=>{
        this.refresh = true;
      })
    },
  },
};
</script>
<style>
.player {
  position: fixed;
  bottom: 0;
  width: 100%;
  /* background-color: #181818; */
  /* border-top: 1px solid #DCDFE6; */
}

.aplayer {
  margin: 0 !important;
  /* background-color: #181818 !important; */
}

.aplayer-lrc:after {
  /* background: linear-gradient(
    180deg,
    hsla(0, 0%, 100%, 0) 0,
    hsl(0deg 0% 0% / 0%)
  ) !important; */
}

.aplayer-lrc:before {
  /* background: linear-gradient(
    180deg,
    #181818 0,
    hsla(0, 0%, 100%, 0)
  ) !important; */
}

.aplayer-title {
  /* color: white; */
}

.aplayer-controller .aplayer-time .aplayer-icon .aplayer-fill {
  /* fill: #fff !important ; */
}
</style>