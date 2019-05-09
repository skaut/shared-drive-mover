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
      required: true
    },
    folder: {
      required: true
    },
    sharedDrives: {
      required: true
    },
    sharedDrive: {
      required: true
    }
  },
  computed: {
    folderName: function()
    {
      if(!this.folder)
      {
        return '';
      }
      var folderId = this.folder;
      return this.folders.find(function(i)
      {
        return i.id === folderId;
      }).name;
    },
    sharedDriveName: function()
    {
      if(!this.sharedDrive)
      {
        return '';
      }
      var sharedDriveId = this.sharedDrive;
      return this.sharedDrives.find(function(i)
      {
        return i.id === sharedDriveId;
      }).name;
    }
  }
});
</script>
