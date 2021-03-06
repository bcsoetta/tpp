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

    // call POST on /endpoint
    postEndpoint (endpoint, data, params) {
        return this.instance.post(endpoint, data, {
            params: params
        })
    }

    // call PUT on /endpoint
    putEndpoint (endpoint, data, params) {
        return this.instance.put(endpoint, data, {
            params: params
        })
    }

    // call DELETE on /endpoint
    deleteEndpoint (endpoint, params) {
        return this.instance.delete(endpoint, {
            params: params
        })
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

    rollbackGateInAwb (id) {
        return this.instance.delete(`/awb/${id}/gate-in`)
    }

    storePenyelesaian (id, data) {
        return this.instance.put(`/awb/${id}/penyelesaian`, data)
    }

    gateOutAwb (id) {
        return this.instance.put(`/awb/${id}/gate-out`)
    }

    awbUpdateRack (id, rack_id) {
        return this.instance.patch(`/awb/${id}`,[
            { op: 'update-rack', data: { 'rack_id': rack_id } }
        ])
    }

    awbSiapBMNCount () {
        return this.instance.get('/awb/siap_bmn')
    }

    // =====================SSO USER ENDPOINTS=========================================================
    getKasi (params) {
        return this.instance.get('/kasi', {
            params: params
        })
    }

    getUser (params) {
        return this.instance.get('/sso', {
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

    editSuratPenetapan (id, nomor, tanggal) {
        return this.instance.patch(`/penetapan/${id}`, {
            nomor_lengkap_dok: nomor,
            tgl_dok: tanggal
        })
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

    // ========================BA CACAH===============================================================
    getBACacah (params) {
        return this.instance.get('/ba_cacah', {
            params: params
        })
    }

    getBACacahById (id, params) {
        return this.instance.get('/ba_cacah/' + id, {
            params: params
        })
    }

    getBACacahAwb (id, params) {
        return this.instance.get(`/ba_cacah/${id}/awb`, {
            params: params
        })
    }

    createBACacah (data, params) {
        return this.instance.post('/ba_cacah', data, {
            params: params
        })
    }

    // ===========================UMUM===============================================
    getSettings () {
        return this.instance.get('/setting')
    }

    getRefDokPenyelesaian () {
        return this.instance.get('/referensi-dokumen-penyelesaian')
    }

    createRefDokPenyelesaian (data) {
        return this.instance.post('/referensi-dokumen-penyelesaian', data)
    }

    deleteRefDokPenyelesaian (id) {
        return this.instance.delete(`/referensi-dokumen-penyelesaian/${id}`)
    }

    updateRefDokPenyelesaian (data) {
        return this.instance.put(`/referensi-dokumen-penyelesaian/${data.id}`, data)
    }

    // ========================PNBP===============================================================
    getPnbp (params) {
        return this.instance.get('/pnbp', {
            params: params
        })
    }
    
    getPnbpById (id, params) {
        return this.instance.get(`/pnbp/${id}`, {
            params: params
        })
    }

    precalculatePnbp (id, params) {
        return this.instance.get(`/awb/${id}/pnbp-mockup`, {
            params: params
        })
    }

    storePnbp (data) {
        return this.instance.post('/pnbp', data)
    }

    tandaiLunasPnbp (id) {
        return this.instance.patch(`/pnbp/${id}`, [
            {
                op: 'tandai-lunas'
            }
        ])
    }

    perbaruiPnbp (id) {
        return this.instance.patch(`/pnbp/${id}`, [
            {
                op: 'perbarui-pungutan'
            }
        ])
    }

    // =================================RACK=========================================================
    getRack (params) {
        return this.instance.get('/rack', {
            params: params
        })
    }

    getRackById (id, params) {
        return this.instance.get(`/rack/${id}`, {
            params: params
        })
    }

    getRackByKode (kode, params) {
        return this.instance.get(`/rack/${kode}`, {
            params: params
        })
    }

    storeRack (data) {
        return this.instance.post('/rack', data)
    }

    updateRack (id, data) {
        return this.instance.put(`/rack/${id}`, data)
    }

    destroyRack (id) {
        return this.instance.delete(`/rack/${id}`)
    }
}

export {
    ApiTpp
}
