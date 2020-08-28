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

        <!-- <paginated-browser
            :search-date-range="false"
            :search-box="false"
            :data-callback="fetchAwbSiapRekamBAST"
            ref="browserAwb"
        > -->
        <!-- button to record this -->
        <div class="my-2">
            <!-- <b-button
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
            </b-button> -->
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
            <!-- custom rendering   -->
            <template #default="{ data, pagination }">
               
                <awb-flexi-table
                    :per-page="pagination.number"
                    :current-page="pagination.page"
                    
                    :items="data"   

                    :prependFields="['selected']"
                    :tbody-tr-class="rowClass"
                    @row-clicked="onRowClicked"
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

                    <!-- delete button -->
                    <!-- <template #additional-controls="{ row }">
                        <b-button 
                            variant="danger"
                            class="shadow"
                            size="sm"
                            v-b-tooltip title="Delete AWB"
                            @click="handleDelete(row.item)"
                        >
                            <font-awesome-icon icon="trash-alt"/>
                        </b-button>
                    </template> -->
                </awb-flexi-table>
            </template>
        </paginated-browser>

        <!-- footer -->
        <template #modal-footer>
            <b-button variant="danger" size="sm" @click="createBAST" :disabled="!selected.length">
                <font-awesome-icon icon="pencil-alt"/>
                <span v-if="!selected.length">
                    Pilih HAWB dulu
                </span>
                <span v-else>
                    Rekam BAST untuk <b-badge>{{ selected.length }}</b-badge> AWB
                </span>
            </b-button>
        </template>
    </b-modal>
</template>

<script>
import Datepicker from '@/components/Datepicker'
import TableDataAwal from '@/components/TableDataAwal'
import AwbFlexiTable from '@/components/AwbFlexiTable'
import { mapGetters, mapMutations } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import PaginatedBrowser from '@/components/PaginatedBrowser'
import SelectUser from '@/components/SelectUser'
import dataSelection from '../mixins/dataSelection'

export default {
    inheritAttrs: false,

    mixins: [ 
        axiosErrorHandler,
        dataSelection
    ],

    props: {
        dataTps: {
            type: Object,
            required: true
        }
    },

    components: {
        Datepicker,
        TableDataAwal,
        PaginatedBrowser,
        SelectUser,
        AwbFlexiTable
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

        onRequestselectedData({q, spinner, vm}) {
            var filtered = this.selectedData.filter(e => this.filterData(e, q))
            vm.setData(filtered)
            vm.setTotal(filtered.length)
        },

        // grab data
        loadData(vm, q) {
            const spinner = this.setBusyState
            spinner(true)

            this.api.getAwbSiapRekamBAST(this.dataTps.kode, q)
            .then(e => {
                spinner(false)
                this.data = e.data.data
                this.total = e.data.meta.pagination.total

                if (vm) {
                    vm.setData(this.data)
                    vm.setTotal(this.total)
                }
            })
            .catch(e => {
                spinner(false)
                alert('FUGG')
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

            // console.log('selected', this.selected)

            // return

            // call api
            this.api.createBAST(this.dataTps.kode, {
                nomor_lengkap_dok: this.no_dok_lengkap,
                tgl_dok: this.tgl_dok,
                entry_manifest_id: this.selected
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