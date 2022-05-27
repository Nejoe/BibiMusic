<template>
    <div>
        <el-header>
            <nav-bar></nav-bar>
        </el-header>
        <el-main v-loading="loading">
            <div class="main">
                <el-row>
                    <div class="musicInfoArea">
                        <el-image fit="cover"
                            style="width: 225px; height: 225px; margin-right: 20px;border-radius: 4px;"
                            :src="'/api' + musicData.music.cover" :lazy="true">
                        </el-image>
                        <div class="musicInfo">
                            <p>单曲</p>
                            <p>{{ musicData.music.name }}</p>
                            <div>
                                <el-icon class="el-icon-user"></el-icon>
                                <el-link style="margin-left:5px" v-for="(artist, index) in musicData.artist"
                                    :key="index" @click="goDetail(artist.id, 'Artist')">
                                    {{ artist.name }}
                                </el-link>
                            </div>
                            <el-button-group>
                                <el-button type="primary" icon="el-icon-caret-right"
                                    @click="playMusic($route.params.id)">播放</el-button>
                                <el-button icon="el-icon-circle-plus-outline" @click="handleAdd">添加到</el-button>
                                <el-button icon="el-icon-chat-dot-round" @click="goAnchor('comment')">评论 ({{
                                        totalComment
                                }})</el-button>
                                <el-button icon="el-icon-edit" v-if="$store.state.userInfo.is_admin"
                                    @click="handleEdit">
                                    编辑歌曲信息
                                </el-button>
                                <el-button type="danger" v-if="$store.state.userInfo.is_admin" @click="handleDelete">删除
                                </el-button>
                            </el-button-group>
                        </div>
                    </div>
                    <!-- 添加到歌单选择框 -->
                    <el-dialog title="添加到歌单" :visible.sync="dialogTableVisible">
                        <el-table :data="myPlaylistData" highlight-current-row @current-change="handleCurrentChange"
                            style="width: 100%;cursor: pointer;" max-height="450">
                            <el-table-column width="80">
                                <template slot-scope="scope">
                                    <el-image fit="cover" :src="'/api' + scope.row.cover"
                                        style="width: 50px; height: 50px; border-radius: 4px;">
                                    </el-image>
                                </template>
                            </el-table-column>
                            <el-table-column label="标题" width="220">
                                <template slot-scope="scope">
                                    {{ scope.row.name }}
                                </template>
                            </el-table-column>
                            <el-table-column label="歌曲数">
                                <template slot-scope="scope">
                                    {{ scope.row.music_number }}首
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-dialog>
                    <!-- 修改歌曲信息框 -->
                    <el-dialog title="编辑歌曲信息" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
                        <el-form :model="musicAddForm" :rules="musicAddRules" ref="musicAddForm" label-width="100px">
                            <el-form-item label="歌曲标题" prop="musicName">
                                <el-input v-model="musicAddForm.musicName" placeholder="请输入歌曲名称"></el-input>
                            </el-form-item>
                            <el-form-item label="歌手" prop="artistId">
                                <el-select v-model="musicAddForm.artistId" placeholder="请选择歌手" filterable
                                    @click.native="getAllArtistName">
                                    <el-option v-for="item in artistList" :key="item.id" :label="item.name"
                                        :value="item.id">
                                        <div style="display:flex; align-items:center">
                                            <el-image :src="'/api' + item.avatar"
                                                style="width: 30px;height: 30px;border-radius: 4px;margin-right: 5px;">
                                            </el-image>
                                            <span v-text="item.name"></span>
                                        </div>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="音乐封面" prop="coverUrl">
                                <el-upload action="#" :auto-upload="true" :limit="1" ref="uploadCover"
                                    :file-list="fileList" :on-change="handleCoverChange"
                                    :before-upload="beforeCoverUpload" :before-remove="beforeCoverRemove"
                                    :http-request="uploadCover" list-type="picture">
                                    <el-button slot="trigger" size="small" type="primary">上传封面文件</el-button>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="音乐文件" prop="musicUrl">
                                <el-upload action="#" :auto-upload="true" :limit="1" ref="uploadMusic"
                                    :file-list="fileList" :on-change="handleMusicChange"
                                    :before-upload="beforeMusicUpload" :before-remove="beforeMusicRemove"
                                    :http-request="uploadMusic">
                                    <el-button slot="trigger" size="small" type="primary">上传音乐文件</el-button>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="歌词lrc" prop="musicLrc">
                                <el-input type="textarea" :rows="2" placeholder="请输入lrc格式歌词" v-model="musicAddForm.lrc"
                                    :autosize="{ minRows: 2, maxRows: 9 }" resize="none">
                                </el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="submitForm('musicAddForm')">确 定</el-button>
                        </div>
                    </el-dialog>
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
                                        <el-avatar shape="square" size="large" :src="'/api' + comment.avatarUrl">
                                        </el-avatar>
                                    </div>
                                    <div class="commentContent">
                                        <div class="comment-content">
                                            <el-link type="primary" @click="goDetail(comment.user_id, 'User')">{{
                                                    comment.nickname
                                            }} :
                                            </el-link> {{ comment.content }}
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
                        <h2>包含这首歌的歌单</h2>
                        <el-card :body-style="{ padding: '0px' }" v-for="playlist in playlistData" :key="playlist.id"
                            shadow="hover" @click.native="goDetail(playlist.id, 'Playlist')">
                            <img :src="'/api' + playlist.cover" class="image">
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
        const validateName = (rule, value, callback) => {
            if (value.trim() === '') {
                callback('歌曲标题不能为空');
            } else {
                callback();
            }
        };
        return {
            loading: true,
            currentPage: 1,
            pageSize: 10,
            totalComment: 0,
            textarea: "",
            musicData: {
                music: {
                    // 初始化歌曲封面url，防止页面加载时控制台报错
                    cover: '/upload/images/music_cover/default.png',
                },
                artist: [{}],
            },
            // 推荐歌单
            playlistData: [],
            // 我的歌单
            myPlaylistData: [],
            comments: [],
            dialogFormVisible: false,
            dialogTableVisible: false,
            fileList: [],
            musicFile: {},
            coverFile: {},
            musicAddForm: {
                musicId: "",
                musicName: '',
                artistId: '',
                lrc: '',
                musicUrl: '',
                coverUrl: '',
            },
            musicIsUpload: false,
            coverIsUpload: false,
            musicAddRules: {
                musicName: [{
                    required: true,
                    message: '请输入歌曲名称',
                    trigger: 'blur'
                }],
                artistId: [{
                    required: true,
                    message: '请选择歌手',
                    trigger: 'blur'
                }],
                coverUrl: [{
                    required: false,
                    message: '请选择封面',
                    trigger: 'blur'
                }],
                musicUrl: [{
                    required: false,
                    message: '请选择音乐文件',
                    trigger: 'blur'
                }],
            },
            artistList: [],
            artistNameList: [],
        };
    },
    computed: {
    },
    methods: {
        // 上传相关
        // 上传音乐封面文件
        uploadCover() {
            const formData = new FormData();
            formData.append('music_cover', this.coverFile.raw);
            this.$axios({
                method: 'post',
                url: '/upload/uploadMusicCover',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.musicAddForm.coverUrl = '/upload/images/music_cover/' + res.data.obj.filename;
                    this.coverIsUpload = true;
                }
            })
        },
        // 上传音乐文件
        uploadMusic() {
            const formData = new FormData();
            formData.append('music', this.musicFile.raw);
            this.$axios({
                method: 'post',
                url: '/upload/uploadMusic',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.musicAddForm.musicUrl = '/upload/music/' + res.data.obj.filename;
                    this.musicIsUpload = true;
                }
            })
        },
        // 文件变动时，标记为未完成，赋值给上传文件
        handleCoverChange(file, fileList) {
            this.coverIsUpload = false;
            this.coverFile = file;
        },
        handleMusicChange(file, fileList) {
            this.musicIsUpload = false;
            this.musicFile = file;
        },
        // 验证图片格式
        beforeCoverUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG && !isPNG) {
                this.$message.error('上传音乐图片只能是 JPG 或 PNG 格式!');
                return false;
            } else if (!isLt2M) {
                this.$message.error('上传音乐图片大小不能超过 2MB!');
                return false;
            } else {
                return true;
            }
        },
        // 验证音乐格式
        beforeMusicUpload(file) {
            const isMP3 = (file.type === 'audio/mp3') || (file.type === 'audio/mpeg');
            if (!isMP3) {
                this.$message.error('上传音乐文件只能是 MP3 格式!');
            }
            return isMP3;
        },
        // 文件删除前要清空表单
        beforeCoverRemove(file, fileList) {
            this.musicAddForm.coverUrl = '';
            this.coverIsUpload = false;
        },
        beforeMusicRemove(file, fileList) {
            this.musicAddForm.musicUrl = '';
            this.musicIsUpload = false;
        },
        getAllArtistName() {
            this.$axios({
                method: 'get',
                url: '/artist/getAllArtistName'
            }).then(res => {
                this.artistList = res.data.obj;
            })
        },
        ...mapActions({ playMusic: "changeCurrentSong" }),
        // 在添加到歌单时，点击了某个歌单，把歌曲添加到该歌单
        handleCurrentChange(val) {
            // 点击添加过一次后，再次打开表格，会把之前的歌单清空，导致变化，val变为空
            if (val !== null) {
                this.addMusicPlaylist(val.id);
            }
        },
        handleAdd() {
            if(this.$store.state.isLogin) {
                this.getUserPageInfo();
            } else {
                this.$message.error('请先登录！');
            }
        },
        handleEdit() {
            // 赋值给表单
            this.musicAddForm = {
                musicId: this.$route.params.id,
                musicName: this.musicData.music.name,
                artistId: '',
                lrc: this.musicData.music.lrc,
                musicUrl: this.musicData.music.url,
                coverUrl: this.musicData.music.cover,
            }
            this.dialogFormVisible = true;
        },
        handleDelete() {
            this.$confirm('确定删除该歌曲？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteMusic();
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
                params: { id }
            })
        },
        currentChange(currentPage) {
            this.currentPage = currentPage;
            this.getComment();
        },
        addMusicPlaylist(playlistId) {
            this.$axios({
                method: 'post',
                url: '/music/addMusicPlaylist',
                data: {
                    musicId: this.$route.params.id,
                    playlistId: playlistId
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.$message.success(res.data.msg);
                } else if (res.data.code === 201) {
                    this.$message.warning(res.data.msg);
                } else {
                    this.$message.error(res.data.msg);
                }
                this.dialogTableVisible = false;
            })
        },
        updateMusic() {
            this.$axios({
                method: 'post',
                url: '/music/updateMusic',
                data: this.musicAddForm,
            }).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.getMusicById();
                    this.dialogFormVisible = false;
                } else {
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        deleteMusic() {
            this.$axios({
                method: 'post',
                url: '/music/deleteMusic',
                data: {
                    musicId: this.$route.params.id
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.$router.push({
                        name: 'Home'
                    })
                } else {
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            })
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
        },
        // 提交表单
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.updateMusic();
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
        getMusicById() {
            // 根据网页路径的参数，获取歌曲
            this.$axios({
                url: "/music/getMusicById",
                method: "get",
                params: {
                    id: this.$route.params.id,
                },
            }).then((res) => {
                if (res.data.code === 200) {
                    if (typeof (res.data.obj.music) === 'undefined') {
                        this.$message.error("歌曲不存在");
                        this.$router.push({
                            name: 'Home'
                        })
                    } else {
                        this.musicData = res.data.obj;
                    }
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        getMusicPlaylist() {
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
        },
        getUserPageInfo() {
            // 获取我的歌单
            this.$axios({
                url: "/playlist/getUserPageInfo",
                method: "get",
                params: {
                    user_id: this.$store.state.userInfo.id,
                },
            }).then((res) => {
                if (res.data.code === 200) {
                    this.myPlaylistData=[]
                    // 循环提取出我的歌单
                    res.data.obj.forEach((item) => {
                        if (item.user_id === this.$store.state.userInfo.id) {
                            this.myPlaylistData.push(item);
                        }
                    })
                    console.log('我的歌单', this.myPlaylistData);
                } else {
                    this.$message.error(res.data.msg);
                }
                // 获取完成后打开表格
                this.dialogTableVisible = true;
            });

        }
    },
    created() {
        this.loading = true;
        this.getMusicById();
        this.getMusicPlaylist();
        this.getComment();
        this.loading = false;
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
    width: 800px;
}

.musicInfo>p:nth-of-type(2) {
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