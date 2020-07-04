<template>
  <div>
    <!-- add button tambah TPS di atas -->
    <div class="mb-3" v-if="hasRole('CONSOLE')">
        <b-button variant="primary" class="shadow" @click="createTps">
            <font-awesome-icon icon="plus-square"/>
            Rekam TPS
        </b-button>
    </div>
    <paginated-browser :search-date-range="false" :data-callback="queryTps">
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
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import axiosErrorHandler from "../mixins/axiosErrorHandler";
import userChecker from '../mixins/userChecker';

import PaginatedBrowser from "@/components/PaginatedBrowser";
import TableTps from '@/components/TableTps'

export default {
    mixins: [
        axiosErrorHandler,
        userChecker
    ],

    components: {
        PaginatedBrowser,
        TableTps
    },

    computed: {
        ...mapGetters(['api'])
    },

    methods: {
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
        }
    }
};
</script>