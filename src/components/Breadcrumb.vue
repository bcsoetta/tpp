<template>
  <b-breadcrumb class="border rounded bg-light shadow">
    <b-breadcrumb-item
      v-for="(bc, id) in this.validBreadCrumbs"
      :key="id"
      :to="bc.path"
      :disabled="bc.disabled"
      :active="bc.disabled"
    >{{ bc.title }}</b-breadcrumb-item>
  </b-breadcrumb>
</template>

<script>
import appMethod from "../mixins/appMethod";

export default {
  mixins: [appMethod]
};
</script>