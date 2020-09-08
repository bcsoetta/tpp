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
                    :showPencacahan="true"

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

                </awb-flexi-table>
            </template>
        </paginated-browser>

        <!-- Modal utk rekam data -->
        <b-modal
            id="modal-ba-cacah"
            ref="modal"
            size="xl"
            title="Rekam Berita Acara Pencacahan"
            footer-bg-variant="light"
            header-bg-variant="light"
            @hide="penetapan_id=[null], bast_id=[null]"
        >
            <!-- footer -->
            <template #modal-footer>
                <b-button size="sm" variant="primary" @click="createBACacah">
                    <font-awesome-icon icon="save" />
                    Rekam
                </b-button>
            </template>

            <!-- nomor ba cacah + st in a row -->
            <b-row>
                <b-col md="4">
                    <b-form-group label="Nomor Berita Acara" description="Isikan nomor BA penuh">
                        <b-form-input 
                            v-model="nomor_ba_cacah"
                        />
                    </b-form-group>
                </b-col>
                <b-col md="2">
                    <b-form-group label="Tanggal">
                        <datepicker
                            v-model="tgl_ba_cacah"
                        />
                    </b-form-group>
                </b-col>
                <!-- <b-col md="4">
                    <b-form-group label="Nomor Surat Tugas" description="Isikan nomor ST penuh">
                        <b-form-input 
                            v-model="nomor_st"
                        />
                    </b-form-group>
                </b-col>
                <b-col md="2">
                    <b-form-group label="Tanggal">
                        <datepicker
                            v-model="tgl_st"
                        />
                    </b-form-group>
                </b-col> -->
            </b-row>
            <b-row>
                <!-- Select Penetapan -->
                <b-col md="6">
                    <b-form-group>
                        <template #label>
                            Pilih Penetapan <b-button variant="dark" class="shadow" size="sm" @click="penetapan_id.push(null)">Tambah</b-button>
                        </template>

                        <!-- List of select penetapan -->
                        <div v-for="(p_id, index) in penetapan_id" :key="index" class="my-1">
                            <b-input-group>
                                <select-penetapan 
                                    class="flex-grow-1"
                                    :search-on-empty="!p_id"
                                    :value="p_id" 
                                    @input="e => penetapan_id[index] = e" 
                                />
                                <b-button variant="danger" class="shadow" size="sm" @click="penetapan_id.splice(index,1)">
                                    <font-awesome-icon icon="trash-alt"/>
                                </b-button>
                            </b-input-group>
                        </div>
                    </b-form-group>
                </b-col>

                <!-- Select BAST -->
                <b-col md="6">
                    <b-form-group>
                        <template #label>
                            Pilih BAST <b-button variant="dark" class="shadow" size="sm" @click="bast_id.push(null)">Tambah</b-button>
                        </template>

                        <!-- List of select penetapan -->
                        <div v-for="(p_id, index) in bast_id" :key="index" class="my-1">
                            <b-input-group>
                                <select-bast 
                                    class="flex-grow-1"
                                    :search-on-empty="!p_id"
                                    :value="p_id" 
                                    @input="e => bast_id[index] = e" 
                                />
                                <b-button variant="danger" class="shadow" size="sm" @click="bast_id.splice(index,1)">
                                    <font-awesome-icon icon="trash-alt"/>
                                </b-button>
                            </b-input-group>
                        </div>
                    </b-form-group>
                </b-col>
            </b-row>
            <!-- Pilih pejabat + pelaksana? -->
            <b-row>
                
                <b-col md="6">
                    <b-form-group>
                        <template #label>
                            Pilih Pejabat (yang mengetahui)
                        </template>

                        <!-- List of select penetapan -->
                        <select-user
                            :search-on-empty="!pejabat_id"
                            v-model="pejabat_id"
                        />
                    </b-form-group>
                </b-col>
                <b-col md="6">
                    <b-form-group>
                        <template #label>
                            Pilih Pelaksana <b-button variant="dark" class="shadow" size="sm" @click="pelaksana_id.push(null)">Tambah</b-button>
                        </template>

                        <!-- List of select user -->
                        <div v-for="(p_id, index) in pelaksana_id" :key="index" class="my-1">
                            <b-input-group>
                                <select-user 
                                    role="tpp.pelaksana"
                                    class="flex-grow-1"
                                    :search-on-empty="!p_id"
                                    :value="p_id" 
                                    @input="e => pelaksana_id[index] = e" 
                                />
                                <b-button variant="danger" class="shadow" size="sm" @click="pelaksana_id.splice(index,1)">
                                    <font-awesome-icon icon="trash-alt"/>
                                </b-button>
                            </b-input-group>
                        </div>
                    </b-form-group>
                </b-col>
            </b-row>

            <!-- the paginated browser in offline mode? -->
            <hr>
            <b-form-group :label="`AWB Terpilih: (${selectedData.length})`">
                <paginated-browser
                    manual
                    ref="browserModal"
                    @data-request="onRequestselectedData"
                >
                    <template #default="{ data, pagination }">
                        <awb-flexi-table
                            :showBc11="false"
                            :items="data"

                            :per-page="pagination.number"
                            :current-page="pagination.page"
                            show-pencacahan
                            />
                    </template>
                </paginated-browser>
            </b-form-group>
        </b-modal>
    </div>
</template>

<script>
import PaginatedBrowser from '@/components/PaginatedBrowser'
import AwbFlexiTable from '@/components/AwbFlexiTable'

import Datepicker from '@/components/Datepicker'

import SelectPenetapan from '@/components/SelectPenetapan'
import SelectBast from '@/components/SelectBast'
import SelectUser from '@/components/SelectUser'

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
        PaginatedBrowser,
        Datepicker,
        SelectPenetapan,
        SelectBast,
        SelectUser
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
            pelaksana_id: [null],

            // penetapan_id (s)
            penetapan_id: [null],

            // bast_id (s)
            bast_id: [null]
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

        onRequestselectedData({q, spinner, vm}) {
            var filtered = this.selectedData.filter(e => this.filterData(e, q))
            vm.setData(filtered)
            vm.setTotal(filtered.length)
        },

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
        createBACacah () {
            this.setBusyState(true)

            // call api
            this.api.createBACacah({
                nomor_lengkap: this.nomor_ba_cacah,
                tgl_dok: this.tgl_ba_cacah,
                nomor_st: this.nomor_st,
                tgl_st: this.tgl_st,

                pejabat_id: this.pejabat_id,

                penetapan_id: this.penetapan_id,
                bast_id: this.bast_id,
                pelaksana_id: this.pelaksana_id,
                
                entry_manifest_id: this.selected,
            })
            .then(e => {
                this.setBusyState(false)
                // show toast
                this.showToast('Done', `Berhasil merekam BA Cacah  #${e.data.id} nomor ${e.data.nomor_lengkap} tanggal ${e.data.tgl_dok} berisi ${e.data.total} AWB`, 'success')

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