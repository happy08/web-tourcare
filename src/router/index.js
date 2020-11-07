import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store";
import _storage from "@/utils/localStorage";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'mydata',
        component: () => import(/* webpackChunkName: "mydata" */ '@/views/mydata/index.vue'),
        meta: {
            auth: true,
            index: 1,
            title: "项目大数据"
        },
    },
    {
        path: '/mydata',
        name: 'mydata',
        component: () => import(/* webpackChunkName: "mydata" */ '@/views/mydata/index.vue'),
        meta: {
            auth: true,
            index: 1,
            title: "项目大数据"
        },

    },
    {
        path: '/auth',
        name: 'auth',
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/index.vue'),
        meta: {
            auth: true,
            index: 1,
            title: ""
        },

    },
    {
        path: '/add_phone',
        name: 'add_phone',
        component: () => import(/* webpackChunkName: "add_phone" */ '@/views/auth/add_phone.vue'),
        meta: {
            auth: true,
            index: 1,
            title: "绑定手机号"
        }
    },
    {
        path: '/equipment',
        name: 'equipment',
        component: () => import(/* webpackChunkName: "equipment" */ '@/views/equipment/index.vue'),
        meta: {
            auth: true,
            index: 1,
            title: "激活设备"
        },

    },
    {
        path: '/equipment_share',
        name: 'equipment_share',
        component: () => import(/* webpackChunkName: "equipment" */ '@/views/equipment/share.vue'),
        meta: {
            auth: true,
            index: 5,
            title: "邀请同事加入"
        },

    },
    {
        path: '/share_money',
        name: 'share_money',
        component: () => import(/* webpackChunkName: "share_money" */ '@/views/share_money/index.vue'),
        meta: {
            auth: true,
            index: 1,
            title: ""
        }
    },
    {
        path: '/experience',
        name: 'experience',
        component: () => import(/* webpackChunkName: "experience" */ '@/views/share_money/experience/index.vue'),
        meta: {
            auth: true,
            index: 1,
            title: "申请体验"
        }
    },
    {
        path: '/experience_center/:id',
        name: 'experience_center',
        component: () => import(/* webpackChunkName: "experience" */ '@/views/share_money/experience/experience_center.vue'),
        meta: {
            auth: true,
            index: 1,
            title: "体验中心"
        }
    },
    {
        path: '/experience/evaluate',
        name: 'experience_evaluate',
        component: () => import(/* webpackChunkName: "experience" */ '@/views/share_money/experience/evaluate.vue'),
        meta: {
            auth: true,
            index: 1,
            title: "评价"
        }
    },
    {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/index.vue'),
        meta: {
            auth: true,
            index: 1,
            title: "个人中心"
        },

    },
    {
        path: '/setting',
        name: 'setting',
        component: () => import(/* webpackChunkName: "setting" */ '@/views/user/setting/index.vue'),
        meta: {
            auth: true,
            index: 5,
            title: "设置"
        },

    },
    {
        path: '/setting/user_info',
        name: 'user_info',
        component: () => import(/* webpackChunkName: "setting" */ '@/views/user/setting/user_info.vue'),
        meta: {
            auth: true,
            index: 10,
            title: "个人信息"
        },

    },
    {
        path: '/setting/car_info',
        name: 'car_info',
        component: () => import(/* webpackChunkName: "setting" */ '@/views/user/setting/car_info.vue'),
        meta: {
            auth: true,
            index: 15,
            title: "车辆信息"
        },

    },
    {
        path: '/car_list',
        name: 'car_list',
        component: () => import(/* webpackChunkName: "car_list" */ '@/views/user/car_list/index.vue'),
        children: [
            {
                path: 'car_brand',
                name: 'car_brand',
                component: () => import(/* webpackChunkName: "car_list" */ '@/views/user/car_list/car_brand.vue'),
                meta: {
                    auth: false,
                    index: 20,
                    title: "选择品牌"
                },

            },
            {
                path: "car_line",
                name: "car_line",
                component: () => import(/* webpackChunkName: "car_list" */ '@/views/user/car_list/car_line.vue'),
                meta: {
                    auth: false,
                    index: 20,
                    title: "选择车系"
                },

            },
            {
                path: 'car_type',
                name: 'car_type',
                component: () => import(/* webpackChunkName: "car_list" */ '@/views/user/car_list/car_type.vue'),
                meta: {
                    auth: false,
                    index: 20,
                    title: "选择车型"
                },

            }
        ]
    },

    {
        path: '/setting/message_remind',
        name: 'message_remind',
        component: () => import(/* webpackChunkName: "setting" */ '@/views/user/setting/message_remind.vue'),
        meta: {
            auth: true,
            index: 10,
            title: "消息提醒设置"
        },

    },
    {
        path: '/orders',
        name: 'orders',
        component: () => import(/* webpackChunkName: "orders" */ '@/views/user/orders/index.vue'),
        meta: {
            auth: true,
            index: 10,
            title: "我的订单"
        },

    },
    {
        path: '/orders/detail',
        name: 'orders_detail',
        component: () => import(/* webpackChunkName: "orders" */ '@/views/user/orders/detail.vue'),
        meta: {
            auth: true,
            index: 15,
            title: "立即使用｜核销校验码"
        },

    },
    {
        path: '/store',
        name: 'store',
        component: () => import(/* webpackChunkName: "store" */ '@/views/user/store/index.vue'),
        meta: {
            auth: true,
            index: 20,
            title: "门店详情"
        },

    },
    {
        path: '/myshare',
        name: 'myshare',
        component: () => import(/* webpackChunkName: "myshare" */ '@/views/user/myshare/index.vue'),
        meta: {
            auth: true,
            index: 10,
            title: "分享记录",
            keepAlive: true
        },

    },
    {
        path: '/myshare/detail',
        name: 'myshare_detail',
        component: () => import(/* webpackChunkName: "myshare" */ '@/views/user/myshare/detail.vue'),
        meta: {
            auth: true,
            index: 15,
            title: "分享详情"
        }
    },
    {
        path: '/construction_case',
        name: 'construction_case',
        component: () => import(/* webpackChunkName: "construction_case" */ '@/views/user/construction_case/index.vue'),
        meta: {
            auth: false,
            index: 25,
            title: "施工案例"
        },

    },
    {
        path: '/evaluate',
        name: 'evaluate',
        component: () => import(/* webpackChunkName: "evaluate" */ '@/views/user/evaluate/index.vue'),
        meta: {
            auth: true,
            index: 25,
            title: "全部评价"
        },

    },
    {
        path: '/evaluate/add',
        name: 'evaluate_add',
        component: () => import(/* webpackChunkName: "evaluate" */ '@/views/user/evaluate/add.vue'),
        meta: {
            auth: true,
            index: 10,
            title: "评价"
        },

    },
    {
        path: '/evaluate/detail',
        name: 'evaluate_detail',
        component: () => import(/* webpackChunkName: "evaluate" */ '@/views/user/evaluate/detail.vue'),
        meta: {
            auth: true,
            index: 10,
            title: "查看评价"
        },

    },

    {
        path: '*',
        name: 'not_fount',
        component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
        meta: {
            auth: true,
            index: 1,
            title: "加载中…"
        },

    },
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

//重写push 防止push当前路径报错
const routerPush = router.__proto__.push
router.__proto__.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}

router.beforeEach(async (to, from, next) => {

    //切换路由，取消上个页面所有请求
    window.__axiosPromiseArr.forEach((ele, index) => {
        ele.cancel()
        window.__axiosPromiseArr.shift()
    })

    //设置公众号信息
    if (to.query.sysSource) {
        store.commit("setUser", "")
        await store.dispatch('getSysInfo', to.query.sysSource);
    }

    // //是否授权
    // const user = store.state.user
    // if (to.meta.auth === true) {
    //     if (!user) {
    //         if (to.path !== '/auth') {
    //             store.commit('setRedirectUrl', to.fullPath);
    //             return next({ path: '/auth?timestamp=' + new Date().getTime(), replace: true })
    //         }
    //     }

    //     //是否绑定手机号
    //     if (user && !user.phone) {
    //         //运营数据页面 必须要先绑定手机号
    //         if (to.path === '/' || to.path === '/mydata') {
    //             console.log('to.fullPath',to.fullPath);
    //             from.path !== '/auth' && store.commit('setRedirectUrl', to.fullPath);
    //             return next({ path: '/add_phone', replace: true })
    //         }
    //     }
    // }
    next()
    document.title = to.meta.title
})



export default router
