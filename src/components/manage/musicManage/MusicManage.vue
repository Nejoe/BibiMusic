<template>
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane label="新增歌曲" name="first">
                <el-form :model="musicAddForm" :rules="musicAddRules" ref="musicAddForm" label-width="100px">
                    <el-form-item label="歌曲标题" prop="musicName">
                        <el-input v-model="musicAddForm.musicName" placeholder="请输入歌曲名称"></el-input>
                    </el-form-item>
                    <el-form-item label="歌手" prop="artistId">
                        <el-select v-model="musicAddForm.artistId" placeholder="请选择歌手" @click.native="getAllArtistName"
                            clearable>
                            <el-option v-for="item in artistList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="音乐封面" prop="coverUrl">
                        <el-upload action="#" :auto-upload="true" :limit="1" ref="uploadCover" :file-list="fileList"
                            :on-change="handleCoverChange" :before-upload="beforeCoverUpload"
                            :before-remove="beforeCoverRemove" :on-success="handleMusicSuccess"
                            :http-request="uploadCover" list-type="picture">
                            <el-button slot="trigger" size="small" type="primary">上传封面文件</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="音乐文件" prop="musicUrl">
                        <el-upload action="#" :auto-upload="true" :limit="1" ref="uploadMusic" :file-list="fileList"
                            :on-change="handleMusicChange" :before-upload="beforeMusicUpload"
                            :before-remove="beforeMusicRemove" :on-success="handleMusicSuccess"
                            :http-request="uploadMusic">
                            <el-button slot="trigger" size="small" type="primary">上传音乐文件</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="歌词" prop="musicLrc">
                        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="musicAddForm.lrc"
                            :autosize="{ minRows: 2, maxRows: 9 }" resize="none">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('musicAddForm')">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="修改歌曲" name="second">修改歌曲</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    name: 'MusicManage',
    data() {
        return {
            activeName: 'first',
            fileList: [],
            musicFile: {},
            coverFile: {},
            musicAddForm: {
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
                    required: true,
                    message: '请选择封面',
                    trigger: 'blur'
                }],
                musicUrl: [{
                    required: true,
                    message: '请选择音乐文件',
                    trigger: 'blur'
                }],
            },
            artistList: [],
            artistNameList: [],
        }
    },
    methods: {
        // 提交表单
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid && this.musicIsUpload && this.coverIsUpload) {
                    console.log('表单', this.musicAddForm);
                    this.addMusic();
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
        // 提交上传
        submitUpload(type) {
            switch (type) {
                case 'uploadMusic':
                    this.$refs.uploadMusic.submit();
                    break;
                case 'uploadCover':
                    this.$refs.uploadCover.submit();
                    break;
            }
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
                console.log(res.data);
                if (res.data.code === 200) {
                    this.musicAddForm.musicUrl = 'http://localhost:3000/upload/music/' + res.data.obj.filename;
                    this.musicIsUpload = true;
                }
            })
        },
        // 上传封面文件
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
                console.log(res.data);
                if (res.data.code === 200) {
                    this.musicAddForm.coverUrl = 'http://localhost:3000/upload/images/music_cover/' + res.data.obj.filename;
                    this.coverIsUpload = true;
                }
            })
        },
        // 文件变动时，标记为未完成，赋值给上传文件
        handleMusicChange(file, fileList) {
            this.musicIsUpload = false;
            this.musicFile = file;
        },
        handleCoverChange(file, fileList) {
            this.coverIsUpload = false;
            this.coverFile = file;
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },

        handleMusicSuccess(file) {
            console.log(file);
        },
        beforeCoverUpload(file) {
            // 验证图片格式
            const isJPG = file.type === 'image/jpeg';
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            return isJPG;
        },
        beforeMusicUpload(file) {
            // 验证音乐格式
            const isMP3 = (file.type === 'audio/mp3') || (file.type === 'audio/mpeg');
            if (!isMP3) {
                this.$message.error('上传音乐文件只能是 MP3 格式!');
            }
            return isMP3;

        },
        // 文件删除前钩子
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
        addMusic() {
            this.$axios({
                method: 'post',
                url: '/music/addMusic',
                data: this.musicAddForm
            }).then(res => {
                console.log(res);
                if (res.data.code === 200) {
                    this.resetForm('musicAddForm');
                    this.$message({
                        message: 'res.data.msg',
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: 'res.data.msg',
                        type: 'error'
                    });
                }
            })
        }
    },
    mounted() {
    },
}
</script>

<style>
.el-form {
    margin: 0 auto;
    width: 70%;
}
</style>