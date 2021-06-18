<StepHeader {step}/>
<p>
  {$_("steps." + step + ".introduction")}
</p>
<List>
  <Divider/>
  <Subheader>
    <span class="primary-text breadcrumb" on:click={rootNavigation}>
      {$_("drive.driveList")}
    </span>
    {#each path as segment (segment.id)}
      &nbsp; &gt; &nbsp;
      <span class="primary-text breadcrumb" on:click={() => breadcrumbNavigation(segment)}>
        {segment.name}
      </span>
    {/each}
  </Subheader>
  <Divider/>
  {#if items === null}
    <ProgressLinear indeterminate/>
  {:else}
    <ListItemGroup value={selected !== null ? items.map((item) => item.id).indexOf(selected.id) : undefined}>
      {#each items as item (item.id)}
        <ListItem on:click={() => selected = item} on:dblclick={() => itemNavigation(item)}>
          {item.name}
        </ListItem>
      {/each}
    </ListItemGroup>
  {/if}
  <Divider/>
</List>

<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {_} from "svelte-i18n";
  import {Divider, List, ListItem, ListItemGroup, ProgressLinear, Subheader} from 'svelte-materialify/src';

  import StepHeader from "./StepHeader.svelte";

  export let step: string;
  export let path: Array<NamedRecord> = [];
  export let selected: NamedRecord|null = null;

  const dispatch = createEventDispatcher();

  let items: Array<NamedRecord>|null = null;

  function rootNavigation(): void {
    selected = null;
    path = [];
    getItems();
  }

  function breadcrumbNavigation(segment: NamedRecord): void {
    selected = null;
    path = path.slice(0, path.findIndex((item) => item.id === segment.id) + 1);
    getItems();
  }

  function itemNavigation(item: NamedRecord): void {
    selected = null;
    path = [...path, item];
    getItems();
  }

  function handleSharedDriveResponse(response: Array<NamedRecord>): void {
    items = [{id: "root", name: $_("drive.myDrive")}, ...response];
  }

  function handleFolderResponse(response:Array<NamedRecord>): void {
    items = response;
  }

  function handleError(response: Error): void {
    dispatch("error", {
      message: response.message,
    })
  }

  function getItems(): void {
    items = null;
    if(path.length === 0) {
      google.script.run
        .withSuccessHandler(handleSharedDriveResponse)
        .withFailureHandler(handleError)
        .listSharedDrives();
    } else {
      google.script.run
        .withSuccessHandler(handleFolderResponse)
        .withFailureHandler(handleError)
        .listFolders(path[path.length - 1].id);
    }
  }

  getItems();
</script>

<style lang="scss">
  .breadcrumb {
    cursor: pointer;
  }
</style>
