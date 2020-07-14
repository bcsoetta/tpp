<template>
    <api-select
        v-on="$listeners"
        v-bind="$attrs"

        :search-callback="searchKasi"
        :reduce="e => e.id"
    >
        <!-- custom rendering -->
        <template #option="opt">
            <h5>👨‍✈️{{ opt.name }}</h5>
            <div>NIP {{ opt.nip }}</div>
            <div>{{ opt.pangkat }}</div>
        </template>

        <template #selected-option="opt">
            👨‍✈️{{ opt.name }}&nbsp;(<strong>{{ opt.nip }}</strong>)
        </template>
    </api-select>
</template>

<script>
import ApiSelect from '@/components/ApiSelect'
import { mapGetters, mapMutations } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'

export default {
    inheritAttrs: false,

    mixins: [
        axiosErrorHandler
    ],

    components: {
        ApiSelect
    },

    computed: {
        ...mapGetters(['api'])
    },

    methods: {
        ...mapMutations(['setBusyState']),

        searchKasi(q, spinner, vm) {
            spinner(true)

            this.api.getKasi(q)
            .then(e => {
                spinner(false)
                vm.setOptions(e.data.data)
            })
            .catch(e => {
                spinner(false)
                this.handleError(e)
            })
        }
    }
}
</script>