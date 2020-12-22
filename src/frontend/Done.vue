<template>
  <div>
    <p>
      {{ $t("done.description") }}
    </p>
    <div v-if="errors.length > 0">
      <p>
        {{ $t("done.errorHeader") }}
      </p>
      <md-table>
        <md-table-row>
          <md-table-head> {{ $t("done.file") }} </md-table-head>
          <md-table-head> {{ $t("done.message") }} </md-table-head>
        </md-table-row>
        <md-table-row v-for="error in errors" :key="error.file">
          <md-table-cell> {{ error.file.join("/") }} </md-table-cell>
          <md-table-cell> {{ error.error }} </md-table-cell>
        </md-table-row>
      </md-table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    errors: {
      type: Array,
      default: (): Array<string> => [],
    },
  },
});
</script>

<style scoped>
div {
  margin-top: 20px;
}
</style>
