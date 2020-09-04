<template>
    <div>
        <div>
            <b-button variant="primary" class="shadow my-2" v-b-modal.modal-add-ref @click="mode = 'add'">
                <font-awesome-icon icon="plus-square"/>
                Tambah Jenis Dokumen
            </b-button>
        </div>
        <b-table
            small
            head-variant="dark"
            bordered
            striped
            hover
            class="shadow"
            :fields="fields"
            :items="refDokPenyelesaian"
            responsive
        >

            <!-- custom control -->
            <template #cell(act)="{ item }">
                <b-button variant="primary" size="sm" @click="editItem(item)" class="shadow">
                    <font-awesome-icon icon='pencil-alt'/>
                    Edit
                </b-button>
                <b-button variant="danger" size="sm" @click="deleteItem(item)" class="shadow">
                    <font-awesome-icon icon='trash-alt'/>
                    Delete
                </b-button>
            </template>

        </b-table>

        <!-- modal -->
        <b-modal
        :title="modalTitle"
        id="modal-add-ref"
        ref="modal"
        header-bg-variant="light"
        footer-bg-variant="light"
        centered
        >
            <!-- custom footer -->
            <template #modal-footer>
                <b-button variant="primary" size="sm" @click="saveItem">
                    <font-awesome-icon icon="save"/>
                    Simpan
                </b-button>
            </template>

            <!-- body -->
            <b-form-group label="Jenis Dokumen Penyelesaian">
                <!-- when add, show edit box bound to modalAddRefData.nama -->
                <template v-if="mode == 'add'">
                    <b-form-input v-model="modalAddRefData.nama"/>
                </template>

                <!-- when editing -->
                <template v-else>
                    <b-form-input v-model="modalEditRefData.item.nama"/>
                </template>
            </b-form-group>
        </b-modal>
    </div>
</template>

<script>

import axiosErrorHandler from '../mixins/axiosErrorHandler'
import userChecker from '../mixins/userChecker'
import { mapGetters, mapMutations } from 'vuex'

export default {
    mixins: [
        axiosErrorHandler,
        userChecker
    ],

    data () {
        return {
            refDokPenyelesaian: [],

            fields: [
                { key: 'id', class: 'text-center' },
                { key: 'nama', class: 'text-center' },
                ...(this.hasRole("CONSOLE") ? [{ label: '', key: 'act', class: 'text-center' }] : [] )
            ],

            mode: 'add',

            modalAddRefData: {
                nama: null
            },

            modalEditRefData: {
                item: null
            }
        }
    },

    methods: {
        ...mapMutations(['setBusyState']),

        editItem(item) {
            this.mode = 'edit'
            this.modalEditRefData.item = item
            this.$refs.modal.show()
        },

        saveItem() {
            this.setBusyState(true)

            var result = null

            if (this.mode == 'add') {
                result = this.api.createRefDokPenyelesaian(this.modalAddRefData)
                .then(e => {
                    this.setBusyState(false)
                    
                    this.$nextTick(() => {
                        this.$refs.modal.hide()
                        // reset data
                        this.modalAddRefData.nama = null
                        // reload data too?
                        this.fetchItem()
                        // show toast
                        this.showToast(
                            'Data added',
                            'Jenis Dokumen Penyelesaian berhasil ditambahkan',
                            'success'
                        )
                    })
                })
            } else {
                result = this.api.updateRefDokPenyelesaian(this.modalEditRefData.item)
                .then(e => {
                    this.setBusyState(false)
                    
                    this.$nextTick(() => {
                        this.$refs.modal.hide()
                        // reset data
                        this.modalEditRefData.item = null
                        // reload data too?
                        this.fetchItem()
                        // show toast
                        this.showToast(
                            'Data Updated',
                            'Jenis Dokumen Penyelesaian berhasil diupdate',
                            'success'
                        )
                    })
                })
            }

            if (result)
                result.catch(e => {
                    this.setBusyState(false)
                    this.handleError(e)
                })
            
        },

        async deleteItem(item) {
            var answer = await this.$bvModal.msgBoxConfirm(
                `Delete Ref Dok Penyelesaian #${item.id}?`,
                {
                    title: 'Konfirmasi',
                    size: 'sm',
                    buttonSize: 'sm',
                    okVariant: 'danger',
                    centered: true
                }
            )

            if (answer) {
                this.setBusyState(true)
                this.api.deleteRefDokPenyelesaian(item.id)
                .then(e => {
                    this.setBusyState(false)
                    this.$nextTick(() => {
                        this.fetchItem()
                        this.showToast('Deleted', 'Referensi Dokumen Berhasil dihapus', 'warning')
                    })
                })
                .catch(e => {
                    this.setBusyState(false)
                    this.handleError(e)
                })
            }
        },

        fetchItem() {
            this.setBusyState(true)
            this.api.getRefDokPenyelesaian()
            .then(e => {
                this.setBusyState(false)
                this.refDokPenyelesaian = e.data.data
            })
            .catch(e => {
                this.setBusyState(false)
                this.handleError(e)
            })
        }
    },

    computed: {
        ...mapGetters(['api']),

        modalTitle () {
            return this.mode == 'add' ? 'Tambah Jenis Dokumen Penyelesaian' : 'Edit Jenis Dokumen Penyelesaian'
        },


    },

    created() {
        this.fetchItem()
    }
}
</script>