// disable console.log?
var _consoleLog = window.console.log
if (process.env.DISABLE_CONSOLE) {
   window.console.log = function () {}
}
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
   faCalendarAlt, faLock, faLockOpen, faUserCircle,
   faUser, faUserAlt, faPowerOff, faEye, faEyeSlash, faUserPlus,
   faSave, faSearch, faPencilAlt, faPlusSquare, faMinusSquare,
   faTrashAlt, faPlaneDeparture, faMoneyCheckAlt, faWrench, faTimes,
   faStamp, faCashRegister, faPrint, faCloudDownloadAlt, faHandPaper,
   faMapMarkerAlt, faRadiation, faUserSecret, faSync, faCamera, faUpload,
   faFileAlt, faFileArchive, faTools, faBars, faShippingFast, faDatabase,
   faWarehouse, faSearchLocation, faFileExcel, faBoxes, faTasks, faDollyFlatbed,
   faHandshake,
   faClipboardCheck,
   faSpinner,
   faUndoAlt,
   faDoorOpen,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCalendarAlt, faLock, faLockOpen, faUserCircle, 
   faUser, faUserAlt, faPowerOff, faEye, faEyeSlash, faUserPlus, faSave,
   faSearch, faPencilAlt, faPlusSquare, faMinusSquare, faTrashAlt,
   faPlaneDeparture, faMoneyCheckAlt, faWrench, faTimes, faStamp, faCashRegister,
   faPrint, faCloudDownloadAlt, faHandPaper, faMapMarkerAlt, faRadiation, faUserSecret,
   faSync, faCamera, faUpload, faFileAlt, faFileArchive, faTools, faBars, faShippingFast,
   faDatabase, faWarehouse, faSearchLocation, faFileExcel, faBoxes, faTasks, faDollyFlatbed,
   faHandshake, faClipboardCheck, faSpinner, faUndoAlt, faDoorOpen)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Bootstrap
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// import './assets/css/style.css'
// vue-select
import 'vue-select/dist/vue-select.css'

// our custom style.css
import './assets/style.css'
import './assets/menu.css'

// our custom filters
import './filters'

// our custom directives
import './directives'

// mixins?
// import axiosErrorHandler from './mixins/axiosErrorHandler'

Vue.use(BootstrapVue)
// Vue.mixin(axiosErrorHandler)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
   el: '#app',
   router,
   store,
   components: { App },
   template: '<App/>'
})
