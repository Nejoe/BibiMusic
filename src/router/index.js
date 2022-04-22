import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Discover from '../views/discover/Discover.vue'
import Search from '../views/search/Search.vue'
import Favorites from '../views/favorites/Favorites.vue'
Vue.use(VueRouter)

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
                // redirect: '/discover/recommend',
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
        ]
    },
]

//配置VUE-ROUTER
const router = new VueRouter({
    routes,
})

export default router