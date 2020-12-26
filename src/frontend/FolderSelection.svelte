<p>
  {$_("steps.source-selection.introduction")}
</p>
{#if items === null}
  <LinearProgress indeterminate/>
{:else}
  <List singleSelection>
    {#each items as item (item.id)}
      <Item on:dblclick={() => itemNavigation(item)} on:SMUI:action={() => selected = item.id} selected={selected === item.id}>
        <Text>
          {item.name}
        </Text>
      </Item>
    {/each}
  </List>
{/if}

<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {_} from "svelte-i18n";
  import LinearProgress from "@smui/linear-progress";
  import List, {Item, Text} from "@smui/list";

  export let path: Array<NamedRecord>;

  const dispatch = createEventDispatcher();

  let items = null;
  let selected = null;

  function itemNavigation(item: NamedRecord): void {
    path.push(item);
    getItems();
  }

  function handleSharedDriveResponse(response: Array<NamedRecord>): void {
    items = response;
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
