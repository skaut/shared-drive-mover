<template>
	<div>
		{{ $t('configuration.description') }}
		<br>
		<md-checkbox
			:value="!copyComments"
			@change="$emit('changeCopyComments')"
		>
			{{ $t('configuration.copy.title') }}
			<br>
			{{ $t('configuration.copy.description') }}
		</md-checkbox>
		<br>
		<md-button
			class="md-raised md-primary"
			@click="$emit('next-step')"
		>
			{{ $t('continueButton') }}
		</md-button>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	props: {
		copyComments: {
			type: Boolean,
			default: false
		}
	}
});
</script>
