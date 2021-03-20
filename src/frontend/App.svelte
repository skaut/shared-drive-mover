<svelte:head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic|Material+Icons">
</svelte:head>
<MaterialApp>
  <AppBar class="primary-color">
    <span slot="title">
      Shared drive mover
    </span>
  </AppBar>
  {#if progress > 0}
    <ProgressLinear value={progress} />
  {/if}
  {#if moving}
    <ProgressLinear indeterminate />
  {/if}
  <div id="tab">
    {#if currentTab === "introduction"}
      <Introduction bind:copyComments={copyComments}/>
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
    <Dialog persistent bind:active={errorDialog}>
      <Card>
        <CardTitle>
          {$_("errorDialog.title")}
        </CardTitle>
        <CardText>
          {$_("errorDialog.content") + errorMessage}
        </CardText>
        <CardActions class="justify-end">
          <Button text class="primary-text" on:click={() => errorDialog = false}>
            {$_("errorDialog.ok")}
          </Button>
        </CardActions>
      </Card>
    </Dialog>
  </div>
</MaterialApp>

<script lang="ts">
  import {addMessages, init, _} from "svelte-i18n";
  import {AppBar, Button, Card, CardActions, CardText, CardTitle, Dialog, MaterialApp, ProgressLinear} from 'svelte-materialify/src';

  import BackButton from "./BackButton.svelte";
  import Confirmation from "./Confirmation.svelte";
  import ContinueButton from "./ContinueButton.svelte";
  import Done from "./Done.svelte";
  import FolderSelection from "./FolderSelection.svelte";
  import Introduction from "./Introduction.svelte";
  import Moving from "./Moving.svelte";

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
  let errorDialog = false;
  let errorMessage: string = "";

  $: progress = currentTab === "introduction" ? 100 * 1/5 :
    currentTab === "source-selection" ? 100 * 2/5 :
    currentTab === "destination-selection" ? 100 * 3/5 :
    currentTab === "confirmation" ? 100 * 4/5 : 0;

  let copyComments = true;
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
      .move(source!.id, destination!.id, copyComments, false, forceNonEmpty);
  }

  function moveSuccessHandler(response: MoveResponse): void {
    moving = false;
    if (response.status === "error") {
      if (response.reason === "notEmpty") {
        movingComponent.showNonEmptyDialog();
      } else {
        currentTab = "confirmation";
        showErrorDialog(response.reason!)
      }
      return;
    }
    errors = response.errors ?? null;
    currentTab = "done";
  }

  function moveErrorHandler(response: Error) {
    moving = false;
    currentTab = "confirmation";
    showErrorDialog(response.message)
  }

  function showErrorDialog(message: string): void {
    errorMessage = message;
    errorDialog = true;
  }
</script>

<style lang="scss">
  #tab {
    margin: 50px;
  }
</style>
