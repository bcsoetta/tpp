<template>
    <div>
        <!-- buttons -->
        <div class="my-2">
            <!-- select all -->
            <b-button 
                variant="dark"
                class="shadow"
                v-b-tooltip.hover title="Pilih Semua Data"
                @click="selectAll"
            >
                <font-awesome-icon icon="tasks"/>
                Select All
            </b-button>
            <!-- clear selection -->
            <b-button 
                variant="danger"
                class="shadow"
                v-b-tooltip.hover title="Clear selection"
                @click="clearSelection"
            >
                <font-awesome-icon icon="times"/>
                Clear Selection
            </b-button>
            <!-- Refresh -->
            <b-button 
                variant="success"
                class="shadow"
                v-b-tooltip.hover title="Refresh data"
                @click="loadData($refs.browser)"
            >
                <font-awesome-icon icon="sync"/>
                Refresh
            </b-button>
            <!-- Create Penetapan -->
            <b-button 
                variant="primary"
                :disabled="!selected.length"
                class="shadow"
                v-b-tooltip.hover :title="selected.join(',')"
                @click="handlePenetapan(selectedData)"
            >
                <font-awesome-icon icon="stamp"/>
                <template v-if="!selected.length">
                    Pilih TPS Dulu pls
                </template>
                <template v-else>
                    Rekam Penetapan dari
                    <template v-if="selected.length < 2">
                        TPS: 
                        <b-badge 
                        v-for="(kode) in selected" 
                        :key="kode" 
                        :variant="badgeVariant(kode)"
                        >{{ kode }}</b-badge>
                    </template>
                    <template v-else>
                        <b-badge>{{ selected.length }}</b-badge> TPS
                    </template>
                </template>
            </b-button>

        </div>
        <!-- Paginated Browser here -->
        <paginated-browser
        ref="browser"
        manual
        @data-request="onDataRequest"
        >
            <!-- custom rendering here -->
            <template #default="{ viewData, data }">
            <b-form-row>
                <b-col md="4" v-for="(tps) in viewData" :key="tps.id" class="mb-2">
                <!-- iterate over all of data -->
                    <b-card 
                        :header-bg-variant="inSelection(tps.kode) ? 'dark' : 'light'" 
                        :header-text-variant="inSelection(tps.kode) ? 'light' : null"
                        :footer-bg-variant="inSelection(tps.kode) ? 'dark' : 'light'"
                        :body-bg-variant="!inSelection(tps.kode) ? null : 'dark'"
                        :body-text-variant="inSelection(tps.kode) ? 'light' : null"
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
                            <b-button 
                                :variant="!inSelection(tps.kode) ? 'primary' : 'light'" 
                                :pressed="inSelection(tps.kode)"
                                block
                                @click="inSelection(tps.kode) ? selected.splice(selected.indexOf(tps.kode), 1) : selected.push(tps.kode)">
                                {{ inSelection(tps.kode) ? 'Deselect' : 'Select' }}
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
        :data="selectedData" 
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

import dataSelection from '../mixins/dataSelection'
import niceties from '../mixins/niceties'

export default {
    mixins: [axiosErrorHandler, dataSelection, niceties],

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
        ...mapGetters(['api']),

        selectedData () {
            return this.data.filter(e => (this.inSelection(e.kode)))
        }
    },

    methods: {
        ...mapMutations(['setBusyState']),

        inSelection(kode) {
            return this.selected.indexOf(kode) >= 0
        },

        selectAll () {
            this.clearSelection()
            this.data.forEach(e => {
                this.selected.push(e.kode)
            });
        },

        loadData(vm) {
            this.fetchTpsSiapPenetapan({}, this.setBusyState, vm)
        },

        filterData(e, q) {
            // by kode or real name
            var pass = true
            if (q.q) {
                q.q = q.q.toUpperCase()
                pass = e.kode.indexOf(q.q) >= 0
                    || e.nama.indexOf(q.q) >= 0
            }
            return pass
        },

        fetchTpsSiapPenetapan(q, spinner, vm) {
            spinner(true)
            // call api
            this.api.getTps({
                ...q,
                siap_penetapan:true,
                show_all:true
            })
            .then(e => {
                spinner(false)

                this.data = e.data.data
                this.total = e.data.meta.pagination.total

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
            // clear?
            this.clearSelection()
            this.data.splice(0)
            this.loadData(this.$refs.browser)
        }
    }
}
</script>