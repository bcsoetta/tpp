// this mixin provides user checking capabilities
import store from '../store'

export default {
    computed: {
        canEdit: () => {
            return store.getters.canEdit
        }
    },
    methods: {
        canDelete: (isDocLocked) => {
            return store.getters.canEdit || !isDocLocked
        },

        hasRole: (roles) => {
            return store.getters.hasRole(roles)
            /* if (!Array.isArray(roles)) {
                console.log("Convertin roles criteria to array: ", roles)
                if (typeof roles === 'undefined' || roles === null) {
                    roles = []
                } else {
                    roles = [roles]
                }
                
            }
                

            // if has no role, bail
            if (store.getters.roles === false) 
                return false

            console.log('checking roles ', store.getters.roles)
            console.log('criteria : ', roles)

            // special check for empty array
            if (roles.length < 1) {
                if (store.getters.roles === [] || store.getters.roles.length) {
                    console.log("Special case! passed!")
                    return true
                }
            }

            // just simply check em
            var result = store.getters.roles.filter(e => roles.indexOf(e) !== -1)
            console.log('result: ', result)

            return result.length > 0 */
        }
    }
}