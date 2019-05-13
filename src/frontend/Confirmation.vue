<template>
	<div>
		{{ $t('confirmation.description', {folderName, sharedDriveName}) }}
		<br>
		<br>
		<md-button
			class="md-raised md-primary"
			@click="$emit('next-step')"
		>
			{{ $t('moveButton') }}
		</md-button>
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
		currentPath: {
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
			let ret = '';
			for(let segment of this.currentPath as Array<Folder>)
			{
				ret += segment.name + '/';
			}
			ret += (this.folders as Array<Folder>).find(i => i.id === this.folder)!.name;
			return ret;
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

<style scoped>
div {
	margin-top: 20px;
}
</style>
