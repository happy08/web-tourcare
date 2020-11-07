import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import api from '@/service/api';
import utils from "@/utils/index"

Vue.use(Vuex)

const state = {
    keepAlive: [], //缓存页面
    sysInfo: "",  //系统信息
    redirectUrl: "", //重定向路径
    user: "",      //用户
    defaultRole: "",  //默认角色
    shareMoneyMusic: { //健康接力页面背景音乐
        play: true,  
        lastTime:""  //上次时间，3天后自动播放
    },
}

const getters = {
}

const mutations = {
    setKeepAlive: (state, payload) => state.keepAlive = payload,

    //设置系统信息
    setSysInfo: (state, payload) => state.sysInfo = payload,

    //设置重定向路径
    setRedirectUrl: (state, payload) => {
        let redirectUrl = utils.urlDelParams(payload, 'sysSource')
        state.redirectUrl = redirectUrl + (redirectUrl.indexOf('?') === "-1" ? '?' : '&') + 'timestamp=' + new Date().getTime()
    },

    //设置用户
    setUser: (state, payload) => state.user = payload,

    //设置默认角色
    setDefaultRole: (state, payload) => state.defaultRole = payload,

    //绑定手机
    addPhone: (state, payload) => state.user.phone = payload,

    //设置健康接力页面背景音乐开启/关闭
    setShareMoneyMusic: (state, payload) => state.shareMoneyMusic = payload
}

const actions = {
    //获取系统信息
    async getSysInfo({ commit }, sysSource) {
        try {
            const params = {
                pk: sysSource,
                source: sysSource,
                errMsg: false
            }
            const res = await api.findAppCheckTypeInfo(params)
            if (!!res && !!res.obj) {
                commit('setSysInfo', res.obj);
            }
        } catch (err) { }
    },

    //通过code获取用户
    async getUser({ commit }, code) {
        try {
            const params = {
                code: code,
                errMsg: false
            }
            const res = await api.login(params) //api.getAccountsUserAndRole
            if (!!res && !!res.obj) {
                //用户信息
                commit('setUser', res.obj.user);
            }
        } catch (err) { }
    },

}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    plugins: [createPersistedState()]
})
