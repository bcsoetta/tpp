<template>
    <v-select
        v-bind="$attrs"
        v-on="$listeners"

        :reduce="reduce"

        :options="tps"
        label="kode"
        :filter-by="filterTps"
    >
        <!-- custom render option -->
        <template #option="opt">
            <h5>🏤{{ opt.kode }}</h5>
            <div>
                {{ opt.nama }}
            </div>
        </template>

        <template #selected-option="opt">
            <strong>🏤{{ opt.kode }}</strong>&nbsp;-&nbsp;
            {{ opt.nama }}
        </template>
    </v-select>    
</template>

<script>
import vSelect from 'vue-select'
import { mapGetters, mapActions } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'

export default {
    inheritAttrs: false,
    
    components: {
        vSelect
    },

    props: {
        reduce: {
            type: Function,
            default: (e) => (e.id)
        }
    },

    computed: {
        ...mapGetters(['tps'])
    },

    methods: {
        ...mapActions(['fetchTps']),

        filterTps (opt, label, search) {
            return opt.kode.toLowerCase().indexOf(search.toLowerCase()) > -1
                || opt.nama.toLowerCase().indexOf(search.toLowerCase()) > -1
        }
    },

    created () {
        // just fetch it, 
        this.fetchTps()
        .catch(e => {
            this.handleError(e)
        })
    }
}
</script>