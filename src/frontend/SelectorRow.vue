<template>
	<md-list-item
		:class="{'router-link-exact-active': selected}"
		@click="$emit('click', item.id)"
		@dblclick="$emit('dblclick', item.id)"
	>
		<md-icon>folder</md-icon>
		<span class="md-list-item-text">{{ item.name }}</span>
	</md-list-item>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	props: {
		selected: {
			type: Boolean,
			default: false
		},
		item: {
			type: Object,
			required: true
		}
	}
});
</script>
