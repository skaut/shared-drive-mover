<svelte:head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic|Material+Icons">
</svelte:head>
<TopAppBar variant="static" color="primary">
  <Row>
    <Section>
      <Title>Shared Drive mover</Title>
    </Section>
  </Row>
</TopAppBar>
<LinearProgress {progress} />
<div id="tab">
  {#if currentTab === "introduction"}
    <Introduction bind:copyComments={copyComments}/>
    <ContinueTab disabled={false} on:next={() => currentTab = "source-selection"}/>
  {:else if currentTab === "source-selection"}
    <p>
      {$_("steps.source-selection.introduction")}
    </p>
    <FolderSelection on:error={() => {}} bind:path={sourcePath} bind:selected={source}/> <!-- TODO -->
    <ContinueTab disabled={source === null} on:next={() => currentTab = "destination-selection"}/>
  {:else if currentTab === "destination-selection"}
    <p>
      {$_("steps.destination-selection.introduction")}
    </p>
    <FolderSelection on:error={() => {}} bind:path={destinationPath} bind:selected={destination}/> <!-- TODO -->
    <ContinueTab disabled={destination === null} on:next={() => currentTab = "confirmation"}/>
  {:else if currentTab === "confirmation"}
    <Confirmation on:next={() => currentTab = "done"} {sourcePath} {destinationPath} {source} {destination}/>
  {/if}
</div>

<script lang="ts">
  import {addMessages, init, _} from "svelte-i18n";
  import LinearProgress from '@smui/linear-progress';
  import TopAppBar, {Row, Section, Title} from '@smui/top-app-bar';

  import "./_smui-theme.scss"
  import Confirmation from "./Confirmation.svelte";
  import ContinueTab from "./ContinueTab.svelte";
  import FolderSelection from "./FolderSelection.svelte";
  import Introduction from "./Introduction.svelte";

  import cs from "./locales/cs.json"
  import en from "./locales/en.json"

  addMessages('en', en);
  addMessages('cs', cs);
  init({
    fallbackLocale: "en",
    initialLocale: "<?= Session.getActiveUserLocale() ?>",
  })

  let currentTab = "introduction";

  $: progress = currentTab === "introduction" ? 1/5 :
    currentTab === "source-selection" ? 2/5 :
    currentTab === "destination-selection" ? 3/5 :
    currentTab === "confirmation" ? 4/5 :
    currentTab === "done" ? 1 : 0;

  let copyComments = true;
  let sourcePath: Array<NamedRecord> = [];
  let destinationPath: Array<NamedRecord> = [];
  let source: NamedRecord|null = null;
  let destination: NamedRecord|null = null;
</script>

<style lang="scss">
  :global(body) {
    margin: 0;
  }

  #tab {
    margin: 15px;
  }
</style>
