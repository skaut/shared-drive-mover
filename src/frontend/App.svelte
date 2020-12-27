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
<TabBar tabs={tabs} let:tab key={tab => tab.id} bind:active={currentTab}>
  <Tab {tab}>
    <Icon class="material-icons">{tab.icon}</Icon>
    <Label>{$_("steps." + tab.id + ".tabLabel")}</Label>
  </Tab>
</TabBar>
<div id="tab">
  {#if currentTab.id === "introduction"}
    <Introduction bind:copyComments={copyComments}/>
    <ContinueTab on:next={() => currentTab = tabs[1]}/>
  {:else if currentTab.id === "source-selection"}
    <p>
      {$_("steps.source-selection.introduction")}
    </p>
    <FolderSelection on:error={() => {}} bind:path={sourcePath} bind:selected={source}/> <!-- TODO -->
    <ContinueTab on:next={() => currentTab = tabs[2]}/>
  {:else if currentTab.id === "destination-selection"}
    <p>
      {$_("steps.destination-selection.introduction")}
    </p>
    <FolderSelection on:error={() => {}} bind:path={destinationPath} bind:selected={destination}/> <!-- TODO -->
    <ContinueTab on:next={() => currentTab = tabs[3]}/>
  {:else if currentTab.id === "confirmation"}
    <Confirmation on:next={() => currentTab = tabs[4]} {sourcePath} {destinationPath} {source} {destination}/>
  {/if}
</div>

<script lang="ts">
  import {addMessages, init, _} from "svelte-i18n";
  import Tab, {Icon, Label} from '@smui/tab';
  import TabBar from '@smui/tab-bar';
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

  const tabs = [
    {
      id: "introduction",
      icon: "settings",
    },
    {
      id: "source-selection",
      icon: "content_copy",
    },
    {
      id: "destination-selection",
      icon: "content_paste",
    },
    {
      id: "confirmation",
      icon: "check_box_outline_blank",
    },
    {
      id: "done",
      icon: "check_box",
    },
  ]
  let currentTab = tabs[1];

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
