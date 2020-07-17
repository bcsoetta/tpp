<template>
    <div>
        <!-- button to record this -->
        <div class="my-2">
            <b-button
                variant="primary"
                class="shadow"
                :disabled="!selected.length"
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
                @click="loadData"
            >
                <font-awesome-icon icon="sync"/>
                Refresh
            </b-button>
        </div>
        <hr>
        <!-- form-select -->
        <b-form-group
            label-cols="6"
            label="Tampilkan"
            class="d-block"
            style="width: 200px"
        >
            <b-form-select v-model="perPage" size="sm">
                <b-form-select-option :value="1">1</b-form-select-option>
                <b-form-select-option :value="5">5</b-form-select-option>
                <b-form-select-option :value="10">10</b-form-select-option>
                <b-form-select-option :value="25">25</b-form-select-option>
            </b-form-select>
        </b-form-group>
        <!-- <pre>selected: {{ selected }}</pre> -->
        <!-- paginated browser here -->
        <table-data-awal
            :showNumber="false"
            :showKeterangan="false"
            :items="data"

            read-only
            :editable="false"
            disable-controls
            hideDataBc11

            :per-page="perPage"
            :current-page="currentPage"

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

        <b-row>
            <!-- 1st col, x of y from z -->
            <b-col md="6" sm="12">
                <span>Menampilkan <strong>{{ pageStart }}</strong> - <strong>{{ pageEnd }}</strong> dari <strong>{{ total }}</strong></span>
            </b-col>
            <b-col md="6" sm="12">
                <div class="float-md-right float-sm-center">
                    <b-pagination
                        v-model="currentPage"
                        :total-rows="total"
                        :per-page="perPage"
                        class="shadow"
                    />
                </div>
            </b-col>
        </b-row>

        <!-- Modal to record surat -->
    </div>
</template>

<script>
import TableDataAwal from '@/components/TableDataAwal'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import niceties from '../mixins/niceties'
import { mapGetters, mapMutations } from 'vuex'

export default {
    mixins: [
        axiosErrorHandler,
        niceties
    ],

    components: {
        TableDataAwal
    },

    data() {
        return {
            total: 0,
            data: [],

            perPage: 10,
            currentPage: 1,

            selected: []    // selected rows here
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

    created () {
        this.loadData()
    },

    methods: {
        ...mapMutations(['setBusyState']),

        inSelection(id) {
            return this.selected.indexOf(id) >= 0
        },

        rowClass(item) {
            if (this.inSelection(item.id)) {
                return ["b-table-row-selected", "table-primary", "cursor-pointer"]
            } else {
                return ["cursor-pointer"]
            }
        },

        loadData () {
            this.setBusyState(true)
            // call api
            this.api.getAwb({
                siap_rekam_bast: true,
                dari_kep_bdn: true
            })
            .then(e => {
                this.setBusyState(false)
                this.data = e.data.data
                this.total = e.data.meta.pagination.total
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
        }
    }
}
</script>

<style>
.cursor-pointer {
    cursor: pointer;
}
</style>