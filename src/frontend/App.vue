<template>
  <md-app md-waterfall md-mode="fixed">
    <md-app-toolbar class="md-primary">
      <span class="md-title">Shared Drive mover</span>
    </md-app-toolbar>
    <md-app-content>
      <md-steppers md-linear :md-active-step.sync="activeStep">
        <md-step id="configuration" :md-label="$t('steps.configuration')">
          <Configuration
            :copy-comments="copyComments"
            @change-copy-comments="copyComments = !copyComments"
            @changeDeleteOriginals="deleteOriginals = !deleteOriginals"
            @next-step="activeStep = 'folder-selection'"
          />
        </md-step>
        <md-step id="folder-selection" :md-label="$t('steps.folderSelection')">
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
            @next-step="activeStep = 'confirmation'"
          />
        </md-step>
        <md-step id="confirmation" :md-label="$t('steps.confirmation')">
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
        <md-step id="progress" :md-label="$t('steps.progress')">
          <InProgress />
        </md-step>
        <md-step id="done" :md-label="$t('steps.done')">
          <Done :errors="errors" />
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
import Vue from "vue";

import Configuration from "./Configuration.vue";
import Confirmation from "./Confirmation.vue";
import Done from "./Done.vue";
import FolderSelector from "./FolderSelector.vue";
import InProgress from "./InProgress.vue";
import SharedDriveSelector from "./SharedDriveSelector.vue";

export default Vue.extend({
  components: {
    Configuration,
    Confirmation,
    Done,
    FolderSelector,
    InProgress,
    SharedDriveSelector,
  },
  data() {
    return {
      activeStep: "configuration",
      folders: [] as Array<NamedRecord>,
      folderPath: [] as Array<NamedRecord>,
      folder: "",
      sharedDrives: [] as Array<NamedRecord>,
      sharedDrivePath: [] as Array<NamedRecord>,
      sharedDrive: "",
      copyComments: true,
      displayNonEmptyDialog: false,
      displayErrorDialog: false,
      optionalErrorMessage: "",
      errors: [] as Array<MoveError>,
    };
  },
  created() {
    this.getFolders();
    this.getSharedDrives();
  },
  methods: {
    setFolders(folders: Array<NamedRecord>): void {
      this.folders = folders;
    },
    navigateFolderBreadcrumb(folderId: string): void {
      if (folderId === undefined) {
        this.folderPath = [];
      } else {
        this.folderPath = this.folderPath.slice(
          0,
          this.folderPath.findIndex((segment) => segment.id === folderId) + 1
        );
      }
      this.folders = [];
      this.folder = "";
      this.getFolders();
    },
    navigateFolder(folder: string): void {
      this.folderPath.push({
        id: folder,
        name: this.folders.find((item) => item.id === folder)!.name,
      });
      this.folders = [];
      this.folder = "";
      this.getFolders();
    },
    getFolders(): void {
      let parentID = "root";
      if (this.folderPath.length > 0) {
        parentID = this.folderPath[this.folderPath.length - 1].id;
      }
      google.script.run
        .withSuccessHandler((folders: Array<NamedRecord>) =>
          this.setFolders(folders)
        )
        .withFailureHandler((response: Error) => this.handleError(response))
        .listFolders(parentID);
    },
    setSharedDrives(sharedDrives: Array<NamedRecord>): void {
      this.sharedDrives = sharedDrives;
    },
    navigateSharedDriveBreadcrumb(sharedDriveId: string): void {
      if (sharedDriveId === undefined) {
        this.sharedDrivePath = [];
      } else {
        this.sharedDrivePath = this.sharedDrivePath.slice(
          0,
          this.sharedDrivePath.findIndex(
            (segment) => segment.id === sharedDriveId
          ) + 1
        );
      }
      this.sharedDrives = [];
      this.sharedDrive = "";
      this.getSharedDrives();
    },
    navigateSharedDrive(sharedDrive: string): void {
      this.sharedDrivePath.push({
        id: sharedDrive,
        name: this.sharedDrives.find((item) => item.id === sharedDrive)!.name,
      });
      this.sharedDrives = [];
      this.sharedDrive = "";
      this.getSharedDrives();
    },
    getSharedDrives(): void {
      if (this.sharedDrivePath.length === 0) {
        google.script.run
          .withSuccessHandler((sharedDrives: Array<NamedRecord>) =>
            this.setSharedDrives(sharedDrives)
          )
          .withFailureHandler((response: Error) => this.handleError(response))
          .listSharedDrives();
      } else {
        google.script.run
          .withSuccessHandler((sharedDrives: Array<NamedRecord>) =>
            this.setSharedDrives(sharedDrives)
          )
          .withFailureHandler((response: Error) => this.handleError(response))
          .listFolders(
            this.sharedDrivePath[this.sharedDrivePath.length - 1].id
          );
      }
    },
    move(): void {
      this.activeStep = "progress";
      google.script.run
        .withSuccessHandler((response: MoveResponse) =>
          this.handleResponse(response)
        )
        .withFailureHandler((response: Error) => this.handleError(response))
        .move(this.folder, this.sharedDrive, this.copyComments, false, false);
    },
    moveNonEmpty(): void {
      google.script.run
        .withSuccessHandler((response: MoveResponse) =>
          this.handleResponse(response)
        )
        .withFailureHandler((response: Error) => this.handleError(response))
        .move(this.folder, this.sharedDrive, this.copyComments, false, true);
    },
    handleResponse(response: MoveResponse): void {
      if (response.status === "error") {
        if (response.reason === "notEmpty") {
          this.displayNonEmptyDialog = true;
        }
      } else {
        this.errors = response.errors!;
        this.activeStep = "done";
      }
    },
    handleError(response: Error): void {
      this.optionalErrorMessage = "";
      if (response.message) {
        this.optionalErrorMessage =
          "<br><br>" +
          (this.$t("dialogs.error.optionalErrorMessage") as string) +
          response.message;
      }
      this.activeStep = "folder-selection";
      this.displayErrorDialog = true;
    },
  },
});
</script>
