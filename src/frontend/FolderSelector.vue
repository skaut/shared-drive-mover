<template>
	<div>
		<div
			v-if="items === null"
			class="spinner-center"
		>
			<md-progress-spinner md-mode="indeterminate" />
		</div>
		<md-list v-else>
			<md-subheader>
				<a
					@click.prevent="$emit('navigate-breadcrumb')"
				>
					{{ $t('folderSelector.myDrive') }}
				</a>
				<Breadcrumb
					v-for="segment in path"
					:key="segment.id"
					:segment="segment"
					@click="$emit('navigate-breadcrumb', $event)"
				/>
			</md-subheader>
			<SelectorRow
				v-for="item in items"
				:key="item.id"
				:item="item"
				:selected="item.id === selected"
				@click="$emit('select-folder', $event)"
				@dblclick="$emit('navigate-folder', $event)"
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

import Breadcrumb from './Breadcrumb.vue';
import SelectorRow from './SelectorRow.vue';

export default Vue.extend({
	components: {
		Breadcrumb,
		SelectorRow
	},
	props: {
		selected: {
			type: String,
			default: ''
		},
		path: {
			type: Array,
			default: () => []
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

a
{
	cursor: pointer;
}
</style>
