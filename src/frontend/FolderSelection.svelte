<script lang="ts">
  import type { Snippet } from "svelte";

  import LinearProgress from "@smui/linear-progress";
  import List, { Item, Separator, Subheader, Text } from "@smui/list";

  import type { ListResponse } from "../interfaces/ListResponse";
  import type { NamedRecord } from "../interfaces/NamedRecord";

  import * as m from "./paraglide/messages";
  import StepHeader from "./StepHeader.svelte";

  interface Props {
    header: Snippet;
    introduction: Snippet;
    onerror(this: void, message: string): void;
    path?: Array<NamedRecord>;
    selected?: NamedRecord | null;
  }
  let {
    header,
    introduction,
    onerror,
    path = $bindable([]),
    selected = $bindable(null),
  }: Props = $props();

  let items: Array<NamedRecord> | null = $state(null);

  function handleListError(type: string): void {
    switch (type) {
      case "DriveAPIError":
        onerror(m.errorDialog_DriveAPIError());
        break;
      case "invalidParameter":
        onerror(m.errorDialog_InvalidParameterError());
        break;
      default:
        onerror(m.errorDialog_unknownError());
        break;
    }
  }

  function handleSharedDriveResponse(response: ListResponse): void {
    if (response.status === "error") {
      handleListError(response.type);
      return;
    }
    items = [{ id: "root", name: m.drive_myDrive() }, ...response.response];
  }

  function handleError(response: Error): void {
    onerror(m.errorDialog_unknownErrorWithMessage() + response.message);
  }

  function handleFolderResponse(response: ListResponse): void {
    if (response.status === "error") {
      handleListError(response.type);
      return;
    }
    items = response.response;
  }

  function getItems(): void {
    items = null;
    if (path.length === 0) {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Needed because SMUI doesn't provide types for the event
  function handleItemKeydown(e: any, item: NamedRecord): void {
    if ((e as KeyboardEvent).key === "ArrowRight") {
      itemNavigation(item);
    }
  }

  getItems();
</script>

<StepHeader>
  {@render header()}
</StepHeader>
<p>
  {@render introduction()}
</p>
<div>
  <List singleSelection>
    <Separator />
    <Subheader>
      <button class="breadcrumb" onclick={rootNavigation} type="button">
        {m.drive_driveList()}
      </button>
      {#each path as segment (segment.id)}
        &nbsp; &gt; &nbsp;
        <button
          class="breadcrumb"
          onclick={(): void => {
            breadcrumbNavigation(segment);
          }}
          type="button"
        >
          {segment.name}
        </button>
      {/each}
    </Subheader>
    <Separator />
    {#if items === null}
      <LinearProgress indeterminate />
    {:else}
      {#each items as item (item.id)}
        <Item
          onSMUIAction={(): void => {
            if (selected === item) {
              itemNavigation(item);
            } else {
              selected = item;
            }
          }}
          ondblclick={(): void => {
            itemNavigation(item);
          }}
          onkeydown={(e): void => {
            handleItemKeydown(e, item);
          }}
          selected={selected !== null && selected.id === item.id}
        >
          <Text>
            {item.name}
          </Text>
        </Item>
      {/each}
    {/if}
    <Separator />
  </List>
</div>

<style lang="scss">
  div {
    user-select: none;
  }

  .breadcrumb {
    border: none;
    background-color: unset;
    cursor: pointer;
    color: var(--mdc-theme-primary);
    font-size: 1rem;
  }
</style>
