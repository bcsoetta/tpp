const axios = require('axios').default
/**
 * sso.js
 * wrapper utk manggil sso jasny 
 * real file ada di /static/sso/api.php
 */

class SSO {
    //  constructor does nothing I guess
    constructor(attachOnInit) {
        // init variables
        this.attached = false

        // maybe do some attachment when started?
        try {
            // await on ajax request (serialize it)
            if (attachOnInit) {
                this.attach()
            }

            console.log('SSO SESSION ATTACHED!')
        } catch (e) {
            console.log('FAILED ATTACHING SSO SESSION')
        }
    }

    // attach, make it async
    async attach() {
        var me = this
        var ret = await $.ajax({
            url: '/static/sso/api.php?command=attach',
            crossDomain: true,
            dataType: 'jsonp'
        })
            .done((e) => {
                me.attached = true
            })

        return ret
    }

    // just login
    login(username, password) {
        const fd = new FormData()

        fd.set('username', username)
        fd.set('password', password)

        return axios({
            method: 'post',
            url: '/static/sso/api.php?command=login',
            data: fd,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        })
    }

    // logout using post
    logout() {
        return axios({
            method: 'post',
            url: '/static/sso/api.php?command=logout'
        })
    }

    // get user info
    getUserInfo() {
        return axios({
            method: 'get',
            url: '/static/sso/api.php?command=getUserInfo'
        })
    }
}

//  export list
export {
    SSO
}