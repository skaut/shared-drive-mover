<template>
  <div>
    <p>
      {{ $t("configuration.introduction") }}
    </p>
    <p>
      {{ $t("configuration.description") }}
    </p>
    <md-checkbox :value="!copyComments" @change="$emit('change-copy-comments')">
      {{ $t("configuration.copy.title") }}
      <br />
      {{ $t("configuration.copy.description") }}
    </md-checkbox>
    <br />
    <br />
    <md-button class="md-raised md-primary" @click="$emit('next-step')">
      {{ $t("continueButton") }}
    </md-button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    copyComments: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style scoped>
div {
  margin-top: 20px;
}
</style>
