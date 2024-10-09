<script lang="ts" strictEvents>
  import Button, { Label } from "@smui/button";
  import Dialog, { Actions, Content, Title as DialogTitle } from "@smui/dialog";
  import LinearProgress from "@smui/linear-progress";
  import TopAppBar, {
    Row,
    Section,
    Title as TopAppBarTitle,
  } from "@smui/top-app-bar";
  import { _, addMessages, init } from "svelte-i18n";
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
  import cs from "./locales/cs.json";
  import en from "./locales/en.json";
  import Moving from "./Moving.svelte";

  addMessages("en", en);
  addMessages("cs", cs);
  void init({
    fallbackLocale: "en",
    initialLocale: "<?= Session.getActiveUserLocale() ?>",
  });

  let currentTab:
    | "confirmation"
    | "destination-selection"
    | "done"
    | "introduction"
    | "moving"
    | "source-selection" = "introduction";
  let moving = false;
  let showNonEmptyDialog: () => void;
  let errorDialogOpen: boolean;
  let errorMessage = "";

  $: progress =
    currentTab === "introduction"
      ? 1 / 5
      : currentTab === "source-selection"
        ? 2 / 5
        : currentTab === "destination-selection"
          ? 3 / 5
          : currentTab === "confirmation"
            ? 4 / 5
            : 0;

  let copyComments = true;
  let mergeFolders = true;
  let sourcePath: Array<NamedRecord> = [];
  let destinationPath: Array<NamedRecord> = [];
  let source: NamedRecord | null = null;
  let destination: NamedRecord | null = null;
  let errors: Array<MoveError> | null = null;

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
          showErrorDialog($_("errorDialog.DriveAPIError"));
          break;
        case "invalidParameter":
          currentTab = "confirmation";
          showErrorDialog($_("errorDialog.InvalidParameterError"));
          break;
        case "notEmpty":
          showNonEmptyDialog();
          break;
        case "sourceEqualsDestination":
          currentTab = "confirmation";
          showErrorDialog($_("errorDialog.sourceEqualsDestination"));
          break;
        default:
          currentTab = "confirmation";
          showErrorDialog($_("errorDialog.unknownError"));
          break;
      }
      return;
    }
    errors = response.response.errors;
    currentTab = "done";
  }

  function moveErrorHandler(response: Error): void {
    if (response.name === "ScriptError") {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define -- Cyclical dependency
      move();
      return;
    }
    moving = false;
    currentTab = "confirmation";
    showErrorDialog(
      $_("errorDialog.unknownErrorWithMessage") + response.message,
    );
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
      [
        "move"
      ](source.id, destination.id, copyComments, mergeFolders, forceNonEmpty);
  }

  function showErrorDialogWithEvent(
    event: CustomEvent<{ message: string }>,
  ): void {
    showErrorDialog(event.detail.message);
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
<div id="tab">
  {#if currentTab === "introduction"}
    <Introduction bind:copyComments bind:mergeFolders />
    <ContinueButton
      disabled={false}
      on:next={() => (currentTab = "source-selection")}
    />
  {:else if currentTab === "source-selection"}
    <FolderSelection
      step="source-selection"
      on:error={showErrorDialogWithEvent}
      bind:path={sourcePath}
      bind:selected={source}
    />
    <BackButton on:previous={() => (currentTab = "introduction")} />
    <ContinueButton
      disabled={source === null}
      on:next={() => (currentTab = "destination-selection")}
    />
  {:else if currentTab === "destination-selection"}
    <FolderSelection
      step="destination-selection"
      on:error={showErrorDialogWithEvent}
      bind:path={destinationPath}
      bind:selected={destination}
    />
    <BackButton on:previous={() => (currentTab = "source-selection")} />
    <ContinueButton
      disabled={destination === null}
      on:next={() => (currentTab = "confirmation")}
    />
  {:else if currentTab === "confirmation"}
    <Confirmation
      {destination}
      {destinationPath}
      {source}
      {sourcePath}
      on:previous={() => (currentTab = "destination-selection")}
      on:next={() => {
        move();
      }}
    />
  {:else if currentTab === "moving"}
    <Moving
      bind:showNonEmptyDialog
      on:nonEmptyDialogCancel={() => (currentTab = "destination-selection")}
      on:nonEmptyDialogConfirm={() => {
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
      {$_("errorDialog.title")}
    </DialogTitle>
    <Content id="errorDialogContent">
      {errorMessage}
    </Content>
    <Actions>
      <Button>
        <Label>
          {$_("errorDialog.ok")}
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

  :global(body) {
    margin: 0;
  }

  #tab {
    margin: 50px;
  }

  .global-progress:global {
    @include linear-progress.bar-color(var(--mdc-theme-secondary));
  }
</style>
