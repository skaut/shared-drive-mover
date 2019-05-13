<template>
	<div>
		<div
			v-if="items === null"
			class="spinner-center"
		>
			<md-progress-spinner md-mode="indeterminate" />
		</div>
		<md-list v-else>
			<SelectorRow
				v-for="item in items"
				:key="item.id"
				:item="item"
				:selected="item.id === selected"
				@click="$emit('select-shareddrive', $event)"
			/>
		</md-list>
		<md-button
			class="md-raised md-primary"
			:disabled="!selected"
			@click="$emit('next-step')"
		>
			{{ $t('continueButton') }}
		</md-button>
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
			default: ''
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
