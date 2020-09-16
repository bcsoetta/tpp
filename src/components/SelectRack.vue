<template>
    <v-select
        v-bind="$attrs"
        v-on="$listeners"
        :reduce="e => e.id"
        :options="rack"
        label="kode"
        placeholder="Cari Kode Rak"
    >
        <template #option="opt">
            {{ opt.kode }}
        </template>
    </v-select>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters, mapActions } from 'vuex'
import vSelect from 'vue-select'

export default {
    inheritAttrs: false,

    mixins: [
        axiosErrorHandler
    ],

    components: {
        vSelect
    },

    computed: {
        ...mapGetters(['rack'])
    },

    methods: {
        ...mapActions(['fetchRack'])
    },
    
    created () {
        this.fetchRack()
        .catch(e => {
            this.handleError(e)
        })
    }
}
</script>