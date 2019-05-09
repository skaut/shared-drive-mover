<template>
  <div>
    <div class="spinner-center" v-if="items === null">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>
    <md-list v-else>
      <selector-row v-for="item in items" v-bind:item="item" v-bind:selected="item.id === selected" v-bind:key="item.id" v-on:click="$emit('select-shareddrive', $event)"></selector-row>
    </md-list>
    <md-button class="md-raised md-primary" v-on:click="$emit('next-step')" v-bind:disabled="!selected">Continue</md-button>
  </div>'
</template>

<script>
export default Vue.extend({
  props: {
    selected: {
      type: String,
      required: false
    },
    items: {
      validator: prop => typeof prop === 'object' || prop === null,
      required: true
    }
  }
});
</script>

<style scoped>
.spinner-center
{
  display: table;
  margin: 100px auto;
}
</style>
