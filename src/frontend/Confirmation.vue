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
		folderPath: {
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
		sharedDrivePath: {
			type: Array,
			required: true
		},
		sharedDrive: {
			type: String,
			required: true
		}
	},
	computed: {
		folderName(): string
		{
			if(!this.folder)
			{
				return '';
			}
			let ret = '';
			for(const segment of this.folderPath as Array<NamedRecord>)
			{
				ret += segment.name + '/';
			}
			ret += (this.folders as Array<NamedRecord>).find(i => i.id === this.folder)!.name;
			return ret;
		},
		sharedDriveName(): string
		{
			if(!this.sharedDrive)
			{
				return '';
			}
			let ret = '';
			for(const segment of this.sharedDrivePath as Array<NamedRecord>)
			{
				ret += segment.name + '/';
			}
			ret += (this.sharedDrives as Array<NamedRecord>).find(i => i.id === this.sharedDrive)!.name;
			return ret;
		}
	}
});
</script>

<style scoped>
div {
	margin-top: 20px;
}
</style>
