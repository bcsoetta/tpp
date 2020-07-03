import Vue from 'vue'

const formatCurrency = function (val, decLength = 2) {
    return Number(val).toFixed(decLength).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

const displayRupiah = function (val) {
    return "Rp. " + val
}

// Use it globally
Vue.filter('formatCurrency', formatCurrency)
Vue.filter('displayRupiah', displayRupiah)