<template>
    <b-modal
        v-bind="$attrs"
        v-on="$listeners"
        header-bg-variant="light"
        footer-bg-variant="light"
        ref="modal"
    >
        <!-- custom rendering -->
        <template #modal-title>
            Rekam BAST untuk barang dari Gudang {{ data.nama }} (<strong>{{ data.kode }}</strong>)
        </template>

        <!-- body -->
        <b-row>
            <!-- no + tgl surat -->
            <b-col md="6">
                <b-form-group label="No surat" description="penomoran manual utk menghindari konflik dengan BA lain pada seksi ybs">
                    <b-form-input size="sm" v-model="no_dok_lengkap" />
                </b-form-group>
            </b-col>

            <b-col md="2">
                <b-form-group label="Tgl surat">
                    <datepicker size="sm" v-model="tgl_dok" />
                </b-form-group>
            </b-col>
        </b-row>

        <!-- table data awal -->
        <!-- <table-data-awal 
        :items="data.siap_penetapan.data" 
        read-only
        @delete="e => { $emit('delete', data.siap_penetapan.data[e]) }"
        /> -->
        <paginated-browser
            :search-date-range="false"
            :search-box="false"
            :data-callback="fetchAwbSiapRekamBAST"
            ref="browserAwb"
        >
            <!-- custom rendering   -->
            <template #default="{ data, pagination }">
                <table-data-awal
                    :items="data"
                    :start="pagination.start"
                    read-only
                    @delete="e => { handleDelete(data[e]) }"
                />
            </template>
        </paginated-browser>

        <!-- footer -->
        <template #modal-footer>
            <b-button variant="danger" size="sm" @click="createBAST">
                <font-awesome-icon icon="pencil-alt"/>
                Rekam
            </b-button>
        </template>
    </b-modal>
</template>

<script>
import Datepicker from '@/components/Datepicker'
import TableDataAwal from '@/components/TableDataAwal'
import { mapGetters, mapMutations } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import PaginatedBrowser from '@/components/PaginatedBrowser'
import SelectUser from '@/components/SelectUser'

export default {
    inheritAttrs: false,

    mixins: [ axiosErrorHandler ],

    props: {
        data: {
            type: Object,
            required: true
        }
    },

    components: {
        Datepicker,
        TableDataAwal,
        PaginatedBrowser,
        SelectUser
    },

    data () {
        return {
            no_dok_lengkap: null,
            tgl_dok: null
        }
    },

    computed: {
        ...mapGetters(['api'])
    },

    methods: {
        ...mapMutations(['setBusyState']),

        // grab data
        fetchAwbSiapRekamBAST(q, spinner, vm) {
            spinner(true)

            this.api.getAwbSiapRekamBAST(this.data.kode, q)
            .then(e => {
                spinner(false)
                vm.setData(e.data.data)
                vm.setTotal(e.data.meta.pagination.total)
            })
            .catch(e => {
                spinner(false)
                this.handleError(e)
            })
        },

        // when delete button pressed
        async handleDelete (e) {
            console.log('deleting', e)

            var answer = await this.$bvModal.msgBoxConfirm(
                `Delete Entry Manifest HAWB: '${e.hawb}'?`, {
                    title: `Hapus Entry Manifest #${e.id}`,
                    size: 'md',
                    buttonSize: 'md',
                    okVariant: 'danger',
                    okTitle: 'YES',
                    cancelTitle: 'NO',
                    footerClass: 'p-2',
                    hideHeaderClose: false,
                    centered: true
                }
            )

            if (answer) {
                this.setBusyState(true)

                this.api.deleteAwb(e.id)
                .then(e => {
                    this.setBusyState(false)
                    // reload?
                    this.$nextTick(() => {
                        this.$refs.browserAwb.stayAtCurrentPage(-1)
                    })
                })
                .catch(e => {
                    this.setBusyState(false)
                    this.handleError(e)
                })
            }
        },

        // create penetapan
        createBAST () {
            this.setBusyState(true)

            // call api
            this.api.createBAST(this.data.kode, {
                nomor_lengkap_dok: this.no_dok_lengkap,
                tgl_dok: this.tgl_dok
            })
            .then(e => {
                this.setBusyState(false)
                // show toast
                this.showToast('Done', `Berhasil merekam BAST Nomor ${e.data.nomor} berisi ${e.data.total} AWB`, 'success')
                // close modal
                this.$nextTick(() => {
                    this.$refs.modal.hide()
                    // also emit something changed?
                    this.$emit('rekam-bast', e.data)
                })
            })
            .catch(e => {
                this.setBusyState(false)
                this.handleError(e)
            })
        }
    }
}
</script>