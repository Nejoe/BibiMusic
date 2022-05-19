<template>
    <div>
        <el-header>
            <nav-bar></nav-bar>
        </el-header>
        <el-main>
            <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
                <el-tab-pane label="新增歌曲" name="first">
                    <music-manage></music-manage>
                </el-tab-pane>
                <el-tab-pane label="新增歌手" name="second">
                    <artist-manage></artist-manage>
                </el-tab-pane>
            </el-tabs>
        </el-main>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { mapState } from 'vuex';
import NavBar from '../../components/navBar/NavBar.vue';
import MusicManage from '../../components/manage/musicManage/MusicManage.vue';
import ArtistManage from '../../components/manage/artistManage/ArtistManage.vue';
export default {
    name: 'Manage',
    components: { NavBar, MusicManage, ArtistManage },
    data() {
        return {
            activeName: 'first',

        };
    },
    computed: {
        ...mapState({
            isLogin: "isLogin",
        }),
    },
    methods: {
        handleClick(tab, event) {
        },
    },
    watch: {
        'isLogin': function (newVal, oldVal) {
            if (!newVal) {
                this.$router.push('/');
            }
        },
    },
    mounted() {
    },
}
</script>

<style>
</style>