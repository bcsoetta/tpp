<template>
    <b-modal
        v-bind="$attrs"
        v-on="$listeners"
        header-bg-variant="light"
        footer-bg-variant="light"
        :title="`Update racking untuk entry manifest #${data.hawb || data.mawb}`"
    >
        <!-- custom footer -->
        <template #modal-footer>
            <b-button size="sm" variant="primary" @click="updateRacking">
                <font-awesome-icon icon="dolly-flatbed"/>
                Update Racking
            </b-button>
        </template>

        <!-- select racking -->
        <select-rack
        v-model="rack_id"
        />
    </b-modal>
</template>

<script>
import SelectRack from './SelectRack'

export default {
    inheritAttrs: false,

    props: {
        data: Object
    },

    components: {
        SelectRack
    },

    data () {
        return {
            rack_id: null
        }
    },

    methods: {
        updateRacking() {
            this.$emit('update-rack', {
                entry_manifest_id: this.data.id,
                rack_id: this.rack_id
            })
        }
    },

    
}
</script>