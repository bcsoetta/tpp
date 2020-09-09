<template>
    <div v-if="dataPnbp">
        <!-- 1st row, nomor + tgl? -->
        <b-row>
            <!-- nomor dok -->
            <b-col md="6">
                <b-form-group label="Nomor PNBP">
                    <b-form-input
                        :disabled="readOnly"
                        v-model="dataPnbp.nomor_lengkap_dok"
                    />
                </b-form-group>
            </b-col>
            <!-- tgl dok -->
            <b-col md="2">
                <b-form-group label="Tgl Dok">
                    <datepicker
                        :disabled="readOnly"
                        v-model="dataPnbp.tgl_dok"
                    />
                </b-form-group>
            </b-col>
            <!-- tgl gate in -->
            <b-col md="2">
                <b-form-group label="Tgl GateIn">
                    <datepicker
                        :disabled="readOnly"
                        v-model="dataPnbp.tgl_gate_in"
                    />
                </b-form-group>
            </b-col>
            <!-- tgl gate out -->
            <b-col md="2">
                <b-form-group label="Tgl GateOut">
                    <datepicker
                        :disabled="readOnly"
                        v-model="dataPnbp.tgl_gate_out"
                    />
                </b-form-group>
            </b-col>

            <!-- kode_surat -->
            <b-col md="3">
                <b-form-group label="Kode Penomoran">
                    <v-select
                        :disabed="!mockupMode && readOnly"
                        :options="opsiKodeSurat"
                        v-model="dataPnbp.kode_surat"
                        />
                </b-form-group>
            </b-col>

            <!-- nama_bidang -->
            <b-col md="3">
                <b-row>
                    <b-col>
                    <b-form-group label="Kode Bidang">
                        <v-select
                            :disabed="!mockupMode && readOnly"
                            :options="opsiBidang"
                            v-model="dataPnbp.nama_bidang"
                            />
                    </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                    <b-form-group label="Kode Seksi">
                        <v-select
                            :disabed="!mockupMode && readOnly"
                            :options="opsiJabatan"
                            v-model="dataPnbp.nama_jabatan"
                            />
                    </b-form-group>
                    </b-col>
                </b-row>
            </b-col>

            <!-- pejabat -->
            <b-col md="5">
                <b-form-group label="Pejabat">
                    <select-user
                        :disabled="!mockupMode && readOnly"
                        v-model="dataPnbp.pejabat_id"
                        :search-on-empty="!dataPnbp.pejabat_id"
                    />
                </b-form-group>
            </b-col>
        </b-row>

        <!-- 2nd row, pertaining to calculation -->
        <b-row>
            <b-col md="10" offset-md="1">
                <!-- fill it with table? -->
                <table class="table table-bordered table-striped shadow">
                    <thead>
                        <tr class="text-center bg-dark text-light">
                            <th>Item Perhitungan</th>
                            <th>Nilai</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Brutto -->
                        <tr>
                            <td>Brutto</td>
                            <td class="text-right">
                                {{ dataPnbp.entry_manifest.data.brutto | formatCurrency(2) }} kg
                            </td>
                        </tr>
                        <!-- Total Hari -->
                        <tr>
                            <td>Lama timbun di TPP: ({{ dataPnbp.tgl_gate_in_text }} s/d {{ dataPnbp.tgl_gate_out_text }})</td>
                            <td class="text-right">
                                {{ dataPnbp.total_hari }} hari
                            </td>
                        </tr>
                        <!-- Total Hari -->
                        <tr>
                            <td>Tarif penimbunan barang di TPP</td>
                            <td class="text-right">
                                {{ dataPnbp.tarif_pnbp | formatCurrency(2) | displayRupiah }} /kg/hari
                            </td>
                        </tr>
                        <!-- Total Sewa -->
                        <tr>
                            <td>Total Nilai Sewa penimbunan barang di TPP</td>
                            <td class="text-right">
                                {{ dataPnbp.nilai_sewa | formatCurrency(2) | displayRupiah }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Datepicker from './Datepicker'
import vSelect from 'vue-select'
import SelectUser from './SelectUser'

export default {
    props: {
        readOnly: {
            type: Boolean,
            default: true
        },

        mockupMode: {
            type: Boolean,
            default: true
        },

        dataPnbp: {
            type: Object
        }
    },

    components: {
        Datepicker,
        vSelect,
        SelectUser
    },

    data () {
        return {

        }
    },

    computed: {
        opsiBidang () {
            return [
                'BIDANG PFPC I',
                'BIDANG PFPC II',
            ]
        },

        opsiJabatan () {
            return [
                'Pabean Cukai I',
                'Pabean Cukai II',
                'Pabean Cukai III',
                'Pabean Cukai IV',
                'Pabean Cukai V',
                'Pabean Cukai VI',
                'Pabean Cukai VII',
                'Pabean Cukai VIII',
                'Pabean Cukai IX',
                'Pabean Cukai X'
            ]
        },

        opsiKodeSurat () {
            return [
                'KPU.03/BD.0301/TPP',
                'KPU.03/BD.0302/TPP',
                'KPU.03/BD.0303/TPP',
                'KPU.03/BD.0304/TPP',
                'KPU.03/BD.0305/TPP',
                'KPU.03/BD.0306/TPP',
                'KPU.03/BD.0307/TPP',
                'KPU.03/BD.0308/TPP',
                'KPU.03/BD.0309/TPP',
                'KPU.03/BD.0310/TPP',
            ]
        }
    }
}
</script>