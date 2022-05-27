<template>
    <div>
        <el-header>
            <nav-bar></nav-bar>
        </el-header>
        <el-main>
            <div class="main">
                <el-row>
                    <div class="playlistInfoArea">
                        <el-image fit="cover"
                            style="width: 225px; height: 225px; margin-right: 20px ;border-radius: 4px;"
                            :src="'/api' + playlistInfo.playlist_cover" :lazy="true">
                        </el-image>
                        <div class="playlistInfo">
                            <p>歌单</p>
                            <p>{{ playlistInfo.playlist_name }}</p>
                            <div>
                                <el-icon class="el-icon-user"></el-icon>
                                <el-link style="margin-left:5px" @click="goDetail(playlistInfo.user_id, 'User')">
                                    {{ playlistInfo.creater_name }}
                                </el-link>
                            </div>
                            <p>
                                <el-icon class="el-icon-tickets"></el-icon>{{
                                        playlistInfo.description ? playlistInfo.description : '暂无描述'
                                }}
                            </p>
                            <el-button-group>
                                <el-button type="primary" icon="el-icon-caret-right"
                                    @click="changeMusicList(playlistData)" :disabled="is_empty">
                                    播放全部</el-button>
                                <el-button :icon="favoriteIcon" :disabled="is_okToFavorite"
                                    @click="changePlaylistFavorite">
                                    收藏
                                </el-button>
                                <el-button icon="el-icon-chat-dot-round" @click="goAnchor('comment')">
                                    评论({{ totalComment }})
                                </el-button>
                                <el-button icon="el-icon-edit" v-if="is_myPlaylist" @click="handleEdit">
                                    编辑歌单信息
                                </el-button>
                                <el-button type="danger" v-if="is_myPlaylist" @click="handleDelete">删除</el-button>
                            </el-button-group>
                        </div>
                    </div>
                    <!-- 修改歌单信息框 -->
                    <el-dialog title="编辑歌单信息" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
                        <el-form :model="form" :rules="rules" ref="form">
                            <el-form-item label="歌单名" prop="playlist_name">
                                <el-input v-model="form.playlist_name" autocomplete="off" maxlength="40"
                                    show-word-limit></el-input>
                            </el-form-item>
                            <el-form-item label="简介" prop="description">
                                <el-input type="textarea" :rows="2" v-model="form.description"
                                    :autosize="{ minRows: 2, maxRows: 5 }" maxlength="56" show-word-limit resize="none">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="歌单封面" prop="playlist_cover">
                                <el-upload action="#" :auto-upload="true" :limit="1" ref="uploadCover"
                                    :file-list="fileList" :on-change="handleCoverChange"
                                    :before-upload="beforeCoverUpload" :before-remove="beforeCoverRemove"
                                    :http-request="uploadCover" list-type="picture">
                                    <el-button slot="trigger" size="small" type="primary">上传封面文件</el-button>
                                </el-upload>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="submitForm('form')">确 定</el-button>
                        </div>
                    </el-dialog>
                    <div class="musicListArea">
                        <el-table :data="playlistData" stripe style="width: 100%;margin-top: 20px;" v-if="!is_empty">
                            <el-table-column width="50px">
                                <template slot-scope="scope">
                                    <el-button icon="el-icon-caret-right" size="mini"
                                        @click="playMusic(scope.row.music_id)" circle></el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="封面" width="80px">
                                <template slot-scope="scope">
                                    <el-image style="width: 50px; height: 50px; margin-right: 20px; border-radius: 5px;"
                                        :src="'/api' + scope.row.music_cover" :lazy="true">
                                    </el-image>
                                </template>
                            </el-table-column>
                            <el-table-column label="标题" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <el-link @click="goDetail(scope.row.music_id, 'Music')">{{ scope.row.music_name }}
                                    </el-link>
                                </template>
                            </el-table-column>
                            <el-table-column label="歌手" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <el-link @click="goDetail(scope.row.artist_id, 'Artist')">{{ scope.row.artist_name
                                    }}
                                    </el-link>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" :show-overflow-tooltip="true" v-if="is_myPlaylist">
                                <template slot-scope="scope">
                                    <el-button type="danger" size="small" @click="handleMusicDelete(scope.row.music_id)"
                                        plain>
                                        移除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-empty description="暂无歌曲" v-else></el-empty>
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
                            <div class="allComment" v-show="totalComment !== 0">
                                <h3>最新评论</h3>
                                <div class="comment" v-for="(comment, index) in comments" :key="index">
                                    <div class="commentHeader">
                                        <el-avatar shape="square" size="large" :src="'/api' + comment.avatarUrl"
                                            :lazy="true">
                                        </el-avatar>
                                    </div>
                                    <div class="commentContent">

                                        <div class="comment-content">
                                            <el-link type="primary" @click="goDetail(comment.user_id, 'User')">
                                                {{ comment.nickname }} :</el-link> {{ comment.content }}
                                        </div>
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
                            <h2>其他推荐歌单</h2>
                            <el-card :body-style="{ padding: '0px' }" v-for="playlist in randomPlaylist"
                                :key="playlist.id" shadow="hover" @click.native="goDetail(playlist.id, 'Playlist')">
                                <img :src="'/api' + playlist.cover" class="image">
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
        const validateName = (rule, value, callback) => {
            if (value.includes('@') || value.includes('#')) {
                callback('歌单标题不能包含@和#');
            } else if (value.trim() === '') {
                callback('歌单标题不能为空');
            } else {
                callback();
            }
        };
        return {
            is_empty: true,
            currentPage: 1,
            pageSize: 10,
            totalComment: 0,
            textarea: "",
            playlistData: [],
            playlistInfo: {
                playlist_cover: '/upload/images/playlist_cover/default.png'
            },
            is_favorite: false,
            randomPlaylist: [],
            comments: [],
            dialogFormVisible: false,
            form: {
                playlist_name: '',
                description: '',
                playlist_cover: '',
            },
            fileList: [],
            coverFile: {},
            coverIsUpload: false,
            rules: {
                playlist_name: [
                    { required: true, message: '请输入歌单名称', trigger: 'blur' },
                    // 正则验证
                    {
                        validator: validateName,
                        message: '歌单名不能包含@或#或空格',
                        trigger: 'blur'
                    },
                ]
            }
        }
    },
    computed: {
        is_myPlaylist() {
            return this.playlistInfo.user_id === this.$store.state.userInfo.id || this.$store.state.userInfo.is_admin === 1;
        },
        is_okToFavorite() {
            return this.playlistInfo.user_id === this.$store.state.userInfo.id
        },
        favoriteIcon() {
            return this.is_favorite ? 'el-icon-star-on' : 'el-icon-star-off';
        }

    },
    methods: {
        // 上传相关
        // 上传音乐封面文件
        uploadCover() {
            const formData = new FormData();
            formData.append('playlist_cover', this.coverFile.raw);
            this.$axios({
                method: 'post',
                url: '/upload/uploadPlaylistCover',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                console.log(res.data);
                if (res.data.code === 200) {
                    this.form.playlist_cover = '/upload/images/playlist_cover/' + res.data.obj.filename;
                    this.coverIsUpload = true;
                }
            })
        },
        // 文件变动时，标记为未完成，赋值给上传文件
        handleCoverChange(file, fileList) {
            this.coverIsUpload = false;
            this.coverFile = file;
        },
        // 验证图片格式
        beforeCoverUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isJPG && !isPNG) {
                this.$message.error('上传歌单图片只能是 JPG 或 PNG 格式!');
                return false;
            } else if (!isLt5M) {
                this.$message.error('上传歌单图片大小不能超过 5MB!');
                return false;
            } else {
                return true;
            }
        },
        // 文件删除前要清空表单的封面url
        beforeCoverRemove(file, fileList) {
            this.form.coverUrl = '';
            this.coverIsUpload = false;
        },
        ...mapActions({
            changeMusicList: "changeMusicList",
            playMusic: "changeCurrentSong"
        }),
        handleEdit() {
            // 赋值给表单
            this.form = {
                playlist_name: this.playlistInfo.playlist_name,
                description: this.playlistInfo.description,
                playlist_cover: this.playlistInfo.playlist_cover,
            }
            this.dialogFormVisible = true;
        },

        handleDelete() {
            this.$confirm('确定删除该歌单？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deletePlaylist();
            }).catch(() => { });
        },
        handleMusicDelete(music_id) {
            this.$confirm('确定移除该歌曲？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteMusic(music_id);
            }).catch(() => { });
        },
        // 滑动到评论
        goAnchor(selector) {
            this.$refs[selector].scrollIntoView({
                behavior: "smooth",
            });
        },
        goDetail(id, type) {
            this.$router.push({
                name: type,
                params: { id },
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
        getPlaylistInfo() {
            // 获取歌单信息
            this.$axios({
                url: "/playlist/getPlaylistInfo",
                method: "get",
                params: {
                    playlist_id: this.$route.params.id,
                },
            }).then((res) => {
                if (res.data.code === 200) {
                    this.playlistInfo = res.data.obj[0];
                    // 歌单不存在，跳转到主页
                    if (!this.playlistInfo) {
                        this.$router.push({
                            name: "Home"
                        });
                    }
                } else {
                    this.$message.error(res.data.msg);
                }
            });

        },
        getPlaylistById() {
            // 获取歌单歌曲
            this.$axios({
                method: "GET",
                url: "/playlist/getPlaylistById",
                params: {
                    playlist_id: this.$route.params.id,
                },
            }).then((res) => {
                if (res.data.code === 200) {
                    if (res.data.obj.length !== 0) {
                        this.is_empty = false;
                        this.playlistData = res.data.obj;
                    } else {
                        this.is_empty = true;
                    }
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        getIsFavorite() {
            if (this.$store.state.isLogin) {
                // 获取是否收藏
                this.$axios({
                    method: "GET",
                    url: "/playlist/getIsFavorite",
                    params: {
                        playlist_id: this.$route.params.id,
                        user_id: this.$store.state.userInfo.id,
                    },
                }).then((res) => {
                    if (res.data.code === 200) {
                        // 是否收藏
                        this.is_favorite = (res.data.obj === 1);
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            } else {
                this.is_favorite = false;
            }
        },
        changePlaylistFavorite() {
            // 添加收藏
            if (this.$store.state.isLogin) {
                this.$axios({
                    method: "POST",
                    url: "/playlist/changePlaylistFavorite",
                    data: {
                        playlist_id: this.$route.params.id,
                        user_id: this.$store.state.userInfo.id,
                        is_favorite: this.is_favorite ? 1 : 0,
                    },
                }).then((res) => {
                    if (res.data.code === 200) {
                        this.$store.state.isRefresh = true;
                        this.getIsFavorite();
                        this.$message.success(res.data.msg);
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            } else {
                this.$message.error("请先登录再收藏歌单");
            }
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
        },
        updatePlaylist() {
            this.$axios({
                method: "POST",
                url: "/playlist/updatePlaylist",
                data: {
                    playlist_id: this.$route.params.id,
                    playlist_name: this.form.playlist_name,
                    description: this.form.description,
                    playlist_cover: this.form.playlist_cover,
                },
            }).then((res) => {
                if (res.data.code === 200) {
                    this.$message.success(res.data.msg);
                    this.dialogFormVisible = false;
                    this.fileList = [];
                    this.getPlaylistInfo();
                    // 刷新侧边栏
                    this.$store.state.isRefresh = true;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        deletePlaylist() {
            this.$axios({
                url: "/playlist/deletePlaylist",
                method: "post",
                data: {
                    playlist_id: this.$route.params.id,
                },
            }).then((res) => {
                if (res.data.code === 200) {
                    this.$message.success(res.data.msg);
                    // 刷新侧边栏，删除歌单后，跳转到主页
                    this.$store.state.isRefresh = true;
                    this.$router.push({
                        name: "Home"
                    });
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        deleteMusic(music_id) {
            this.$axios({
                url: "/playlist/deleteMusic",
                method: "post",
                data: {
                    playlist_id: this.$route.params.id,
                    music_id: music_id,
                },
            }).then((res) => {
                if (res.data.code === 200) {
                    this.$message.success(res.data.msg);
                    this.getPlaylistById();
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        // 提交表单
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.updatePlaylist();
                } else {
                    this.$message({
                        message: '请补全信息',
                        type: 'error'
                    });
                    return false;
                }
            });
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
    },
    watch: {
        // 路由变化时，获取歌单信息
        "$route.params.id": function () {
            this.getPlaylistInfo();
            this.getIsFavorite();
            this.getPlaylistById();
            this.getComment();
            this.getRandomPlaylist();
        }
    },
    created() {
        this.getPlaylistInfo();
        this.getIsFavorite();
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
    width: 800px;
}

.playlistInfo>p:nth-of-type(2) {
    font-size: 60px;
    line-height: 50px;
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

.card-right>p:nth-of-type(1) {
    font-size: 20px;
}

.el-pagination {
    align-self: center;
}
</style>