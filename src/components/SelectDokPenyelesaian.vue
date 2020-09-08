<template>
    <v-select
    v-bind="$attrs"
    v-on="$listeners"

    :options="refDokPenyelesaian"
    :reduce="e => e.id"
    label="nama" 
    />
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import vSelect from 'vue-select'

export default {
    inheritAttrs: false,

    mixins: [
        axiosErrorHandler
    ],

    components: {
        vSelect
    },

    methods: {
        ...mapActions(['fetchRefDokPenyelesaian']),
    },

    computed: {
        ...mapGetters(['refDokPenyelesaian'])
    },

    created () {
        // fetch dok penyelesaian
        this.fetchRefDokPenyelesaian()
        .catch(e => {
            this.handleError(e)
        })
    }
}
</script>