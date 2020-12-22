<template>
  <div>
    <p>
      {{ $t("done.description") }}
    </p>
    <div v-if="errors.length > 0">
      <p class="md-body-2">
        <md-icon class="md-accent">error</md-icon>
        <i18n path="done.errorHeader.text">
          <template #link>
            <a
              href="https://github.com/skaut/shared-drive-mover/issues"
              target="_blank"
              >{{ $t("done.errorHeader.github") }}</a
            >
          </template>
        </i18n>
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
