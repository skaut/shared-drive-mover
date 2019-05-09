<template>
  <span> &nbsp; &gt; &nbsp; <a v-on:click.prevent="$emit('click', segment.id)">{{segment.name}}</a></span>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    segment: {
      type: Object,
      required: true
    }
  }
});
</script>

<style scoped>
a
{
  cursor: pointer;
}
</style>
