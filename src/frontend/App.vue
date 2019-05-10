<template>
	<md-app
		md-waterfall
		md-mode="fixed"
	>
		<md-app-toolbar class="md-primary">
			<span class="md-title">Shared Drive mover</span>
		</md-app-toolbar>
		<md-app-content>
			<md-steppers
				md-linear
				:md-active-step.sync="activeStep"
			>
				<md-step
					id="folder-selection"
					md-label="Source folder selection"
				>
					<FolderSelector
						:items="folders"
						:path="currentPath"
						:selected="folder"
						@select-folder="folder = $event"
						@navigate-breadcrumb="navigateBreadcrumb"
						@navigate-folder="navigateFolder"
						@next-step="activeStep = 'shared-drive-selection'"
					/>
				</md-step>
				<md-step
					id="shared-drive-selection"
					md-label="Destination Shared drive selection"
				>
					<SharedDriveSelector
						:items="sharedDrives"
						:selected="sharedDrive"
						@select-shareddrive="sharedDrive = $event"
						@next-step="activeStep = 'configuration'"
					/>
				</md-step>
				<md-step
					id="configuration"
					md-label="Configuration"
				>
					<Configuration
						:copyComments="copyComments"
						:deleteOriginals="deleteOriginals"
						@changeCopyComments="copyComments = !copyComments"
						@changeDeleteOriginals="deleteOriginals = !deleteOriginals"
						@next-step="activeStep = 'confirmation'"
					/>
				</md-step>
				<md-step
					id="confirmation"
					md-label="Confirmation"
				>
					<Confirmation
						:folders="folders"
						:folder="folder"
						:sharedDrives="sharedDrives"
						:sharedDrive="sharedDrive"
						@next-step="start"
					/>
				</md-step>
				<md-step
					id="progress"
					md-label="In progress"
				>
					<InProgress />
				</md-step>
				<md-step
					id="done"
					md-label="Done"
				>
					<Done />
				</md-step>
			</md-steppers>
			<md-dialog-confirm
				:md-active.sync="displayNonEmptyDialog"
				md-title="Not empty"
				md-content="The selected Shared drive is not empty. Do you want to proceed anyway?"
				md-confirm-text="Yes"
				md-cancel-text="No"
				@md-confirm="startNonEmpty"
				@md-cancel="activeStep = 'shared-drive-selection'"
			/>
		</md-app-content>
	</md-app>
</template>

<script lang="ts">
import Vue from 'vue';

import Configuration from './Configuration.vue';
import Confirmation from './Confirmation.vue';
import Done from './Done.vue';
import FolderSelector from './FolderSelector.vue';
import InProgress from './InProgress.vue';
import SharedDriveSelector from './SharedDriveSelector.vue';

export default Vue.extend({
	components: {
		Configuration,
		Confirmation,
		Done,
		FolderSelector,
		InProgress,
		SharedDriveSelector
	},
	data()
	{
		return {
			activeStep: "folder-selection",
			folders: [] as Array<Folder>,
			currentPath: [] as Array<Folder>,
			folder: '',
			sharedDrives: [] as Array<Folder>,
			sharedDrive: '',
			copyComments: false,
			deleteOriginals: true, // TODO: Change
			displayNonEmptyDialog: false
		};
	},
	created()
	{
		this.getFolders();
		this.getSharedDrives();
	},
	methods: {
		setFolders(folders: Folders)
		{
			this.currentPath = folders.path;
			this.folders = folders.folders;
		},
		navigateBreadcrumb(folderId: string)
		{
			if(folderId === undefined)
			{
				this.currentPath = [];
			}
			else
			{
				this.currentPath = this.currentPath.slice( 0, this.currentPath.findIndex(segment => segment.id === folderId) + 1 );
			}
			this.folders = [];
			this.folder = '';
			this.getFolders();
		},
		navigateFolder(folder: string)
		{
			this.currentPath.push({id: folder, name: ''});
			this.folders = [];
			this.folder = '';
			this.getFolders();
		},
		getFolders()
		{
			google.script.run.withSuccessHandler(this.setFolders).getFolders(this.currentPath);
		},
		setSharedDrives(sharedDrives: Array<Folder>)
		{
			this.sharedDrives = sharedDrives;
		},
		getSharedDrives()
		{
			google.script.run.withSuccessHandler(this.setSharedDrives).getSharedDrives();
		},
		start()
		{
			this.activeStep = 'progress';
			google.script.run.withSuccessHandler(this.handleResponse).start(this.folder, this.sharedDrive, this.copyComments, this.deleteOriginals, false);
		},
		startNonEmpty()
		{
			google.script.run.withSuccessHandler(this.handleResponse).start(this.folder, this.sharedDrive, this.copyComments, this.deleteOriginals, true);
		},
		handleResponse(response: MoveResponse)
		{
			if(response.status === 'error')
			{
				if(response.reason === 'notEmpty')
				{
					this.displayNonEmptyDialog = true;
				}
			}
			else
			{
				this.activeStep = 'done';
			}
		}
	}
});
</script>
