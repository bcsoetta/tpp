<template>
    <b-modal
    v-bind="$attrs"
    v-on="$listeners"
    header-bg-variant="light"
    footer-bg-variant="light"
    >
        <!-- custom rendering -->
        <template #modal-title>
            <div v-if="data.id">
                Edit Data TPS #{{ data.id }}
            </div>
            <div v-else>
                Input TPS Baru
            </div>
        </template>

        <!-- custom buttons -->
        <template #modal-footer="{ok}">
            <b-button variant="primary" size="sm" :disabled="disableInput" @click="ok">

                <template v-if="!busy">
                    <font-awesome-icon icon="save"/>
                    Simpan
                </template>
                <template v-else>
                    <b-spinner small />
                    Menyimpan...
                </template>
            </b-button>
        </template>

        <!-- id + KODE -->
        <b-form-row>
            <b-col md="6">
                <b-form-group label="ID (auto)">
                    <b-form-input disabled v-model="data.id" size="sm"/>
                </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group label="Kode">
                    <b-form-input :disabled="disableInput" v-model="data.kode" size="sm"/>
                </b-form-group>
            </b-col>
        </b-form-row>

        <!-- nama -->
        <b-form-group label="Nama TPS">
            <b-form-input :disabled="disableInput" v-model="data.nama" size="sm"/>
        </b-form-group>
        
        <!-- alamat -->
        <b-form-group label="Alamat TPS">
            <b-form-textarea :disabled="disableInput" v-model="data.alamat" size="sm"/>
        </b-form-group>
    </b-modal>
</template>

<script>
export default {
    inheritAttrs: false,

    props: {
        data: {
            type: Object,
            required: true
        },

        disabled: {
            type: Boolean,
            default: false
        },

        busy: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        disableInput() {
            return this.disabled || this.busy
        }
    }
}
</script>