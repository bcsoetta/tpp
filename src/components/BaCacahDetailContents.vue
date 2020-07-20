<template>
    <paginated-browser
        ref="browser"
        :data-callback="fetchBaCacahAwb"
    >

        <!-- put table data awal in the middle -->
        <template #default="{ data, pagination }">
            <awb-flexi-table
                show-bcp
                show-pencacahan
                :items="data"
            />
        </template>
    </paginated-browser>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters, mapMutations } from 'vuex'
import PaginatedBrowser from '@/components/PaginatedBrowser'
import AwbFlexiTable from '@/components/AwbFlexiTable'


export default {
    mixins: [ axiosErrorHandler ],

    props: {
        id: {
            type: [Number,String],
            required: true
        },
    },

    components: {
        PaginatedBrowser,
        AwbFlexiTable
    },

    methods: {
        ...mapMutations(['setBusyState']),

        fetchBaCacahAwb (q, spinner, vm) {
            spinner(true)

            this.api.getBACacahAwb(this.id, q)
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
    }
}
</script>