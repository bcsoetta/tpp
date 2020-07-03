<template>
  <li>
    <router-link v-if="to" :to="to" tag="a" active-class="active-route">
      <!-- <span v-if="icon" v-html="icon"></span> -->
      <c-icon :icon="icon" v-if="icon"/>
      {{ text }}
      <!-- spawn dynamic components here -->
    </router-link>
    <a v-else :class="{ 'dropdown-toggle': children }" @click="handleClick">
      <!-- <span v-if="icon" v-html="icon"></span> -->
      <c-icon :icon="icon" v-if="icon"/>
      {{ text }}
    </a>
    <template v-if="children">
      <b-collapse v-model="showChildren">
        <SideNavItemList :option="children"></SideNavItemList>
      </b-collapse>
    </template>
  </li>
</template>

<script>
import SideNavItemList from "@/components/SideNavItemList"
import CIcon from '@/components/CIcon'

export default {
  name: 'SideNavItem',
  components: {
    SideNavItemList,
    CIcon
  },
  props: {
    children: {
      type: Array,
      default: null
    },
    text: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: null
    },
    to: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      id: null,
      showChildren: false
    };
  },

  methods: {
    handleClick() {
      this.showChildren = !this.showChildren;
    //   alert("CLIIICK" + String(this.show));
    }
  },

  mounted() {
    this.id = this._uid;
  },

  beforeCreate: function () {
      this.$options.components.SideNavItemList = require('./SideNavItemList.vue').default
  }
};
</script>