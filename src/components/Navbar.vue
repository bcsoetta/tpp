<template>
  <b-navbar toggleable="lg" type="dark" id="navbar" class="rounded rounded-sm shadow bg-navbar">
    <!-- <b-container fluid> -->
      <b-button variant="light" @click="toggle" class="my-2 my-md-0 mr-md-4 border shadow">
          <font-awesome-icon icon="bars"/>
      </b-button>
      
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>

        <b-navbar-nav class="ml-auto">
          <!-- siap bmn -->
          <b-nav-item-dropdown>
            <template #button-content>
              <span v-b-tooltip.hover title="Total AWB Siap BMN">Siap BMN <b-badge>{{ total }}</b-badge></span>
            </template>
            <!-- utk BTD -->
            <b-dropdown-item variant="primary">
              BTD <b-badge variant="primary">{{ btd }}</b-badge>
            </b-dropdown-item>
            <!-- utk BDN -->
            <b-dropdown-item variant="danger">
              BDN <b-badge variant="danger">{{ bdn }}</b-badge>
            </b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
            <template v-slot:button-content>
              <span>
                <font-awesome-icon icon="user-circle"></font-awesome-icon>
                {{ userInfo.name }}
              </span>
            </template>
            <b-dropdown-item :href="profileUrl" target="blank">
              <font-awesome-icon icon="user"></font-awesome-icon>
              Profile
            </b-dropdown-item>
            <!-- <b-dropdown-item to="/resetpassword"><font-awesome-icon icon="lock"></font-awesome-icon> Reset Password</b-dropdown-item> -->
            
            <b-dropdown-item @click="logout">
              <font-awesome-icon icon="power-off"></font-awesome-icon>
              Sign Out
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    <!-- </b-container> -->
  </b-navbar>
</template>

<script>
import appMethod from "../mixins/appMethod";

import { mapMutations, mapGetters } from "vuex";

export default {
  mixins: [appMethod],

  methods: {
    ...mapMutations(["setSidebarActive"]),

    hasRole() {
      return true;
    },

    toggle () {
        this.setSidebarActive(!this.sidebar)
    },

    async refreshNotification() {
      // call api
      await this.api.awbSiapBMNCount()
      .then(e => {
        this.btd = e.data.BTD
        this.bdn = e.data.BDN
        this.total = e.data.total
      })
      // spawn another timer
      this.timer = setTimeout(() => {
        this.refreshNotification()
      }, 35000)
    }
  },

  computed: {
    ...mapGetters(["sidebar", "api"])
  },

  data () {
    return {
      btd: 0,
      bdn: 0,
      total: 0,

      timer: null
    }
  },

  mounted () {
    if (!this.timer) {
      this.refreshNotification()
    }
  }
};
</script>