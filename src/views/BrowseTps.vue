<template>
  <div>
    <!-- add button tambah TPS di atas -->
    <div class="mb-3" v-if="hasRole('CONSOLE')">
        <b-button variant="primary" class="shadow" @click="createTps">
            <font-awesome-icon icon="plus-square"/>
            Rekam TPS
        </b-button>
    </div>
    <paginated-browser :search-date-range="false" :data-callback="queryTps" ref="tpsBrowser">
      <!-- custom rendering. should be table here -->
      <template #default="{data,pagination}">
        <!-- <pre>{{ JSON.stringify(data, null, 2) }}</pre> -->
        <table-tps 
        :start="pagination.start" 
        :items="data" 
        @edit="editTps"
        @delete="deleteTps"
        />
      </template>
    </paginated-browser>

    <modal-view-tps 
        id="modal-tps" 
        v-if="modalData" 
        :data="modalData" 
        @ok="handleOk"
        :busy="busy"
        />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import axiosErrorHandler from "../mixins/axiosErrorHandler";
import userChecker from '../mixins/userChecker';

import PaginatedBrowser from "@/components/PaginatedBrowser";
import TableTps from '@/components/TableTps'
import ModalViewTps from '@/components/ModalViewTps'

const cloneDeep = require('clone-deep')
import defaultTps from '../defaults/defaultTps'

export default {
    mixins: [
        axiosErrorHandler,
        userChecker
    ],

    components: {
        PaginatedBrowser,
        TableTps,
        ModalViewTps
    },

    computed: {
        ...mapGetters(['api'])
    },

    data() {
        return {
            modalData: null,
            busy: false
        }
    },

    methods: {
        ...mapMutations(['setBusyState']),

        queryTps(q, spinner, vm) {
            spinner(true)

            this.api.getTps({
                ...q
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

        // to create Tps?
        createTps() {
            this.modalData = cloneDeep(defaultTps)
            this.$nextTick(() => {
                this.$bvModal.show('modal-tps')
            })
        }, 
        // to edit tps first
        editTps(data) {
            this.modalData = data
            this.$nextTick(() => {
                this.$bvModal.show('modal-tps')
            })
        },
        // delete tps with confirmation first
        async deleteTps(data) {
            var answer = await this.$bvModal.msgBoxConfirm(
                `Hapus TPS (${data.kode})?`,
                {
                    title: 'Konfirmasi',
                    size: 'sm',
                    buttonSize: 'sm',
                    okVariant: 'danger',
                    centered: true
                }
            )

            if (answer) {
                // do the deletion
                this.setBusyState(true)

                this.api.deleteTps(data)
                .then(e => {
                    this.setBusyState(false)
                    this.showToast('TPS Deleted', `TPS (${data.kode}) deleted`, 'warning')
                    this.$nextTick(() => {
                        this.$refs.tpsBrowser.stayAtCurrentPage(-1)
                    })
                })
                .catch(e => {
                    this.setBusyState(false)
                    this.handleError(e)
                })
            }
        },

        // handle ok
        handleOk(e) {
            e.preventDefault()

            this.busy = true
            const vm = this
            const inserting = this.modalData.id == null

            // are we inserting or updating?
            if (inserting) {
                // we're inserting
                vm.api.createTps(this.modalData)
                .then(e => {
                    vm.busy = false
                    // show toast?
                    vm.showToast('TPS Added', `Added TPS ${e.data.kode} @ '${e.data.uri}'`, 'success')
                    // move to last page
                    vm.$nextTick(() => {
                        vm.$bvModal.hide('modal-tps')
                        vm.$refs.tpsBrowser.moveToLastPage(1)
                    })
                })
                .catch(e => {
                    vm.busy = false
                    vm.handleError(e)
                })
            } else {
                // we're updating
                vm.api.updateTps(this.modalData)
                .then(e => {
                    vm.busy = false
                    // show toast
                    vm.showToast('TPS Updated', `TPS ${vm.modalData.kode} updated`, 'info')
                    // refresh browser on next tick
                    vm.$nextTick(() => {
                        vm.$bvModal.hide('modal-tps')
                        vm.$refs.tpsBrowser.stayAtCurrentPage(0)
                    })
                })
                .catch(e => {
                    vm.busy = false
                    vm.handleError(e)
                })
            }

        }
    }
};
</script>