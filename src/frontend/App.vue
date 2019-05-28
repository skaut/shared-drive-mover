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
					:md-label="$t('steps.folderSelection')"
				>
					<FolderSelector
						:items="folders"
						:path="folderPath"
						:selected="folder"
						@select-folder="folder = $event"
						@navigate-breadcrumb="navigateFolderBreadcrumb"
						@navigate-folder="navigateFolder"
						@next-step="activeStep = 'shared-drive-selection'"
					/>
				</md-step>
				<md-step
					id="shared-drive-selection"
					:md-label="$t('steps.sharedDriveSelection')"
				>
					<SharedDriveSelector
						:items="sharedDrives"
						:path="sharedDrivePath"
						:selected="sharedDrive"
						@select-shareddrive="sharedDrive = $event"
						@navigate-breadcrumb="navigateSharedDriveBreadcrumb"
						@navigate-shareddrive="navigateSharedDrive"
						@next-step="activeStep = 'configuration'"
					/>
				</md-step>
				<md-step
					id="configuration"
					:md-label="$t('steps.configuration')"
				>
					<Configuration
						:copy-comments="copyComments"
						@changeCopyComments="copyComments = !copyComments"
						@changeDeleteOriginals="deleteOriginals = !deleteOriginals"
						@next-step="activeStep = 'confirmation'"
					/>
				</md-step>
				<md-step
					id="confirmation"
					:md-label="$t('steps.confirmation')"
				>
					<Confirmation
						:folders="folders"
						:folder-path="folderPath"
						:folder="folder"
						:shared-drives="sharedDrives"
						:shared-drive-path="sharedDrivePath"
						:shared-drive="sharedDrive"
						@next-step="move"
					/>
				</md-step>
				<md-step
					id="progress"
					:md-label="$t('steps.progress')"
				>
					<InProgress />
				</md-step>
				<md-step
					id="done"
					:md-label="$t('steps.done')"
				>
					<Done />
				</md-step>
			</md-steppers>
			<md-dialog-confirm
				:md-active.sync="displayNonEmptyDialog"
				:md-title="$t('dialogs.nonEmpty.title')"
				:md-content="$t('dialogs.nonEmpty.content')"
				:md-confirm-text="$t('dialogs.nonEmpty.confirm')"
				:md-cancel-text="$t('dialogs.nonEmpty.cancel')"
				@md-confirm="moveNonEmpty"
				@md-cancel="activeStep = 'shared-drive-selection'"
			/>
			<md-dialog-alert
				:md-active.sync="displayErrorDialog"
				:md-title="$t('dialogs.error.title')"
				:md-content="$t('dialogs.error.content') + optionalErrorMessage"
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
			folders: [] as Array<NamedRecord>,
			folderPath: [] as Array<NamedRecord>,
			folder: '',
			sharedDrives: [] as Array<NamedRecord>,
			sharedDrivePath: [] as Array<NamedRecord>,
			sharedDrive: '',
			copyComments: true,
			displayNonEmptyDialog: false,
			displayErrorDialog: false,
			optionalErrorMessage: ''
		};
	},
	created()
	{
		this.getFolders();
		this.getSharedDrives();
	},
	methods: {
		setFolders(folders: PathResponse)
		{
			this.folderPath = folders.path;
			this.folders = folders.children;
		},
		navigateFolderBreadcrumb(folderId: string)
		{
			if(folderId === undefined)
			{
				this.folderPath = [];
			}
			else
			{
				this.folderPath = this.folderPath.slice( 0, this.folderPath.findIndex(segment => segment.id === folderId) + 1 );
			}
			this.folders = [];
			this.folder = '';
			this.getFolders();
		},
		navigateFolder(folder: string)
		{
			this.folderPath.push({id: folder, name: ''});
			this.folders = [];
			this.folder = '';
			this.getFolders();
		},
		getFolders()
		{
			google.script.run.withSuccessHandler(this.setFolders).getFolders(this.folderPath);
		},
		setSharedDrives(sharedDrives: PathResponse)
		{
			this.sharedDrivePath = sharedDrives.path
			this.sharedDrives = sharedDrives.children;
		},
		navigateSharedDriveBreadcrumb(sharedDriveId: string)
		{
			if(sharedDriveId === undefined)
			{
				this.sharedDrivePath = [];
			}
			else
			{
				this.sharedDrivePath = this.sharedDrivePath.slice( 0, this.sharedDrivePath.findIndex(segment => segment.id === sharedDriveId) + 1 );
			}
			this.sharedDrives = [];
			this.sharedDrive = '';
			this.getSharedDrives();
		},
		navigateSharedDrive(sharedDrive: string)
		{
			this.sharedDrivePath.push({id: sharedDrive, name: ''});
			this.sharedDrives = [];
			this.sharedDrive = '';
			this.getSharedDrives();
		},
		getSharedDrives()
		{
			google.script.run.withSuccessHandler(this.setSharedDrives).getSharedDrives(this.sharedDrivePath);
		},
		move()
		{
			this.activeStep = 'progress';
			google.script.run.withSuccessHandler(this.handleResponse).withFailureHandler(this.handleError).move(this.folder, this.sharedDrive, this.copyComments, false);
		},
		moveNonEmpty()
		{
			google.script.run.withSuccessHandler(this.handleResponse).withFailureHandler(this.handleError).move(this.folder, this.sharedDrive, this.copyComments, true);
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
		},
		handleError(response: Error)
		{
			this.optionalErrorMessage = '';
			if(response.message)
			{
				this.optionalErrorMessage = '<br><br>' + this.$t('dialogs.error.optionalErrorMessage') + response.message;
			}
			this.activeStep = 'folder-selection'
			this.displayErrorDialog = true;
		}
	}
});
</script>
