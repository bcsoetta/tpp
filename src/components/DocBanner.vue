<template>
  <div id="doc-banner" :class="[ data.is_locked ? 'bg-danger' : 'bg-primary', 'text-light', 'p-2', 'shadow', 'border', 'border-dark', 'rounded', 'd-inline-block']">
    <template v-if="!isNew">
      <span>
        {{ doctype }} #{{ data.id }}
        <b-badge variant="light">
          <font-awesome-icon :icon="data.is_locked ? 'lock' : 'lock-open'"></font-awesome-icon>
          {{ data.is_locked ? "LOCKED" : "OPEN" }}
        </b-badge>
      </span>
    </template>
    <template v-else>Input {{ doctype }} Baru</template>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,
    isNew: [Boolean, String, Number],
    doctype: String
  }
};
</script>

<style scoped>
#doc-banner {
    font-weight: 500;
    font-size: 1.5rem;
}
</style>