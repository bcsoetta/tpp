<!-- UBER TABLE FLEXIBLE TOO -->

<template>
    <b-table
        table-class="shadow"
        head-variant="dark"
        small
        striped
        hover
        bordered
        responsive="sm"

        v-bind="$attrs"
        v-on="$listeners"

        :fields="fields"
    >
        <!-- Pass thru all scoped slots -->
        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope" />
        </template>

        <!-- number -->
        <template #cell(#)="{ index }">
            {{ start+index }}.
        </template>

        <!-- bc11 -->
        <template #cell(bc11)="{ item }">
            <div v-if="item.no_bc11">
                <div>
                    <b-badge variant="primary">Nomor {{ item.no_bc11 }}</b-badge>
                </div>
                <div>
                    <b-badge variant="danger">Tanggal {{ item.tgl_bc11 }}</b-badge>
                </div>
                <div>
                    <b-badge variant="info">Pos {{ item.pos_formatted }}</b-badge>
                </div>

            </div>
            <div v-else >-</div>
        </template>

        <!-- bcp -->
        <template #cell(bcp)="{ value }">
            <div v-if="value">
                <div>
                    <b-badge :variant="value.data.jenis == 'BDN' ? 'danger' : 'primary'">{{ value.data.nomor_lengkap }}</b-badge>
                </div>
                <div>
                    <b-badge variant="info">{{ value.data.tgl_dok }}</b-badge>
                </div>
            </div>
            <div v-else>-</div>
        </template>

        <!-- kd_flight -->
        <template #cell(kd_flight)="{ value }">
            <b-badge v-if="value" :variant="badgeVariant(value)">{{ value }}</b-badge>
            <div v-else>-</div>
        </template>

        <!-- AWB -->
        <template #cell(awb)="{ item }">
            <div><b-badge variant="dark">{{ item.mawb }}</b-badge></div>
            <div><b-badge variant="success">{{ item.hawb }}</b-badge></div>
        </template>

        <template #head(awb)>
            <div class="border-bottom">MAWB</div>
            <div>HAWB</div>
        </template>

        <!-- Importir -->
        <template #cell(importir)="{ item }">
            <div :class="['bg-primary', 'font-weight-bold', 'border-bottom']">{{ item.nama_importir }}</div>
            <div>{{ item.alamat_importir }}</div>
        </template>

        <template #head(importir)>
            <div class="border-bottom">Nama Importir</div>
            <div>Alamat Importir</div>
        </template>

        <!-- Barang -->
        <template #cell(barang)="{ value }">
            <div 
                v-for="(barang, index) in value.data" :key="barang.id"
                class="font-weight-bold"
            >
                <u><span v-if="barang.jumlah">{{ barang.jumlah }} {{barang.jenis}} </span>{{ barang.uraian }}</u>
                <hr
                    v-if="value.data.length > 1 && index < value.data.length-1"
                >
            </div>
        </template>

        <!-- TPS -->
        <template #cell(tps)="{ value }">
            <div v-if="value">
                <b-badge :variant="badgeVariant(value.data.kode)">{{ value.data.kode }}</b-badge>
            </div>
            <div v-else>-</div>
        </template>

        <!-- Controls -->
        <template #cell(act)="row">
            <!-- default slot only view -->
            <slot name="controls" :row="row">

                <!-- view -->
                <b-button variant="primary" size="sm" class="shadow my-1" :to="`/hawb/${row.item.id}`">
                    <font-awesome-icon icon="eye"/>
                </b-button>

                <!-- additional control goes here -->
                <slot name="additional-controls" :row="row">
                </slot>
            </slot>
        </template>
    </b-table>
</template>

<script>
import niceties from  '../mixins/niceties'

export default {
    inheritAttrs: false,

    mixins: [
        niceties
    ],

    props: {
        showBc11: {
            type: Boolean,
            default: true
        },

        showBcp: {
            type: Boolean,
            default: true
        },

        showNumber: {
            type: Boolean,
            default: false
        },

        start: {
            type: Number,
            default: 1
        },

        showTps: {
            type: Boolean,
            default: true
        },

        showControls: {
            type: Boolean,
            default: true
        },

        prependFields: {
            type: Array,
            default: () => []
        },

        appendFields: {
            type: Array,
            default: () => []
        }
    },

    computed: {
        fields() {
            return [
                ...(this.showNumber ? ['#'] : []),
                ...this.prependFields,
                ...(this.showBcp ? [{ label: 'No BCP', key: 'bcp', class: 'text-center'}] : []),
                ...(this.showBc11 ? [
                    { label: 'Pos BC11', key:'bc11', class: 'text-center'},
                    { key: 'kd_flight', class: 'text-center'}
                ] : []),
                
                { key: 'koli', class: 'text-center'},
                { key: 'brutto', class: 'text-center', label: 'Berat (Kg)'},
                { key: 'awb', class: 'text-center'},
                { key: 'importir', class: 'text-center'},
                { key: 'barang', class: 'text-center'},
                ...(this.showTps ? [{ key: 'tps', class: 'text-center'}] : []),

                ...this.appendFields,

                ...(this.showControls ? [{
                    label: '',
                    key: 'act',
                    class: 'text-center'
                }]:[])
            ]
        }
    }
}
</script>