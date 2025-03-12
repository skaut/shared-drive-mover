<script lang="ts">
  import Button, { Label } from "@smui/button";
  import Dialog, { Actions, Content, Title as DialogTitle } from "@smui/dialog";
  import LinearProgress from "@smui/linear-progress";
  import TopAppBar, {
    Row,
    Section,
    Title as TopAppBarTitle,
  } from "@smui/top-app-bar";
  import "svelte-material-ui/bare.css";

  import type { MoveError } from "../interfaces/MoveError";
  import type { MoveResponse } from "../interfaces/MoveResponse";
  import type { NamedRecord } from "../interfaces/NamedRecord";

  import BackButton from "./BackButton.svelte";
  import Confirmation from "./Confirmation.svelte";
  import ContinueButton from "./ContinueButton.svelte";
  import Done from "./Done.svelte";
  import FolderSelection from "./FolderSelection.svelte";
  import Introduction from "./Introduction.svelte";
  import Moving from "./Moving.svelte";
  import * as m from "./paraglide/messages";
  import { baseLocale, defineGetLocale, isLocale } from "./paraglide/runtime";

  defineGetLocale(() => {
    const languageTag = "<?= Session.getActiveUserLocale() ?>"
      .replace(/^["']/u, "")
      .replace(/["']$/u, "");
    return isLocale(languageTag) ? languageTag : baseLocale;
  });

  let currentTab:
    | "confirmation"
    | "destination-selection"
    | "done"
    | "introduction"
    | "moving"
    | "source-selection" = $state("introduction");
  let moving = $state(false);
  let movingComponent: Moving | undefined = $state();
  let errorDialogOpen = $state(false);
  let errorMessage = $state("");

  let progress = $derived(
    currentTab === "introduction"
      ? 1 / 5
      : currentTab === "source-selection"
        ? 2 / 5
        : currentTab === "destination-selection"
          ? 3 / 5
          : currentTab === "confirmation"
            ? 4 / 5
            : 0,
  );

  let copyComments = $state(true);
  let mergeFolders = $state(true);
  let sourcePath: Array<NamedRecord> = $state([]);
  let destinationPath: Array<NamedRecord> = $state([]);
  let source: NamedRecord | null = $state(null);
  let destination: NamedRecord | null = $state(null);
  let errors: Array<MoveError> | null = $state(null);

  function showErrorDialog(message: string): void {
    errorMessage = message;
    errorDialogOpen = true;
  }

  function moveSuccessHandler(response: MoveResponse): void {
    moving = false;
    if (response.status === "error") {
      switch (response.type) {
        case "DriveAPIError":
          currentTab = "confirmation";
          showErrorDialog(m.errorDialog_DriveAPIError());
          break;
        case "invalidParameter":
          currentTab = "confirmation";
          showErrorDialog(m.errorDialog_InvalidParameterError());
          break;
        case "notEmpty":
          (movingComponent?.showNonEmptyDialog as (() => void) | undefined)?.();
          break;
        case "sourceEqualsDestination":
          currentTab = "confirmation";
          showErrorDialog(m.errorDialog_sourceEqualsDestination());
          break;
        default:
          currentTab = "confirmation";
          showErrorDialog(m.errorDialog_unknownError());
          break;
      }
      return;
    }
    errors = response.response.errors;
    currentTab = "done";
  }

  function moveErrorHandler(response: Error): void {
    if (response.name === "ScriptError") {
      move();
      return;
    }
    moving = false;
    currentTab = "confirmation";
    showErrorDialog(m.errorDialog_unknownErrorWithMessage() + response.message);
  }

  function move(forceNonEmpty = false): void {
    if (source === null || destination === null) {
      moveErrorHandler(new Error("No source or destination specified"));
      return;
    }
    currentTab = "moving";
    moving = true;
    google.script.run
      .withSuccessHandler(moveSuccessHandler)
      .withFailureHandler(moveErrorHandler)
      .move(
        source.id,
        destination.id,
        copyComments,
        mergeFolders,
        forceNonEmpty,
      );
  }
</script>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic|Material+Icons"
    rel="stylesheet"
  />
</svelte:head>
<TopAppBar color="primary" variant="static">
  <Row>
    <Section>
      <TopAppBarTitle>Shared drive mover</TopAppBarTitle>
    </Section>
  </Row>
</TopAppBar>
<div class="global-progress">
  {#if progress > 0}
    <LinearProgress {progress} />
  {/if}
  {#if moving}
    <LinearProgress indeterminate />
  {/if}
</div>
<div class="tab">
  {#if currentTab === "introduction"}
    <Introduction bind:copyComments bind:mergeFolders />
    <ContinueButton
      disabled={false}
      onclick={(): void => {
        currentTab = "source-selection";
      }}
    />
  {:else if currentTab === "source-selection"}
    <FolderSelection
      onerror={showErrorDialog}
      bind:path={sourcePath}
      bind:selected={source}
    >
      {#snippet header()}
        {m.sourceSelection_header()}
      {/snippet}
      {#snippet introduction()}
        {m.sourceSelection_introduction()}
      {/snippet}
    </FolderSelection>
    <BackButton
      onclick={(): void => {
        currentTab = "introduction";
      }}
    />
    <ContinueButton
      disabled={source === null}
      onclick={(): void => {
        currentTab = "destination-selection";
      }}
    />
  {:else if currentTab === "destination-selection"}
    <FolderSelection
      onerror={showErrorDialog}
      bind:path={destinationPath}
      bind:selected={destination}
    >
      {#snippet header()}
        {m.destinationSelection_header()}
      {/snippet}
      {#snippet introduction()}
        {m.destinationSelection_introduction()}
      {/snippet}
    </FolderSelection>
    <BackButton
      onclick={(): void => {
        currentTab = "source-selection";
      }}
    />
    <ContinueButton
      disabled={destination === null}
      onclick={(): void => {
        currentTab = "confirmation";
      }}
    />
  {:else if currentTab === "confirmation"}
    <Confirmation
      {destination}
      {destinationPath}
      onnext={(): void => {
        move();
      }}
      onprevious={(): void => {
        currentTab = "destination-selection";
      }}
      {source}
      {sourcePath}
    />
  {:else if currentTab === "moving"}
    <Moving
      bind:this={movingComponent}
      onNonEmptyDialogCancel={(): void => {
        currentTab = "destination-selection";
      }}
      onNonEmptyDialogConfirm={(): void => {
        move(true);
      }}
    />
  {:else if currentTab === "done"}
    <Done {errors} />
  {/if}
  <Dialog
    aria-describedby="errorDialogContent"
    aria-labelledby="errorDialogTitle"
    bind:open={errorDialogOpen}
  >
    <DialogTitle id="errorDialogTitle">
      {m.errorDialog_title()}
    </DialogTitle>
    <Content id="errorDialogContent">
      {errorMessage}
    </Content>
    <Actions>
      <Button>
        <Label>
          {m.errorDialog_ok()}
        </Label>
      </Button>
    </Actions>
  </Dialog>
</div>

<style lang="scss">
  @use "@material/linear-progress/index" as linear-progress;

  :root {
    --mdc-theme-primary: #448aff; /* Blue A200 */
    --mdc-theme-secondary: #ff5252; /* Red A200 */
  }

  .tab {
    margin: 50px;
  }

  :global(body) {
    margin: 0;
  }

  :global(.global-progress .mdc-linear-progress__bar-inner) {
    border-color: var(--mdc-theme-secondary, #6200ee);
  }

  /* TODO: Try to fix this in newer Svelte with :global {}
  :global(.global-progress) {
    @include linear-progress.bar-color(var(--mdc-theme-secondary));
  }
  */
</style>
