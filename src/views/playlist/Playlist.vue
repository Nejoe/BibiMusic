<template>
    <div>
        <el-header>
            <nav-bar></nav-bar>
        </el-header>
        <el-main>
            <div class="main">
                <el-row>
                    <div class="playlistInfoArea">
                        <el-image style="width: 225px; height: 225px; margin-right: 20px"
                            :src="playlistData[0].playlist_cover" lazy>
                        </el-image>
                        <div class="playlistInfo">
                            <p>歌单</p>
                            <p>{{ playlistData[0].playlist_name }}</p>
                            <p>
                                <el-icon class="el-icon-tickets"></el-icon>{{
                                        playlistData[0].description ? playlistData[0].description : '暂无描述'
                                }}
                            </p>
                            <el-button-group>
                                <el-button type="primary" icon="el-icon-caret-right"
                                    @click="changeMusicList(playlistData)">播放全部</el-button>
                                <el-button icon="el-icon-star-off">收藏</el-button>
                                <!-- <el-button type="primary" icon="el-icon-star-on">收藏</el-button> -->
                                <el-button icon="el-icon-chat-dot-round" @click="goAnchor('comment')">评论
                                    ({{ totalComment
                                    }})</el-button>
                            </el-button-group>
                        </div>
                    </div>
                    <div class="musicListArea">
                        <el-table :data="playlistData" stripe style="width: 100%;background-color: #FAFAFA;">
                            <el-table-column width="50px">
                                <template slot-scope="scope">
                                    <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
                                    <el-button icon="el-icon-caret-right" size="mini"
                                        @click="playMusic(scope.row.music_id)" circle></el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="封面" width="80px">
                                <template slot-scope="scope">
                                    <el-image style="width: 50px; height: 50px; margin-right: 20px; border-radius: 5px;"
                                        :src="scope.row.music_cover">
                                    </el-image>
                                </template>
                            </el-table-column>
                            <el-table-column label="标题" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <el-link @click="goMusicDetail(scope.row.music_id)">{{ scope.row.music_name }}
                                    </el-link>
                                </template>
                            </el-table-column>
                            <el-table-column label="歌手" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <el-link>{{ scope.row.artist_name }}</el-link>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-col :span="17">
                        <div class="commentArea" ref="comment">
                            <!-- 发布评论 -->
                            <div class="myComment">
                                <h2>评论</h2>
                                <span>共{{ totalComment }}条评论</span>
                                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea"
                                    maxlength="140" show-word-limit resize="none">
                                </el-input>
                                <el-button type="primary" size="small" @click="send">评论</el-button>
                            </div>
                            <!-- 循环加载评论 -->
                            <div class="allComment" v-show="totalComment!==0">
                                <h3>最新评论</h3>
                                <div class="comment" v-for="(comment, index) in comments" :key="index">
                                    <div class="commentHeader">
                                        <el-avatar shape="square" size="large" :src="comment.avatarUrl"></el-avatar>
                                    </div>
                                    <div class="commentContent">
                                        <el-link type="primary">{{ comment.nickname }}:</el-link>
                                        <div class="comment-content">{{ comment.content }}</div>
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
                                    </div>
                                </div>
                            </div>
                            <!-- 分页 -->
                            <el-pagination background layout="prev, pager, next" :total="totalComment"
                                :current-page="currentPage" @current-change="currentChange"
                                :hide-on-single-page="totalComment <= pageSize">
                            </el-pagination>
                        </div>
                    </el-col>
                    <el-col :span="7">
                        <div class="randomArea">
                            <h2>随机推荐歌单</h2>
                            <el-card :body-style="{ padding: '0px' }" v-for="playlist in randomPlaylist"
                                :key="playlist.id" shadow="hover" @click.native="goPlaylistDetail(playlist.id)">
                                <img :src="playlist.cover" class="image">
                                <div class="card-right">
                                    <p>{{ playlist.name }}</p>
                                    <p>{{ playlist.description }}</p>
                                </div>
                            </el-card>
                        </div>
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
    name: "Playlist",
    components: { NavBar },
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            totalComment: 0,
            textarea: "",
            playlistData: [{
                playlist_cover: "",
            }],
            randomPlaylist: [],
            comments: [],
        }
    },
    methods: {
        ...mapActions({
            changeMusicList: "changeMusicList",
            playMusic: "changeCurrentSong"
        }),
        // 滑动到评论
        goAnchor(selector) {
            this.$refs[selector].scrollIntoView({
                behavior:"smooth",
            });
        },
        goMusicDetail(id) {
            this.$router.push({
                name: "Music",
                params: { id },
            });
        },
        goPlaylistDetail(id) {
            console.log(id);
            this.$router.push({
                name: "Playlist",
                params: { id },
            });
            // 刷新
            this.$nextTick(() => {
                this.getPlaylistById();
                this.getComment();
                this.getRandomPlaylist();
            });
        },
        currentChange(currentPage) {
            this.currentPage = currentPage;
            this.getComment();
        },
        getComment() {
            // 根据歌单id获取评论
            this.$axios({
                url: "/comment/getPlaylistComment",
                method: "get",
                params: {
                    playlist_id: this.$route.params.id,
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
                // 发送歌单评论请求
                this.$axios({
                    method: "POST",
                    url: "/comment/addPlaylistComment",
                    data: {
                        playlist_id: this.$route.params.id,
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
        },
        getPlaylistById() {
            // 获取歌单信息
            this.$axios({
                method: "GET",
                url: "/playlist/getPlaylistById",
                params: {
                    playlist_id: this.$route.params.id,
                },
            }).then((res) => {
                console.log(res.data);
                this.playlistData = res.data.obj;
            });
        },
        getRandomPlaylist() {
            // 获取随机歌单，传入该页面的id，防止获取到自己的歌单
            this.$axios({
                method: "GET",
                url: "/playlist/getRandomPlaylist",
                params: {
                    playlist_id: this.$route.params.id,
                    limit: 3,
                },
            }).then((res) => {
                this.randomPlaylist = res.data.obj;
            });
        }

    },
    mounted() {
        this.getPlaylistById();
        this.getRandomPlaylist();
        this.getComment();
    },

}
</script>

<style>
.playlistInfoArea {
    display: flex;
    justify-content: flex-start;
    /* margin-bottom: 70px; */
}

.playlistInfo {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.playlistInfo>p:nth-of-type(2) {
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
    /* display: flex;
  flex-direction: column; */
    /* justify-content: space-between; */
    width: 100%;
    /* align-self: stretch; */
    /* flex: 29; */
    /* align-items: flex-start; */
}

.commentContent> :nth-child(1) {
    /* align-self: flex-start; */
}

.comment-content {
    width: 100%;
    /* height: 50px; */
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

.randomArea {
    padding-top: 80px;
}

.el-card {
    margin-top: 20px;
    width: 80%;
}

.el-card img {
    margin-right: 20px;
}

.el-card__body {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    cursor: pointer;
}

.card-right {}

.card-right>p:nth-of-type(1) {
    font-size: 20px;
}

.el-pagination {
    align-self: center;
}
</style>