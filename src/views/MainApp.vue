<template>
  <!-- Wrapper -->
  <div class="wrapper">
    <!-- Sidebar Navigation -->
    <side-nav :options="menuOption">
      <template #header>
        <h3>
          <img src="@/assets/banner_icon.png" height="32px" style="color: white;"/>
          TePePe
        </h3>
        <h6>versi {{ $store.getters.version }}</h6>
      </template>
    </side-nav>
    <!-- The content section houses page contents -->
    <div id="content" :class="[{ active: $store.getters.sidebar }]">
      <vuescroll :ops="scrollOptions">
        <div class="py-3">
          <!-- Real container -->
          <b-container fluid id="contents-section">
            <!-- Navbar -->
            <navbar />
            <!-- Breadcrumb -->
            <breadcrumb class="my-2" />
            <!-- <span class="h4" v-if="$route.meta.title">{{ this.$route.meta.title }}</span>
            <hr />-->
            <h4 v-if="$route.meta.title" class="p-1" style="text-shadow: 1px 2px 12px rgba(125, 125, 225, 0.5); ">{{ this.$route.meta.title }}</h4>
            <hr />

            <!-- Per route view -->
            <router-view></router-view>
            <div>
              <hr />&copy;
              <a href="mailto:duktek.soetta@customs.go.id">Duktek Soetta</a> 2020
            </div>
          </b-container>

        </div>
      </vuescroll>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import Breadcrumb from "@/components/Breadcrumb";

import vuescroll from "vuescroll";

import userChecker from "../mixins/userChecker";
import appMethod from "../mixins/appMethod";
import menuGenerator from "../mixins/menuGenerator";

import menuInput from "@/assets/menu.json";

export default {
  mixins: [userChecker, appMethod, menuGenerator],

  methods: {
    checkRole(roles) {
      var result = this.$store.getters.hasRole(roles);
      // console.log("Checking roles: ", roles, "result: ", result)
      // console.log("Checking against: ", this.$store.getters.roles)
      console.log(
        "Checking roles [ ",
        roles,
        "] <-> ",
        this.$store.getters.roles,
        " : ",
        result
      );
      return result;
    }
  },

  computed: {
    menuOption() {
      var result = [];
      menuInput.forEach(e => {
        this.processElement(result, e);
      });
      return result;
    },

    scrollOptions() {
      return {
        bar: {
          background: "#aaa"
        },
        scrollPanel: {
          scrollingX: false
        }
      };
    }
  },

  components: {
    Navbar,
    SideNav,
    Breadcrumb,
    vuescroll
  }
};
</script>
