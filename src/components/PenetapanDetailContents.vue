<template>
    <paginated-browser
        ref="browser"
        :data-callback="fetchPenetapanAwb"
    >
        <!-- put table data awal in the middle -->
        <template #default="{ data, pagination }">
            <awb-flexi-table

                :items="data"
                :start="pagination.start"

                :showBc11="!bdnMode"
                :showBcp="bdnMode"
            >
                
            </awb-flexi-table>
        </template>
    </paginated-browser>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters, mapMutations } from 'vuex'
import PaginatedBrowser from '@/components/PaginatedBrowser'
import TableDataAwal from '@/components/TableDataAwal'
import AwbFlexiTable from '@/components/AwbFlexiTable'


export default {
    mixins: [ axiosErrorHandler ],

    props: {
        id: {
            type: [Number,String],
            required: true
        },

        bdnMode: {
            type: Boolean,
            default: false
        }
    },

    components: {
        PaginatedBrowser,
        TableDataAwal,
        AwbFlexiTable
    },

    methods: {
        ...mapMutations(['setBusyState']),

        fetchPenetapanAwb (q, spinner, vm) {
            spinner(true)

            this.api.getPenetapanAwb(this.id, q)
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