import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

export default new VueI18n({
	locale: '<?= Session.getActiveUserLocale() ?>',
	fallbackLocale: 'en',
	messages: {
		en: {
			steps: {
				folderSelection: 'Source folder selection',
				sharedDriveSelection: 'Destination Shared drive selection',
				configuration: 'Configuration',
				confirmation: 'Confirmation',
				progress: 'In progress',
				done: 'Done'
			},
			dialogs: {
				nonEmpty: {
					title: 'Not empty',
					content: 'The selected Shared drive is not empty. Do you want to proceed anyway?',
					confirm: 'Yes',
					cancel: 'No'
				},
				error: {
					title: 'Error',
					content: 'An unknown error occured. Please check the source folder and the destination Shared Drive and try again.',
					optionalErrorMessage: 'Error message: '
				}
			},
			continueButton: 'Continue',
			moveButton: 'Move',
			configuration: {
				description: 'When moving files of which you are not the owner, instead of moving the file a copy is created in the destination Shared drive. For such a case, there are several options that can be configured:',
				copy: {
					title: 'Copy comments',
					description: 'Copy comments from the original files. The comments will be created as if you made them, with the original commenter tagged. Note that may slow the moving significantly.'
				}
			},
			confirmation: {
				description: 'Are you sure you want to move the contents of the "{folderName}" folder into the "{sharedDriveName}" Shared drive?'
			},
			done: {
				description: 'Successfully moved. You can delete the original files from your Google Drive - some of them may have been left behind as they cannot be removed automatically.'
			},
			folderSelector: {
				myDrive: 'My Drive'
			}
		}
	}
});
