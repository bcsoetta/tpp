<template>
    <div>
        <!-- <pre>{{ $route.query }}</pre>
        <pre>{{ filter }}</pre> -->
        <!-- paginated browser here -->
        <paginated-browser
            :data-callback="getAwb"
            ref="browser"
        >
            <!-- append table param -->
            <template #append-search-param>
                <b-col md="12" class="border-bottom my-2">
                    
                </b-col>
                <b-col md="2">
                    <label>
                        <b-form-checkbox v-model="showManifest" class="d-inline-block"/>
                        Show BC11
                    </label>
                </b-col>
                <b-col md="2">
                    <label>
                        <b-form-checkbox v-model="showBcp" class="d-inline-block"/>
                        Show BCP
                    </label>
                </b-col>
            </template>

            <!-- put table in the middle -->
            <template #default="{ data, pagination }">
                <table-data-awal
                    :showNumber="false"
                    :showKeterangan="false"
                    :items="data"
                    read-only
                    editable
                    :appendFields="['tps']"

                    :hideDataBc11="!showManifest"

                    :prependFields="prependFields"
                >
                    <!-- slot for controls (total override) -->
                    <template #controls="{ row }">
                        <div class="text-center">
                            <!-- View/Edit -->
                            <b-button 
                            size="sm" 
                            variant="primary" 
                            class="shadow" 
                            v-b-tooltip.hover title="Edit/Lihat Detil"
                            :to="`/hawb/${row.item.id}`"
                            >
                                <font-awesome-icon icon="pencil-alt"/>
                            </b-button>

                            <!-- Cacah (if filter.siap_pencacahan) -->
                            <b-button
                            v-if="filter.siap_pencacahan"
                            size="sm"
                            variant="warning"
                            class="shadow"
                            v-b-tooltip.hover title="Pencacahan"
                            @click="mulaiPencacahan(row.item.id)"
                            >
                                <font-awesome-icon icon="boxes"/>
                            </b-button>
                        </div>
                    </template>

                    <!-- for BCP? -->
                    <template #cell(bcp)="{ item }">
                        <div v-if="item.bcp" class="text-center">
                            <div>
                                <b-badge :variant="item.bcp.data.jenis == 'BTD' ? 'primary' : 'danger'">
                                    {{ item.bcp.data.nomor_lengkap }}
                                </b-badge>
                            </div>

                            <div>
                                <b-badge :variant="item.bcp.data.jenis == 'BTD' ? 'info' : 'warning'">
                                    {{ item.bcp.data.tgl_dok }}
                                </b-badge>
                            </div>
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
        return {
            showManifest: true,
            showBcp: false,

            filter: {}
        }
    },

    computed: {
        ...mapGetters(['api']),

        prependFields() {
            return [
                ...(this.showBcp ? [
                    'bcp'
                ]:[])
            ]
        }
    },

    methods: {
        ...mapMutations(['setBusyState']),

        getAwb(q, spinner, vm) {
            spinner(true)

            // call api
            this.api.getAwb({
                ...q,
                ...this.filter
            })
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

        // mulai pencacahan
        async mulaiPencacahan(id) {

            var answer = await this.$bvModal.msgBoxConfirm(
                `Mulai Pencacahan?`, {
                    title: `Pencacahan`,
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

            if (!answer) return

            // just call the api
            this.setBusyState(true)
            this.api.putEndpoint(`/awb/${id}/pencacahan`)
            .then(e => {
                this.setBusyState(false)
                this.$nextTick(() => {
                    // go to the awb detail /pencacahan
                    this.$router.push(`/hawb/${id}?tab=pencacahan`)
                })
            })
            .catch(e => {
                this.setBusyState(false)
                this.handleError(e)
            })
        }
    },

    watch: {
        '$route.query': {
            deep: true,
            immediate: true,
            handler(nv, ov) {
                this.showManifest = (nv.show_bc11 == 'true')
                this.showBcp = (nv.show_bcp == 'true')

                // clear filters
                this.filter = {}

                if (nv.filter) {
                    if (!Array.isArray(nv.filter)) {
                        nv.filter = [nv.filter]
                    }

                    nv.filter.forEach(element => {
                        this.filter[element] = true
                    });
                }
            }
        },

        filter: {
            handler(nv) {
                // just reload data
                this.$refs.browser.loadData()
            }
        }
    }
}
</script>