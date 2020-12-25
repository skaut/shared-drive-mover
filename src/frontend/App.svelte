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
    <Label>{tab.label}</Label>
  </Tab>
</TabBar>
<div id="tab">
  {#if currentTab.id === "introduction"}
    <ContinueTab on:next={currentTab = tabs[1]}>
      <Introduction/>
    </ContinueTab>
  {/if}
</div>

<script lang="ts">
  import "svelte-i18n";
  import TopAppBar, {Row, Section, Title} from '@smui/top-app-bar';
  import Tab, {Icon, Label} from '@smui/tab';
  import TabBar from '@smui/tab-bar';

  import "./_smui-theme.scss"
  import Introduction from "./Introduction.svelte";
  import ContinueTab from "./ContinueTab.svelte";

  const tabs = [
    {
      id: "introduction",
      icon: "favorite",
      label: "Introduction",
    },
    {
      id: "bogus",
      icon: "near_me",
      label: "Near me",
    },
  ]

  let currentTab = tabs[0];
</script>

<style lang="scss">
  :global(body) {
    margin: 0;
  }

  #tab {
    margin: 8px;
  }
</style>
