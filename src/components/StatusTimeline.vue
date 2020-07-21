<template>
    <div class="bg-secondary p-4 m-n2 status-cage">
        <!-- just spawn a card? or card inside div? -->
        <div v-for="status in processedData" :key="status.id" class="text-center status-node">
            <b-alert show :variant="badgeVariant(status.status)" :class="statusClass(status)" style="border-width: .2em">
                <div class="d-flex">
                    <div class="flex-grow-1"><b-badge style="font-size: 1.1rem" :variant="badgeVariant(status.status)">{{ status.status }}</b-badge></div>
                    <small>{{ status.created_at }}</small>
                </div>
                
                <!-- more description.... -->
                <p v-if="status.detail" class="text-left">
                    {{ status.detail.data.keterangan }}
                    
                    <b-button 
                    :variant="badgeVariant(status.status)" 
                    class="shadow"
                    v-if="status.detail.data.linkable"
                    >
                        View Detail {{ status.detail.data.linkable_type.replace(/App\\/i, '') }}..
                    </b-button>
                </p>
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
        statusClass(status) {
            var styles = [
                'shadow',
                'mx-auto',
            ]
            if (status.status == 'CREATED') {
                styles.push('w-25')
            } else {
                styles.push('w-50')
            }
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
.status-cage {
    box-shadow: 0 0 24px .5em rgba(25, 25, 25, 0.5) inset;
    border-radius: .2em;
}

.status-node {
    position: relative;
    margin-top: 4em;
}

.status-node:first-of-type {
    margin-top: 1em;
}

@keyframes pulse {
    0% { transform: scale(1.0) rotate(-1deg); }
    50% { transform: scale(1.05) rotate(2deg); }
    100% { transform: scale(1.0) rotate(-1deg); }
}

.status-node:first-of-type > div {
    animation: pulse infinite ease-in-out 2s;
}

.status-node::before {
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

.status-node:last-of-type::before {
    content: none;
    position: relative;
}

@media (max-width: 768px) {
    .w-25, .w-50 {
        width: 100% !important;
    }

    .status-node .d-flex {
        display: block !important;
    }

    .status-node .flex-grow-1 {
        display: block;
        width: 100%;
    }
}

</style>