<template>
  <div>
    <el-header>
      <nav-bar></nav-bar>
    </el-header>
    <el-main>
      <div class="main">
        <el-row>
          <div class="musicInfoArea">
            <el-image style="width: 225px; height: 225px; margin-right: 20px;border-radius: 4px;"
              :src="musicData.music.cover">
            </el-image>
            <div class="musicInfo">
              <p>单曲</p>
              <p>{{ musicData.music.name }}</p>
              <div>
                <el-icon class="el-icon-user"></el-icon>
                <!-- <el-link v-for="(artist, index) in artistList" :key="index">
                  {{ artist }}
                </el-link> -->
                <!-- <el-link v-model="musicData" :key="index">
                  {{ musicData.artist }}
                </el-link> -->
                <el-link style="margin-left:5px" v-for="(artist, index) in musicData.artist" :key="index"
                  @click="goDetail(artist.id, 'Artist')">
                  {{ artist.name }}
                </el-link>
              </div>
              <el-button-group>
                <el-button type="primary" icon="el-icon-caret-right" @click="playMusic($route.params.id)">播放</el-button>
                <!-- <el-button icon="el-icon-star-off">收藏</el-button> -->
                <el-button icon="el-icon-chat-dot-round" @click="goAnchor('comment')">评论 ({{ totalComment
                }})</el-button>
                <el-button icon="el-icon-circle-plus-outline">添加到</el-button>
              </el-button-group>
            </div>
          </div>
          <el-col :span="17">
            <div class="commentArea" ref="comment">
              <!-- 发布评论 -->
              <div class="myComment">
                <h2>评论</h2>
                <span>共{{ totalComment }}条评论</span>
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea" maxlength="140"
                  show-word-limit resize="none">
                </el-input>
                <el-button type="primary" size="small" @click="send">评论</el-button>
              </div>
              <!-- 循环加载评论 -->
              <div class="allComment" v-show="totalComment !== 0">
                <h3>最新评论</h3>
                <div class="comment" v-for="(comment, index) in comments" :key="index">
                  <div class="commentHeader">
                    <el-avatar shape="square" size="large" :src="comment.avatarUrl"></el-avatar>
                  </div>
                  <div class="commentContent">
                    <div class="comment-content">
                      <el-link type="primary" @click="goDetail(comment.user_id, 'User')">{{ comment.nickname }} :
                      </el-link> {{ comment.content }}
                    </div>
                    <!-- 引用的评论
                    <div class="comment-reply"></div> -->
                    <div class="comment-info">
                      <p class="comment-createTime">{{ comment.createTime }}</p>
                      <div>
                        <!-- 删除按钮 -->
                        <el-button size="mini" @click="delButton(comment.id)"
                          v-if="$store.state.userInfo.is_admin === 1 || (comment.user_id === $store.state.userInfo.id)"
                          plain>
                          <el-icon class="el-icon-delete"></el-icon>
                          <span>删除</span>
                        </el-button>
                        <!-- 回复按钮 -->
                        <el-button size="mini" plain @click="reply(comment.nickname)">
                          <el-icon class="el-icon-chat-dot-round"></el-icon>
                          <span>回复</span>
                        </el-button>
                      </div>
                    </div>
                    <!-- 回复时出现回复输入框
                    <div class="reply-area">

                    </div> -->
                  </div>
                </div>
              </div>
              <!-- 分页 -->
              <el-pagination background layout="prev, pager, next" :total="totalComment" :current-page="currentPage"
                @current-change="currentChange" :hide-on-single-page="totalComment <= pageSize">
              </el-pagination>
            </div>
          </el-col>
          <el-col :span="7">
            <h2>包含这首歌的歌单</h2>
            <el-card :body-style="{ padding: '0px' }" v-for="playlist in playlistData" :key="playlist.id" shadow="hover"
              @click.native="goDetail(playlist.id, 'Playlist')">
              <img :src="playlist.cover" class="image">
              <div class="card-right">
                <p>{{ playlist.name }}</p>
                <p>{{ playlist.description }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </div>
</template>

<script>
import NavBar from "../../components/navBar/NavBar";
import { mapActions } from "vuex";
export default {
  name: "Music",
  components: { NavBar },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totalComment: 0,
      textarea: "",
      musicData: {
        music: {
          // 初始化歌曲封面url，防止页面加载时控制台报错
          cover: "",
        },
        artist: [{}],
      },
      playlistData: [],
      comments: [],
    };
  },
  methods: {
    ...mapActions({ playMusic: "changeCurrentSong" }),
    // 滑动到评论
    goAnchor(selector) {
      this.$refs[selector].scrollIntoView({
        behavior: "smooth",
      });
    },
    goDetail(id, type) {
      this.$router.push({
        name: type,
        params: { id }
      })
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.getComment();
    },
    getComment() {
      // 根据歌曲id获取评论
      this.$axios({
        url: "/comment/getMusicComment",
        method: "get",
        params: {
          music_id: this.$route.params.id,
          page: this.currentPage,
          pageSize: this.pageSize,
        },
      }).then((res) => {
        if (res.data.code === 200) {
          this.totalComment = res.data.obj.total;
          this.comments = res.data.obj.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    deleteComment(id) {
      this.$axios({
        url: "/comment/deleteComment",
        method: "post",
        data: {
          comment_id: id,
        },
      }).then((res) => {
        if (res.data.code === 200) {
          this.$message.success(res.data.msg);
          this.getComment();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    send() {
      if (!this.$store.state.isLogin) {
        this.$message.error("请先登录再评论");
        return;
      } else if (this.textarea.length === 0) {
        this.$message.warning("请输入评论内容");
        return;
      } else {
        // 发送评论请求
        this.$axios({
          method: "POST",
          url: "/comment/addMusicComment",
          data: {
            music_id: this.$route.params.id,
            content: this.textarea,
            user_id: this.$store.state.userInfo.id,
          },
        }).then((res) => {
          if (res.data.code === 200) {
            this.$message.success(res.data.msg);
            this.textarea = "";
            this.getComment();
          } else {
            this.$message.error(res.data.msg);
          }
        })
      }
    },
    reply(nickname) {
      this.textarea = `回复：${nickname} `;
    },
    delButton(id) {
      this.$confirm('确定删除评论?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteComment(id);
      }).catch(() => { });
    }
  },
  computed: {
  },
  mounted() {
    // 根据网页路径的参数，获取歌曲
    this.$axios({
      url: "/music/getMusicById",
      method: "get",
      params: {
        id: this.$route.params.id,
      },
    }).then((res) => {
      if (res.data.code === 200) {
        this.musicData = res.data.obj;
      } else {
        this.$message.error(res.data.msg);
      }
    });
    // 获取歌曲相关歌单
    this.$axios({
      url: "/playlist/getMusicPlaylist",
      method: "get",
      params: {
        id: this.$route.params.id,
      },
    }).then((res) => {
      if (res.data.code === 200) {
        this.playlistData = res.data.obj;
      } else {
        this.$message.error(res.data.msg);
      }
    });
    // 获取评论
    this.getComment();
  },
};
</script>

<style>
.musicInfoArea {
  display: flex;
  justify-content: flex-start;
}

.musicInfo {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.musicInfo>p:nth-of-type(2) {
  font-size: 60px;
}

.commentArea {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-right: 70px;
  padding-top: 80px;
}

.allComment>h3 {
  margin-bottom: 20px
}

.comment {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-top: 15px;
  padding-bottom: 15px;
  width: 100%;
  border-top: 1px solid #ccc;
}

.commentHeader {
  margin-right: 10px;
}

.commentContent {
  width: 100%;
}

.comment-content {
  width: 100%;
  font-size: 14px;
  word-break: break-all;
}

.comment-info {
  display: flex;
  justify-content: space-between;
}

.comment-createTime {
  align-self: center;
  font-size: 12px;
  color: #909399;
}

.myComment {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 0 40px 0;
  height: 200px;
}

.myComment>.el-button {
  align-self: flex-end;
}

.el-card {
  margin-top: 20px;
  width: 80%;
}

.el-card img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}

.el-card__body {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  cursor: pointer;
}

.card-right>p:nth-of-type(1) {
  font-size: 20px;
}

.el-pagination {
  align-self: center;
}
</style>