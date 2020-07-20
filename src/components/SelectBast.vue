<template>
    <api-select
        :search-callback="searchPenetapan"

        :reduce="e => e.id"

        label="id"

        v-bind="$attrs"
        v-on="$listeners"
    >
        <template #option="opt">
            <div class="font-weight-bold">
                {{ opt.nomor_lengkap }}
            </div>
            <div>
                <small>Tanggal {{ opt.tgl_dok }}</small>
            </div>
        </template>

        <template #selected-option="opt">
            <div class="font-weight-bold">{{ opt.nomor_lengkap }}</div>&nbsp;<small>Tanggal {{ opt.tgl_dok }}</small>
        </template>
    </api-select>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import ApiSelect from '@/components/ApiSelect'
import { mapGetters, mapMutations } from 'vuex'

export default {
    inheritAttrs: false,

    mixins: [
        axiosErrorHandler
    ],

    components: {
        ApiSelect
    },

    methods: {

        searchPenetapan(q, spinner, vm) {
            spinner(true)

            this.api.getBAST({
                q: q
            })
            .then(e => {
                spinner(false)
                vm.setOptions(e.data.data)
            })
            .catch(e => {
                spinner(false)
                this.handleError(e)
            })
        }
    },

    computed: {
        ...mapGetters(['api'])
    }
}
</script>