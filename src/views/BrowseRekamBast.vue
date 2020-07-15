<template>
    <div>
        <!-- Paginated Browser here -->
        <paginated-browser
        :data-callback="fetchTpsSiapRekamBAST"
        ref="browser"
        >
            <!-- custom rendering here -->
            <template #default="{ data, pagination }">
            <b-form-row>
                <b-col md="4" v-for="(tps) in data" :key="tps.id" class="mb-2">
                <!-- iterate over all of data -->
                    <b-card 
                        header-bg-variant="light" 
                        footer-bg-variant="light"
                        :title="tps.nama"
                        :sub-title="tps.alamat"
                        class="shadow">
                        <template #header>
                            <h5>🏤 #{{ tps.id }} {{ tps.kode }}</h5>
                        </template>

                        <b-alert variant="info" show>
                            Terdapat <b-badge variant="light">{{ tps.total }}</b-badge> Entry Manifest yang belum direkam dalam Berita Acara Serah Terima
                        </b-alert>

                        <template #footer>
                            <b-button variant="primary" @click="handleRekamBAST(tps)">
                                Rekam BAST untuk <b-badge variant="light">{{ tps.total }}</b-badge> AWB
                            </b-button>
                        </template>
                    </b-card>
                </b-col>
            </b-form-row>
            </template>
        </paginated-browser>

        <!-- The Modal -->
        <modal-rekam-bast 
        size="xl" 
        id="modal-rekam-bast" 
        :data="dataRekamBAST" 
        v-if="dataRekamBAST" 
        @delete="handleDelete"
        @rekam-bast="onRekamBASTDone"
        />
    </div>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import PaginatedBrowser from '@/components/PaginatedBrowser'
import { mapMutations, mapGetters } from 'vuex'
import ModalRekamBast from '@/components/ModalRekamBast'

export default {
    mixins: [axiosErrorHandler],

    components: {
        PaginatedBrowser,
        ModalRekamBast
    },

    data () {
        return {
            dataRekamBAST: null
        }
    },

    computed: {
        ...mapGetters(['api'])
    },

    methods: {
        ...mapMutations(['setBusyState']),

        fetchTpsSiapRekamBAST(q, spinner, vm) {
            spinner(true)
            // call api
            this.api.getTps({
                ...q,
                siap_rekam_bast:true
            })
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

        // handlePenetapan (KODE)
        handleRekamBAST (tps) {
            // simply set tps data, and show modal-penetapan
            this.dataRekamBAST = tps

            this.$nextTick(() => {
                this.$bvModal.show('modal-rekam-bast')
            })
            /* // alert(kode_tps)
            this.setBusyState(true)

            // call api
            this.api.getTpsByKode(kode_tps, {
                include: 'siap_penetapan'
            })
            .then(e => {
                this.setBusyState(false)
                this.dataPenetapan = e.data.data

                // popup modal next
                this.$nextTick(() => {
                    this.$bvModal.show('modal-penetapan')
                })
            })
            .catch(e => {
                this.setBusyState(false)
                this.handleError(e)
            }) */
        },

        // handle delete from inside table
        handleDelete (e) {
            console.log('delete', e)
        },

        // when penetapan is done
        onRekamBASTDone (e) {
            // we simply refresh the browser
            this.$nextTick(() => {
                this.$refs.browser.stayAtCurrentPage(-1)
            })
        }
    }
}
</script>