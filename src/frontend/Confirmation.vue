<template>
	<div>
		Are you sure you want to move the contents of the "{{folderName}}" folder into the "{{sharedDriveName}}" Shared drive?
		<br>
		<md-button class="md-raised md-primary" v-on:click="$emit('next-step')">Move</md-button>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	props: {
		folders: {
			type: Array,
			required: true
		},
		folder: {
			type: String,
			required: true
		},
		sharedDrives: {
			type: Array,
			required: true
		},
		sharedDrive: {
			type: String,
			required: true
		}
	},
	computed: {
		folderName()
		{
			if(!this.folder)
			{
				return '';
			}
			return (this.folders as Array<Folder>).find(i => i.id === this.folder)!.name;
		},
		sharedDriveName()
		{
			if(!this.sharedDrive)
			{
				return '';
			}
			return (this.sharedDrives as Array<Folder>).find(i => i.id === this.sharedDrive)!.name;
		}
	}
});
</script>
