<template>
    <div>
        <!-- Paginated Browser here -->
        <paginated-browser
        :data-callback="fetchTpsSiapPenetapan"
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
                            Terdapat <b-badge variant="light">{{ tps.total }}</b-badge> Entry Manifest yang belum ditetapkan
                        </b-alert>

                        <template #footer>
                            <b-button variant="primary" @click="handlePenetapan(tps)">
                                Tetapkan <b-badge variant="light">{{ tps.total }}</b-badge> AWB
                            </b-button>
                        </template>
                    </b-card>
                </b-col>
            </b-form-row>
            </template>
        </paginated-browser>

        <!-- The Modal -->
        <modal-penetapan 
        size="xl" 
        id="modal-penetapan" 
        :data="dataPenetapan" 
        v-if="dataPenetapan" 
        @delete="handleDelete"
        @penetapan="onPenetapanDone"
        />
    </div>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import PaginatedBrowser from '@/components/PaginatedBrowser'
import { mapMutations, mapGetters } from 'vuex'
import ModalPenetapan from '@/components/ModalPenetapan'

export default {
    mixins: [axiosErrorHandler],

    components: {
        PaginatedBrowser,
        ModalPenetapan
    },

    data () {
        return {
            dataPenetapan: null
        }
    },

    computed: {
        ...mapGetters(['api'])
    },

    methods: {
        ...mapMutations(['setBusyState']),

        fetchTpsSiapPenetapan(q, spinner, vm) {
            spinner(true)
            // call api
            this.api.getTps({
                ...q,
                siap_penetapan:true
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
        handlePenetapan (tps) {
            // simply set tps data, and show modal-penetapan
            this.dataPenetapan = tps

            this.$nextTick(() => {
                this.$bvModal.show('modal-penetapan')
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
        onPenetapanDone (e) {
            // we simply refresh the browser
            this.$nextTick(() => {
                this.$refs.browser.stayAtCurrentPage(-1)
            })
        }
    }
}
</script>