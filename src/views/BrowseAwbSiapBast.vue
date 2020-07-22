<template>
    <div>
        <!-- button to record this -->
        <div class="my-2">
            <b-button
                variant="primary"
                class="shadow"
                :disabled="!selected.length"
                v-b-modal.modal-bast
            >
                <font-awesome-icon icon="plus-square"/>
                <template v-if="selected.length">
                    Rekam Berita Acara atas <b-badge>{{ selected.length }}</b-badge> SBP
                </template>
                <template v-else>
                    Tidak ada item terpilih
                </template>
            </b-button>
            <b-button
                variant="success"
                class="shadow"
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
                </awb-flexi-table>
            </template>

        </paginated-browser>

        <!-- empty -->
        <!-- <template v-else>
            <b-alert show variant="warning">
                Tidak ada AWB siap rekam BAST
            </b-alert>
        </template> -->

        <!-- Modal to record surat -->
        <b-modal
            id="modal-bast"
            ref="modal"
            size="xl"
            title="Rekam BAST Barang SBP (ex P2)"
            header-bg-variant="light"
            footer-bg-variant="light"
        >
            <!-- footer -->
            <template #modal-footer>
                <b-button size="sm" variant="primary" @click="createBASTSpecific">
                    <font-awesome-icon icon="save"/>
                    Rekam
                </b-button>
            </template>

            <!-- Nomor + tgl surat -->
            <b-form-row>
                <b-col md="8">
                    <b-form-group label="Nomor Surat BAST" description="Wajib diisi: isikan nomor surat full">
                        <b-form-input 
                            size="sm"
                            v-model="no_bast"
                            required
                        />
                    </b-form-group>
                </b-col>
                <b-col md="4">
                    <b-form-group label="Tanggal">
                        <datepicker 
                            size="sm"
                            v-model="tgl_bast"
                            style="width: 128px"
                        />
                    </b-form-group>
                </b-col>
            </b-form-row>
            <!-- the table viewing filtered data -->
            <b-form-group :label="'Selected AWB: ' + selected.length">
                <awb-flexi-table
                    :items="selectedData"
                    :showBc11="false"
                    primary-key="id"
                />
            </b-form-group>
        </b-modal>
    </div>
</template>

<script>
import PaginatedBrowser from '@/components/PaginatedBrowser'
import TableDataAwal from '@/components/TableDataAwal'
import AwbFlexiTable from '@/components/AwbFlexiTable'

import Datepicker from '@/components/Datepicker'
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
        TableDataAwal,
        Datepicker,
        PaginatedBrowser,
        AwbFlexiTable
    },

    data() {
        return {
            no_bast: null,
            tgl_bast: null
        }
    },

    computed: {
        ...mapGetters(['api']),
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
                siap_rekam_bast: true,
                dari_kep_bdn: true,
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

                // refresh
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