<template>
    <div>
        <!-- paginated browser here -->
        <paginated-browser
            :data-callback="getAwb"
            ref="browser"
        >
            <!-- put table in the middle -->
            <template #default="{ data, pagination }">
                <table-data-awal
                    :showNumber="false"
                    :showKeterangan="false"
                    :items="data"
                    read-only
                    editable
                    :appendFields="['tps']"
                >
                    <!-- slot for controls (total override) -->
                    <template #controls="{ row }">
                        <div class="text-center">
                            <b-button 
                            size="sm" 
                            variant="primary" 
                            class="shadow" 
                            v-b-tooltip.hover title="Edit/Lihat Detil"
                            :to="`/hawb/${row.item.id}`"
                            >
                                <font-awesome-icon icon="pencil-alt"/>
                            </b-button>
                        </div>
                    </template>

                    <!-- additional column -->
                    <template #cell(tps)="row">
                        <b-badge 
                            v-if="row.item.tps"
                            :id="`badge-${row.item.id}`" 
                            :variant="badgeVariant(row.item.tps.data.kode)"
                            v-b-tooltip.hover :title="row.item.tps.data.nama"
                            >
                            {{ row.item.tps.data.kode }}
                        </b-badge>

                    </template>
                </table-data-awal>
            </template>
        </paginated-browser>
    </div>
</template>

<script>
import TableDataAwal from '@/components/TableDataAwal'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import niceties from '../mixins/niceties'
import { mapGetters, mapMutations } from 'vuex'
import PaginatedBrowser from '@/components/PaginatedBrowser'

export default {
    mixins: [
        axiosErrorHandler,
        niceties
    ],

    components: {
        TableDataAwal,
        PaginatedBrowser
    },

    data() {
        return {}
    },

    computed: {
        ...mapGetters(['api'])
    },

    methods: {
        ...mapMutations(['setBusyState']),

        getAwb(q, spinner, vm) {
            spinner(true)

            // call api
            this.api.getAwb(q)
            .then(e => {
                spinner(false)
                vm.setData(e.data.data)
                vm.setTotal(e.data.meta.pagination.total)
            })
            .catch(e => {
                spinner(false)
                this.handleError(e)
            })
        },
    }
}
</script>