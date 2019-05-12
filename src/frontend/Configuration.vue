<template>
	<div>
		When moving files of which you are not the owner, instead of moving the file a copy is created in the destination Shared drive. For such a case, there are several options that can be configured:
		<br>
		<md-checkbox
			:value="!copyComments"
			@change="$emit('changeCopyComments')"
		>
			Copy comments
			<br>
			Copy comments from the original files. The comments will be created as if you made them, with the original commenter tagged. Note that may slow the moving significantly.
		</md-checkbox>
		<br>
		<md-button
			class="md-raised md-primary"
			@click="$emit('next-step')"
		>
			Continue
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
