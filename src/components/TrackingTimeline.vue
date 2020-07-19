<template>
    <div class="bg-secondary p-4 m-n2 tracking-cage">
        <!-- just spawn a card? or card inside div? -->
        <div v-for="tracking in processedData" :key="tracking.id" class="text-center tracking-node">
            <b-alert show :variant="badgeVariant(tracking.lokasi.data.kode)" :class="trackingClass(tracking.lokasi.data.kode)" style="border-width: .2em">
                <div class="d-flex">
                    <div class="flex-grow-1 text-left"><b-badge style="font-size: 1.1rem" :variant="badgeVariant(tracking.lokasi.data.kode)">{{ tracking.lokasi.data.kode }}</b-badge></div>
                    <small>{{ tracking.created_at }}</small>
                </div>
                
                <!-- more description.... -->
                <p class="text-left">
                    <strong>{{ tracking.lokasi.data.nama }}</strong>
                </p>
                <blockquote>Tracking updated by <b-badge>{{ tracking.petugas.data.name }}</b-badge></blockquote>
            </b-alert>
        </div>
    </div>
</template>

<script>
import niceties from '../mixins/niceties'

export default {
    mixins: [ niceties ],

    props: {
        data: {
            type: Array,
            required: true
        },

        reversed: {
            type: Boolean,
            default: true
        }
    },

    methods: {
        trackingClass(tracking) {
            var styles = [
                'shadow',
                'mx-auto',
                'w-25'
            ]
            
            return styles
        }
    },

    computed: {
        processedData() {
            return this.reversed ? this.data.slice().reverse() : this.data
        }
    }
}
</script>

<style>
.tracking-cage {
    box-shadow: 0 0 24px .5em rgba(25, 25, 25, 0.5) inset;
    border-radius: .2em;
}

.tracking-node {
    position: relative;
    margin-top: 4em;
}

.tracking-node:first-of-type {
    margin-top: 1em;
}

@keyframes pulse {
    0% { transform: scale(1.0) rotate(-1deg); }
    50% { transform: scale(1.05) rotate(2deg); }
    100% { transform: scale(1.0) rotate(-1deg); }
}

.tracking-node:first-of-type > div {
    animation: pulse infinite ease-in-out 2s;
}

.tracking-node::before {
    position: absolute;
    left: 50%;
    top: 100%;
    content: " ";
    width: .5rem;
    height: 4em;
    background: rgb(235, 245, 182);
    text-align: center;
    box-shadow: 1px 1px 4px 8px rgba(169, 212, 166, 0.5);
}

.tracking-node:last-of-type::before {
    content: none;
    position: relative;
}

</style>