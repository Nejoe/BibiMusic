import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);
// 设置axios的基础路径
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const defaultSong = {
    title: "バッグパイパー",
    artist: "ファクトリー・ノイズ&AG",
    src: "https://music.163.com/song/media/outer/url?id=403136190.mp3",
    pic: "https://p1.music.126.net/-y3BfZwvRZrI3awBbR8m-w==/1420569023661522.jpg",
    lrc: "[00:00.00]纯音乐，请欣赏"
}
const defaultList = [defaultSong]

export default new Vuex.Store({
    state: {
        currentSong: window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('currentSongOfUser#' + JSON.parse(window.localStorage.getItem('userInfo')).id)) : defaultSong,
        musicList: window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('musicListOfUser#' + JSON.parse(window.localStorage.getItem('userInfo')).id)) : defaultList,
        // 本地若有登录信息，则读取本地登录信息，否则state.userInfo初始化
        userInfo: window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')) : {
            id: 0,
            account: '',
            name: '',
            is_admin: 0,
            avatar: '',
        },
        // 若本地有登录信息，则state.isLogin为true，否则为false
        isLogin: window.localStorage.getItem('userInfo') ? true : false,
        // 是否该刷新侧边栏，简单解决歌单数据变化后侧边栏不刷新的问题
        isRefresh: false,
        isUserRefresh: false,
    },
    mutations: {
        //修改当前歌曲
        setCurrentSong(state, song) {
            state.currentSong = song
                // 修改本地歌曲数据
            window.localStorage.setItem('currentSongOfUser#' + state.userInfo.id, JSON.stringify(song))
        },
        //修改播放列表
        setMusicList(state, list) {
            state.musicList = list;
            state.currentSong = list[0];
            // 修改本地歌曲列表数据
            window.localStorage.setItem('currentSongOfUser#' + state.userInfo.id, JSON.stringify(list[0]))
            window.localStorage.setItem('musicListOfUser#' + state.userInfo.id, JSON.stringify(list))
        },
        //向播放列表中添加歌曲
        addMusic(state, song) {
            state.musicList.push(song);
        },
        setUserInfo(state, user) {
            // 将用户信息保存在localStorage
            window.localStorage.setItem('userInfo', JSON.stringify(user));
            // 将本地的用户信息保存在vuex中
            state.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
            state.isUserRefresh = false;
        },
        setUserLogin(state, user) {
            // 将用户信息保存在localStorage
            window.localStorage.setItem('userInfo', JSON.stringify(user));
            // 将本地的用户信息保存在vuex中
            state.userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
            // 创建或读取本地音乐数据
            if (!window.localStorage.getItem('musicListOfUser#' + state.userInfo.id)) {
                window.localStorage.setItem('musicListOfUser#' + state.userInfo.id, JSON.stringify(defaultList));
            } else {
                state.musicList = JSON.parse(window.localStorage.getItem('musicListOfUser#' + state.userInfo.id));
            }
            if (!window.localStorage.getItem('currentSongOfUser#' + state.userInfo.id)) {
                window.localStorage.setItem('currentSongOfUser#' + state.userInfo.id, JSON.stringify(defaultSong));
            } else {
                state.currentSong = JSON.parse(window.localStorage.getItem('currentSongOfUser#' + state.userInfo.id));
            }
            state.isLogin = true
            state.isUserRefresh = false
        },
        setUserLogout(state) {
            // 将音乐数据保存在localStorage
            window.localStorage.setItem('currentSongOfUser#' + state.userInfo.id, JSON.stringify(state.currentSong));
            window.localStorage.setItem('musicListOfUser#' + state.userInfo.id, JSON.stringify(state.musicList));
            // 将用户信息从本地删除
            window.localStorage.removeItem('userInfo');
            // 将用户信息从vuex中删除
            state.userInfo = {
                id: 0,
                account: '',
                name: '',
                is_admin: 0,
                avatar: ''
            };
            state.isLogin = false
        },
    },
    actions: {
        changeCurrentSong(context, id) {
            //根据id发送请求，获取歌曲信息
            axios({
                url: '/music/getMusicById',
                method: 'get',
                params: {
                    id: id
                }
            }).then(res => {
                if (res.data.code === 200) {
                    //在无歌词的时候，使用默认歌词
                    if (!res.data.obj.music.lrc) {
                        res.data.obj.music.lrc = `[00:00.00]纯音乐，请欣赏`
                    }
                    // 数据库传回是会把\n变为\\n，替换res.data.obj.music.lrc中的\\n为\n
                    res.data.obj.music.lrc = res.data.obj.music.lrc.replace(/\\n/g, '\n');
                    //将歌手数组对象转为名字数组，再转为字符串
                    const artistList = res.data.obj.artist.map(item => {
                        return item.name
                    }).join(' / ');
                    // 封装一个歌曲对象
                    const music = {
                        title: res.data.obj.music.name,
                        artist: artistList,
                        src: '/api' + res.data.obj.music.url,
                        pic: '/api' + res.data.obj.music.cover,
                        lrc: res.data.obj.music.lrc,
                    };
                    //将response中的数据发送给mutations中的setCurrentSong
                    // context.commit('addMusic', music);
                    context.commit('setCurrentSong', music);
                }
            });
        },
        changeMusicList(context, list) {
            console.log(list);
            const musicList = [];
            list.forEach(item => {

                if (!item.music_lrc) {
                    item.music_lrc = `[00:00.00]纯音乐，请欣赏`
                }
                item.music_lrc = item.music_lrc.replace(/\\n/g, '\n');
                // const artistList = res.data.obj.artist.map(item => {
                //     return item.name
                // }).join(' / ');
                musicList.push({
                    title: item.music_name,
                    artist: item.artist_name,
                    src: '/api' + item.music_url,
                    pic: '/api' + item.music_cover,
                    lrc: item.music_lrc,
                })
            });
            context.commit('setMusicList', musicList);
        },
        login(context, user) {
            // 向服务器发送请求，获取用户信息
            axios({
                url: '/user/login',
                method: 'post',
                data: user
            }).then(res => {
                if (res.data.code === 200) {
                    //将用户信息发送给mutations中的setUserLogin
                    context.commit('setUserLogin', res.data.obj[0]);
                }
            })
        },
        logout(context) {
            context.commit('setUserLogout');
        }
    },
    modules: {}
})