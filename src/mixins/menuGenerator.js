export default {
    methods: {
        canProcess (input) {
            if ('role' in input) {
                // role check present
                return this.checkRole(input['role'])
            }
            // by default we can
            return true
        },

        processElement (arr, input) {
            if (!this.canProcess(input)) {
                return
            }
            // gotta check what type of input it is?
            if ('section' in input) {
                // process section
                this.processSection(arr, input)
            } else if ('list' in input) {
                // process list tag
                this.processList(arr, input)
            } else if ('item' in input) {
                // process item
                this.processItem(arr, input)
            }
        },

        processSection (arr, input) {
            console.log('processing section: ', input)
            // generate a SideNavSection
            arr.push({
                type: 'SideNavSection',
                data: {
                    text: input["section"]
                }
            })
        },
        
        processList (arr, input) {
            console.log('processing list: ', input)
            // generate a SideNavList
            var ret = {
                type: 'SideNavItemList',
                data: {
                    option: []
                }
            }
            
            // now we gotta process each child
            if (Array.isArray(input['list'])) {
                console.log('got valid item list input', input['list'])
                input['list'].forEach(e => {
                    this.processElement(ret.data.option, e)
                })
            }
            
            arr.push(ret)
        },
        
        processItem (arr, input) {
            console.log('processing item: ', input)
            // generate a SideNavItem
            var ret = {
                type: 'SideNavItem',
                data: {
                    text: input['item']
                }
            }

            // conditional processing
            if ('icon' in input) {
                ret.data.icon = input['icon']
            }

            if ('to' in input) {
                ret.data.to = input['to']
            }

            // if we have children
            if ('children' in input && Array.isArray(input['children'])) {
                // generate empty array
                ret.data.children = []

                // populate it
                input['children'].forEach(e => {
                    this.processElement(ret.data.children, e)
                })
            }

            arr.push(ret)
        },

        checkRole (roles) {
            console.log("dummy check roles :", roles)
            return true
        }
    }
}