<template>
    <paginated-browser
        ref="browser"
        :data-callback="fetchBASTAwb"
    >
        <!-- SLOT: custom control (hide manifest) -->
        <template #append-search-param>
                <b-col md="4">
                    <label label-for="hide-manifest">
                        <b-form-checkbox v-model="hideManifest" class="d-inline-block"/>
                        Hide Manifest
                    </label>
                </b-col>
            
        </template>

        <!-- put table data awal in the middle -->
        <template #default="{ data, pagination }">
            <table-data-awal
                read-only
                disable-controls
                :items="data"
                :start="pagination.start"

                :prependFields="prependFields"

                :hideDataBc11="hideManifest"
            >
                
            </table-data-awal>
        </template>
    </paginated-browser>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters, mapMutations } from 'vuex'
import PaginatedBrowser from '@/components/PaginatedBrowser'
import TableDataAwal from '@/components/TableDataAwal'


export default {
    mixins: [ axiosErrorHandler ],

    props: {
        id: {
            type: [Number,String],
            required: true
        },

        bdnMode: {
            type: Boolean,
            default: true
        }
    },

    data () {
        return {
            hideManifest: true
        }
    },

    components: {
        PaginatedBrowser,
        TableDataAwal
    },

    methods: {
        ...mapMutations(['setBusyState']),

        fetchBASTAwb (q, spinner, vm) {
            spinner(true)

            this.api.getBASTAwb(this.id, q)
            .then(e => {
                spinner(false)
                vm.setData(e.data.data)
                vm.setTotal(e.data.meta.pagination.total)
            })
            .catch(e => {
                spinner(false)
                this.handleError(e)
            })
        }
    },

    computed: {
        ...mapGetters(['api']),

        prependFields () {
            if (this.bdnMode) {
                return [
                    { key: 'bcp.data.nomor_lengkap', label: 'BCP', class: "text-center" }, 
                    { key: 'bcp.data.tgl_dok', label: 'Tanggal', class: "text-center" }, 
                ]
            }
            return []
        }
    }
}
</script>