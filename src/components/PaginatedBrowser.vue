<template>
    <div>
        <!-- 1st row, length select and search box -->
        <!-- Make it a slot so it can be modified -->
        <b-container fluid>
        <slot name="header">
            <b-row class="mb-3 py-2 rounded border border-dark bg-light shadow bg-form-control">
                <!-- length select -->
                <!-- make it a slot too -->
                <slot name="header-length-select">
                    <b-col md="3" sm="12">
                        <b-form inline>
                            <b-form-group
                                label="tampilkan"
                                label-for="length-select"
                                class="mb-sm-2 mb-md-0">
                                <b-form-select v-model="internalLength" 
                                    :options="lengthOptions" 
                                    id="length-select" 
                                    ref="lengthSelect" 
                                    >
                                </b-form-select>
                            </b-form-group>
                        </b-form>
                    </b-col>
                </slot>
                <!-- search box -->
                <!-- make it a slot too -->
                <slot name="header-search-box">
                    <slot name="prepend-search-param"></slot>
                    <b-col md="9" sm="12" >
                        <b-form inline class="float-md-right float-sm-none" @submit.prevent="loadData">
                            <!-- search date range -->
                            <template v-if="searchDateRange">
                                <b-form-group label="dari" label-for="from" style="margin-right: .25em" class="mb-sm-2 mb-md-0">
                                    <!-- datepicker from -->
                                    <datepicker v-model="queryFrom" style="width:150px;"></datepicker>
                                </b-form-group>
                                <b-form-group label="s/d" label-for="to"  style="margin-right: .25em" class="mb-sm-2 mb-md-0">
                                    <!-- datepicker to -->
                                    <datepicker v-model="queryTo" style="width:150px;"></datepicker>
                                </b-form-group>
                            </template>
                            <template v-if="searchBox">
                                <b-form-group label="Keyword" label-for="q">
                                    <b-input-group>
                                        <b-form-input type="text" id="q" ref="q" placeholder="masukkan keyword..." 
                                            v-model="queryString"></b-form-input>
                                        <b-input-group-append>
                                            <b-button type="submit" variant="primary">
                                                <font-awesome-icon icon="search"></font-awesome-icon>
                                            </b-button>
                                        </b-input-group-append>
                                    </b-input-group>
                                </b-form-group>
                            </template>
                        </b-form>
                    </b-col>
                    <slot name="append-search-param"></slot>
                </slot>
            </b-row>
        </slot>
        </b-container>
        
        <!-- 2nd row, content -->
        <b-row class="my-2 position-relative">
            <b-col>
                <slot :data="internalData" :pagination="paginationData" v-if="dataLength">
                    There's {{ dataLength }} data here. But no render components provided. SHieet
                </slot>
                <slot name="no-data" v-if="!dataLength">
                    <b-alert show variant="danger">
                        No data found.
                    </b-alert>
                </slot>
            </b-col>
        </b-row>

        <!-- 3rd row, pagination info -->
        <b-row>
            <!-- 1st col, x of y from z -->
            <b-col md="6" sm="12">
                <span>Menampilkan <strong>{{ start }}</strong> - <strong>{{ end }}</strong> dari <strong>{{ totalRows }}</strong></span>
            </b-col>
            <b-col md="6" sm="12">
                <div class="float-md-right float-sm-center">
                    <b-pagination
                        class="shadow"
                        v-model="internalPage"
                        :per-page="internalLength"
                        :total-rows="totalRows"
                        :limit="10"></b-pagination>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import Datepicker from '@/components/Datepicker'
import axiosErrorHandler from '../mixins/axiosErrorHandler'

export default {
    name: 'paginated-browser',
    mixins: [
        axiosErrorHandler
    ],
    components: {
        Datepicker
    },
    props: {
        // default page number
        page: {
            type: [Number,String],
            default: 1
        },
        length: {
            type: [Number,String],
            default: 10
        },
        dataCallback: {
            type: Function,
            required: true
        },
        dateRange: {
            type: Boolean,
            default: true
        },
        immediateLoad: {
            type: Boolean,
            default: true
        },
        searchDateRange: {
            type: Boolean,
            default: true
        },
        searchBox: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            internalPage: this.page,
            internalLength: this.length,
            internalData: null,
            totalRows: 0,
            queryString: '',
            queryFrom: null,
            queryTo: null,
            lengthOptions: [
                { value: 2, text: "2" },
                { value: 5, text: "5" },
                { value: 10, text: "10" },
                { value: 25, text: "25" },
                { value: 50, text: "50" }
            ]
        }
    },
    computed: {
        browseData () {
            return {
                q: this.queryString,
                from: this.queryFrom,
                to: this.queryTo,
                page: this.internalPage,
                number: this.internalLength
            }
        },
        dataLength: function () {
            return this.internalData ? (Array.isArray(this.internalData) ? this.internalData.length : 0 ) : 0
        },
        start: function () {
            return Math.min( (this.internalPage - 1) * this.internalLength + 1, this.totalRows )
        },
        end: function () {
            return Math.min( this.internalPage * this.internalLength, this.totalRows )
        },
        paginationData () {
            return {
                start: this.start,
                end: this.end,
                number: this.internalLength,
                page: this.internalPage,
                total: this.totalRows
            }
        }
    },
    methods: {
        ...mapMutations(['setBusyState']),
        // call it whenever data needs to be reloaded
        loadData () {
            console.log("Calling loadData...")
            if (this.dataCallback) {
                console.log("Refreshing paginated-browser...")
                // call it (browseData, spinner, vm)
                this.dataCallback(this.browseData, this.setBusyState, this)
            }
        },
        calcLastPage (offset) {
            var newTotal = this.totalRows + offset
            // set new page?
            return Math.ceil(newTotal / this.internalLength)
        },
        // this will move to end of page after item is added by offset
        moveToLastPage (offset) {
            // set page to last
            var lastPage = this.calcLastPage(offset)
            // this.totalRows += offset

            console.log("moving to last page: ", lastPage, " from: ", this.internalPage)
            // console.log(lastPage)

            // if we're already at last
            // reload
            if (this.internalPage == lastPage) { 
                this.loadData()
            } 

            this.internalPage = lastPage
            
        },
        // this will stay but will shrink if num page is not enough
        stayAtCurrentPage (offset) {
            var newTotal = this.totalRows + offset
            // set whichever is smallest
            var targetPage = Math.min(this.internalPage, this.calcLastPage(offset))
            // 
            if (this.internalPage == targetPage) {
                this.loadData()
            } else {
                this.internalPage = targetPage
            }
        },
        // set data
        setData (data) {
            this.internalData = data
        },
        // set total
        setTotal (total) {
            this.totalRows = total
        }
    },
    watch: {
        page: function(val) {
            this.internalPage = val
        },
        length: function(val) {
            this.internalLength = val
        },
        // change in this value cause data-reload
        internalLength: function() {
            this.loadData()
        },
        internalPage: function(nv, ov) {
            console.log('internal page changed from ', ov, ' to ', nv)
            this.loadData()
        }
    },
    mounted () {
        if (this.immediateLoad) {
            this.loadData()
        }
    }
}
</script>

<style>
label.d-block {
    margin-right: .25em !important;
}
</style>