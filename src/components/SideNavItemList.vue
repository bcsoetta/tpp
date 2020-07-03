<template>
  <ul class="list-unstyled">
    <component v-for="(opt, id) in option" :key="opt.id || id" :is="opt.type" v-bind="opt.data"></component>
  </ul>
</template>

<script>

import SideNavItem from "@/components/SideNavItem"

export default {
  name: "SideNavItemList",
  components: {
    SideNavItem
  },
  props: {
    option: {
      type: Array,
      default: []
    }
  }
};
</script>