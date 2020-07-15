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
            Penetapan BTD untuk barang dari Gudang {{ data.nama }} (<strong>{{ data.kode }}</strong>)
        </template>

        <!-- body -->
        <b-row>
            <!-- no + tgl surat -->
            <b-col md="6">
                <b-form-group label="No surat" description="isi apabila nomor surat manual, kosongkan apabila ingin penomoran otomatis">
                    <b-form-input size="sm" v-model="no_dok_lengkap" />
                </b-form-group>
            </b-col>

            <b-col md="2">
                <b-form-group label="Tgl surat">
                    <datepicker size="sm" v-model="tgl_dok" />
                </b-form-group>
            </b-col>

            <b-col md="4">
                <b-form-group label="Kepala Seksi">
                    <select-kasi
                        search-on-empty
                        v-model="pejabat_id"
                    />
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
            :data-callback="fetchAwbSiapPenetapan"
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
            <b-button variant="primary" size="sm" @click="createPenetapan">
                <font-awesome-icon icon="stamp"/>
                Tetapkan
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
import SelectKasi from '@/components/SelectKasi'

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
        SelectKasi
    },

    data () {
        return {
            no_dok_lengkap: null,
            tgl_dok: null,
            pejabat_id: null
        }
    },

    computed: {
        ...mapGetters(['api'])
    },

    methods: {
        ...mapMutations(['setBusyState']),

        // grab data
        fetchAwbSiapPenetapan(q, spinner, vm) {
            spinner(true)

            this.api.getAwbSiapPenetapan(this.data.kode, q)
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
        createPenetapan () {
            this.setBusyState(true)

            // call api
            this.api.createPenetapan(this.data.kode, {
                nomor_lengkap_dok: this.no_dok_lengkap,
                tgl_dok: this.tgl_dok,
                pejabat_id: this.pejabat_id
            })
            .then(e => {
                this.setBusyState(false)
                // show toast
                this.showToast('Done', `Berhasil menetapkan ${e.data.total} AWB`, 'success')
                // close modal
                this.$nextTick(() => {
                    this.$refs.modal.hide()
                    // also emit something changed?
                    this.$emit('penetapan', e.data)
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