<template>
	<div>
		<div class="spinner-center" v-if="items === null">
			<md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
		</div>
		<md-list v-else>
			<SelectorRow v-for="item in items" v-bind:item="item" v-bind:selected="item.id === selected" v-bind:key="item.id" v-on:click="$emit('select-shareddrive', $event)"></SelectorRow>
		</md-list>
		<md-button class="md-raised md-primary" v-on:click="$emit('next-step')" v-bind:disabled="!selected">Continue</md-button>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';

import SelectorRow from './SelectorRow.vue';

export default Vue.extend({
	components: {
		SelectorRow
	},
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
