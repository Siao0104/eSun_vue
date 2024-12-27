import { createWebHistory, createRouter} from "vue-router";
import store from "../store/index.js";
import HomeBackground from '../layout/HomeBackground.vue';

const routes = [
    {
        path: '/',
        component: HomeBackground,
        children: [
            {
                path: "/",
                component: () => import('../components/Logging.vue'),
            },
            {
                path: "/register",
                component: () => import('../components/Register.vue'),
            },
        ]
    },

    {
        path: "/mainLayout",
        component: () => import('../layout/MainLayout.vue'),
        children: [
            {
                path: '', // 空路徑作爲預設子路由
                component: () => import('../layout/MainBar.vue'),
            },
            {
                path: "/voting1000",
                component: () => import('../views/voting/voting1000/index.vue'),
            },
            {
                path: "/voting1010",
                component: () => import('../views/voting/voting1010/index.vue'),
            },
            {
                path: "/utility1010",
                component: () => import('../views/utility/utility1010/index.vue'),
            },
        ]
    },

    {
        path: "/mail",
        component: () => import('../components/Mail.vue'),
    },

    {
        path: "/googleOauth",
        component: () => import('../components/GoogleOauth2.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
    linkActiveClass: 'active'
})

router.beforeEach((to,from,next)=>{
    //在每次路由切換之前，檢查Token的有效性
    store.dispatch('auth/checkToken');
    next();
})

export default router;