<template>
    <div>
        <el-header>
            <nav-bar></nav-bar>
        </el-header>
        <el-main>
            <div class="main">
                <el-row>
                    <div class="userInfoArea">
                        <el-image fit="cover"
                            style="width: 225px; height: 225px; margin-right: 20px;border-radius: 4px;"
                            :src="'/api' + userData.avatar" :lazy="true">
                        </el-image>
                        <div class="userInfo">
                            <p>UID:{{ userData.user_id }}</p>
                            <p>{{ userData.user_name }}</p>
                            <p>
                                <el-icon class="el-icon-tickets"></el-icon>{{
                                        userData.description ? userData.description : '暂无介绍'
                                }}
                            </p>
                            <el-button-group>
                                <el-button icon="el-icon-chat-dot-round" @click="goAnchor('comment')">评论
                                    ({{ totalComment
                                    }})</el-button>
                                <el-button icon="el-icon-edit" v-if="is_myPage" @click="handleEdit">编辑个人信息</el-button>
                            </el-button-group>
                        </div>
                    </div>
                    <!-- 修改个人信息框 -->
                    <el-dialog title="编辑个人信息" :visible.sync="dialogFormVisible">
                        <el-form :model="form" :rules="rules" ref="form">
                            <el-form-item label="昵称" prop="user_name">
                                <el-input v-model="form.user_name" autocomplete="off" maxlength="12" minlength="4"
                                    show-word-limit></el-input>
                            </el-form-item>
                            <el-form-item label="介绍" prop="description">
                                <el-input type="textarea" :rows="2" v-model="form.description"
                                    :autosize="{ minRows: 2, maxRows: 5 }" maxlength="56" show-word-limit resize="none">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="头像" prop="avatar">
                                <el-upload action="#" :auto-upload="true" :limit="1" ref="uploadCover"
                                    :file-list="fileList" :on-change="handleCoverChange"
                                    :before-upload="beforeCoverUpload" :before-remove="beforeCoverRemove"
                                    :http-request="uploadCover" list-type="picture">
                                    <el-button slot="trigger" size="small" type="primary">上传头像文件</el-button>
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
                            <el-table-column label="收藏歌单" width="80px">
                                <template slot-scope="scope">
                                    <el-image fit="cover"
                                        style="width: 50px; height: 50px; margin-right: 20px; border-radius: 5px;"
                                        :src="'/api' + scope.row.cover" :lazy="true">
                                    </el-image>
                                </template>
                            </el-table-column>
                            <el-table-column label="标题" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <el-link @click="goDetail(scope.row.id, 'Playlist')">{{ scope.row.name
                                    }}
                                    </el-link>
                                </template>
                            </el-table-column>
                            <el-table-column label="创建者" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <el-link @click="goDetail(scope.row.user_id, 'User')">{{ scope.row.creater_name
                                    }}&nbsp;#{{ scope.row.user_id }}
                                    </el-link>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" :show-overflow-tooltip="true" v-if="is_myPage">
                                <template slot-scope="scope">
                                    <el-button v-if="scope.row.user_id === myUserID || myUserID === 1" type="danger"
                                        size="small" @click="handlePlaylistDelete(scope.row.id)" plain>
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-empty description="暂无收藏歌单" v-else></el-empty>
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
                                        <el-avatar shape="square" size="large" :src="'/api' + comment.avatarUrl">
                                        </el-avatar>
                                    </div>
                                    <div class="commentContent">

                                        <div class="comment-content">
                                            <el-link type="primary" @click="goDetail(comment.user_id, 'User')">
                                                {{ comment.nickname }} :
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
                    <!-- <el-col :span="7">
                        <div class="randomArea">
                            <h2>相关歌单推荐</h2>
                            <el-card :body-style="{ padding: '0px' }" v-for="playlist in aboutPlaylist"
                                :key="playlist.id" shadow="hover" @click.native="goPlaylistDetail(playlist.id)">
                                <img :src="'/api'+playlist.cover" class="image">
                                <div class="card-right">
                                    <p>{{ playlist.name }}</p>
                                    <p>{{ playlist.description }}</p>
                                </div>
                            </el-card>
                        </div>
                    </el-col> -->
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
        const checkName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("请输入用户名"));
            } else if (value.length < 2) {
                return callback(new Error("用户名长度不能小于2位"));
            } else if (value.length > 12) {
                return callback(new Error("用户名长度不能大于12位"));
            } else if (!/^[\u4E00-\u9FA5\w]+$/.test(value)) {
                //用户名只能是中文、数字、字母、下划线组成
                return callback(new Error("用户名只能是中文、数字、字母、下划线组成"));
            } else {
                callback();
            }
        };
        return {
            dialogFormVisible: false,
            is_empty: true,
            currentPage: 1,
            pageSize: 10,
            totalComment: 0,
            textarea: "",
            userData: {
                avatar: '/upload/images/playlist_cover/default.png'
            },
            fileList: [],
            form: {
                user_name: '',
                description: '',
                avatar: '',
            },
            rules: {
                user_name: [
                    { required: true, message: '请输入昵称', trigger: 'blur' },
                    { validator: checkName, trigger: 'blur' },
                ],
                description: [
                    { min: 0, max: 300, message: '最多300个字符', trigger: 'blur' }
                ],
            },
            playlistData: [],
            aboutPlaylist: [],
            comments: [],
        }
    },
    computed: {
        is_myPage() {
            return parseInt(this.$route.params.id) === this.$store.state.userInfo.id || this.$store.state.userInfo.is_admin === 1;
        },
        myUserID() {
            return this.$store.state.userInfo.id
        }
    },
    methods: {
        // 上传相关
        // 上传用户头像文件
        uploadCover() {
            const formData = new FormData();
            formData.append('user_avatar', this.coverFile.raw);
            this.$axios({
                method: 'post',
                url: '/upload/uploadUserAvatar',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.form.avatar = '/upload/images/user_avatar/' + res.data.obj.filename;
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
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG && !isPNG) {
                this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
                return false;
            } else if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                return false;
            } else {
                return true;
            }
        },
        // 文件删除前要清空表单的封面url
        beforeCoverRemove(file, fileList) {
            this.form.avatar = '';
            this.coverIsUpload = false;
        },
        ...mapActions({
            changeMusicList: "changeMusicList",
            playMusic: "changeCurrentSong"
        }),
        handleEdit() {
            // 赋值给表单
            this.form = {
                user_name: this.userData.user_name,
                description: this.userData.description,
                avatar: this.userData.avatar,
            }
            this.dialogFormVisible = true;
        },
        handlePlaylistDelete(playlistId) {
            this.$confirm('确定删除该歌单？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deletePlaylist(playlistId);
            }).catch(() => { });
        },
        deletePlaylist(playlistId) {
            this.$axios({
                url: "/playlist/deletePlaylist",
                method: "post",
                data: {
                    playlist_id: playlistId,
                },
            }).then((res) => {
                if (res.data.code === 200) {
                    this.$message.success(res.data.msg);
                    // 刷新侧边栏，删除歌单后，跳转到主页
                    this.$store.state.isRefresh = true;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
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
                url: "/comment/getUserComment",
                method: "get",
                params: {
                    user_page_id: this.$route.params.id,
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
                    url: "/comment/addUserComment",
                    data: {
                        user_page_id: this.$route.params.id,
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
        getUserInfo() {
            this.$axios({
                url: "/user/getUserInfo",
                method: "get",
                params: {
                    user_id: this.$route.params.id,
                },
            }).then((res) => {
                if (res.data.code === 200) {
                    this.userData = res.data.obj[0];
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        getUserPageInfo() {
            // 获取歌单信息
            this.$axios({
                method: "GET",
                url: "/playlist/getUserPageInfo",
                params: {
                    user_id: this.$route.params.id,
                },
            }).then((res) => {
                console.log('获取歌单数据', res.data);
                if (res.data.code === 200) {
                    if (res.data.obj.length !== 0) {
                        this.is_empty = false;
                        this.playlistData = res.data.obj;
                    } else {
                        this.is_empty = true;
                    }
                } else {
                    this.$message.error(res.data.msg)
                }
            });
        },
        // 用户主页没有推荐歌单，暂时没用
        getAboutPlaylist() {
            // 获取相关歌单，传入歌手id
            this.$axios({
                method: "GET",
                url: "/playlist/getAboutPlaylist",
                params: {
                    user_id: this.$route.params.id,
                    limit: 3,
                },
            }).then((res) => {
                this.aboutPlaylist = res.data.obj;
            });
        },
        updateUser() {
            this.$axios({
                method: "POST",
                url: "/user/updateUser",
                data: {
                    user_id: this.$route.params.id,
                    user_name: this.form.user_name,
                    description: this.form.description,
                    avatar: this.form.avatar,
                },
            }).then((res) => {
                if (res.data.code === 200) {
                    this.$message.success(res.data.msg);
                    this.dialogFormVisible = false;
                    this.fileList = [];
                    this.getUserInfo();
                    this.$store.state.isUserRefresh = true;
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        // 提交表单
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.updateUser();
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
            this.getUserInfo();
            this.getUserPageInfo();
            this.getComment();
        },
        // 在用户页面创建歌单后要刷新收藏歌单信息
        '$store.state.isRefresh': {
            deep: true,
            handler(newVal, oldVal) {
                // console.log('用户页检测到了', newVal, oldVal);
                // home的侧边栏创建歌单后将isRefresh设为true，然后watch中检测到了又变为false，最后才是用户页检测到新旧都是false,才会执行
                if (newVal === false) {
                    this.getUserPageInfo();
                    this.$store.state.isRefresh = false;
                }
            }
        }
    },
    created() {
        this.getUserInfo();
        this.getUserPageInfo();
        this.getComment();
    },
}
</script>

<style>
.userInfoArea {
    display: flex;
    justify-content: flex-start;
}

.userInfo {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 800px;
}

.userInfo>p:nth-of-type(2) {
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