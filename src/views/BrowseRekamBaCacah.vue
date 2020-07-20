<template>
    <div>
        <!-- button to record this -->
        <div class="my-2">
            <b-button
                variant="primary"
                class="shadow"
                :disabled="!selected.length"
                v-b-modal.modal-ba-cacah
            >
                <font-awesome-icon icon="plus-square"/>
                <template v-if="selected.length">
                    Rekam Berita Acara atas <b-badge>{{ selected.length }}</b-badge> Pencacahan
                </template>
                <template v-else>
                    Tidak ada item terpilih
                </template>
            </b-button>
            <b-button
                variant="success"
                class="shadow my-1"
                @click="loadData($refs.browser)"
            >
                <font-awesome-icon icon="sync"/>
                Refresh
            </b-button>
            <b-button
                variant="dark"
                class="shadow my-1"
                v-b-toggle.smart-select
            >
                <font-awesome-icon icon="radiation"/>
                BCP Range Selection
            </b-button>
        </div>

        <!-- BCP Range Selection dialog -->
        <b-collapse id="smart-select">
            <hr>
            <b-row>
                <b-col md="6">
                    <b-form-group label="Select Berdasarkan Range BCP" description="masukkan nomor BCP LENGKAP [BTD-2020/00002 .. BTD-2020/00012]">
                        <b-input-group size="sm">
                            <b-form-input
                                class="text-center"
                                placeholder="Nomor BCP awal..."
                                :value="bcp_start"
                                @input="e => bcp_start = e.toUpperCase().trim()"
                            />
                            <b-form-input
                                class="text-center"
                                placeholder="Nomor BCP akhir..."
                                :value="bcp_end"
                                @input="e => bcp_end = e.toUpperCase().trim()"
                            />
                            <template #append>
                                <b-button variant="primary" @click="selectBCPRange">
                                    SELECT!
                                </b-button>
                            </template>
                        </b-input-group>
                    </b-form-group>
                </b-col>
            </b-row>
        </b-collapse>

        <hr>
        <!-- use PaginatedBrowser in offline mode? -->
        <!-- paginated browser here -->
        <paginated-browser 
            manual
            ref="browser"
            @data-request="onDataRequest"
        >
            <template #append-search-param>
                <b-col>
                    <label>
                        <b-form-checkbox v-model="showSelectedOnly" class="d-inline-block" />Show Selected Only
                    </label>
                </b-col>
            </template>

            <template #default="{ data, pagination }">
                <awb-flexi-table
                    :items="data"

                    :showBc11="false"

                    :per-page="pagination.number"
                    :current-page="pagination.page"

                    :prependFields="['selected']"

                    :appendFields="['pencacahan']"

                    @row-clicked="onRowClicked"
                    ref="table"
                    :tbody-tr-class="rowClass"
                    primary-key="id"
                >
                    <!-- selected cell display -->
                    <template #cell(selected)="{ item }">
                        <pre>{{ item.selected }}</pre>
                        <div class="text-center">
                            <b-form-checkbox
                                :checked="inSelection(item.id)"
                                @change="e => onSelectionChange(e, item)"
                            />
                        </div>
                    </template>

                    <!-- selection header -->
                    <template #head(selected)>
                        <div class="text-center">
                            <b-form-checkbox
                                :checked="selected.length > 0"
                                :indeterminate="selected.length > 0 && selected.length != data.length"

                                @change="e => e ? selectAll() : clearSelection()"
                            />
                        </div>
                    </template>

                    <!-- Pencacahan -->
                    <template #cell(pencacahan)="{ value }">
                        <!-- draw a row for each detail? -->
                        <div v-for="(barang, index) in value.data.barang.data" :key="barang.id">
                            <div
                                :class="['border', 'border-'+badgeVariant(barang.uraian.split(' ')[0]), 'p-1', { 'border-top' : index > 0, 'mt-1' : index > 0 }, 'font-weight-bold']"
                            >
                                <u><span v-if="barang.jumlah">{{ barang.jumlah }} {{ barang.jenis }} </span>{{ barang.uraian }}</u>
                            </div>
                        </div>
                    </template>
                </awb-flexi-table>
            </template>
        </paginated-browser>

        <!-- Modal utk rekam data -->
        <b-modal
            size="xl"
            title="Rekam Berita Acara Pencacahan"
        >
        </b-modal>
    </div>
</template>

<script>
import PaginatedBrowser from '@/components/PaginatedBrowser'
import AwbFlexiTable from '@/components/AwbFlexiTable'

import axiosErrorHandler from '../mixins/axiosErrorHandler'
import niceties from '../mixins/niceties'
import dataSelection from '../mixins/dataSelection'
import { mapGetters, mapMutations } from 'vuex'

export default {
    mixins: [
        axiosErrorHandler,
        niceties,
        dataSelection
    ],

    components: {
        AwbFlexiTable,
        PaginatedBrowser
    },

    data() {
        return {           

            // data ba cacah
            nomor_ba_cacah: null,
            tgl_ba_cacah: null,

            // nomor st
            nomor_st: null,
            tgl_st: null,

            // pejabat_id
            pejabat_id: null,

            // pelaksana_id (s)
            pelaksana_id: [],

            // penetapan_id (s)
            penetapan_id: [],

            // bast_id (s)
            bast_id: []
        }
    },

    computed: {
        ...mapGetters(['api']),

        /* pageStart () {
            return (this.currentPage-1) * this.perPage + 1
        },

        pageEnd () {
            return Math.min(this.currentPage * this.perPage, this.total)
        }, */
    },

    methods: {
        ...mapMutations(['setBusyState']),

        // load data from backend
        loadData (vm, q) {
            console.log('loadData vm: ', vm)
            // clear seelction
            // this.clearSelection()

            this.setBusyState(true)
            // call api
            this.api.getAwb({
                siap_rekam_ba_cacah: true,
                show_all: true,
                ...q
            })
            .then(e => {
                this.setBusyState(false)
                this.data = e.data.data
                this.total = e.data.meta.pagination.total
                // if vm is set
                if (vm) {
                    vm.setData(this.data)
                    vm.setTotal(this.total)
                }
            })
            .catch(e => {
                this.setBusyState(false)
                this.handleError(e)
            })
        },

        // when bast is recorded
        createBASTSpecific () {
            this.setBusyState(true)

            // call api
            this.api.createBASTSpecific({
                nomor_lengkap_dok: this.no_bast,
                tgl_dok: this.tgl_bast,
                entry_manifest: this.selected,
                ex_p2: true
            })
            .then(e => {
                this.setBusyState(false)
                // show toast
                this.showToast('Done', `Berhasil merekam BAST #${e.data.id} berisi ${e.data.total} AWB`, 'success')

                // refresh and clear selection
                this.$nextTick(() => {
                    this.$refs.modal.hide()
                    this.clearSelection()
                    this.loadData(this.$refs.browser)
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

<style>
.cursor-pointer {
    cursor: pointer;
}
</style>