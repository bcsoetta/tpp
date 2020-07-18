<template>
    <div>
        <b-row>
            <!-- Kondisi barang -->
            <b-col md="6">
                <b-form-group label="Kondisi Barang">
                    <b-form-radio-group 
                        size="sm"
                        :options="kondisiBarangOpts"
                        v-model="data.kondisi_barang"
                        :disabled="disabled"
                    />
                </b-form-group>
            </b-col>
            <!-- Peruntukan AWal -->
            <b-col md="3">
                <b-form-group label="Peruntukan Awal">
                    <v-select
                        :options="peruntukanAwalOpts"
                        v-model="data.peruntukan_awal"
                        taggable
                        :disabled="disabled"
                    />
                </b-form-group>
            </b-col>
        </b-row>
        <hr>
        <b-form-group label="Detil Pencacahan">
            <b-table
                small
                hover
                bordered
                head-variant="dark"
                class="shadow"
                striped

                :fields="detailBarangFields"
                :items="data.barang.data"

                show-empty
            >
                <template #empty>
                    <b-alert variant="warning" show class="m-0">
                        Tidak ada data detil pencacahan
                    </b-alert>
                </template>

                <!-- index -->
                <template #cell(#)="{ index }">
                    {{ index+1 }}.
                </template>

                <!-- jumlah -->
                <template #cell(jumlah)="{ item }">
                    <b-form-input 
                        v-model.number="item.jumlah" 
                        :disabled="disabled" 
                        class="text-center"
                        :debounce="500"
                    />
                </template>

                <!-- jenis -->
                <template #cell(jenis)="{ item }">
                    <b-form-input
                        :value="item.jenis"
                        @input="e => item.jenis = e.toUpperCase()"
                        :disabled="disabled" 
                        class="text-center"
                        :debounce="500"
                    />
                </template>
                
                <!-- jenis -->
                <template #cell(uraian)="{ item }">
                    <b-form-textarea 
                        :value="item.uraian" 
                        @input="e => item.uraian = e.trim()"

                        :disabled="disabled" 
                        class="text-center"
                        :debounce="500"
                    />
                </template>

                <!-- action -->
                <template #cell(action)="{ index }">
                    <div class="text-center">
                        <b-button
                            :disabled="disabled"
                            class="shadow"
                            size="sm"
                            variant="danger"
                            @click="deleteDetailBarang(index)"
                        >
                            <font-awesome-icon icon="trash-alt"/>
                        </b-button>
                    </div>
                </template>
            </b-table>
            <!-- put add button below -->
            <b-button
                v-if="!disabled"
                variant="primary"
                class="shadow"
                @click="addDetailBarang"
            >
                <font-awesome-icon icon="plus-square"/>
                Tambah Detail Barang
            </b-button>
        </b-form-group>
        <!-- <pre>{{ data }}</pre> -->
    </div>
</template>

<script>

import vSelect from 'vue-select'

import defaultDetailBarang from '../defaults/defaultDetailBarang'

const cloneDeep = require('clone-deep')

export default {
    props: {
        data: {
            type: Object,
            required: true
        },

        disabled: {
            type: Boolean,
            default: false
        }
    },

    components: {
        vSelect
    },

    methods: {
        // tambah detail barang
        addDetailBarang() {
            this.data.barang.data.push(cloneDeep(defaultDetailBarang))
        },

        // hapus detail barang (index)
        async deleteDetailBarang(index) {
            var answer = await this.$bvModal.msgBoxConfirm(
                `Delete Detail Pencacahan #${index+1}?`, {
                    title: `Konfirmasi Penghapusan`,
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

            // do something (splice)
            this.data.barang.data.splice(index, 1)
        }
    },

    computed: {
        kondisiBarangOpts() {
            return [
                { text: 'BAIK/BARU', value: 'Baik/Baru' },
                { text: 'BAIK/BEKAS', value: 'Baik/Bekas' },
                { text: 'BAIK', value: 'Baik' },
                { text: 'RUSAK', value: 'Rusak' },
                { text: 'BUSUK', value: 'Busuk' },
            ]
        },

        peruntukanAwalOpts() {
            return [
                'DILELANG',
                'DIMUSNAHKAN'
            ]
        },

        detailBarangFields() {
            return [
                '#',
                { key: 'jumlah', class: 'text-center' },
                { key: 'jenis', class: 'text-center' },
                { key: 'uraian', class: 'text-center' },
                { key: 'action', class: 'text-center' }
            ]
        }
    }
}
</script>