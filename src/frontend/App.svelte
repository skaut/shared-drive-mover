<svelte:head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic|Material+Icons">
</svelte:head>
<TopAppBar variant="static" color="primary">
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
    <Introduction bind:copyComments={copyComments} bind:mergeFolders={mergeFolders}/>
    <ContinueButton disabled={false} on:next={() => currentTab = "source-selection"}/>
  {:else if currentTab === "source-selection"}
    <FolderSelection step="source-selection" on:error={(event) => {showErrorDialog(event.detail.message)}} bind:path={sourcePath} bind:selected={source}/>
    <BackButton on:previous={() => currentTab = "introduction"}/>
    <ContinueButton disabled={source === null} on:next={() => currentTab = "destination-selection"}/>
  {:else if currentTab === "destination-selection"}
    <FolderSelection step="destination-selection" on:error={(event) => {showErrorDialog(event.detail.message)}} bind:path={destinationPath} bind:selected={destination}/>
    <BackButton on:previous={() => currentTab = "source-selection"}/>
    <ContinueButton disabled={destination === null} on:next={() => currentTab = "confirmation"}/>
  {:else if currentTab === "confirmation"}
    <Confirmation on:previous={() => currentTab = "destination-selection"} on:next={() => move()} {sourcePath} {destinationPath} {source} {destination}/>
  {:else if currentTab === "moving"}
    <Moving bind:this={movingComponent} on:nonEmptyDialogCancel={() => currentTab = "destination-selection"} on:nonEmptyDialogConfirm={() => move(true)}/>
  {:else if currentTab === "done"}
    <Done {errors}/>
  {/if}
  <Dialog bind:open={errorDialogOpen} aria-labelledby="errorDialogTitle" aria-describedby="errorDialogContent">
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

<script lang="ts">
  import {addMessages, init, _} from "svelte-i18n";
  import Button, {Label} from "@smui/button/styled";
  import Dialog, {Actions, Content, Title as DialogTitle} from "@smui/dialog/styled";
  import LinearProgress from '@smui/linear-progress/styled';
  import TopAppBar, {Row, Section, Title as TopAppBarTitle} from '@smui/top-app-bar/styled';

  import "./_smui-theme.scss"
  import BackButton from "./BackButton.svelte";
  import Confirmation from "./Confirmation.svelte";
  import ContinueButton from "./ContinueButton.svelte";
  import Done from "./Done.svelte";
  import FolderSelection from "./FolderSelection.svelte";
  import Introduction from "./Introduction.svelte";
  import Moving from "./Moving.svelte";

  import type { MoveError } from "../interfaces/MoveError";
  import type { MoveResponse } from "../interfaces/MoveResponse";
  import type { NamedRecord } from "../interfaces/NamedRecord";

  import cs from "./locales/cs.json"
  import en from "./locales/en.json"

  addMessages('en', en);
  addMessages('cs', cs);
  init({
    fallbackLocale: "en",
    initialLocale: "<?= Session.getActiveUserLocale() ?>",
  })

  let currentTab: "introduction"|"source-selection"|"destination-selection"|"confirmation"|"moving"|"done" = "introduction";
  let moving = false;
  let movingComponent: Moving;
  let errorDialogOpen: boolean;
  let errorMessage: string = "";

  $: progress = currentTab === "introduction" ? 1/5 :
    currentTab === "source-selection" ? 2/5 :
    currentTab === "destination-selection" ? 3/5 :
    currentTab === "confirmation" ? 4/5 : 0;

  let copyComments = true;
  let mergeFolders = true;
  let sourcePath: Array<NamedRecord> = [];
  let destinationPath: Array<NamedRecord> = [];
  let source: NamedRecord|null = null;
  let destination: NamedRecord|null = null;
  let errors: Array<MoveError>|null = null;

  function move(forceNonEmpty: boolean = false): void {
    currentTab = "moving";
    moving = true;
    google.script.run
      .withSuccessHandler(moveSuccessHandler)
      .withFailureHandler(moveErrorHandler)
      .move(source!.id, destination!.id, copyComments, mergeFolders, forceNonEmpty);
  }

  function moveSuccessHandler(response: MoveResponse): void {
    moving = false;
    if (response.status === "error") {
      switch (response.type) {
        case "DriveAPIError":
          currentTab = "confirmation";
          showErrorDialog($_("errorDialog.DriveAPIError"))
          break;
        case "notEmpty":
          movingComponent.showNonEmptyDialog();
          break;
        case "sourceEqualsDestination":
          currentTab = "confirmation";
          showErrorDialog($_("errorDialog.sourceEqualsDestination"))
          break;
        default:
          currentTab = "confirmation";
          showErrorDialog($_("errorDialog.unknownError"))
          break;
      }
      return;
    }
    errors = response.response.errors ?? null;
    currentTab = "done";
  }

  function moveErrorHandler(response: Error) {
    moving = false;
    currentTab = "confirmation";
    showErrorDialog($_("errorDialog.unknownErrorWithMessage") + response.message)
  }

  function showErrorDialog(message: string): void {
    errorMessage = message;
    errorDialogOpen = true;
  }
</script>

<style lang="scss">
  @use 'smui-theme' as theme;
  @use '@material/linear-progress/index' as linear-progress;

  :global(body) {
    margin: 0;
  }

  #tab {
    margin: 50px;
  }

  .global-progress:global {
    @include linear-progress.bar-color(theme.$secondary);
  }
</style>
