import store from '../store'

const axios = require('axios')

export default {
    data () {
        return {
            profileUrl : 'https://intra.bcsoetta.org/',
            // viewSelectLocation: false
        }
    },

    methods: {
        // to logout of sso session
        logout () {
            store.commit('setBusyState', true)

            // call api
            /* axios({
                method: 'post',
                url: '/static/sso/api.php?command=logout'
            }) */
            store.getters.sso.logout()
            .then(e => {
                store.commit('setBusyState', false)
                // clear local data
                store.commit('clearLocalData')
                // success. return to login page?
                // also might want to cleanup store data
                this.$router.push({
                    path: '/login'
                })
            })
            .catch(e => {
                store.commit('setBusyState', false)
                // failed. you may try again
            })
        }
    },
    computed: {
        validBreadCrumbs () {
            var validBreadCrumbs = this.$route.matched
                                .filter(e=>e.meta.breadcrumb)
                                .map(e=>( { path: e.path.length ? e.path : '/', title: e.meta.breadcrumb, disabled: false} ));

            validBreadCrumbs[validBreadCrumbs.length-1].disabled = true;
            validBreadCrumbs[validBreadCrumbs.length-1].path = null;

            console.log('<<MainApp>>')
            console.log(this.$route)
            console.log(this.$route.matched.filter(e => e.meta.breadcrumb));
            console.log('<</MainApp>>')
            return validBreadCrumbs;
        },
        userInfo () {
            return store.state.userInfo
        },
        lokasi () {
            return store.getters.lokasi
        }
    }
}