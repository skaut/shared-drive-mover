<template>
  <div>
    <div class="spinner-center" v-if="items === null">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>
    <md-list v-else>
      <md-subheader>
        <a v-on:click.prevent="$emit('navigate-breadcrumb')">My Drive</a>
        <breadcrumb v-for="segment in path" v-bind:key="segment.id" v-bind:segment="segment" v-on:click="$emit('navigate-breadcrumb', $event)"></breadcrumb>
      </md-subheader>
      <selector-row v-for="item in items" v-bind:item="item" v-bind:selected="item.id === selected" v-bind:key="item.id" v-on:click="$emit('select-folder', $event)" v-on:dblclick="$emit('navigate-folder', $event)"></selector-row>
    </md-list>
    <md-button class="md-raised md-primary" v-on:click="$emit('next-step')" v-bind:disabled="!selected">Continue</md-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    selected: {
      type: String,
      required: false
    },
    path: {
      type: Array,
      default: []
    },
    items: {
      validator: prop => typeof prop === 'object' || prop === null,
      required: true
    }
  },
  methods: {
    navigate: function(id)
    {
      google.script.run.withSuccessHandler(this.setFolders).getFolders();
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

a
{
  cursor: pointer;
}
</style>
