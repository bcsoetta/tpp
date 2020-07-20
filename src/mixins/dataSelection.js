export default {
    // data required for selection
    data () {
        return {
            data: [],
            total: 0,

            selected: [],    // selected rows here
            showSelectedOnly: false,    // do we?

            // bcp selection
            bcp_start: '',
            bcp_end: '',
        }
    },

    watch: {
        showSelectedOnly: {
            handler(nv) {
                if (nv) {
                    // set data to be the selected
                    this.$refs.browser.setData(this.selectedAwb)
                    this.$refs.browser.setTotal(this.selectedAwb.length)
                } else {
                    this.$refs.browser.setData(this.data)
                    this.$refs.browser.setTotal(this.data.length)
                }
            }
        }
    },

    computed: {
        selectedAwb () {
            return this.data.filter(e => (this.inSelection(e.id)))
        }
    },

    methods: {
        // method to filter awb
        filterAwb(data, q) {
            var pass = true
            // only worth noting is q, from, and to
            if (q.q) {
                q.q = q.q.toUpperCase()
                pass = pass && (
                    data.mawb.toUpperCase().indexOf(q.q) >= 0
                    || data.hawb.toUpperCase().indexOf(q.q) >= 0 
                    || data.nama_importir.toUpperCase().indexOf(q.q) >= 0
                    )
            }

            if (q.from) {
                pass = pass && (data.tgl_bc11 >= q.from)
            }

            if (q.to) {
                pass = pass && (data.tgl_bc11 <= q.to)
            }

            return pass
        },

        // clear selection
        clearSelection () {
            this.selected = []
        },

        // select all
        selectAll () {
            this.selected = []
            this.data.forEach(e => {
                this.selected.push(e.id)
            });
        },

        // when selection change
        onSelectionChange (e, item) {
            if (e) {
                this.selected.push(item.id)
            } else {
                this.selected.splice(this.selected.indexOf(item.id), 1)
            }
        },

        // when row clicked
        onRowClicked (item) {
            console.log('select-row', item)
            
            // if selected, remove
            if (this.inSelection(item.id)) {
                var idx = this.selected.indexOf(item.id)
                this.selected.splice(idx, 1)
            } else {
                // add to selected
                this.selected.push(item.id)
            }
        },

        // select bcp range
        selectBCPRange () {
            // both must be complete!
            if (this.bcp_start.length != 14 || this.bcp_end.length != 14) {
                this.showToast(`Error`, `Nomer range BCP tidak komplit`, 'danger')
                return
            }

            // filter based on bcp
            var filtered = this.data.filter(e => e.bcp.data.nomor_lengkap >= this.bcp_start && e.bcp.data.nomor_lengkap <= this.bcp_end)

            // push em to selection
            // this.clearSelection()

            filtered.forEach(e => this.selected.push(e.id))
        },

        // when data is requested, or filter change
        onDataRequest({q, spinner, vm}) {
            console.log('request-data', q)
            
            // call load data internally if no data present
            if (!this.data.length) {
                this.loadData(vm)
            } else {
                // might wann do manual query?
                console.log("Gotta filter manually using: ", q)

                var filtered = (this.showSelectedOnly ? this.selectedAwb : this.data).filter(e => this.filterAwb(e, q))
                // if only show selected?
                console.log('filtered length: ', filtered.length)

                // set it
                vm.setData(filtered)
                vm.setTotal(filtered.length)
            }
        },

        // rowClass function
        rowClass(item) {
            if (this.inSelection(item.id)) {
                return ["b-table-row-selected", "table-primary", "cursor-pointer"]
            } else {
                return ["cursor-pointer"]
            }
        },

        // is awb id in selection
        inSelection(id) {
            return this.selected.indexOf(id) >= 0
        },

        
    }
}