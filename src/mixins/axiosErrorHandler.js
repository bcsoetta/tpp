const axiosErrorHandler = {
    methods: {
        // show success message
        showToast(title,message,variant) {
            this.$bvToast.toast(message, {
                title: title,
                autoHideDelay: 5000,
                appendToast: true,
                toaster: 'b-toaster-top-center',
                variant: variant
            })
        },
        // show floating error
        showError(code, message) {
            this.showToast(`Error (${code})`, message, 'danger')
        },
        // handle error from axios
        handleError (e) {
            var code = 0
            var msg = '<GENERIC ERROR TEXT>'
            // e is axios error
            if (e.response) {
                // console.log("Got error response type: ", typeof e.response.data)
                // got response, but we must convert if the response is in array buffer
                if (e.response.data && e.response.data instanceof ArrayBuffer) {
                    console.log('Parsing arraybuffer error object...', e.response.data)
                    var jsonString = String.fromCharCode.apply(null, new Uint8Array(e.response.data))
                    console.log(jsonString)

                    try {
                        var jsonObj = JSON.parse(jsonString)
                        console.log('parsed: ', jsonObj)
                        e.response.data = jsonObj
                    } catch (error) {
                        // do nothing...
                        console.log('json parsing failed: ', error)
                    }

                }

                // continue as usual
                if (e.response.data && e.response.data.error) {
                    // stylized error
                    code = e.response.data.error.http_code
                    msg = e.response.data.error.message
                } else {
                    code = e.response.status
                    msg = e.response.statusText
                }
            } else {
                code = '?'
                msg = e.toString()
            }

            // show floating text
            this.showError(code, msg)
        }
    }
}

export default axiosErrorHandler