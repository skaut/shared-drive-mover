<script lang="ts" strictEvents>
  import LinearProgress from "@smui/linear-progress";
  import List, { Item, Separator, Subheader, Text } from "@smui/list";
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";

  import type { ListResponse } from "../interfaces/ListResponse";
  import type { NamedRecord } from "../interfaces/NamedRecord";

  import StepHeader from "./StepHeader.svelte";

  export let step: string;
  export let path: Array<NamedRecord> = [];
  export let selected: NamedRecord | null = null;

  const dispatch = createEventDispatcher<{ error: { message: string } }>();

  let items: Array<NamedRecord> | null = null;

  function handleListError(type: string): void {
    switch (type) {
      case "DriveAPIError":
        dispatch("error", {
          message: $_("errorDialog.DriveAPIError"),
        });
        break;
      case "invalidParameter":
        dispatch("error", {
          message: $_("errorDialog.InvalidParameterError"),
        });
        break;
      default:
        dispatch("error", {
          message: $_("errorDialog.unknownError"),
        });
        break;
    }
  }

  function handleSharedDriveResponse(response: ListResponse): void {
    if (response.status === "error") {
      handleListError(response.type);
      return;
    }
    items = [{ id: "root", name: $_("drive.myDrive") }, ...response.response];
  }

  function handleError(response: Error): void {
    dispatch("error", {
      message: $_("errorDialog.unknownErrorWithMessage") + response.message,
    });
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
        ["listSharedDrives"]();
    } else {
      google.script.run
        .withSuccessHandler(handleFolderResponse)
        .withFailureHandler(handleError)
        ["listFolders"](path[path.length - 1].id);
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

<StepHeader {step} />
<p>
  {$_(`steps.${step}.introduction`)}
</p>
<div>
  <List singleSelection>
    <Separator />
    <Subheader>
      <button class="breadcrumb" type="button" on:click={rootNavigation}>
        {$_("drive.driveList")}
      </button>
      {#each path as segment (segment.id)}
        &nbsp; &gt; &nbsp;
        <button
          class="breadcrumb"
          type="button"
          on:click={() => {
            breadcrumbNavigation(segment);
          }}
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
          selected={selected !== null && selected.id === item.id}
          on:dblclick={() => {
            itemNavigation(item);
          }}
          on:keydown={(e) => {
            handleItemKeydown(e, item);
          }}
          on:SMUI:action={() => {
            if (selected === item) {
              itemNavigation(item);
            } else {
              selected = item;
            }
          }}
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
