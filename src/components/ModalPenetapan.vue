<template>
    <b-modal
        v-bind="$attrs"
        v-on="$listeners"
        header-bg-variant="light"
        footer-bg-variant="light"
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
                    <b-form-input size="sm" />
                </b-form-group>
            </b-col>

            <b-col md="2">
                <b-form-group label="Tgl surat">
                    <datepicker size="sm" />
                </b-form-group>
            </b-col>

            <b-col md="4">
                <b-form-group label="Kepala Seksi">
                    <select-kasi
                        search-on-empty
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
            <b-button variant="primary" size="sm">
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

    computed: {
        ...mapGetters(['api'])
    },

    methods: {
        ...mapMutations(['setBusyState']),

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
        }
    }
}
</script>