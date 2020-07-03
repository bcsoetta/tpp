<template>
  <b-navbar toggleable="lg" type="dark" id="navbar" class="rounded rounded-sm shadow bg-navbar">
    <!-- <b-container fluid> -->
      <b-button variant="light" @click="toggle" class="my-2 my-md-0 mr-md-4 border shadow">
          <font-awesome-icon icon="bars"/>
      </b-button>
      
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>

        <b-navbar-nav class="ml-auto">
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
    }
  },

  computed: {
    ...mapGetters(["sidebar"])
  }
};
</script>