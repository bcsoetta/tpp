<template>
    <b-modal
        v-bind="$attrs"
        v-on="$listeners"
        header-bg-variant="light"
        footer-bg-variant="light"
        ref="modal"
    >
        <!-- custom title -->
        <template #modal-title>
            Penyelesaian Untuk Entry Manifest #{{ dataId }}
        </template>

        <!-- custom footer -->
        <template #modal-footer>
            <b-button size="sm" @click="clearFields">
                Clear
            </b-button>

            <b-button variant="primary" size="sm">
                <font-awesome-icon icon="save"/>
                Simpan
            </b-button>
        </template>

        <!-- body -->
        <b-row>
            <b-col md="8">
                <b-form-group label="Jenis Dokumen Penyelesaian">
                    <v-select
                    :options="refDokPenyelesaian"
                    label="nama"
                    v-model="jenis_dok"
                    />
                </b-form-group>
            </b-col>
            <b-col md="4">
                <b-form-group label="Tanggal Dokumen">
                    <datepicker
                    v-model="tgl_dok"
                    />
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group label="Nomor Dokumen">
                    <b-form-input
                        v-model="no_dok"
                    />
                </b-form-group>
            </b-col>
        </b-row>


    </b-modal>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'

import Datepicker from './Datepicker'
import vSelect from 'vue-select'
import { mapGetters, mapActions } from 'vuex'

export default {
    inheritAttrs: false,

    mixins: [ axiosErrorHandler ],

    props: {
        dataId: [String,Number]
    },

    components: {
        Datepicker,
        vSelect
    },

    data () {
        return {
            options: null,

            jenis_dok: null,
            no_dok: null,
            tgl_dok: null
        }
    },

    methods: {
        ...mapActions(['fetchRefDokPenyelesaian']),

        clearFields() {
            this.jenis_dok = this.no_dok = this.tgl_dok = null
        }
    },

    computed: {
        ...mapGetters(['refDokPenyelesaian'])
    },

    created() {
        // fetch dok penyelesaian
        this.fetchRefDokPenyelesaian()
        .catch(e => {
            this.handleError(e)
        })
    }
}
</script>