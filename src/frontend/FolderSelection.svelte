<List singleSelection>
  <Subheader>
    <a on:click={rootNavigation}>
      {$_("drive.driveList")}
    </a>
    {#each path as segment (segment.id)}
      &nbsp; &gt; &nbsp;
      <a on:click={() => breadcrumbNavigation(segment)}>
        {segment.name}
      </a>
    {/each}
  </Subheader>
  <Separator/>
  {#if items === null}
    <LinearProgress indeterminate/>
  {:else}
    {#each items as item (item.id)}
      <Item on:dblclick={() => itemNavigation(item)} on:SMUI:action={() => selected = item.id} selected={selected === item.id}>
        <Text>
          {item.name}
        </Text>
      </Item>
    {/each}
  {/if}
</List>

<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {_} from "svelte-i18n";
  import LinearProgress from "@smui/linear-progress";
  import List, {Item, Separator, Subheader, Text} from "@smui/list";

  export let path: Array<NamedRecord> = [];
  export let selected: NamedRecord|null = null;

  const dispatch = createEventDispatcher();

  let items = null;

  function rootNavigation(): void {
    path = [];
    getItems();
  }

  function breadcrumbNavigation(segment: NamedRecord): void {
    path = path.slice(0, path.findIndex((item) => item.id === segment.id) + 1);
    getItems();
  }

  function itemNavigation(item: NamedRecord): void {
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
      message: reponse.message,
    })
  }

  function getItems(): void {
    selected = null;
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
  @import "./_smui-theme.scss";

  a {
    cursor: pointer;
    color: $mdc-theme-primary;
  }
</style>
