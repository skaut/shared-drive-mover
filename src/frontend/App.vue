<template>
  <md-app md-waterfall md-mode="fixed">
    <md-app-toolbar class="md-primary">
      <span class="md-title">Shared Drive mover</span>
    </md-app-toolbar>
    <md-app-content>
      <md-steppers md-linear v-bind:md-active-step.sync="activeStep">
        <md-step id="folder-selection" md-label="Source folder selection">
          <FolderSelector v-bind:items="folders" v-bind:path="currentPath" v-bind:selected="folder" v-on:select-folder="folder = $event" v-on:navigate-breadcrumb="navigateBreadcrumb" v-on:navigate-folder="navigateFolder" v-on:next-step="activeStep = 'shared-drive-selection'"></FolderSelector>
        </md-step>
        <md-step id="shared-drive-selection" md-label="Destination Shared drive selection">
          <SharedDriveSelector v-bind:items="sharedDrives" v-bind:selected="sharedDrive" v-on:select-shareddrive="sharedDrive = $event" v-on:next-step="activeStep = 'configuration'"></SharedDriveSelector>
        </md-step>
        <md-step id="configuration" md-label="Configuration">
          <Configuration v-bind:copyComments="copyComments" v-on:changeCopyComments="copyComments = !copyComments" v-bind:deleteOriginals="deleteOriginals" v-on:changeDeleteOriginals="deleteOriginals = !deleteOriginals" v-on:next-step="activeStep = 'confirmation'"></Configuration>
        </md-step>
        <md-step id="confirmation" md-label="Confirmation">
          <Confirmation v-bind:folders="folders" v-bind:folder="folder" v-bind:sharedDrives="sharedDrives" v-bind:sharedDrive="sharedDrive" v-on:next-step="start"></Confirmation>
        </md-step>
        <md-step id="progress" md-label="In progress">
          <InProgress></InProgress>
        </md-step>
        <md-step id="done" md-label="Done">
          <Done></Done>
        </md-step>
      </md-steppers>
      <md-dialog-confirm v-bind:md-active.sync="displayNonEmptyDialog" md-title="Not empty" md-content="The selected Shared drive is not empty. Do you want to proceed anyway?" md-confirm-text="Yes" md-cancel-text="No" v-on:md-confirm="startNonEmpty" v-on:md-cancel="activeStep = 'shared-drive-selection'"></md-dialog-confirm>
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
  },
  created()
  {
    this.getFolders();
    this.getSharedDrives();
  }
});
</script>
