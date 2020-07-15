<template>
    <div>
        <!-- paginated browser here -->
        <paginated-browser
            :data-callback="getAwbSiapGateIn"
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
                                v-b-tooltip.hover title="Proses Gate In"
                                @click="prosesGateIn(row.item)">
                                <font-awesome-icon icon="warehouse"/>
                            </b-button>
                        </div>
                    </template>

                    <!-- additional column -->
                    <template #cell(tps)="row">
                        <b-badge 
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
import { mapGetters, mapMutations } from 'vuex'
import PaginatedBrowser from '@/components/PaginatedBrowser'

export default {
    mixins: [
        axiosErrorHandler
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

        getAwbSiapGateIn(q, spinner, vm) {
            spinner(true)

            // call api
            this.api.getAwbSiapGateIn(q)
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

        // generate random consistent badge
        badgeVariant(text) {
            // make it a number?
            const variants = [
                'primary', 'secondary', 'success', 'danger', 'warning', 'info','light','dark'
            ];

            var n = 0;
            for (var i=0; i<text.length; i++ ) {
                n += text.charCodeAt(i) * Math.pow(10, i)
            }
            n = n % variants.length
            return variants[n]
        },

        // proses gate in
        async prosesGateIn(awb) {
            console.log('Gate in: ', awb)
            var answer = await this.$bvModal.msgBoxConfirm(
                `Gate In (${awb.hawb})?`,
                {
                    title: 'Konfirmasi',
                    size: 'sm',
                    buttonSize: 'sm',
                    okVariant: 'danger',
                    centered: true
                }
            )

            if (answer) {
                this.setBusyState(true)
                // do shit here
                this.api.gateInAwb(awb.id)
                .then(e => {
                    this.setBusyState(false)
                    // success? show toast
                    this.showToast(`AWB Gated In`, `AWB ${awb.hawb} telah digate-in`, 'success')
                    this.$nextTick(() => {
                        // refresh browser
                        this.$refs.browser.stayAtCurrentPage(-1)
                    })
                })
                .catch(e => {
                    this.setBusyState(false)
                    this.handleError(e)
                })
            }
        }
    }
}
</script>