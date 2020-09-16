<template>
    <div>
        <!-- tambah rak -->
        <div class="mb-2">
            <b-button variant="primary"
            class="shadow"
            :disabled="!hasRole('CONSOLE')"
            @click="modalAddMode()"
            >
                <font-awesome-icon icon="plus-square"/>
                Tambah Rak
            </b-button>
        </div>

        <paginated-browser
        ref="browser"
        :data-callback="getRack"
        :search-date-range="false"
        >
            <template #default="{ pagination, data }">
                <!-- put table here -->
                <b-table
                :fields="fields"
                :items="data"

                small
                hover
                striped
                responsive
                bordered
                head-variant="dark"
                class="shadow"

                no-local-sorting
                @sort-changed="onSortChanged"
                >
                    <!-- special render -->
                    <template #cell(number)="{ index }">
                        {{ pagination.start + index }}
                    </template>

                    <!-- kode -->
                    <template #cell(kode)="{ value }">
                        <b-badge :variant="badgeVariant(value.slice(0,1)+'-')">{{ value }}</b-badge>
                    </template>

                    <!-- visual data -->
                    <template #cell(visual_data)="{ item }">
                        <span>x y w h rot: <b-badge variant="primary">{{ item.x }}, {{ item.y }}, {{ item.w }}, {{ item.h }}, {{ item.rot }}</b-badge></span>
                    </template>

                    <!-- awb_count -->
                    <template #cell(total_awb)="{ value }">
                        <span><b-badge>{{ value }}</b-badge> AWB</span>
                    </template>

                    <!-- act -->
                    <template #cell(act)="{ item }">
                        <!-- see details -->
                        <b-button
                        variant="primary"
                        size="sm"
                        class="shadow my-1"
                        @click="modalViewDetail(item)"
                        >
                            <font-awesome-icon icon="clipboard-check"/>
                        </b-button>

                        <!-- update -->
                        <b-button
                        variant="warning"
                        size="sm"
                        class="shadow my-1"
                        :disabled="!hasRole('CONSOLE')"
                        @click="modalEditMode(item)"
                        >
                            <font-awesome-icon icon="pencil-alt"/>
                        </b-button>

                        <!-- delete -->
                        <b-button
                        variant="danger"
                        size="sm"
                        class="shadow my-1"
                        :disabled="!hasRole('CONSOLE')"
                        @click="destroyRack(item)"
                        >
                            <font-awesome-icon icon="trash-alt"/>
                        </b-button>
                    </template>
                </b-table>
            </template>
        </paginated-browser>

        <!-- modal tambah rak -->
        <b-modal
            id="modal-add"
            :title="mode == 'add' ? 'Tambah Rak Baru' : `Edit Rak #${rack.id} (${rack.kode})`"
            header-bg-variant="light"
            footer-bg-variant="light"
        >
        <!-- custom footer -->
            <template #modal-footer>
                <b-button size="sm" variant="primary" @click="mode == 'add' ? storeRack() : updateRack()">
                    <font-awesome-icon icon="save"/>
                    Simpan
                </b-button>
            </template>

        <!-- just show rack-contents -->
            <rack-contents :data="rack"/>
        </b-modal>

        <!-- modal utk lihat list awb -->
        <b-modal
            id="modal-view-awb"
            :title="`List AWB yang ada di rak - ${rack.kode} (${rack.total_awb})`"
            size="xl"
            header-bg-variant="light"
            hide-footer
        >
            <paginated-browser
            ref="awb_browser"
            :data-callback="getDetailAwb"
            >
                <template #default="{ data, pagination }">
                    <awb-flexi-table
                
                        :items="data"
                        :start="pagination.start"

                        show-bc11
                        show-bcp
                    >
                        
                    </awb-flexi-table>
                </template>
            </paginated-browser>
        </b-modal>
    </div>
</template>

<script>
import PaginatedBrowser from '../components/PaginatedBrowser'
import RackContents from '../components/RackContents'
import AwbFlexiTable from '../components/AwbFlexiTable'
import { mapGetters, mapMutations } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import niceties from '../mixins/niceties'
import userChecker from '../mixins/userChecker'

import defaultRack from '../defaults/defaultRack.json'

const cloneDeep = require('clone-deep')

export default {
    mixins: [
        axiosErrorHandler,
        niceties,
        userChecker
    ],
    
    components: {
        PaginatedBrowser,
        RackContents,
        AwbFlexiTable
    },

    data () {
        return {
            mode: 'add',
            rack: cloneDeep(defaultRack),

            orderBy: null
        }
    },

    methods: {
        ...mapMutations(['setBusyState']),

        getRack(q, spinner, vm) {
            this.setBusyState(true)
            // call api
            this.api.getRack({
                ...q,
                orderBy: this.orderBy
            })
            .then(e => {
                this.setBusyState(false)
                vm.setData(e.data.data)
                vm.setTotal(e.data.meta.pagination.total)
            })
            .catch(e => {
                this.setBusyState(false)
                this.handleError(e)
            })
        },

        // get detail awb
        getDetailAwb(q, spinner, vm) {
            this.setBusyState(true)
            this.api.getAwb({
                ...q,
                rack_id: this.rack.id
            })
            .then(e => {
                this.setBusyState(false)
                vm.setData(e.data.data)
                vm.setTotal(e.data.meta.pagination.total)
            })
            .catch(e => {
                this.setBusyState(false)
                this.handleError(e)
            })
        },

        // show modal add
        modalAddMode() {
            // this.rack = item
            this.rack = cloneDeep(defaultRack)
            this.mode = 'add'
            this.$bvModal.show('modal-add')
        },

        // show modal edit
        modalEditMode(item) {
            this.mode = 'edit'
            this.rack = item
            this.$bvModal.show('modal-add')
        },

        // modal view detail
        modalViewDetail(item) {
            this.rack = item
            this.$bvModal.show('modal-view-awb')
        },

        // input data rak baru
        storeRack() {
            this.setBusyState(true)
            this.api.storeRack(this.rack)
            .then(e => {
                this.setBusyState(false)
                // close modal and refresh?
                this.$bvModal.hide('modal-add')
                this.$nextTick(() => {
                    this.$refs.browser.loadData()
                    this.showToast(
                        'Data Rak Tersimpan', 
                        `Rak ${e.data.data.kode} tersimpan dengan id #${e.data.data.id}`,
                        'success'
                    )
                })
            })
            .catch(e => {
                this.setBusyState(false)
                this.handleError(e)
            })
        },

        updateRack() {
            // alert(`Gotta update mang!`)
            this.setBusyState(true)
            this.api.updateRack(this.rack.id, this.rack)
            .then(e => {
                this.setBusyState(false)
                // close modal and refresh?
                this.$bvModal.hide('modal-add')
                this.$nextTick(() => {
                    this.$refs.browser.stayAtCurrentPage(0)
                    this.showToast(
                        'Data Rak Tersimpan', 
                        `Data Rak #${this.rack.id} berhasil tersimpan`,
                        'success'
                    )
                })
            })
            .catch(e => {
                this.setBusyState(false)
                this.handleError(e)
                this.$refs.browser.stayAtCurrentPage(0)
            })
        },

        // delete rack
        async destroyRack(item) {
            var answer = await this.$bvModal.msgBoxConfirm(
                `Delete Rak: '${item.kode}'?`, {
                    title: `Hapus Rak #${item.id}`,
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
                this.api.destroyRack(item.id)
                .then(e => {
                    this.setBusyState(false)
                    this.$nextTick(() => {
                        this.$refs.browser.stayAtCurrentPage(-1)
                        this.showToast(
                            'Data rak terhapus',
                            'Data rak berhasil terhapus',
                            'warning'
                        )
                    })
                })
                .catch(e => {
                    this.setBusyState(false)
                    this.handleError(e)
                })
            }
        },

        // when sorting change
        onSortChanged(e) {
            console.log('sort changed', e)
            this.orderBy = null
            if (e.sortBy) {
                var query = `${e.sortBy}|` + (e.sortDesc ? 'desc' : 'asc')
                this.orderBy = query
            }
        }
    },

    computed: {
        ...mapGetters(['api']),

        fields() {
            return [
                { key: 'number', label: '#' },
                { key: 'kode', class: 'text-center', sortable:true },
                { key: 'visual_data', class: 'text-center' },
                { key: 'total_awb', class: 'text-center', sortable:true },
                { key: 'act', class: 'text-center' }
            ]
        }
    },

    watch: {
        orderBy: {
            handler() {
                this.$refs.browser.loadData()
            }
        }
    }
}
</script>