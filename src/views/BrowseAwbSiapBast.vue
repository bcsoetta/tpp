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
        </div>
        <hr>
        
        <!-- paginated browser here -->
        <paginated-browser 
            manual
            ref="browser"
            @data-request="onDataRequest"
        >

            <template #default="{ data, pagination }">
                <table-data-awal
                    :showNumber="false"
                    :showKeterangan="false"
                    :items="data"

                    read-only
                    :editable="false"
                    disable-controls
                    hideDataBc11

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
                </table-data-awal>
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
                <table-data-awal
                    :showKeterangan="false"
                    :items="selectedAwb"

                    read-only
                    :editable="false"
                    disable-controls
                    hideDataBc11

                    primary-key="id"
                />
            </b-form-group>
        </b-modal>
    </div>
</template>

<script>
import PaginatedBrowser from '@/components/PaginatedBrowser'
import TableDataAwal from '@/components/TableDataAwal'
import Datepicker from '@/components/Datepicker'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import niceties from '../mixins/niceties'
import { mapGetters, mapMutations } from 'vuex'

export default {
    mixins: [
        axiosErrorHandler,
        niceties
    ],

    components: {
        TableDataAwal,
        Datepicker,
        PaginatedBrowser
    },

    data() {
        return {
            total: 0,
            data: [],

            perPage: 10,
            currentPage: 1,

            selected: [],    // selected rows here

            no_bast: null,
            tgl_bast: null
        }
    },

    computed: {
        ...mapGetters(['api']),

        pageStart () {
            return (this.currentPage-1) * this.perPage + 1
        },

        pageEnd () {
            return Math.min(this.currentPage * this.perPage, this.total)
        },

        selectedAwb () {
            return this.data.filter(e => (this.inSelection(e.id)))
        }
    },

    methods: {
        ...mapMutations(['setBusyState']),

        // is awb id in selection
        inSelection(id) {
            return this.selected.indexOf(id) >= 0
        },

        // rowClass function
        rowClass(item) {
            if (this.inSelection(item.id)) {
                return ["b-table-row-selected", "table-primary", "cursor-pointer"]
            } else {
                return ["cursor-pointer"]
            }
        },

        // when data is requested, or filter change
        onDataRequest({q, spinner, vm}) {
            console.log('request-data', q)
            
            // call load data internally if no data present
            if (!this.data.length) {
                this.loadData(vm)
            }
        },

        // load data from backend
        loadData (vm) {
            console.log('loadData vm: ', vm)
            // clear seelction
            this.clearSelection()

            this.setBusyState(true)
            // call api
            this.api.getAwb({
                siap_rekam_bast: true,
                dari_kep_bdn: true,
                show_all: true
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

        // clear selection
        clearSelection () {
            this.selected = []
        },

        // select all
        selectAll () {
            this.selected = []
            this.data.forEach(e => {
                this.selected.push(e.id)
            });
        },

        // when selection change
        onSelectionChange (e, item) {
            if (e) {
                this.selected.push(item.id)
            } else {
                this.selected.splice(this.selected.indexOf(item.id), 1)
            }
        },

        // when row clicked
        onRowClicked (item) {
            console.log('select-row', item)
            
            // if selected, remove
            if (this.inSelection(item.id)) {
                var idx = this.selected.indexOf(item.id)
                this.selected.splice(idx, 1)
            } else {
                // add to selected
                this.selected.push(item.id)
            }
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