<template>
    <div>
        <b-row>
            <b-col md="4" offset-md="3">
                <b-form-group label="Jenis Dok Penyelesaian">
                    <select-dok-penyelesaian v-model="data.jenis_dokumen_id" disabled/>
                </b-form-group>
            </b-col>
            <b-col md="2">
                <b-form-group label="Tgl Dok">
                    <datepicker v-model="data.tgl_dok" disabled/>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="6" offset-md="3">
                <b-form-group label="Nomor Dokumen">
                    <b-form-input v-model="data.nomor_lengkap_dok" disabled/>
                </b-form-group>
            </b-col>
        </b-row>
    </div>
</template>

<script>

import SelectDokPenyelesaian from './SelectDokPenyelesaian'
import Datepicker from './Datepicker'

export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },

    components: {
        SelectDokPenyelesaian,
        Datepicker
    }
}
</script>