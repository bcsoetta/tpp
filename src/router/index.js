import Vue from 'vue'
import Router from 'vue-router'

import HomePage from '@/views/HomePage'
import MainApp from '@/views/MainApp'

import DummyView from '@/views/DummyView'
import LoginPage from '@/views/LoginPage'
import PageNotFound from '@/views/PageNotFound'
import Forbidden from '@/views/Forbidden'

import TestPage from '@/views/TestPage'

import ImportDataAwal from '@/views/ImportDataAwal'
import ImportKepBdn from '@/views/ImportKepBdn'

import BrowseTps from '@/views/BrowseTps'

import Penetapan from '@/views/Penetapan'

import BrowseAwbGateIn from '@/views/BrowseAwbGateIn'
import BrowseAwb from '@/views/BrowseAwb'
import BrowseRekamBast from '@/views/BrowseRekamBast'

import BrowseAwbSiapBast from '@/views/BrowseAwbSiapBast'

import BrowsePenetapanBtd from '@/views/BrowsePenetapanBtd'

import ViewEntryManifest from '@/views/ViewEntryManifest'

import store from '../store'

// const axios = require('axios').default
const cookie = require('cookie')

Vue.use(Router)

const router = new Router({
  routes: [
    // specific path put first so it can resolve
    /* {
       path: '/print-sppbmcp',
       component: PrintSppbmcp
    }, */
    {
      /* root path */
      path: '/',
      component: MainApp,
      meta: {
        breadcrumb: '🏠Home',
        authRequired: true
      },
      children: [
        { /* /home */
          path: '',
          name: 'HomePage',
          component: HomePage,
          meta: {
            title: 'Home Page'
          }
        },
        {
          path: 'import-data-awal',
          name: 'ImportDataAwal',
          component: ImportDataAwal,
          meta: {
            title: 'Import Data Awal',
            breadcrumb: '📋Import Data Awal (Excel)'
          }
        },
        {
          path: 'import-kep-bdn',
          name: 'ImportKepBdn',
          component: ImportKepBdn,
          meta: {
            title: 'Import Kep BDN',
            breadcrumb: '📋Import Kep BDN dari P2'
          }
        },
        {
          path: 'penetapan-btd',
          name: 'Penetapan',
          component: Penetapan,
          meta: {
            title: 'Penetapan BTD',
            breadcrumb: '🖊️Penetapan Barang Tidak Dikuasai'
          }
        },
        {
          path: 'gate-in',
          name: 'GateIn',
          component: BrowseAwbGateIn,
          meta: {
            title: 'Browse AWB Siap Gate In',
            breadcrumb: '📦Gate In AWB'
          }
        },
        {
          path: 'bast',
          name: 'RekamBAST',
          component: BrowseRekamBast,
          meta: {
            title: 'Rekam Berita Acara Serah Terima',
            breadcrumb: '🤝🏼Rekam Berita Acara Serah Terima'
          }
        },
        {
          path: 'bast-p2',
          name: 'RekamBASTP2',
          component: BrowseAwbSiapBast,
          meta: {
            title: 'Rekam Berita Acara Serah Terima - Ex P2',
            breadcrumb: '🤝🏼Rekam Berita Acara Serah Terima - Ex P2'
          }
        },
        {
          path: 'hawb',
          meta: {
            // title: 'Browse AWB',
            breadcrumb: '🔎Browse AWB'
          },
          component: DummyView,
          children: [
            {
              // the browse view
              path: ':id',
              name: 'ViewEntryManifest',
              meta: {
                title: 'View Detail AWB',
                breadcrumb: '👁️View Detail AWB'
              },
              component: ViewEntryManifest,
              props: true
            },
            {
              // the browse view
              path: '',
              name: 'BrowseAwb',
              meta: {
                title: 'Browse AWB'
              },
              component: BrowseAwb
            }
          ]
        },
        {
          path: 'test',
          name: 'TestPage',
          component: TestPage,
          meta: {
            title: 'Test Page'
          }
        },
        {
          path: 'tps',
          name: 'BrowseTps',
          component: BrowseTps,
          meta: {
            title: 'Browse TPS',
            breadcrumb: '🔍Browse TPS'
          }
        },
        {
          path: 'browse-penetapan-btd',
          name: 'BrowsePenetapanBtd',
          component: BrowsePenetapanBtd,
          meta: {
            title: 'Browse Penetapan BTD',
            breadcrumb: '🔍Browse Penetapan BTD'
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage
    },
    {
      path: '/forbidden',
      name: 'Forbidden',
      component: Forbidden
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ],

  //  mode: 'history'
})

// set navigation guards here
router.beforeEach(async (to, from, next) => {
  console.log('-->>')
  console.log(to)

  var authRequired = to.matched.some(e => e.meta.authRequired)
  console.log("AUTH REQUIRED")

  // bypass authentication if we're in dev mode
  // also, set default userInfo
  if (process.env.NODE_ENV != 'production') {
    console.log("Not in production. Bypassing login and authentication and using default user")

    var mockRoles = {
      token_pelaksana: ['PELAKSANA'],
      token_admin: ['CONSOLE', 'KASI'],
      token_kasi: ['KASI']
    }

    var lokasiDemo = process.env.MOCK_LOKASI || "KANTOR"
    var tokenDemo = process.env.MOCK_TOKEN || 'token_admin'

    var userDemo = {
      "user_id": "666",
      "username": "user.demo",
      "name": "User Demo",
      "nip": "123456789012345678",
      "pangkat": "Penata Muda - III/a",
      "status": true,
      "apps_data": {
        "1": {
          "app_name": "SSO",
          "roles": [
            "Administrator"
          ]
        },
        "2": {
          "app_name": "APPFOTO",
          "roles": [
            "Administrator"
          ]
        },
        "3": {
          "app_name": "AKANG",
          "roles": [
            "PJT",
            "ADMIN_PABEAN",
            "SUPERUSER"
          ]
        },
        "5": {
          "app_name": "SiBAPE",
          "roles": []
        },
        "11": {
          "app_name": "TPP",
          "roles": mockRoles[tokenDemo]
        }
      }
    }

    // store default data
    store.commit('setUserInfo', userDemo)
    // store.commit('setLokasi', lokasiDemo)
    store.commit('setToken', tokenDemo)
    // bypass auth
    authRequired = false
  }

  // okay, if required and we're not logged in yet (check user info)
  console.log(store.state.userInfo)
  if (authRequired /* && !store.state.userInfo */) {
    // perhaps state.userInfo is reset, but our token is still valid?
    //  var tokenData = document.cookie.split("=")
    var cookies = cookie.parse(document.cookie)
    console.log(cookies)
    var token = cookies.sso_token_11

    var tries = 0
    while (typeof token === 'undefined' || !token) {
      console.log("No token found. Regenerating...tries: ", ++tries)
      // welp, not attached yet. force attachment
      await store.getters.sso.attach()
      cookies = cookie.parse(document.cookie)
      token = cookies.sso_token_11
    }

    // use token from .env if there's one
    if (process.env.VUE_APP_TOKEN) {
      console.log('ENV token exists! using it instead...')
      token = process.env.VUE_APP_TOKEN
    }

    console.log("Token Cookie:")
    console.log(token)
    // show loading screen
    store.commit('setBusyState', true)
    // if no token existed, we're way off of our login process
    // so just redirect to login page
    if (!token) {
      next('/login')
      store.commit('setBusyState', false)
    } else {
      // okay, token exists meaning it must have been attached (or not)
      // 1st, request user info from sso
      /* axios({
        method: 'get',
        url: '/static/sso/api.php?command=getUserInfo'
      }) */
      store.getters.sso.getUserInfo()
        .then((e) => {
          store.commit('setBusyState', false)
          // we got user info! but is it empty?
          if (!e.data) {
            // empty!! We're not logged in
            next('/login')
          } else {
            // data is valid. store it to store
            store.commit('setUserInfo', e.data)
            // also store token
            store.commit('setToken', token)
            // log store data?
            console.log('store now: ')
            console.log(store)
            // redirect to whatever page we were accessing
            if (store.getters.roles !== false) {
              console.log('Has valid roles. Go on...')
              next()
            } else {
              console.log('FORBIDDEN!!')
              next('/forbidden')
            }
          }
        })
        .catch((e) => {
          store.commit('setBusyState', false)
          // obviously we're in deep trouble
          // either the token is not-attached to sso session
          // or sso server is down. For now, redirect to
          // login
          next('/login')
        })

    }
  } else {
    store.commit('setBusyState', false)
    next()
  }
})

export default router