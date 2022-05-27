<template>
    <div>

        <el-form :model="artistAddForm" :rules="artistAddRules" ref="artistAddForm" label-width="100px">
            <el-form-item label="名字" prop="artistName">
                <el-input v-model="artistAddForm.artistName" placeholder="请输入歌手名称"></el-input>
            </el-form-item>
            <el-form-item label="头像" prop="avatarUrl">
                <el-upload action="#" :auto-upload="true" :limit="1" ref="uploadAvatar" :file-list="fileList"
                    :on-change="handleAvatarChange" :before-upload="beforeAvatarUpload"
                    :before-remove="beforeAvatarRemove" :http-request="uploadAvatar" list-type="picture">
                    <el-button slot="trigger" size="small" type="primary">上传封面文件</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="介绍" prop="description">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="artistAddForm.description"
                    :autosize="{ minRows: 2, maxRows: 9 }" resize="none">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('artistAddForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'ArtistManage',
    data() {
        return {
            fileList: [],
            musicFile: {},
            avatarFile: {},
            artistAddForm: {
                artistName: '',
                avatarUrl: '',
                description: '',
            },
            // musicIsUpload: false,
            avatarIsUpload: false,
            artistAddRules: {
                artistName: [{
                    required: true,
                    message: '请输入歌手名称',
                    trigger: 'blur'
                }],
                // artistId: [{
                //     required: true,
                //     message: '请选择歌手',
                //     trigger: 'blur'
                // }],
                avatarUrl: [{
                    required: true,
                    message: '请选择图片',
                    trigger: 'blur'
                }],
                // musicUrl: [{
                //     required: true,
                //     message: '请选择音乐文件',
                //     trigger: 'blur'
                // }],
            },
            // artistList: [],
            // artistNameList: [],
        }
    },
    methods: {
        // 提交表单
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid && this.avatarIsUpload) {
                    console.log('表单', this.artistAddForm);
                    this.addArtist();
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
        // 上传头像文件
        uploadAvatar() {
            const formData = new FormData();
            formData.append('artist_avatar', this.avatarFile.raw);
            this.$axios({
                method: 'post',
                url: '/upload/uploadArtistAvatar',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.artistAddForm.avatarUrl = '/upload/images/artist_avatar/' + res.data.obj.filename;
                    this.avatarIsUpload = true;
                }
            })
        },
        // 文件变动时，标记为未完成，赋值给上传文件
        handleMusicChange(file, fileList) {
            this.musicIsUpload = false;
            this.musicFile = file;
        },
        handleAvatarChange(file, fileList) {
            this.avatarIsUpload = false;
            this.avatarFile = file;
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },

        beforeAvatarUpload(file) {
            // 验证图片格式
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            if (!isJPG && !isPNG) {
                this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
                return false;
            } else {
                return true;
            }

        },
        // 文件删除前钩子
        beforeAvatarRemove(file, fileList) {
            this.artistAddForm.avatarUrl = '';
            this.avatarIsUpload = false;
        },
        beforeMusicRemove(file, fileList) {
            this.artistAddForm.musicUrl = '';
            this.musicIsUpload = false;
        },
        // getAllArtistName() {
        //     this.$axios({
        //         method: 'get',
        //         url: '/artist/getAllArtistName'
        //     }).then(res => {
        //         this.artistList = res.data.obj;
        //     })
        // },
        addArtist() {
            this.$axios({
                method: 'post',
                url: '/artist/addArtist',
                data: this.artistAddForm
            }).then(res => {
                console.log(res);
                if (res.data.code === 200) {
                    // 重置表单
                    this.resetForm('artistAddForm');
                    this.fileList = [];
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            })
        }
    },
    mounted() {
        // this.getAllArtistName();
    },
}
</script>

<style>
.el-form {
    margin: 0 auto;
    width: 70%;
}
</style>