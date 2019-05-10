<template>
	<div>
		When moving files of which you are not the owner, instead of moving the file a copy is created in the destination Shared drive. For such a case, there are several options that can be configured:
		<br>
		<md-checkbox v-bind:value="!copyComments" v-on:change="$emit('changeCopyComments')" disabled>
			Copy comments
			<br>
			Copy comments from the original files. The comments will be created as if you made them, with the original commenter tagged. Note that may slow the moving significantly.
		</md-checkbox>
		<br>
		<md-checkbox v-bind:value="!deleteOriginals" v-on:change="$emit('changeDeleteOriginals')" disabled>
			Delete originals
			<br>
			Delete the original files after they have been copied.
		</md-checkbox>
		<br>
		<md-button class="md-raised md-primary" v-on:click="$emit('next-step')">Continue</md-button>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	props: {
		copyComments: {
			type: Boolean,
			default: false
		},
		deleteOriginals: {
			type: Boolean,
			default: true
		}
	}
});
</script>
