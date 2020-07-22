<template>
    <b-container md="6" class="mt-2 mt-md-4 col-md-4 col-sm-12">
        <b-card
            header-bg-variant="dark"
            header-text-variant="light"
            footer-bg-variant="dark"
            footer-text-variant="light"
            class="shadow">
            <template v-slot:header>
                <h2 class="text-center">
                    <img src="../assets/banner_icon.png" width="64px" class="mr-2">Customs Warehouse Management System
                </h2>
            </template>
            <template v-slot:footer>
                &copy; Duktek Soetta 2020
            </template>
            <!-- <b-card-title>
                Login SiBAPE
            </b-card-title> -->
            <b-form @submit.prevent="processLogin">
                <b-form-group
                    label="Username"
                    label-for="username"
                    description="Username SSO">
                    <b-input-group>
                        <b-form-input
                            id="username"
                            v-model.trim="username"
                            required
                            placeholder="Username sesuai SSO..."
                            type="text"
                            :disabled="!loginReady"></b-form-input>
                        <b-input-group-append>
                            <b-input-group-text>
                                <font-awesome-icon icon="user"></font-awesome-icon>
                            </b-input-group-text>
                        </b-input-group-append>
                    </b-input-group>
                    
                </b-form-group>
                <b-form-group
                    label="Password"
                    label-for="password"
                    description="Password sesuai SSO">
                    <b-input-group>
                        <b-form-input
                            id="password"
                            v-model.trim="password"
                            required
                            placeholder="Password sesuai SSO..."
                            type="password"
                            :disabled="!loginReady"></b-form-input>
                        <b-input-group-append>
                            <b-input-group-text>
                                <font-awesome-icon icon="lock"></font-awesome-icon>
                            </b-input-group-text>
                        </b-input-group-append>
                    </b-input-group>
                </b-form-group>
                <b-alert :show="errorMsg.length" variant="danger">{{ errorMsg }}</b-alert>
                <div>
                    <b-button type="submit" variant="primary" :disabled="!loginReady">{{ loginButtonText }}<b-spinner small variant="light" v-if="!loginReady"></b-spinner></b-button>
                    <!-- <a href="./static/sso/api.php">SSO API</a> -->
                    <!-- <b-button type="button" variant="dark" @click="getUserInfo">Get UserInfo</b-button> -->
                </div>
            </b-form>
        </b-card>
        
        <!-- <pre>{{ JSON.stringify(userInfo) }}</pre> -->
    </b-container>
</template>

<script>
import { mapGetters } from 'vuex'

const axios = require('axios').default

export default {
    data () {
        return {
            username: '',
            password: '',
            attached: false,
            userInfo: null,
            errorMsg: '',
            loginStatus: 'Attaching',
            lokasi: null
        }
    },
    computed: {
        ...mapGetters(['sso']),

        environment: function () {
            console.log(process)
            return process.NODE_ENV
        },
        loginButtonText () {
            if (this.loginStatus.length) {
                // still busy, return it
                return this.loginStatus
            } else {
                return "Login"
            }
        },
        loginReady () {
            return this.loginStatus.length == 0
        }
    },

    watch: {
        'sso.attached': {
            immediate: true,
            handler(nv) {
                if (nv) {
                    this.loginStatus = ''
                } else {
                    this.loginStatus = 'ATTACHING...'

                    var timer = setInterval(() => {
                        if (this.sso.attached) {
                            clearInterval(timer)
                            return
                        }
                        console.log('Attempt to attach...')
                        this.sso.attach()
                    }, 4000)
                }
            }
        }
    },

    methods: {
        processLogin () {
            if (!this.loginReady) {
                alert('Login IS NOT READY BIATCH!!')
            }

            // set some status
            this.errorMsg = ''
            this.loginStatus = 'Logging in... '

            /* const fd = new FormData()
            fd.set('username', this.username)
            fd.set('password', this.password)

            axios({
                method: 'post',
                url: '/static/sso/api.php?command=login',
                data: fd,
                config: {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            }) */
            this.sso.login(this.username, this.password)
                .then( (e) => {
                    console.log('login success')
                    console.log(e)
                    // store user info locally
                    this.userInfo = e.data
                    this.errorMsg = ''
                    this.loginStatus = 'Redirecting to homepage... '

                    // store at central store
                    this.$store.commit('setUserInfo', e.data)
                    // this.$store.commit('setLokasi', this.lokasi)

                    // redirect to home?
                    this.$router.push({
                        path: '/'
                    }, () => {})
                })
                .catch( (e) => {
                    console.log('login error')
                    console.log(e.response)
                    if (e.response) {
                        // got some response with the error
                        this.errorMsg = e.response.data.error
                    } else {
                        this.errorMsg = e
                    }
                    this.loginStatus = ''
                })
        },
        getUserInfo () {
            /* axios({
                method: 'get',
                url: '/static/sso/api.php?command=getUserInfo'
            }) */
            this.sso.getUserInfo()
            .then((e) => {
                this.userInfo = e
            })
            .catch((e) => {
                alert(e.data)
            })
        }
    }
}
</script>