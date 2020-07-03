<template>
  <div id="sidebar" :class="[{ 'active' : sidebar }, 'shadow', 'bg-menu']">
    <!-- PERFECT SCROLL -->
    <vuescroll :ops="opts">
      <div id="sidebar-header" class="p-3 text-center">
        <slot name="header">
          <!-- SIDEBAR HEADER CONTENT GOES HERE -->
        </slot>
      </div>

      <!-- MENU CONTENT GOES HERE -->
      <slot>
        <component
          v-for="(opt, id) in options"
          :is="opt.type"
          v-bind="opt.data"
          :key="id || opt.id"
        ></component>
      </slot>
    </vuescroll>
  </div>
</template>

<script>
import vuescroll from "vuescroll";
import { mapGetters } from "vuex";

import SideNavSection from "@/components/SideNavSection";
import SideNavItemList from "@/components/SideNavItemList";
import SideNavItem from "@/components/SideNavItem";

export default {
  components: {
    vuescroll,
    SideNavSection,
    SideNavItemList,
    SideNavItem
  },
  props: {
    options: {
      type: Array,
      default: null
    }
  },

  data() {
    return {
      opts: {
        bar: {
          background: "#c2c2c2"
        }
      }
    };
  },

  computed: {
    ...mapGetters(["sidebar"])
  }
};
</script>