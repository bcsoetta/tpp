const axios = require('axios').default

/**
 * apiSibape : class merepresentasikan api-backend sibape
 * @param {*} url : url backend
 * @param {*} timeout : timeout per request (jgn ngandelin kecepatan server, gunakan akal sehat)
 */
class ApiTpp {
    // private instance. made when initialized I guess
    constructor(url, timeout) {
        this.instance = axios.create({
            baseURL: url,
            timeout: timeout
        })
    }

    //===================GENERIC SECTION========================================
    // setToken (token) : ngeset semua access token tiap request    
    setToken (token) {
        this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    // generateUrl (endpoint) : menggenerate absolute url utk endpoint tertentu
    //  eg: generateUrl('cd/2') => https://apishinta.test/cd/2
    generateUrl (endpoint) {
        return this.instance.defaults.baseURL + endpoint.replace(/^\/+|\/+$/g, '')
    }

    // call GET on /endpoint
    getEndpoint (endpoint) {
        return this.instance.get(endpoint)
    }

    //===================RESOURCE : PDF======================================================
    getPdf (doctype, id, param) {
        return this.instance.get('/pdf', {
            headers: {
                'Content-Type' : 'text/html'
            },
            params: {
                doc: doctype,
                id: id,
                ...param
            }
        })
    }
    
    // this one generate accessible url (supposedly) to download pdf
    generatePdfUrl (doctype, id, param) {
        var url = this.instance.defaults.baseURL + 'pdf' + `?doc=${doctype}&id=${id}`
        // dynamically add more to param
        if (param) {
            for (var k in param) {
                url += `&${k}=${param[k]}`
            }
        }
        
        return url
    }
    
    // this one attach resource to a specific endpoints
    attachFile (doctype, id, data, progressFn) {
        var url = `/${doctype}/${id}/lampiran`
        
        return this.instance.post(url, data.blob, {
            onUploadProgress: progressFn,
            headers: {
                ...this.instance.defaults.headers,
                
                'Content-Type'      : data.type,
                // 'Content-Length'    : data.blobsize,
                'X-Content-Filesize': data.filesize,
                'X-Content-Filename': data.filename
            }
        })
    }

    // this one attach resource to a specific uri
    attachFileToUri (uri, data, progressFn) {
        return this.instance.post(uri, data.blob, {
            onUploadProgress: progressFn,
            headers: {
                ...this.instance.defaults.headers,

                'Content-Type'      : data.type,
                'X-Content-Filesize': data.filesize,
                'X-Content-Filename': data.filename
            }
        })
    }

    // this one attach ONE raw file to a specific uri
    attachRawFileToUri (uri, file, progressFn) {
        var fd = new FormData();
        fd.append('file', file)
        return this.instance.post(uri, fd, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: progressFn
        })
    }

    // this one delete attachment by id
    // deleteAttachment (id) : DELETE /lampiran/id
    deleteAttachment (id) {
        return this.instance.delete('/lampiran/' + id)
    }

    // this downloads uri
    downloadUri (uri, headers, timeout) {
        return this.instance.get(uri, {
            responseType: 'arraybuffer',
            headers: {
                ...this.instance.defaults.headers,
                ...headers
            },
            timeout : timeout || this.instance.timeout
        })
    }

    // =====================TPS ENDPOINTS=========================================================
    getTps (params) {
        return this.instance.get('/tps', {
            params: params 
        })
    }

    getTpsByKode (kode, params) {
        return this.instance.get('/tps/' + kode, {
            params: params
        })
    }

    createTps (data) {
        return this.instance.post('/tps', data)
    }

    updateTps (data) {
        return this.instance.put('/tps/' + data.id, data)
    }

    deleteTps (data) {
        return this.instance.delete('/tps/' + data.id)
    }

    // =====================AWB ENDPOINTS=========================================================
    getAwb (params) {
        return this.instance.get('/awb', {
            params: params
        })
    }

    getAwbSiapGateIn (params) {
        return this.instance.get('/awb/siap_gate_in', {
            params: params
        })
    }

    getAwbById (id, params) {
        return this.instance.get('/awb/' + id, {
            params: params
        })
    }

    getAwbSiapPenetapan (kode_tps, params) {
        return this.instance.get(`/tps/${kode_tps}/siap_penetapan`, {
            params: params
        })
    }

    getAwbSiapRekamBAST (kode_tps, params) {
        return this.instance.get(`/tps/${kode_tps}/siap_rekam_bast`, {
            params: params
        })
    }

    storeAwb (data, params) {
        return this.instance.post('/awb', data, {
            params: params
        })
    }

    deleteAwb (id) {
        return this.instance.delete('/awb/' + id)
    }

    gateInAwb (id) {
        return this.instance.put(`/awb/${id}/gate-in`)
    }

    // =====================SSO USER ENDPOINTS=========================================================
    getKasi (params) {
        return this.instance.get('/kasi', {
            params: params
        })
    }

    // ========================PENETAPAN===============================================================
    getPenetapan (params) {
        return this.instance.get('/penetapan', {
            params: params
        })
    }

    getPenetapanAwb (id, params) {
        return this.instance.get(`/penetapan/${id}/awb`, {
            params: params
        })
    }

    createPenetapan (kode_tps, data) {
        return this.instance.put(`/tps/${kode_tps}/penetapan`, data)
    }

    // ========================BAST===============================================================
    getBAST (params) {
        return this.instance.get('/bast', {
            params: params
        })
    }

    getBASTAwb (id, params) {
        return this.instance.get(`/bast/${id}/awb`, {
            params: params
        })
    }

    createBAST (kode_tps, data) {
        return this.instance.put(`tps/${kode_tps}/bast`, data)
    }

    createBASTSpecific (data, params) {
        return this.instance.post('/bast', data, {
            params: params
        })
    }
}

export {
    ApiTpp
}
