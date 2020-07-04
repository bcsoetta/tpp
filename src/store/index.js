import Vue from 'vue'
import Vuex from 'vuex'
import { ApiTpp } from './api-tpp'
import { SSO } from './sso'

Vue.use(Vuex)

const axios = require('axios').default
const STORE_DEBUG = true

// now we grab variable
/* const proc_env = process.env.NODE_ENV
console.log('App run in : ' + proc_env)
console.log('Complete env : ')
console.log(process.env)
 */
export default new Vuex.Store({
    state: {
        userInfo: null, // user info dari sso
        busy: false,    // status layar (busy) bakal mnculin modal
        lokasi: 'KANTOR',   // data lokasi
        // backend SiBAPE
        api: new ApiTpp(process.env.API_URL, process.env.API_TIMEOUT),
        sso: new SSO(process.env.NODE_ENV == 'production'),
        
        sidebarActive: false,

        // referensi
        tps: [], // masih kosong,
        fetchTps: null
    },
    mutations: {
        setSidebarActive(state, payload) {
            state.sidebarActive = payload
        },
        setUserInfo(state, payload) {
            state.userInfo = payload
        },
        setBusyState(state, payload) {
            state.busy = payload
            // log it?
            console.log("BUSY? " + state.busy)
        },
        setLokasi(state, payload) {
            state.lokasi = payload

            // also store @ localStorage for 
            // later fetch if unavailable
            localStorage.setItem('lokasi', payload)
        },
        setToken(state, payload) {
            state.api.setToken(payload)
        },
        clearLocalData(state) {
            state.userInfo = null
            // state.lokasi = null
            localStorage.clear()
        },

        setTps(state, payload) {
            state.tps = payload
        },

        setFetchTps(state, payload) {
            state.fetchTps = payload
            state.fetchTps.then(e => {
                state.tps = e.data.data
            })
        }
    },
    getters: {
        sidebar: (state) => (state.sidebarActive),
        lokasi: state => {
            if (!state.lokasi) {
                // attempt to fetch from localStorage
                // if our store is newly created
                return localStorage.getItem('lokasi')
            }
            return state.lokasi
        },
        api: state => {
            return state.api
        },
        sso: state => {
            return state.sso
        },

        canEdit: state => {
            // check if user role is one of 'KASI' or 'CONSOLE'
            // do we have user info?
            if (!state.userInfo) return false
            // does the user have apps?
            if (!state.userInfo.apps_data) return false
            // does the user have SiBAPE privilege?
            if (!state.userInfo.apps_data['11']) return false
            // ok, check privileges
            return state.userInfo.apps_data['11'].roles.filter(e => e == 'CONSOLE').length > 0
        },
        canDelete: (state, getters) => isDocLocked => {
            return getters.canEdit || !isDocLocked
        },
        roles: (state) => {
            if (!state.userInfo) return false
            if (!state.userInfo.apps_data) return false
            if (!state.userInfo.apps_data['11']) return false

            return state.userInfo.apps_data['11'].roles
            // return state.userInfo.apps_data['5'].roles.filter(e => -1 !== roles.indexOf(e))
        },
        version: (state) => {
            return process.env.APP_VERSION
        },
        hasRole : (state, getters) => (roles) => {
            // special case
            if (roles === '*') {
                var arr_roles = getters.roles
                return Array.isArray(arr_roles)
            }

            // better check, split em
            var arr_roles = roles.split(',')
            var intersection = arr_roles.filter(e => getters.roles.indexOf(e) !== -1)

            return intersection.length > 0
        },

        // activate safe mode for pemeriksa
        tps: (state) => {
            return state.tps
        },
    },
    actions: {
        fetchTps (context) {
            // only does this if we're not fetching already
            if (!context.state.fetchTps) {
                context.commit('setFetchTps', context.getters.api.getTps({
                        number: 500
                    })
                )
            }

            return context.state.fetchTps
        }
    }
})