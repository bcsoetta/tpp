<template>
  <b-table
    :fields="fields"
    small
    head-variant="dark"
    bordered
    hover
    striped
    class="shadow"
    v-on="$listeners"
    v-bind="$attrs"
  >
    <!-- index -->
    <template #cell(index)="row">{{ row.index + start }}</template>

    <template #cell(act)="row" v-if="hasRole('CONSOLE')">
      <div class="text-center">
        <!-- edit -->
        <b-button size="sm" variant="primary" @click="$emit('edit', row.item)" class="shadow">
          <font-awesome-icon icon="pencil-alt" />
        </b-button>

        <!-- delete button -->
        <b-button size="sm" variant="danger" @click="$emit('delete', row.item)" class="shadow">
          <font-awesome-icon icon="trash-alt" />
        </b-button>
      </div>
    </template>
  </b-table>
</template>

<script>
import { mapGetters } from "vuex";
import userChecker from "../mixins/userChecker";

export default {
  inheritAttrs: false,

  mixins: [userChecker],

  props: {
    start: {
      type: Number,
      default: 1
    }
  },

  computed: {
    fields() {
      return [
        {
          label: "#",
          key: "index"
        },
        "kode",
        "nama",
        "alamat",

        ...(this.hasRole("CONSOLE")
          ? [
              {
                label: "",
                key: "act"
              }
            ]
          : [])
      ];
    }
  }
};
</script>