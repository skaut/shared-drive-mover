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
					title: 'Shared drive not empty',
					content: 'The selected destination Shared drive is not empty. Do you want to proceed anyway?',
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
					description: 'Copy comments from the original files. The comments will be created as if you made them, with the original commenter tagged. Note that this may slow down the moving.'
				}
			},
			confirmation: {
				description: 'Are you sure you want to move the contents of the folder "{folderName}" into the Shared drive "{sharedDriveName}"?'
			},
			done: {
				description: 'Successfully moved. You can delete the original files from your Google Drive - some of them may have been left behind as they cannot be removed automatically.'
			},
			folderSelector: {
				myDrive: 'My Drive'
			},
			sharedDriveSelector: {
				sharedDriveList: 'Shared drive list'
			}
		},
		cs: {
			steps: {
				folderSelection: 'Výběr zdrojové složky',
				sharedDriveSelection: 'Výběr cílového Sdíleného disku',
				configuration: 'Nastavení',
				confirmation: 'Potvrzení',
				progress: 'Přesun',
				done: 'Hotovo'
			},
			dialogs: {
				nonEmpty: {
					title: 'Sdílený disk není prázdný',
					content: 'Vybraný cílový Sdílený disk není prázdný. Chcete přesto pokračovat?',
					confirm: 'Ano',
					cancel: 'Ne'
				},
				error: {
					title: 'Chyba',
					content: 'Nastala neznámá chyba. Prosím zkontrolujte zdrojovou složku a cílový Sdílený disk a zkuste to znovu.',
					optionalErrorMessage: 'Chybová hláška: '
				}
			},
			continueButton: 'Pokračovat',
			moveButton: 'Přesunout',
			configuration: {
				description: 'U souborů, jichž nejste vlastníkem, se místo jejich přesunutí vytvoří kopie v cílovém Sdíleném disku. V takovém případě lze nastavit několik možností:',
				copy: {
					title: 'Kopírovat komentáře',
					description: 'Zkopírovat komentáře z původních souborů. Komentáře budou vytvořeny pod vaším účtem a původní autor bude označen. Kopírování komentářů může přesun zpomalit.'
				}
			},
			confirmation: {
				description: 'Opravdu chcete přesunout obsah složky "{folderName}" do Sdíleného disku "{sharedDriveName}"?'
			},
			done: {
				description: 'Úspěšně přesunuto. Můžete smazat původní soubory ze svého Google Disku - některé soubory mohly být zanechány protože nemohly být smazány automaticky.'
			},
			folderSelector: {
				myDrive: 'Můj Disk'
			},
			sharedDriveSelector: {
				sharedDriveList: 'Seznam Sdílených disků'
			}
		}
	}
});
