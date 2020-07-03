import Vue from 'vue'

Vue.directive('focus', {
    /* bind: function (el, binding, vnode) {
        if (binding.value) {
            el.focus()
        }
    } */
    inserted: function (el) {
        el.focus()
        console.log("DIRECTIVE FOCUS RUN")
    }
})