import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Discover from '../views/discover/Discover.vue'
import Search from '../views/search/Search.vue'
import Favorites from '../views/favorites/Favorites.vue'
import Login from '../views/login/Login.vue'
import Music from '../views/music/Music.vue'
import Playlist from '../views/playlist/Playlist.vue'
Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const routes = [
    { path: '/', redirect: '/home' },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        redirect: '/discover',
        children: [{
                path: '/discover',
                name: 'Discover',
                component: Discover,
            },
            {
                path: '/search',
                name: 'Search',
                component: Search,
            },
            {
                path: '/favorites',
                name: 'Favorites',
                component: Favorites,
            },
            {
                path: '/music/:id',
                name: 'Music',
                component: Music,
            },
            {
                path: '/playlist/:id',
                name: 'Playlist',
                component: Playlist,
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    }

]

//配置VUE-ROUTER
const router = new VueRouter({
    routes,
})

export default router